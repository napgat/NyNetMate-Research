"""Run existing Auth/Audit checks in disposable copies, never against devices."""
from pathlib import Path
import datetime, hashlib, json, os, shutil, subprocess, tempfile, time

ROOT = Path(r"D:\KMITL-Repo\KMITL_Knowledge\Project")
OUT = Path(__file__).resolve().parent
TEMP = Path(tempfile.mkdtemp(prefix="mynetmate-advisor-20261009-"))
IGNORE = shutil.ignore_patterns(".git", ".venv", "node_modules", "dist", "__pycache__", ".pytest_cache", ".env", ".env.local", ".env.production", "*.pyc")
result = {"checked_at_bangkok": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat(), "temporary_copy": str(TEMP), "checks": {}, "repositories": {}}
env = os.environ.copy()
env.update(PYTHONDONTWRITEBYTECODE="1", PYTHONUTF8="1", APP_ENV="test", TEST_DATABASE_URL="", DATABASE_URL="postgresql+asyncpg://test:test@127.0.0.1:1/advisor_unused", SYNC_DATABASE_URL="postgresql+psycopg2://test:test@127.0.0.1:1/advisor_unused", DB_ECHO="false")

def run(key, args, cwd, timeout=900):
    start = time.monotonic()
    try:
        p = subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout)
        output = p.stdout + p.stderr
        code = p.returncode
    except subprocess.TimeoutExpired:
        output, code = "Verification timed out. No result claimed.\n", -1
    # Never publish a connection string with credentials.
    import re
    output = re.sub(r"(postgresql[^\s]*?://)[^\s@]+@", r"\1[redacted]@", output)
    (OUT / (key + ".log")).write_text(output, encoding="utf-8")
    result["checks"][key] = {"command": args, "exit_code": code, "elapsed_seconds": round(time.monotonic()-start, 2), "log": key + ".log"}
    (OUT / "verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(key, "exit", code, flush=True)
    return code

for scope in ("backend", "website", "docs"):
    src = ROOT / "mynetmate" / scope
    result["repositories"][scope] = {"head": subprocess.check_output(["git", "-C", str(src), "rev-parse", "HEAD"], text=True).strip(), "status_before": subprocess.check_output(["git", "-C", str(src), "status", "--short"], text=True)}
for scope in ("backend", "website"):
    shutil.copytree(ROOT / "mynetmate" / scope, TEMP / scope, ignore=IGNORE)

if run("backend-dependencies", ["uv", "sync", "--frozen", "--python", "3.11"], TEMP / "backend") == 0:
    targets = sorted(str(p.relative_to(TEMP / "backend")) for p in (TEMP / "backend" / "tests").glob("test_*.py") if p.name.startswith(("test_authentication", "test_audit")))
    run("backend-auth-audit", [str(TEMP / "backend" / ".venv" / "Scripts" / "python.exe"), "-B", "-m", "pytest", "-q", "-p", "no:cacheprovider", "-m", "not database", "--junitxml=" + str(OUT / "backend-auth-audit.xml"), *targets], TEMP / "backend")

npm = shutil.which("npm.cmd") or shutil.which("npm")
if npm:
    bun_cmd = [npm, "exec", "--yes", "--package=bun", "--", "bun"]
    if run("frontend-dependencies", bun_cmd + ["install", "--frozen-lockfile"], TEMP / "website") == 0:
        run("frontend-auth-audit", bun_cmd + ["test", "tests/authentication.test.ts", "tests/audit-display.test.ts"], TEMP / "website")
        initial_build = run("frontend-build", bun_cmd + ["run", "build"], TEMP / "website")
        if initial_build != 0 and (TEMP / "backend" / ".venv" / "Scripts" / "python.exe").exists():
            # The documented Docker pipeline generates this ignored client first.
            schema = TEMP / "openapi.json"
            export = "from pathlib import Path; import json; from app.main import app; Path(" + repr(str(schema)) + ").write_text(json.dumps(app.openapi()), encoding='utf-8')"
            if run("frontend-schema", [str(TEMP / "backend" / ".venv" / "Scripts" / "python.exe"), "-B", "-c", export], TEMP / "backend") == 0:
                env["OPENAPI_INPUT"] = str(schema)
                if run("frontend-client-generation", bun_cmd + ["run", "openapi:generate"], TEMP / "website") == 0:
                    run("frontend-build-after-generation", bun_cmd + ["run", "build"], TEMP / "website")

for scope in result["repositories"]:
    src = ROOT / "mynetmate" / scope
    result["repositories"][scope]["status_after"] = subprocess.check_output(["git", "-C", str(src), "status", "--short"], text=True)
    result["repositories"][scope]["unchanged"] = result["repositories"][scope]["status_after"] == result["repositories"][scope]["status_before"]
result["excluded"] = ["PostgreSQL integration: -m not database, TEST_DATABASE_URL empty", "Browser E2E", "Device execution/discovery/scan", "Deployment"]
(OUT / "verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print("Verification complete; original repositories unchanged:", all(v["unchanged"] for v in result["repositories"].values()), flush=True)
