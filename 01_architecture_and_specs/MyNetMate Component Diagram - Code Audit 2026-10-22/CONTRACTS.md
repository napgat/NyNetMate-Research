# สัญญาบริการและหลักฐานของ Component Diagram (Revision 2)

วันที่ตรวจ: 22 ตุลาคม 2569 (2026-10-22)

เอกสารนี้ระบุผู้ต้องใช้บริการ ผู้ให้บริการ operation และจุดผูกต่อของ Assembly Connector ทุกเส้น ภาพไม่มีลูกศร ไม่มีเส้นที่แปลว่า Request/Response หรือขั้นตอนเวลา ชื่อขึ้นต้น I เป็นชื่อ Interface ในแบบจำลองที่สกัดจาก API จริง ไม่ได้อ้างว่ามี Python Protocol/Class ชื่อนั้น ยกเว้น AuditWriter ที่มี Protocol จริง

แต่ละ R_<รหัส> และ P_<รหัส> เป็นคนละ Simple Port ที่ต้องการ/ให้บริการ Interface เดียวกัน ชื่อ Port ถูกซ่อนบนภาพเพื่อลดการทับกัน การเลือก portin/portout ใน PlantUML เป็นเรื่องจัดวาง ไม่ใช่นิยาม Provided/Required; ความหมายนั้นมาจากฝั่ง Socket/Ball และ contract ที่กำหนด

ชนิด Component ในภาพเป็น logical module abstraction ที่มีขอบเขตและ public operation ตามตารางต่อไป ไม่ได้อ้างว่าเป็น microservice หรือ deploy แยกได้ทุกกล่อง และไม่ใช้ชื่อไฟล์หรือไลบรารีหลายตัวที่ไม่เกี่ยวกันมารวมเป็น Component สมมติ

## MyNetMate - Network Management components

[ภาพ SVG](01-components-across-branches.svg) · [PlantUML](01-components-across-branches.puml)

backend main @ 166e2ee | selected internal contracts | no cross-branch assembly

### ขอบเขต Component / Part

| Part | สิ่งที่ใช้เป็น implementation | ความหมาย |
|---|---|---|
| devices : DeviceManagement | [devices/service.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/service.py) | DeviceService และ use cases ของอุปกรณ์ |
| collection : NetworkCollection | [network_device_discovery/service.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/service.py) | CollectionService สำหรับ enrollment, collection และ discovery |
| collector : InventoryCollection | [devices/collector.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/collector.py) | InventoryCollector และ StrictSnmpClient ฝั่ง MyNetMate |
| oxian : OxianPython | [oxian_py/__init__.py](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/__init__.py), [snmp/client.py](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/snmp/client.py) | Python library ตาม revision ใน backend lockfile |

### N01 — ITargetCollection

ฝั่ง Socket: **devices : DeviceManagement** · ฝั่ง Ball: **collection : NetworkCollection**

Operations / API ที่สัญญาครอบคลุม:

