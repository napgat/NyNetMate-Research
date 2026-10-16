"""Follow the existing offline client-generation prerequisite in the test copy."""
from pathlib import Path
import json, os, re, shutil, subprocess, time
OUT = Path(__file__).resolve().parent
result = json.loads((OUT / "verification.json").read_text(encoding="utf-8"))
TEMP = Path(result["temporary_copy"])
env = os.environ.copy()
env.update(PYTHONDONTWRITEBYTECODE="1", PYTHONUTF8="1", APP_ENV="test", TEST_DATABASE_URL="", DATABASE_URL="postgresql+asyncpg://test:test@127.0.0.1:1/advisor_unused", SYNC_DATABASE_URL="postgresql+psycopg2://test:test@127.0.0.1:1/advisor_unused", DB_ECHO="false")
def run(key, args, cwd):
    start = time.monotonic()
    p = subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=300)
    output = re.sub(r"(postgresql[^\s]*?://)[^\s@]+@", r"\1[redacted]@", p.stdout+p.stderr)
    (OUT / (key+".log")).write_text(output, encoding="utf-8")
    result["checks"][key] = {"command": args, "exit_code": p.returncode, "elapsed_seconds": round(time.monotonic()-start, 2), "log": key+".log"}
    (OUT / "verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(key, "exit", p.returncode, flush=True)
    return p.returncode
schema = TEMP / "openapi.json"
export = "from pathlib import Path; import json; from app.main import app; Path(" + repr(str(schema)) + ").write_text(json.dumps(app.openapi()), encoding='utf-8')"
if run("frontend-schema", [str(TEMP / "backend" / ".venv" / "Scripts" / "python.exe"), "-B", "-c", export], TEMP / "backend") == 0:
    env["OPENAPI_INPUT"] = str(schema)
    bun = [shutil.which("npm.cmd"), "exec", "--yes", "--package=bun", "--", "bun"]
    if run("frontend-client-generation", bun+["run", "openapi:generate"], TEMP / "website") == 0:
        run("frontend-build-after-generation", bun+["run", "build"], TEMP / "website")
