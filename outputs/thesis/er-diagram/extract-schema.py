"""Read source AST only: no app imports, database access or network collection."""
import ast
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent


def name(node):
    return node.id if isinstance(node, ast.Name) else node.attr if isinstance(node, ast.Attribute) else ''


def const(node, default=None):
    return node.value if isinstance(node, ast.Constant) else default


def column(node, field=None):
    kw = {k.arg: k.value for k in node.keywords}
    args = list(node.args)
    if field is None:
        field = const(args.pop(0))
    dtype = ast.unparse(args[0]) if args else '?'
    pk = const(kw.get('primary_key'), False)
    nullable = const(kw.get('nullable'), not pk)
    foreign = [const(a.args[0]) for a in args if isinstance(a, ast.Call) and name(a.func) == 'ForeignKey']
    return {'name': field, 'type': dtype, 'pk': pk, 'nullable': nullable, 'foreign': foreign,
            'unique': const(kw.get('unique'), False)}


tables = []
path = ROOT / 'mynetmate/backend/app/core/inventory_tables.py'
for node in ast.parse(path.read_text(encoding='utf-8')).body:
    if not isinstance(node, ast.Assign) or not isinstance(node.value, ast.Call) or name(node.value.func) != 'Table':
        continue
    call = node.value
    t = {'name': const(call.args[0]), 'source': str(path.relative_to(ROOT)), 'columns': [], 'composite_foreign': []}
    for arg in call.args[2:]:
        if not isinstance(arg, ast.Call):
            continue
        kind = name(arg.func)
        if kind == 'Column':
            t['columns'].append(column(arg))
        elif kind == 'PrimaryKeyConstraint':
            keys = [const(a) for a in arg.args]
            for c in t['columns']:
                if c['name'] in keys:
                    c['pk'] = True
        elif kind == 'ForeignKeyConstraint':
            t['composite_foreign'].append({'columns': ast.literal_eval(arg.args[0]), 'references': ast.literal_eval(arg.args[1])})
    tables.append(t)

for rel in ['authentication/models.py', 'audit_trail/models.py']:
    path = ROOT / 'mynetmate/backend/app/features' / rel
    for node in ast.parse(path.read_text(encoding='utf-8')).body:
        if not isinstance(node, ast.ClassDef):
            continue
        tn = next((const(n.value) for n in node.body if isinstance(n, ast.Assign) and any(name(a) == '__tablename__' for a in n.targets)), None)
        if not tn:
            continue
        t = {'name': tn, 'source': str(path.relative_to(ROOT)), 'columns': [], 'composite_foreign': []}
        for n in node.body:
            if isinstance(n, ast.AnnAssign) and isinstance(n.value, ast.Call) and name(n.value.func) == 'mapped_column':
                c = column(n.value, name(n.target))
                # AuditLog uses a SQLAlchemy column object for its true actor FK.
                if tn == 'audit_logs' and c['name'] == 'user_id':
                    c['foreign'] = ['users.id']
                t['columns'].append(c)
        tables.append(t)

order = ['users', 'auth_sessions', 'audit_logs', 'credential_profiles', 'sites', 'device_groups', 'devices',
         'device_group_members', 'device_interfaces', 'interface_ip_addresses', 'discovery_scans', 'collection_runs',
         'neighbor_observations', 'topology_default_routes']
tables.sort(key=lambda t: order.index(t['name']))
assert len(tables) == 14
assert all(c['name'] for t in tables for c in t['columns'])
(OUT / 'schema.json').write_text(json.dumps(tables, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'tables': len(tables), 'columns': sum(len(t['columns']) for t in tables),
                  'entities': {t['name']: len(t['columns']) for t in tables}}, ensure_ascii=False))