- `collect_target(db, target, credential_id, environment, timeout, ...)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/devices/service.py:70 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/service.py#L70) — `await collection_service.collect_target(`
- [backend/app/features/network_device_discovery/service.py:214 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/service.py#L214) — `async def collect_target(`

### N02 — ISnapshotApplication

ฝั่ง Socket: **collection : NetworkCollection** · ฝั่ง Ball: **devices : DeviceManagement**

Operations / API ที่สัญญาครอบคลุม:

- `apply_snapshot(db, snapshot, credential_id, source, assignments, groups, require_new)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/network_device_discovery/service.py:230 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/service.py#L230) — `await device_service.apply_snapshot(`
- [backend/app/features/devices/service.py:108 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/service.py#L108) — `async def apply_snapshot(`

### N03 — IInventoryCollection

ฝั่ง Socket: **collection : NetworkCollection** · ฝั่ง Ball: **collector : InventoryCollection**

Operations / API ที่สัญญาครอบคลุม:

- `collect(target, community, port, timeout) -> Snapshot`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/network_device_discovery/service.py:223 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/service.py#L223) — `await collector.collect(`
- [backend/app/features/devices/collector.py:92 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/collector.py#L92) — `async def collect(`

### N04 — IOxianDiscovery

ฝั่ง Socket: **collection : NetworkCollection** · ฝั่ง Ball: **oxian : OxianPython**

Operations / API ที่สัญญาครอบคลุม:

- `discover(...)`
- `discover_stream(...)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/network_device_discovery/service.py:9 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/service.py#L9) — `from oxian_py import discover, discover_stream`
- [oxian/oxian_py/__init__.py:46 @ 59ee94f](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/__init__.py#L46) — `discover_stream`

Oxian version is the uv.lock revision, inspected in a separate bare repository.

### N05 — ISnmpClient

ฝั่ง Socket: **collector : InventoryCollection** · ฝั่ง Ball: **oxian : OxianPython**

Operations / API ที่สัญญาครอบคลุม:

- `SnmpClient lifecycle`
- `get(oid), walk_column(oid), walk_lldp_column(oid)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/devices/collector.py:6 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/collector.py#L6) — `from oxian_py.snmp.client import SnmpClient`
- [oxian/oxian_py/snmp/client.py:13 @ 59ee94f](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/snmp/client.py#L13) — `class SnmpClient`

StrictSnmpClient extends SnmpClient; local walk override is not attributed to the library.

## MyNetMate - Authentication / Audit component assembly

[ภาพ SVG](02-auth-audit-binding.svg) · [PlantUML](02-auth-audit-binding.puml)

backend feature/11-audit-writer @ b862c60 | application-owned contracts

### ขอบเขต Component / Part

| Part | สิ่งที่ใช้เป็น implementation | ความหมาย |
|---|---|---|
| auth : AuthenticationService | [authentication/service.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/service.py), [authentication/runtime.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/runtime.py) | AuthService กับการประกอบ dependencies ที่ application เป็นเจ้าของ |
| bootstrap : UserProvisioning | [authentication/provisioning.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/provisioning.py) | CLI bootstrap/demo provisioning ไม่ใช่ User Admin HTTP API |
| adapter : AuthAuditAdapterModule | [authentication/audit_adapter.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/audit_adapter.py) | AuthAuditAdapter และ AuditWriter Protocol |
| writer : AuditAppendModule | [audit_trail/writer.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/writer.py) | ฟังก์ชัน record_audit_event ที่ validate/redact/add/flush |
| reader : AuditReadModule | [audit_trail/reader.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/reader.py), [audit_trail/router.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/router.py) | AuditReadService ที่รับ authorizer และ session factory ผ่าน router |
| database : DatabaseRuntime | [core/database.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/core/database.py) | async_session_factory ที่ runtime ส่งให้ consumer |

### A01 — IRecordAuthEvent

ฝั่ง Socket: **auth : AuthenticationService** · ฝั่ง Ball: **adapter : AuthAuditAdapterModule**

Operations / API ที่สัญญาครอบคลุม:

- `record_auth_event(action, resource_type, resource_id, actor_id)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/authentication/service.py:173 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/service.py#L173) — `AuthAuditAdapter(db, self._writer).record_auth_event(`
- [backend/app/features/authentication/audit_adapter.py:32 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/audit_adapter.py#L32) — `async def record_auth_event(`

### A02 — IRecordAuthEvent

ฝั่ง Socket: **bootstrap : UserProvisioning** · ฝั่ง Ball: **adapter : AuthAuditAdapterModule**

Operations / API ที่สัญญาครอบคลุม:

- `record_auth_event(action, resource_type, resource_id, actor_id)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/authentication/provisioning.py:179 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/provisioning.py#L179) — `AuthAuditAdapter(db, self._writer).record_auth_event(`
- [backend/app/features/authentication/audit_adapter.py:32 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/audit_adapter.py#L32) — `async def record_auth_event(`

### A03 — AuditWriter

ฝั่ง Socket: **adapter : AuthAuditAdapterModule** · ฝั่ง Ball: **writer : AuditAppendModule**

Operations / API ที่สัญญาครอบคลุม:

- `async __call__(*, db, action, resource_type, result, user_id, resource_id, safe_error_category, description)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/authentication/audit_adapter.py:19 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/audit_adapter.py#L19) — `class AuditWriter(Protocol):`
- [backend/app/features/authentication/runtime.py:90 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/runtime.py#L90) — `audit_writer=record_audit_event`
- [backend/app/features/audit_trail/writer.py:22 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/writer.py#L22) — `async def record_audit_event(`

This interface is a real Python Protocol; runtime.py injects its implementation.

### A04 — IAsyncSessionFactory

ฝั่ง Socket: **auth : AuthenticationService** · ฝั่ง Ball: **database : DatabaseRuntime**

Operations / API ที่สัญญาครอบคลุม:

- `async_session_factory() -> AsyncSession`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/authentication/runtime.py:88 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/runtime.py#L88) — `session_factory=async_session_factory`
- [backend/app/core/database.py:28 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/core/database.py#L28) — `async_session_factory = async_sessionmaker(`

### A05 — IAsyncSessionFactory

ฝั่ง Socket: **bootstrap : UserProvisioning** · ฝั่ง Ball: **database : DatabaseRuntime**

Operations / API ที่สัญญาครอบคลุม:

- `async_session_factory() -> AsyncSession`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/authentication/provisioning.py:201 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/provisioning.py#L201) — `session_factory=async_session_factory`
- [backend/app/core/database.py:28 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/core/database.py#L28) — `async_session_factory = async_sessionmaker(`

### A06 — IAsyncSessionFactory

ฝั่ง Socket: **reader : AuditReadModule** · ฝั่ง Ball: **database : DatabaseRuntime**

Operations / API ที่สัญญาครอบคลุม:

- `async_session_factory() -> AsyncSession`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/audit_trail/router.py:23 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/router.py#L23) — `session_factory=`
- [backend/app/features/audit_trail/reader.py:75 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/reader.py#L75) — `async with self._sessions() as db:`
- [backend/app/core/database.py:28 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/core/database.py#L28) — `async_session_factory = async_sessionmaker(`

### A07 — IAuthorize

ฝั่ง Socket: **reader : AuditReadModule** · ฝั่ง Ball: **auth : AuthenticationService**

Operations / API ที่สัญญาครอบคลุม:

- `authorize(cookie_token, permission_key) -> PublicUser`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/audit_trail/router.py:24 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/router.py#L24) — `authorizer=`
- [backend/app/features/audit_trail/reader.py:34 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/reader.py#L34) — `await self._authorizer(cookie_token, "audit.read")`
- [backend/app/features/authentication/service.py:205 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/service.py#L205) — `async def authorize(`

## MyNetMate - CIS validation component assembly

[ภาพ SVG](03-cis-branch-boundaries.svg) · [PlantUML](03-cis-branch-boundaries.puml)

backend feature/08-cis-security-validation @ 0f65dd8 | NOT connected to main deployment

### ขอบเขต Component / Part

| Part | สิ่งที่ใช้เป็น implementation | ความหมาย |
|---|---|---|
| http : SecurityHttpBoundary | [cis_security_validation/router.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/router.py) | HTTP boundary รวม FastAPI dependencies ที่ประกาศบน router |
| security : SecurityValidation | [cis_security_validation/service.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/service.py) | SecurityValidationService สำหรับ scan, rule CRUD และ override |
| engine : RuleEngineModule | [cis_security_validation/rule_engine.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/rule_engine.py) | Deterministic rule evaluation functions |
| actor : HeaderIdentityModule | [core/actor.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/actor.py) | ตัวอ่าน header และ role dependency แบบ development bridge |
| audit : LogAuditModule | [core/audit.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/audit.py) | ฟังก์ชัน audit ของ branch ที่ส่งเข้า application log เท่านั้น |
| database : DatabaseRuntime | [core/database.py](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/database.py) | get_db dependency ที่ HTTP boundary ขอใช้ |

### S01 — ISecurityOperations

ฝั่ง Socket: **http : SecurityHttpBoundary** · ฝั่ง Ball: **security : SecurityValidation**

Operations / API ที่สัญญาครอบคลุม:

- `scan(db, payload, actor)`
- `get_scan, override, list_rules, create_rule, update_rule, deactivate_rule`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/cis_security_validation/router.py:35 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/router.py#L35) — `await security_service.scan(db, payload, actor)`
- [backend/app/features/cis_security_validation/service.py:107 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/service.py#L107) — `async def scan(`

### S02 — IActorRoleDependency

ฝั่ง Socket: **http : SecurityHttpBoundary** · ฝั่ง Ball: **actor : HeaderIdentityModule**

Operations / API ที่สัญญาครอบคลุม:

- `get_current_actor()`
- `AnyRole, OperatorOrAdmin, AdminOnly dependencies`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/cis_security_validation/router.py:33 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/router.py#L33) — `Depends(OperatorOrAdmin)`
- [backend/app/core/actor.py:43 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/actor.py#L43) — `def require_roles(`

### S03 — IRequestSessionDependency

ฝั่ง Socket: **http : SecurityHttpBoundary** · ฝั่ง Ball: **database : DatabaseRuntime**

Operations / API ที่สัญญาครอบคลุม:

- `get_db() yields AsyncSession (FastAPI Depends)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/cis_security_validation/router.py:24 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/router.py#L24) — `DbSession = Annotated[AsyncSession, Depends(get_db)]`
- [backend/app/core/database.py:37 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/database.py#L37) — `async def get_db(`

The HTTP dependency boundary obtains db and passes it to service methods; the service does not call get_db.

### S04 — IConfigRuleEvaluation

ฝั่ง Socket: **security : SecurityValidation** · ฝั่ง Ball: **engine : RuleEngineModule**

Operations / API ที่สัญญาครอบคลุม:

- `evaluate_config(target_config, rules, vendor)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/cis_security_validation/service.py:118 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/service.py#L118) — `evaluate_config(payload.target_config, rules, vendor)`
- [backend/app/features/cis_security_validation/rule_engine.py:162 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/rule_engine.py#L162) — `def evaluate_config(`

### S05 — IBranchAuditRecord

ฝั่ง Socket: **security : SecurityValidation** · ฝั่ง Ball: **audit : LogAuditModule**

Operations / API ที่สัญญาครอบคลุม:

- `record_audit_event(db, action, resource_type, result, ...)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/cis_security_validation/service.py:165 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/features/cis_security_validation/service.py#L165) — `await audit.record_audit_event(`
- [backend/app/core/audit.py:22 @ 0f65dd8](https://github.com/Mynetmate/backend/blob/0f65dd8c966cb350771f00ca3cc8503fc8235636/app/core/audit.py#L22) — `logger.info(`

Not the AuditWriter Protocol: branch signature / behavior differ, and only an application log is written.

## MyNetMate - Configuration component assembly

[ภาพ SVG](04-configuration-main.svg) · [PlantUML](04-configuration-main.puml)

backend main @ 166e2ee | source-backed module boundaries | no device commands executed

### ขอบเขต Component / Part

| Part | สิ่งที่ใช้เป็น implementation | ความหมาย |
|---|---|---|
| versions : ConfigVersionModule | [config_version_control/service.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/service.py) | ConfigVersionControlService รวม deploy/reverify/record/load versions |
| drift : ConfigDriftModule | [config_version_control/drift.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/drift.py) | Drift use cases และ periodic checks |
| planning : ConfigPlanningModule | [config_generation/service.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py) | Planning, capture facade, resolve connection และ parse parameters |
| render : TemplateRenderModule | [config_generation/render.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/render.py) | Module ที่ห่อ Jinja2 rendering จริง |
| diff : RemediationModule | [config_generation/remediation.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/remediation.py) | Module ที่ห่อ remediation/diff โดยใช้ hier_config |
| ssh : NetmikoAdapter | [config_generation/netmiko_ops.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/netmiko_ops.py) | Adapter สำหรับ capture/push configuration โดยใช้ Netmiko |

### C01 — IConfigPlanning

ฝั่ง Socket: **versions : ConfigVersionModule** · ฝั่ง Ball: **planning : ConfigPlanningModule**

Operations / API ที่สัญญาครอบคลุม:

- `build_plan(db, request)`
- `resolve_connection(db, device_id)`
- `parameters_from_config(...)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_version_control/service.py:29 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/service.py#L29) — `await build_plan(db, payload)`
- [backend/app/features/config_generation/service.py:128 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py#L128) — `async def build_plan(`

### C02 — ILiveConfigPlanning

ฝั่ง Socket: **drift : ConfigDriftModule** · ฝั่ง Ball: **planning : ConfigPlanningModule**

Operations / API ที่สัญญาครอบคลุม:

- `build_plan(db, request)`
- `resolve_connection, capture_live_config, parameters_from_config`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_version_control/drift.py:89 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/drift.py#L89) — `await build_plan(db, ConfigGenerationRequest(`
- [backend/app/features/config_generation/service.py:176 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py#L176) — `async def capture_live_config(`

### C03 — IRecordConfigVersion

ฝั่ง Socket: **drift : ConfigDriftModule** · ฝั่ง Ball: **versions : ConfigVersionModule**

Operations / API ที่สัญญาครอบคลุม:

- `record_version(db, device_id, content, message)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_version_control/drift.py:146 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/drift.py#L146) — `await config_version_service.record_version(`
- [backend/app/features/config_version_control/service.py:66 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/service.py#L66) — `async def record_version(`

### C04 — IConfigRendering

ฝั่ง Socket: **planning : ConfigPlanningModule** · ฝั่ง Ball: **render : TemplateRenderModule**

Operations / API ที่สัญญาครอบคลุม:

- `render_config(device_type, parameters) -> str`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_generation/service.py:153 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py#L153) — `render_config(`
- [backend/app/features/config_generation/render.py:23 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/render.py#L23) — `def render_config(`

### C05 — IRemediationPlanning

ฝั่ง Socket: **planning : ConfigPlanningModule** · ฝั่ง Ball: **diff : RemediationModule**

Operations / API ที่สัญญาครอบคลุม:

- `compute_remediation_plan(...)`
- `compute_full_push_plan(...)`
- `managed_match_rules(...)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_generation/service.py:154 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py#L154) — `compute_remediation_plan(`
- [backend/app/features/config_generation/remediation.py:142 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/remediation.py#L142) — `def compute_remediation_plan(`

### C06 — IRunningConfigRead

ฝั่ง Socket: **planning : ConfigPlanningModule** · ฝั่ง Ball: **ssh : NetmikoAdapter**

Operations / API ที่สัญญาครอบคลุม:

- `capture_running_config(host, device_type, username, password, secret)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_generation/service.py:179 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/service.py#L179) — `netmiko_ops.capture_running_config`
- [backend/app/features/config_generation/netmiko_ops.py:100 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/netmiko_ops.py#L100) — `def capture_running_config(`

### C07 — IConfigDeployIO

ฝั่ง Socket: **versions : ConfigVersionModule** · ฝั่ง Ball: **ssh : NetmikoAdapter**

Operations / API ที่สัญญาครอบคลุม:

- `push_config(...)`
- `capture_running_config(...) for post-deploy verification`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [backend/app/features/config_version_control/service.py:37 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/service.py#L37) — `netmiko_ops.push_config`
- [backend/app/features/config_generation/netmiko_ops.py:169 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/netmiko_ops.py#L169) — `def push_config(`

## MyNetMate - Web client / server interface contracts

[ภาพ SVG](05-web-contract-pairs.svg) · [PlantUML](05-web-contract-pairs.puml)

Three INDEPENDENT revision pairs | URL-contract trace, not a merged system or E2E test

### ขอบเขต Component / Part

| Part | สิ่งที่ใช้เป็น implementation | ความหมาย |
|---|---|---|
| web : NetworkWebClient | [devices/DeviceInventoryPage.tsx](https://github.com/Mynetmate/website/blob/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e/src/features/devices/DeviceInventoryPage.tsx), [hooks/useNetworkScan.ts](https://github.com/Mynetmate/website/blob/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e/src/features/topology/hooks/useNetworkScan.ts) | Network UI และ client calls ที่มีใน source |
| api : NetworkHttpBoundary | [devices/router.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/router.py), [network_device_discovery/router.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/router.py) | HTTP/SSE boundary ที่ประกอบใน backend main |
| web : ConfigurationWebClient | [config/ConfigEditorPage.tsx](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/ConfigEditorPage.tsx), [components/DriftPanel.tsx](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/components/DriftPanel.tsx), [components/SshConsoleTab.tsx](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/devices/components/SshConsoleTab.tsx) | Configuration UI, Drift และ interactive console client |
| api : ConfigurationHttpBoundary | [config_generation/router.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/router.py), [config_version_control/router.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/router.py), [devices/router.py](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/router.py) | HTTP/WebSocket boundary ของ revision นี้ ไม่ใช่ service ใหม่ที่เพิ่มในโค้ด |
| web : IdentityAuditWebClient | [authentication/actions.ts](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/authentication/actions.ts), [users/UsersPage.tsx](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/users/UsersPage.tsx), [audit/AuditPage.tsx](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/audit/AuditPage.tsx) | Session, Users และ Audit client ของ frontend auth branch |
| api : IdentityAuditHttpBoundary | [authentication/router.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/router.py), [authentication/admin_router.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/admin_router.py), [audit_trail/router.py](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/router.py) | Auth/Admin/Audit HTTP boundaries ที่ main.py ของ branch ประกอบไว้ |

### W01 — IDeviceInventoryHttp

ฝั่ง Socket: **web : NetworkWebClient** · ฝั่ง Ball: **api : NetworkHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `/api/v1/devices (inventory, detail, topology, status)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/devices/DeviceInventoryPage.tsx:19 @ 28ac37b](https://github.com/Mynetmate/website/blob/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e/src/features/devices/DeviceInventoryPage.tsx#L19) — `listDevicesApiV1DevicesGetOptions`
- [backend/app/features/devices/router.py:13 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/router.py#L13) — `prefix='/devices'`

### W02 — IDiscoveryEventStream

ฝั่ง Socket: **web : NetworkWebClient** · ฝั่ง Ball: **api : NetworkHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET /api/v1/network-discovery/scan/stream (SSE)`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/topology/hooks/useNetworkScan.ts:96 @ 28ac37b](https://github.com/Mynetmate/website/blob/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e/src/features/topology/hooks/useNetworkScan.ts#L96) — `new EventSource(streamUrl)`
- [website/src/shared/config.ts:32 @ 28ac37b](https://github.com/Mynetmate/website/blob/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e/src/shared/config.ts#L32) — `/api/v1/network-discovery/scan/stream`
- [backend/app/features/network_device_discovery/router.py:21 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/network_device_discovery/router.py#L21) — `/scan/stream`

### W03 — IConfigPreviewHttp

ฝั่ง Socket: **web : ConfigurationWebClient** · ฝั่ง Ball: **api : ConfigurationHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET /api/v1/configs/{device_id}/current`
- `POST /api/v1/configs/generate`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/config/ConfigEditorPage.tsx:26 @ ad95634](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/ConfigEditorPage.tsx#L26) — `generateApiV1ConfigsGeneratePostMutation`
- [backend/app/features/config_generation/router.py:28 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_generation/router.py#L28) — `"/generate"`

### W04 — IConfigVersionHttp

ฝั่ง Socket: **web : ConfigurationWebClient** · ฝั่ง Ball: **api : ConfigurationHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `POST /api/v1/config-versions`
- `GET versions and version parameters`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/config/ConfigEditorPage.tsx:24 @ ad95634](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/ConfigEditorPage.tsx#L24) — `createConfigVersionApiV1ConfigVersionsPostMutation`
- [backend/app/features/config_version_control/router.py:59 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/router.py#L59) — `async def create_config_version(`

### W05 — IConfigDriftHttp

ฝั่ง Socket: **web : ConfigurationWebClient** · ฝั่ง Ball: **api : ConfigurationHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET /api/v1/config-drift`
- `POST device check / accept`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/config/components/DriftPanel.tsx:6 @ ad95634](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/components/DriftPanel.tsx#L6) — `checkDeviceApiV1ConfigDriftDeviceIdCheckPostMutation`
- [backend/app/features/config_version_control/router.py:37 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/config_version_control/router.py#L37) — `async def check_device(`

### W06 — IInteractiveSshWebSocket

ฝั่ง Socket: **web : ConfigurationWebClient** · ฝั่ง Ball: **api : ConfigurationHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `WS /api/v1/devices/{device_id}/ssh`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/devices/components/SshConsoleTab.tsx:44 @ ad95634](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/devices/components/SshConsoleTab.tsx#L44) — `new WebSocket(appConfig.endpoints.sshConsole(deviceId))`
- [backend/app/features/devices/router.py:16 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/router.py#L16) — `/{device_id}/ssh`

Interactive SSH console belongs to devices/ssh_console.py; separate from Netmiko configuration adapter.

### W07 — IDeviceDetailHttp

ฝั่ง Socket: **web : ConfigurationWebClient** · ฝั่ง Ball: **api : ConfigurationHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET /api/v1/devices/{device_id}`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/config/ConfigEditorPage.tsx:27 @ ad95634](https://github.com/Mynetmate/website/blob/ad95634ca7c10f22591c4b8a7e8267da388d74ed/src/features/config/ConfigEditorPage.tsx#L27) — `getDeviceDetailApiV1DevicesDeviceIdGetOptions`
- [backend/app/features/devices/router.py:82 @ 166e2ee](https://github.com/Mynetmate/backend/blob/166e2eeedbc80c783ffa98c327ef9365fbb68e50/app/features/devices/router.py#L82) — `async def get_device_detail(`

### W08 — ISessionHttp

ฝั่ง Socket: **web : IdentityAuditWebClient** · ฝั่ง Ball: **api : IdentityAuditHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `/api/auth/login, me, logout, change-password`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/authentication/actions.ts:33 @ 3e4d85c](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/authentication/actions.ts#L33) — `/api/auth/login`
- [backend/app/features/authentication/router.py:202 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/router.py#L202) — `"/login"`

### W09 — IUserAdminHttp

ฝั่ง Socket: **web : IdentityAuditWebClient** · ฝั่ง Ball: **api : IdentityAuditHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET/POST /api/admin/users`
- `PATCH /api/admin/users/{user_id}`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/users/UsersPage.tsx:24 @ 3e4d85c](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/users/UsersPage.tsx#L24) — `/api/admin/users`
- [backend/app/features/authentication/admin_router.py:22 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/authentication/admin_router.py#L22) — `"/users"`

### W10 — IAuditReadHttp

ฝั่ง Socket: **web : IdentityAuditWebClient** · ฝั่ง Ball: **api : IdentityAuditHttpBoundary**

Operations / API ที่สัญญาครอบคลุม:

- `GET /api/audit-logs`

หลักฐานการเรียก / การประกอบ และฝั่งให้บริการ:

- [website/src/features/audit/AuditPage.tsx:31 @ 3e4d85c](https://github.com/Mynetmate/website/blob/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251/src/features/audit/AuditPage.tsx#L31) — `/api/audit-logs`
- [backend/app/features/audit_trail/router.py:20 @ b862c60](https://github.com/Mynetmate/backend/blob/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4/app/features/audit_trail/router.py#L20) — `"/audit-logs"`

## ขอบเขตที่ไม่ควรตีความเกินหลักฐาน

- Assembly แสดงการจับคู่ Interface ในโครงสร้างซอฟต์แวร์ ไม่ได้แสดงข้อมูลไหลหรือเวลาเรียก
- Session ที่ส่งเข้า operation เป็น parameter ไม่ได้ทำให้เกิดการพึ่งพา Session Factory โดยตรง เช่น Audit Writer และ CIS Service
- Diagram 05 เป็นสามคู่ revision อิสระตาม API base URL ที่ตั้งค่า ไม่ใช่ระบบที่ merge ครบแล้วหรือผลยืนยันว่ารันร่วมกันผ่าน
- W01/W03–W05/W07 อาศัย source call sites ของ generated client ร่วมกับ backend routes; ไม่ได้ยืนยันว่ามี build artifact หรือผ่านการ build ในรอบนี้
- ส่วน HTTP, persistence หรือ internal helper ที่ละไว้เป็นการจำกัดรายละเอียดของมุมมอง ไม่ได้หมายความว่าไม่มีในโปรแกรม

อ้างอิงสัญลักษณ์: [UML Component Diagrams Reference](https://www.uml-diagrams.org/component-diagrams-reference.html), [UML Port](https://www.uml-diagrams.org/port.html), [PlantUML Component Diagram](https://plantuml.com/component-diagram)

