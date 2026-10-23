# คำอธิบาย Component Diagram ของ MyNetMate

> เอกสารประกอบความเข้าใจและการเรียบเรียงรายงาน Computer Engineering Project 1
> จัดทำคำอธิบาย: 23 ตุลาคม 2569 (2026-10-23)
> ขอบเขตโค้ด: immutable revisions ที่กำกับในรูปจากชุด audit วันที่ 2026-10-22 ไม่ใช่คำรับรองว่าเป็น HEAD ล่าสุดของทุก branch ณ วันนี้

เอกสารนี้เริ่มจากคำอธิบายแบบกระชับ แล้วอธิบายระดับของ Component ความหมายของทุกเส้นเมื่อเทียบกับโค้ด และเหตุผลของการเลือกมุมมอง แยกหลักฐาน implementation ออกจากเหตุผลเชิงออกแบบและสถานะการทดสอบ

รูปหลักมี 5 รูป ส่วนฉบับ A4 ที่ระบุใน A4/layout.json มี 10 รูปย่อย ทั้งสองชุดอ้างถึงสัญญาการเชื่อม 34 เส้นชุดเดียวกัน ไม่ใช่ฟีเจอร์หรือระบบเพิ่มอีกชุด เอกสารนี้ไม่ได้แก้รูปหรือสคริปต์ และไม่ได้สร้าง PDF

## 1. คำอธิบายแบบกระชับ

### รูปหลัก 01 — Network Management

[เปิดรูป](01-components-across-branches.svg)

รูปนี้อธิบายการทำงานร่วมกันของโมดูลจัดการอุปกรณ์ โมดูลประสานการเก็บข้อมูล ตัวรวบรวม SNMP และ Oxian Python library โดย Device Management ขอให้ Collection เก็บข้อมูล และ Collection ใช้บริการ apply Snapshot ของ Device Management อีกครั้ง เส้นเป็นสัญญาบริการสองทิศที่มีจริง ไม่ใช่เส้น Request/Response

ระดับ Component: ระดับโมดูล/บริการเชิงตรรกะภายใน Backend subsystem พร้อม dependency library หนึ่งตัว ไม่ใช่ระดับเครื่องอุปกรณ์หรือ Deployment

### รูปหลัก 02 — Authentication / Audit

[เปิดรูป](02-auth-audit-binding.svg)

รูปนี้แยก Auth, CLI Provisioning, Audit Adapter, Writer, Reader และ Session provider เพื่ออธิบายว่าเหตุการณ์ถูกส่งไปบันทึกอย่างไร ใครตรวจสิทธิ์ และใครเป็นเจ้าของ Session/transaction จุดเชื่อม Adapter–Writer มี AuditWriter Protocol และ runtime injection จริง

ระดับ Component: ระดับ application service และ supporting modules ภายใน Backend เดียวกัน ไม่ได้หมายความว่าเป็น microservices หกตัว

### รูปหลัก 03 — CIS Validation

[เปิดรูป](03-cis-branch-boundaries.svg)

รูปนี้อธิบายองค์ประกอบภายใน CIS branch ตั้งแต่ HTTP boundary และ dependencies ไปยัง use-case service, rule engine และ audit log bridge โดยยังไม่แสดงว่าเชื่อม Session-backed Auth หรือ main deployment แล้ว

ระดับ Component: ระดับ Backend HTTP boundary, application service และ supporting modules ของ CIS branch

### รูปหลัก 04 — Configuration Management

[เปิดรูป](04-configuration-main.svg)

รูปนี้อธิบายโมดูลที่รับผิดชอบ Version, Drift, Planning, Template Rendering, Remediation และ Netmiko adapter เส้นระบุการใช้ฟังก์ชันร่วมและ device I/O ที่พบใน snapshot ไม่ใช่การอนุญาตหรือผลทดสอบการ Deploy

ระดับ Component: ระดับ application modules และ infrastructure adapter ภายใน Backend main; บางกล่องมี Class เป็น implementation บางกล่องเป็นชุดฟังก์ชัน

### รูปหลัก 05 — Web Client / Server Contracts

[เปิดรูป](05-web-contract-pairs.svg)

รูปนี้แสดงสัญญา Network, Configuration และ Identity/Audit ระหว่างกลุ่มหน้าเว็บกับ Backend API โดยแยกเป็นสามคู่ revision อิสระ เส้นอาจเป็น HTTP, SSE หรือ WebSocket ตามสัญญาที่ใช้ ไม่ใช่การเรียกฟังก์ชันภายใน process เดียว

ระดับ Component: ระดับ frontend feature group กับ Backend API boundary ซึ่งหยาบกว่าภาพ 01–04 และมีการสื่อสารข้าม browser/server

## 2. หลักการอ่านที่ใช้ร่วมกันทุกภาพ

### 2.1 Component คือระดับใดในงานนี้

Component คือหน่วยซอฟต์แวร์ที่แบ่งหน้าที่และขอบเขตบริการไว้ชัด โดยซ่อนรายละเอียดภายในจากผู้ใช้บริการ ไม่ได้มีกฎว่า Component หนึ่งตัวต้องเท่ากับไฟล์หนึ่งไฟล์ Class หนึ่ง Class หรือ process หนึ่ง process เสมอไป แนวคิดการทดแทน implementation ต้องคงสัญญาที่ผู้ใช้บริการพึ่งพาไว้ ไม่ใช่คำรับรองว่าปัจจุบันถอดเปลี่ยนทุก module ได้ทันทีโดยไม่ปรับหรือทดสอบ ดู [แนวคิด Component ของ UML](https://download.eclipse.org/modeling/mdt/uml2/javadoc/5.0.0/org/eclipse/uml2/uml/Component.html)

สำหรับรูปชุดนี้:

- รูป 01–04 เป็นมุมมองโครงสร้างภายในของระบบย่อย Backend โดยใช้หน่วยระดับ module/application service และ adapter ที่โยงกับ source ได้
- รูป 05 เป็นมุมมองระดับ frontend feature group กับ Backend API boundary จึงมีความละเอียดหยาบกว่ารูป 01–04
- คำอธิบายว่าเป็นระดับ module/service/boundary คือการบอกความละเอียดของแบบจำลองนี้ ไม่ใช่หมายเลขระดับที่ UML กำหนด และไม่ได้อ้างว่าเป็น C4 Model
- UML Component ไม่ใช่ React Component: กล่อง NetworkWebClient ในรูปอาจครอบคลุม React components หลายตัว client calls และ state/hooks ที่ร่วมกันทำหน้าที่นั้น
- รูปชุดนี้ไม่ใช่ Deployment Diagram จึงไม่แปลว่ากล่องแต่ละกล่องเป็น Docker container, server หรืออุปกรณ์เครือข่ายคนละตัว

### 2.2 กล่องและ Part อ่านอย่างไร

สัญลักษณ์ Component ที่มุมของกล่องบอกว่ากล่องนั้นเป็นหน่วยซอฟต์แวร์ในแบบจำลอง ไม่ใช่ไอคอน Router/Switch ส่วนกรอบคำอธิบายและ legend ไม่ใช่ Component เพิ่มเติม

ข้อความ `collection : NetworkCollection` หมายถึงบทบาท/Part ชื่อ collection ซึ่งมีชนิด Component ตามแบบจำลองชื่อ NetworkCollection ชื่อเหล่านี้เป็นชื่อเชิงสถาปัตยกรรม ตารางในแต่ละหัวข้อระบุสิ่งที่ทำหน้าที่เป็น implementation จริง ไม่จำเป็นต้องมี Python Class ชื่อ NetworkCollection ตรงตัว

กล่องครอบด้านนอกกำหนดบริบทของ internal structure ส่วนกล่องด้านในแสดงหน่วยที่ประกอบกันในมุมมองนั้น ไม่ได้หมายความว่า source มี Python package หรือ Class ชื่อเดียวกับกล่องครอบทุกตัว ส่วนกรอบของรูป 05 เป็นบริบทของคู่ revision ที่นำมาเทียบ ไม่ใช่หลักฐานว่าทั้งสามคู่รวมกันใน runtime เดียวแล้ว

### 2.3 Ball-and-Socket และ Port หมายถึงอะไร

| สัญลักษณ์ | ความหมาย | ความสัมพันธ์กับโค้ด |
|---|---|---|
| วงกลม (Ball/Lollipop) | Provided Interface: บริการที่ Component ฝั่งนั้นให้ | เช่น callable สำหรับบันทึก Audit หรือ endpoint ที่ backend รองรับ |
| ครึ่งวงกลม (Socket) | Required Interface: บริการที่ Component ฝั่งนั้นต้องใช้ | เช่น Auth Adapter ต้องใช้ writer หรือ frontend ต้องใช้ Preview API |
| สี่เหลี่ยมเล็กที่ขอบ | Port: จุดติดต่อของ Component ในแบบจำลอง | ไม่ใช่ TCP/UDP port และไม่ต้องมีตัวแปร Python ชื่อ Port |
| วงกลมประกบครึ่งวงกลม | Assembly Connector: การประกอบผู้ต้องใช้กับผู้ให้บริการที่เข้ากัน | อาจแทน module API call, injected callable หรือ web API contract ตามระดับของภาพ |

รูปชุดนี้ใช้ Simple Ports คือแต่ละจุดให้หรือใช้ Interface เดียว ชื่อสัญญาหนึ่งชื่ออาจมีหลาย operation ได้ เช่น IConfigVersionHttp ครอบคลุมหลาย endpoint ที่เป็นบริการเรื่องเวอร์ชัน ไม่ได้หมายความว่า Simple Port ต้องมีเพียงเมธอดเดียว ตาม [UML Component Diagrams Reference](https://www.uml-diagrams.org/component-diagrams-reference.html) และ [UML Port](https://www.uml-diagrams.org/port.html)

**เส้นไม่ได้มีความหมายว่า “ทำขั้นตอนนี้ก่อน แล้วค่อยทำขั้นตอนถัดไป”** การดูว่าใครต้องใช้ใครให้ดู Socket/Ball ไม่ใช่ซ้าย–ขวาหรือบน–ล่าง หากต้องอธิบายเวลาเรียก การคืนค่า และทางผิดพลาด ควรใช้ Sequence Diagram ประกอบ

ชื่อที่ขึ้นต้น I เช่น ITargetCollection และ IConfigRendering เป็นชื่อสัญญาในแบบจำลองที่สกัดจาก operation จริง ไม่ได้อ้างว่ามี Interface/Class ชื่อนั้นใน Python ทุกตัว ข้อยกเว้นที่เห็นชัดคือ AuditWriter ซึ่งมี Python Protocol ประกาศจริง รหัส N01/A03/... เป็นรหัสสืบย้อน ไม่ใช่ชื่อ API endpoint และ 34 เส้นไม่ได้เท่ากับ Interface คนละชื่อ 34 ชื่อ เพราะบางชื่อถูกใช้ร่วมหลายคู่

คำสั่ง portin/portout ใน PlantUML ใช้ช่วยจัดวาง Port ไม่ใช่เกณฑ์ตัดสิน Required/Provided ใน UML ความหมายที่เอกสารอธิบายยึดฝั่ง Socket/Ball และสัญญา ไม่ยึดตำแหน่งที่ renderer เลือกวาง

### 2.4 เหตุใดการพบ function call จึงยังไม่เพียงพอ

การที่ A เรียกฟังก์ชันของ B ไม่ได้บังคับว่าต้องแยก A/B เป็น UML Components ทุกครั้ง รูปนี้เลือกเฉพาะกลุ่มหน้าที่ที่มีขอบเขต public operations แล้วกำหนด contract ระหว่างขอบเขตนั้น เช่น Render module ไม่แยก get_template กับ template.render เป็นคนละ Component จุดมุ่งหมายคืออธิบายโครงสร้างและการแบ่งความรับผิดชอบ ไม่ใช่คัดลอกรายการ call graph ทั้งหมด

การเปลี่ยนหน้าตาเส้น Dependency ให้เป็น Ball-and-Socket อย่างเดียวไม่ทำให้แบบจำลองถูกต้อง ต้องอธิบายได้ว่าผู้ใช้ต้องการบริการใด ผู้ให้รองรับ operations ใด และประกอบเข้ากันในบริบทใด ข้อเท็จจริงเหล่านี้แสดงในตารางของแต่ละรูป

## 3. คำอธิบายละเอียดของรูปหลัก

เหตุผลการออกแบบด้านล่างหมายถึงเหตุผลที่เลือกแบ่งและนำเสนอแบบจำลองนี้จากโค้ด ไม่ใช่การอ้างว่าทีมเคยบันทึกการตัดสินใจเชิงสถาปัตยกรรมไว้ทุกข้อ

### 3.1 รูปหลัก 01 — Network Management

[SVG](01-components-across-branches.svg) · [PNG](01-components-across-branches.png) · [PlantUML](01-components-across-branches.puml)

![Network Management](<E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/01_architecture_and_specs/MyNetMate Component Diagram - Code Audit 2026-10-22/01-components-across-branches.png>)

Revision ที่ใช้อธิบาย: backend main @ 166e2ee | selected internal contracts | no cross-branch assembly

#### 3.1.1 ระดับของ Component และสิ่งที่แต่ละกล่องแทน

ระดับโมดูล/บริการเชิงตรรกะภายใน Backend subsystem พร้อม dependency library หนึ่งตัว ไม่ใช่ระดับเครื่องอุปกรณ์หรือ Deployment

| Part / Component ในรูป | implementation ที่อ้างถึง | ความรับผิดชอบและขอบเขต |
|---|---|---|
| `devices : DeviceManagement` | DeviceService และ use cases จัดการอุปกรณ์ — `app/features/devices/service.py` | การรับ Snapshot เป็น public operation ของขอบเขตนี้ ส่วน inventory, snapshot, health และ topology services ภายในถูกย่อไว้ |
| `collection : NetworkCollection` | CollectionService ประสาน enrollment, collection และ discovery — `app/features/network_device_discovery/service.py` | รับผิดชอบการจัดงานเก็บข้อมูลและสถานะงาน ไม่รวมรายละเอียด SNMP ทุก OID |
| `collector : InventoryCollection` | InventoryCollector และ StrictSnmpClient ฝั่งแอป — `app/features/devices/collector.py` | รวบรวมและแปลข้อมูล SNMP เป็น Snapshot เพื่อไม่ให้ use case ต้องอ่าน OID เอง |
| `oxian : OxianPython` | Python library สำหรับ discovery และ SNMP — `oxian_py/` | เป็น dependency library ไม่ใช่เครื่อง Router/Switch และไม่ได้แปลว่า backend เรียก Rust CLI |

#### 3.1.2 เส้นเชื่อมแปลว่าอะไรในโค้ดจริง

คอลัมน์ผู้ต้องใช้คือฝั่ง Socket และคอลัมน์ผู้ให้บริการคือฝั่ง Ball ไม่ใช่ลูกศรหรือเส้นบอกลำดับเวลา

| รหัสและ Interface | ผู้ต้องใช้บริการ (Socket) | ผู้ให้บริการ (Ball) | ความหมายในโค้ด |
|---|---|---|---|
| N01 — `ITargetCollection` | `DeviceManagement` | `NetworkCollection` | DeviceService.create() เรียก await collection_service.collect_target(...) เพื่อเก็บข้อมูลเริ่มต้นจากอุปกรณ์เป้าหมายที่ผู้ใช้เพิ่ม |
| N02 — `ISnapshotApplication` | `NetworkCollection` | `DeviceManagement` | CollectionService.collect_target() เรียก await device_service.apply_snapshot(...) เพื่อนำ Snapshot ไปปรับปรุงข้อมูลอุปกรณ์และ Interface ผ่านบริการจัดการอุปกรณ์ |
| N03 — `IInventoryCollection` | `NetworkCollection` | `InventoryCollection` | CollectionService เรียก await collector.collect(target, community, port, timeout) เพื่อรับ Snapshot ที่รวบรวมจาก SNMP |
| N04 — `IOxianDiscovery` | `NetworkCollection` | `OxianPython` | CollectionService ใช้ discover_stream(...) และ discover(...) ที่ import จาก oxian_py สำหรับการค้นหาเครือข่ายและรับผลแบบต่อเนื่อง |
| N05 — `ISnmpClient` | `InventoryCollection` | `OxianPython` | InventoryCollector สร้าง StrictSnmpClient ซึ่งสืบทอดจาก SnmpClient ของ Oxian และใช้ get(), walk_column(), walk_lldp_column() รวมทั้งวงจร async context manager; walk() ที่ override เองยังเป็น implementation ฝั่ง MyNetMate |

#### 3.1.3 ทำไมจึงเลือกออกแบบภาพแบบนี้

แยกการจัดงาน การอ่านอุปกรณ์ และการปรับข้อมูล Inventory

ภาพต้องการตอบว่าใครรับผิดชอบการเก็บข้อมูลและใครนำผลไปใช้ ไม่ลงไปถึงทุก query หรือ OID จึงแยก Collection ออกจาก Collector และ Device Management ตามขอบเขตโค้ดที่พบ การแยกเช่นนี้ช่วยอธิบายการเปลี่ยนวิธีเก็บข้อมูลโดยไม่เอารายละเอียด SNMP ไปผูกกับทุก use case แต่ไม่ใช่หลักฐานว่าถอดเปลี่ยน implementation ได้ทันทีโดยไม่ทดสอบ

มีการพึ่งพาสองทิศจริงระหว่าง Device Management กับ Collection: ฝั่งหนึ่งขอเก็บข้อมูล อีกฝั่งขอ apply Snapshot ความสัมพันธ์นี้สะท้อน coupling ปัจจุบัน ไม่ใช่การยืนยันว่าเป็นสถาปัตยกรรมที่ไร้ปัญหาหรือไม่มีวงจรการพึ่งพา

ตัวอย่างสำคัญ: N01 มี Device Management เป็นผู้ต้องใช้บริการ Collection แต่ N02 มี Collection เป็นผู้ต้องใช้บริการ Device Management การคืนค่า Snapshot หรือ tuple จาก collect_target เป็น return value ของเมธอด ไม่ใช่ความหมายของเส้น N02 เพราะ N02 มีการเรียก apply_snapshot คนละ operation จริง

ส่วน TopologyService และ InventoryService ภายใน DeviceService ไม่ถูกขยายในภาพนี้ จึงไม่ควรอธิบายว่ารูป 01 แจกแจงทุกส่วนของ Network Management ครบทั้งหมด

หลักฐานจุดเรียก จุดประกาศ และ immutable source links รายเส้น: [CONTRACTS.md](CONTRACTS.md)

### 3.2 รูปหลัก 02 — Authentication / Audit

[SVG](02-auth-audit-binding.svg) · [PNG](02-auth-audit-binding.png) · [PlantUML](02-auth-audit-binding.puml)

![Authentication / Audit](<E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/01_architecture_and_specs/MyNetMate Component Diagram - Code Audit 2026-10-22/02-auth-audit-binding.png>)

Revision ที่ใช้อธิบาย: backend feature/11-audit-writer @ b862c60 | application-owned contracts

#### 3.2.1 ระดับของ Component และสิ่งที่แต่ละกล่องแทน

ระดับ application service และ supporting modules ภายใน Backend เดียวกัน ไม่ได้หมายความว่าเป็น microservices หกตัว

| Part / Component ในรูป | implementation ที่อ้างถึง | ความรับผิดชอบและขอบเขต |
|---|---|---|
| `auth : AuthenticationService` | AuthService และการประกอบ runtime ของตัวตน/สิทธิ์ — `app/features/authentication/service.py` | เป็น application service ไม่ใช่หน้า Login และไม่ใช่เครื่อง server แยก |
| `bootstrap : UserProvisioning` | ProvisioningService สำหรับ CLI bootstrap/demo — `app/features/authentication/provisioning.py` | เตรียมผู้ใช้ผ่าน entry point ของ CLI ต้องไม่สับสนกับ admin_router.py |
| `adapter : AuthAuditAdapterModule` | AuthAuditAdapter และ AuditWriter Protocol — `app/features/authentication/audit_adapter.py` | แปลงเหตุการณ์ฝั่ง Auth ให้เข้ากับสัญญา writer โดยไม่เป็นเจ้าของ transaction |
| `writer : AuditAppendModule` | record_audit_event และ registry/redaction ที่เกี่ยวข้อง — `app/features/audit_trail/writer.py` | ตรวจข้อมูลและ add/flush AuditLog โดยรับ Session จากผู้เรียก |
| `reader : AuditReadModule` | AuditReadService — `app/features/audit_trail/reader.py` | ตรวจสิทธิ์ผ่าน authorizer ที่ส่งเข้ามา แล้วอ่าน Audit ด้วย Session ของตน |
| `database : DatabaseRuntime` | Database runtime / Session provider — `app/core/database.py` | กล่องนี้ไม่ใช่ PostgreSQL server; แทนบริการ get_db หรือ async_session_factory ตามภาพและ revision |

#### 3.2.2 เส้นเชื่อมแปลว่าอะไรในโค้ดจริง

คอลัมน์ผู้ต้องใช้คือฝั่ง Socket และคอลัมน์ผู้ให้บริการคือฝั่ง Ball ไม่ใช่ลูกศรหรือเส้นบอกลำดับเวลา

| รหัสและ Interface | ผู้ต้องใช้บริการ (Socket) | ผู้ให้บริการ (Ball) | ความหมายในโค้ด |
|---|---|---|---|
| A01 — `IRecordAuthEvent` | `AuthenticationService` | `AuthAuditAdapterModule` | AuthService สร้าง AuthAuditAdapter(db, self._writer) แล้ว await record_auth_event(...) สำหรับเหตุการณ์ด้านตัวตนและสิทธิ์ |
| A02 — `IRecordAuthEvent` | `UserProvisioning` | `AuthAuditAdapterModule` | ProvisioningService ของ CLI bootstrap/demo สร้าง Adapter และเรียก record_auth_event(...) เมื่อจัดเตรียมผู้ใช้ ไม่ใช่การเรียกจาก User Admin HTTP API |
| A03 — `AuditWriter` | `AuthAuditAdapterModule` | `AuditAppendModule` | Adapter เรียก await self._writer(db=..., action=..., ...) ตาม AuditWriter Protocol; runtime.py ส่ง record_audit_event ของ shared writer เข้า AuthService และ CLI ส่ง callable นี้ให้ ProvisioningService |
| A04 — `IAsyncSessionFactory` | `AuthenticationService` | `DatabaseRuntime` | runtime.py ส่ง async_session_factory เข้า AuthService ผ่าน session_factory=...; Service เรียก self._sessions() เมื่อต้องเปิด Session ของตน |
| A05 — `IAsyncSessionFactory` | `UserProvisioning` | `DatabaseRuntime` | CLI wiring ส่ง async_session_factory เข้า ProvisioningService ซึ่งเรียก self._sessions() เมื่อต้องอ่านหรือเขียนข้อมูล |
| A06 — `IAsyncSessionFactory` | `AuditReadModule` | `DatabaseRuntime` | Audit router ขอ factory ผ่าน get_auth_session_factory(request) แล้วส่งเข้า AuditReadService; Reader เรียก self._sessions() เพื่อเปิด Session สำหรับอ่าน |
| A07 — `IAuthorize` | `AuditReadModule` | `AuthenticationService` | Audit router ส่ง bound method request.state.auth_service.authorize เป็น authorizer; Reader เรียก await self._authorizer(cookie_token, 'audit.read') ก่อนเปิด Session สำหรับอ่าน |

#### 3.2.3 ทำไมจึงเลือกออกแบบภาพแบบนี้

แยกผู้สร้างเหตุการณ์ ผู้แปลงเหตุการณ์ ผู้เขียน และผู้อ่าน

Auth ไม่ต้องรู้รายละเอียด AuditLog, redaction และ registry ทั้งหมด จึงใช้ Adapter เชื่อมไปยัง writer ที่มี Protocol ชัดเจน ส่วน Reader ใช้ authorizer และ Session Factory แยกจากเส้นทางเขียน เพื่ออธิบายสิทธิ์และ transaction ownership ให้เห็นจากโค้ด

เส้น factory มีเฉพาะผู้ที่ขอ Session จริง ไม่มีเส้น Writer ขอ factory เพราะ Writer รับ db ผ่านพารามิเตอร์ การไม่วาดเส้นนี้ไม่ได้แปลว่า Writer ไม่ใช้ฐานข้อมูล แต่แปลว่ามันไม่ได้เป็นผู้สร้าง Session

ตัวอย่างจุดประกอบในโค้ดจริง: runtime สร้าง AuthService โดยส่ง `audit_writer=record_audit_event` และ `session_factory=async_session_factory` จากนั้น Service ส่ง writer ให้ Adapter เมื่อสร้าง `AuthAuditAdapter(db, self._writer)` ส่วน Adapter เรียก writer ด้วย keyword arguments ตาม AuditWriter Protocol ไม่ใช่ส่ง HTTP request ไป service อื่น

Audit Writer ไม่ได้ commit หรือ rollback เอง บริการผู้เรียกเป็นผู้ควบคุม transaction การเอาเส้น Writer–Session Factory ออกจึงเป็นการอธิบาย ownership ให้ตรง ไม่ใช่ลบข้อเท็จจริงว่า Writer ใช้ AsyncSession และไม่มีหลักฐานว่ามีการแทน implementation อื่นแล้วจริง เพียงแต่มี contract/injection ที่รองรับแนวคิดนี้

หลักฐานจุดเรียก จุดประกาศ และ immutable source links รายเส้น: [CONTRACTS.md](CONTRACTS.md)

### 3.3 รูปหลัก 03 — CIS Validation

[SVG](03-cis-branch-boundaries.svg) · [PNG](03-cis-branch-boundaries.png) · [PlantUML](03-cis-branch-boundaries.puml)

![CIS Validation](<E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/01_architecture_and_specs/MyNetMate Component Diagram - Code Audit 2026-10-22/03-cis-branch-boundaries.png>)

Revision ที่ใช้อธิบาย: backend feature/08-cis-security-validation @ 0f65dd8 | NOT connected to main deployment

#### 3.3.1 ระดับของ Component และสิ่งที่แต่ละกล่องแทน

ระดับ Backend HTTP boundary, application service และ supporting modules ของ CIS branch

| Part / Component ในรูป | implementation ที่อ้างถึง | ความรับผิดชอบและขอบเขต |
|---|---|---|
| `http : SecurityHttpBoundary` | Security router และ FastAPI dependency boundary — `app/features/cis_security_validation/router.py` | รวมพฤติกรรมการจัดหา dependencies ของ framework ไว้ใน boundary ไม่ได้อ้างว่า handler เรียก dependency ด้วยตนเองทุกครั้ง |
| `security : SecurityValidation` | SecurityValidationService — `app/features/cis_security_validation/service.py` | จัด use cases scan, override และ rule catalog โดยใช้ Session ที่รับเข้ามา |
| `engine : RuleEngineModule` | Rule evaluation functions — `app/features/cis_security_validation/rule_engine.py` | แยก logic ประเมินข้อความ Config ออกจาก HTTP และ persistence |
| `actor : HeaderIdentityModule` | Header identity และ role dependencies — `app/core/actor.py` | เป็นสะพานชั่วคราวแบบไม่ยืนยันตัวตนจริง ไม่ใช่ Session-backed Auth |
| `audit : LogAuditModule` | Branch-local audit function — `app/core/audit.py` | ชื่อ Audit ในภาพ CIS หมายถึง log bridge ไม่ใช่ shared writer ในภาพ 02 |
| `database : DatabaseRuntime` | Database runtime / Session provider — `app/core/database.py` | กล่องนี้ไม่ใช่ PostgreSQL server; แทนบริการ get_db หรือ async_session_factory ตามภาพและ revision |

#### 3.3.2 เส้นเชื่อมแปลว่าอะไรในโค้ดจริง

คอลัมน์ผู้ต้องใช้คือฝั่ง Socket และคอลัมน์ผู้ให้บริการคือฝั่ง Ball ไม่ใช่ลูกศรหรือเส้นบอกลำดับเวลา

| รหัสและ Interface | ผู้ต้องใช้บริการ (Socket) | ผู้ให้บริการ (Ball) | ความหมายในโค้ด |
|---|---|---|---|
| S01 — `ISecurityOperations` | `SecurityHttpBoundary` | `SecurityValidation` | Security router เรียกเมธอดของ security_service เช่น scan(db, payload, actor), get_scan(...), override(...) และ rule CRUD |
| S02 — `IActorRoleDependency` | `SecurityHttpBoundary` | `HeaderIdentityModule` | FastAPI ประเมิน dependencies ของ route ที่อ้างถึง AnyRole, OperatorOrAdmin หรือ AdminOnly จาก core/actor.py; module นี้อ่าน Actor และตรวจบทบาทตามชุดที่อนุญาต |
| S03 — `IRequestSessionDependency` | `SecurityHttpBoundary` | `DatabaseRuntime` | Router ประกาศ DbSession = Annotated[AsyncSession, Depends(get_db)]; FastAPI จัดหา Session แล้วส่ง db ให้ handler ซึ่งส่งต่อเข้า Service |
| S04 — `IConfigRuleEvaluation` | `SecurityValidation` | `RuleEngineModule` | SecurityValidationService.scan() เรียก evaluate_config(payload.target_config, rules, vendor) เพื่อรับผลประเมินตามกฎ |
| S05 — `IBranchAuditRecord` | `SecurityValidation` | `LogAuditModule` | SecurityValidationService.override() เรียก await audit.record_audit_event(db, ...) ของ core/audit.py; implementation ที่ revision นี้ส่งเหตุการณ์เข้า logger.info ไม่ใช่ shared AuditLog table |

#### 3.3.3 ทำไมจึงเลือกออกแบบภาพแบบนี้

แยก HTTP, use case, rule engine และสะพาน integration

การแยก Rule Engine ทำให้เห็นว่าการประเมินกฎไม่ได้เป็นหน้าที่ของ router และไม่จำเป็นต้องนำการอ่าน header หรือฐานข้อมูลเข้าไปปนใน logic ประเมินกฎ ในภาพเลือกแสดง framework dependency boundary เพื่ออธิบายว่า Session และ Actor มาจากไหน

แสดง CIS branch แยกจาก Auth/Audit และ main deployment เพราะยังไม่มีหลักฐานการผูกต่อครบ การไม่ลากเส้นข้าม branch ป้องกันการอธิบายสถานะงานเกินโค้ด

ข้อจำกัดที่ต้องกล่าวเมื่ออธิบาย: Actor ใน core/actor.py มาจาก X-User-Role/X-User-Id ซึ่งโค้ดระบุว่าไม่ยืนยันตัวตน และ core/audit.py เขียน application log จึงไม่ควรเรียกภาพนี้ว่า “เชื่อมระบบ Auth และ Audit Trail กลางครบแล้ว” อีกทั้งการคืน deployment_allowed จากผลสแกน/override ไม่ได้พิสูจน์ว่า deployment service บังคับใช้ผลนั้นก่อนส่งคำสั่ง

หลักฐานจุดเรียก จุดประกาศ และ immutable source links รายเส้น: [CONTRACTS.md](CONTRACTS.md)

### 3.4 รูปหลัก 04 — Configuration Management

[SVG](04-configuration-main.svg) · [PNG](04-configuration-main.png) · [PlantUML](04-configuration-main.puml)

![Configuration Management](<E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/01_architecture_and_specs/MyNetMate Component Diagram - Code Audit 2026-10-22/04-configuration-main.png>)

Revision ที่ใช้อธิบาย: backend main @ 166e2ee | source-backed module boundaries | no device commands executed

#### 3.4.1 ระดับของ Component และสิ่งที่แต่ละกล่องแทน

ระดับ application modules และ infrastructure adapter ภายใน Backend main; บางกล่องมี Class เป็น implementation บางกล่องเป็นชุดฟังก์ชัน

| Part / Component ในรูป | implementation ที่อ้างถึง | ความรับผิดชอบและขอบเขต |
|---|---|---|
| `versions : ConfigVersionModule` | ConfigVersionControlService — `app/features/config_version_control/service.py` | ครอบคลุม create/deploy/reverify/record/list/load version ตามโค้ด revision นี้ |
| `drift : ConfigDriftModule` | Drift use cases และ periodic-check logic — `app/features/config_version_control/drift.py` | รับผิดชอบการเทียบสถานะกับ baseline และยอมรับ baseline ใหม่ |
| `planning : ConfigPlanningModule` | Planning, connection และ capture/parse facade — `app/features/config_generation/service.py` | รวม logic เตรียมแผนที่หลาย use cases ใช้ร่วม ไม่ใช่ตัว Template Engine โดยตรง |
| `render : TemplateRenderModule` | Jinja2 rendering wrapper — `app/features/config_generation/render.py` | เลือก template และคืนข้อความ Config ไม่ใช่ส่วนส่งคำสั่งไปอุปกรณ์ |
| `diff : RemediationModule` | Remediation planning module — `app/features/config_generation/remediation.py` | คำนวณขอบเขตความเปลี่ยนแปลงและแผนตาม platform ไม่ใช่การรับรอง idempotency engine ทั้งระบบ |
| `ssh : NetmikoAdapter` | Netmiko configuration adapter — `app/features/config_generation/netmiko_ops.py` | ให้บริการ capture/push แบบกำหนดคำสั่ง ไม่ใช่ Paramiko interactive console ของภาพ 05 |

#### 3.4.2 เส้นเชื่อมแปลว่าอะไรในโค้ดจริง

คอลัมน์ผู้ต้องใช้คือฝั่ง Socket และคอลัมน์ผู้ให้บริการคือฝั่ง Ball ไม่ใช่ลูกศรหรือเส้นบอกลำดับเวลา

| รหัสและ Interface | ผู้ต้องใช้บริการ (Socket) | ผู้ให้บริการ (Ball) | ความหมายในโค้ด |
|---|---|---|---|
| C01 — `IConfigPlanning` | `ConfigVersionModule` | `ConfigPlanningModule` | ConfigVersionControlService ใช้ build_plan(db, payload), resolve_connection(...) และ parameters_from_config(...) ของ planning module สำหรับการ deploy หรือเตรียมพารามิเตอร์จากเวอร์ชัน |
| C02 — `ILiveConfigPlanning` | `ConfigDriftModule` | `ConfigPlanningModule` | drift.py ใช้ build_plan(...), resolve_connection(...), capture_live_config(...) และ parameters_from_config(...) เพื่อเทียบสถานะปัจจุบันกับ baseline |
| C03 — `IRecordConfigVersion` | `ConfigDriftModule` | `ConfigVersionModule` | accept_device_state() ใน drift.py เรียก config_version_service.record_version(db, device_id, running, message) เพื่อยอมรับสถานะปัจจุบันเป็น baseline ใหม่ ไม่ได้ Push Config ใน operation นี้ |
| C04 — `IConfigRendering` | `ConfigPlanningModule` | `TemplateRenderModule` | Planning เรียก render_config(device_type, parameters) ของ render.py; module นี้เลือก Jinja2 template และคืนข้อความการกำหนดค่า |
| C05 — `IRemediationPlanning` | `ConfigPlanningModule` | `RemediationModule` | Planning เรียก compute_remediation_plan(...), compute_full_push_plan(...) และ managed_match_rules(...); remediation.py ห่อ logic วางแผนความเปลี่ยนแปลง โดยใช้ hier_config ในเส้นทาง Cisco และ logic แยกในเส้นทาง RouterOS |
| C06 — `IRunningConfigRead` | `ConfigPlanningModule` | `NetmikoAdapter` | capture_live_config() ส่ง netmiko_ops.capture_running_config และอาร์กิวเมนต์ให้ run_in_threadpool(...) เพื่ออ่าน Running Config; จึงเป็นการใช้บริการผ่าน callable ไม่ใช่ syntax เรียกชื่อฟังก์ชันตรงทุกกรณี |
| C07 — `IConfigDeployIO` | `ConfigVersionModule` | `NetmikoAdapter` | create_version() ส่ง netmiko_ops.push_config ให้ run_in_threadpool(...) แล้วเรียก capture_running_config เพื่ออ่านยืนยันภายหลัง ก่อนบันทึกเวอร์ชัน |

#### 3.4.3 ทำไมจึงเลือกออกแบบภาพแบบนี้

แยกการวางแผน การแปลง Template การคำนวณ Diff และ device I/O

Versions และ Drift ใช้ planning functions ร่วมกัน จึงแสดงว่า logic การตีความสถานะและสร้างแผนอยู่ที่ใด ส่วน Jinja2, remediation และ Netmiko มี wrapper คนละหน้าที่จริง จึงไม่รวมเป็นกล่องรายชื่อไลบรารีที่ดูเหมือนเป็น Component เดียว

การแสดง C07 ยอมรับข้อเท็จจริงว่ามีโค้ด push อยู่ใน snapshot ไม่ได้เปลี่ยน MVP scope อัตโนมัติ ไม่ได้อนุญาต AI ให้รัน และไม่รับรองว่าเชื่อม CIS gate หรือ Human-in-the-Loop ฝั่ง server สมบูรณ์แล้ว

ข้อควรแยกให้ชัด: Preview/build_plan มีการอ่าน Running Config ผ่าน SSH ใน snapshot นี้ จึงไม่ควรอธิบายว่าการ Preview เป็นเพียง render ข้อความแบบ offline ทุกครั้ง แต่การอ่านไม่ได้เท่ากับการ Push ส่วน C07 เป็นคนละสัญญาสำหรับ push และอ่านยืนยันภายหลัง

Code snapshot มีเส้นทาง Netmiko push แต่ยังไม่พบการเรียก CIS gate ของอีก branch จึงต้องรายงานเป็นช่องว่างระหว่าง implementation กับกฎ safety/validation ของโครงงาน ไม่ใช้รูปนี้ประกาศว่าทุก Deploy ปลอดภัยหรือผ่าน CIS แล้ว และไม่ใช้เป็นเหตุให้ AI execute บนอุปกรณ์

หลักฐานจุดเรียก จุดประกาศ และ immutable source links รายเส้น: [CONTRACTS.md](CONTRACTS.md)

### 3.5 รูปหลัก 05 — Web Client / Server Contracts

[SVG](05-web-contract-pairs.svg) · [PNG](05-web-contract-pairs.png) · [PlantUML](05-web-contract-pairs.puml)

![Web Client / Server Contracts](<E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/01_architecture_and_specs/MyNetMate Component Diagram - Code Audit 2026-10-22/05-web-contract-pairs.png>)

Revision ที่ใช้อธิบาย: Three INDEPENDENT revision pairs | URL-contract trace, not a merged system or E2E test

#### 3.5.1 ระดับของ Component และสิ่งที่แต่ละกล่องแทน

ระดับ frontend feature group กับ Backend API boundary ซึ่งหยาบกว่าภาพ 01–04 และมีการสื่อสารข้าม browser/server

| Part / Component ในรูป | implementation ที่อ้างถึง | ความรับผิดชอบและขอบเขต |
|---|---|---|
| `web : NetworkWebClient` | กลุ่ม Network UI และ client calls — `src/features/devices/ และ src/features/topology/` | รวมหลาย React components ตามหน้าที่ ไม่ใช่หนึ่ง React component เท่ากับหนึ่ง UML Component |
| `api : NetworkHttpBoundary` | Device และ Discovery HTTP/SSE boundary — `devices/router.py และ network_device_discovery/router.py` | ย่อ FastAPI routers ที่เกี่ยวข้อง ไม่ได้สร้าง service ใหม่ชื่อ NetworkHttpBoundary ใน source |
| `web : ConfigurationWebClient` | ConfigEditor, DriftPanel, VersionHistory และ console client — `src/features/config/ และ SshConsoleTab.tsx` | มุมมองระดับ frontend feature boundary ไม่ใช่กล่องแทน backend SSH adapter |
| `api : ConfigurationHttpBoundary` | Configuration HTTP และอุปกรณ์ detail/WebSocket boundary — `config_generation/router.py, config_version_control/router.py, devices/router.py` | เป็นการรวม boundary ของ revision เดียวเพื่ออ่านสัญญาระหว่างเว็บกับ API ไม่ใช่ microservice แยก |
| `web : IdentityAuditWebClient` | Identity, Users และ Audit UI/client — `authentication/actions.ts, UsersPage.tsx, AuditPage.tsx` | มองเป็น frontend feature group ที่ใช้ชุด API ด้านตัวตนและ Audit |
| `api : IdentityAuditHttpBoundary` | Auth/Admin/Audit HTTP boundaries — `authentication/router.py, admin_router.py, audit_trail/router.py` | เป็นชุด routers ที่ app/main.py ของ auth branch ประกอบไว้ ไม่ใช่ทุก route ใน backend ถูก guard อัตโนมัติ |

#### 3.5.2 เส้นเชื่อมแปลว่าอะไรในโค้ดจริง

คอลัมน์ผู้ต้องใช้คือฝั่ง Socket และคอลัมน์ผู้ให้บริการคือฝั่ง Ball ไม่ใช่ลูกศรหรือเส้นบอกลำดับเวลา

| รหัสและ Interface | ผู้ต้องใช้บริการ (Socket) | ผู้ให้บริการ (Ball) | ความหมายในโค้ด |
|---|---|---|---|
| W01 — `IDeviceInventoryHttp` | `NetworkWebClient` | `NetworkHttpBoundary` | DeviceInventoryPage, รายละเอียดอุปกรณ์ และ Topology client ใช้ generated-client operations สำหรับ /api/v1/devices และ endpoints ย่อย เช่น detail, topology และ status |
| W02 — `IDiscoveryEventStream` | `NetworkWebClient` | `NetworkHttpBoundary` | useNetworkScan สร้าง new EventSource(streamUrl); URL มาจาก appConfig.endpoints.scanStream(...) และ Backend ให้ StreamingResponse แบบ text/event-stream |
| W03 — `IConfigPreviewHttp` | `ConfigurationWebClient` | `ConfigurationHttpBoundary` | ConfigEditorPage ใช้ currentApiV1ConfigsDeviceIdCurrentGetOptions และ generateApiV1ConfigsGeneratePostMutation สำหรับอ่านค่าปัจจุบันและขอ Preview |
| W04 — `IConfigVersionHttp` | `ConfigurationWebClient` | `ConfigurationHttpBoundary` | ConfigEditorPage/VersionHistoryList ใช้ operations สำหรับสร้างเวอร์ชัน ดูรายการ และโหลดพารามิเตอร์จากเวอร์ชัน; POST /api/v1/config-versions มีเส้นทาง deploy ใน Backend revision นี้ |
| W05 — `IConfigDriftHttp` | `ConfigurationWebClient` | `ConfigurationHttpBoundary` | DriftPanel ใช้ operations สำหรับดูผล drift และ POST check/accept ของอุปกรณ์ผ่าน /api/v1/config-drift |
| W06 — `IInteractiveSshWebSocket` | `ConfigurationWebClient` | `ConfigurationHttpBoundary` | SshConsoleTab สร้าง new WebSocket(appConfig.endpoints.sshConsole(deviceId)); Backend route ส่งต่อให้ devices/ssh_console.py ซึ่งใช้ Paramiko เปิด interactive shell |
| W07 — `IDeviceDetailHttp` | `ConfigurationWebClient` | `ConfigurationHttpBoundary` | ConfigEditorPage เรียก getDeviceDetailApiV1DevicesDeviceIdGetOptions เพื่อขอข้อมูลอุปกรณ์ประกอบการแสดงฟอร์ม |
| W08 — `ISessionHttp` | `IdentityAuditWebClient` | `IdentityAuditHttpBoundary` | authentication/actions.ts เรียก authRequest(...) ไปยัง login, me, logout และ change-password ใต้ /api/auth |
| W09 — `IUserAdminHttp` | `IdentityAuditWebClient` | `IdentityAuditHttpBoundary` | UsersPage เรียก authRequest(...) สำหรับ GET/POST /api/admin/users และ PATCH /api/admin/users/{user_id} |
| W10 — `IAuditReadHttp` | `IdentityAuditWebClient` | `IdentityAuditHttpBoundary` | AuditPage เรียก authRequest(...) ไปยัง GET /api/audit-logs เพื่อรับรายการ Audit ตามตัวกรองและการแบ่งหน้า |

#### 3.5.3 ทำไมจึงเลือกออกแบบภาพแบบนี้

แยกสัญญาข้ามขอบเขต frontend/backend และแยกชุด revision

ภาพนี้ตอบว่าเว็บต้องการ API อะไรจาก backend ไม่ตอบว่า backend เรียก helper อะไรภายใน จึงใช้กล่องระดับ feature/boundary ที่หยาบกว่าภาพ 01–04 และแยก HTTP ปกติ, SSE และ WebSocket เพราะรูปแบบการสื่อสารและภาระของผู้ใช้บริการต่างกัน

สามกรอบเป็นคู่ revision อิสระ ไม่ใช่ระบบเดียวที่ merge แล้ว การตรงกันของชื่อ operation หรือ URL เป็นหลักฐานเชิงโครงสร้าง ไม่ใช่ผลยืนยันว่า generated client build ผ่านหรือ E2E ผ่าน

W01/W03–W05/W07 อ้างการเรียก generated-client operations และ Backend routes ที่สอดคล้องกัน โดย src/client เป็น output ที่ต้องสร้างตาม tooling ของ frontend การพบชื่อ operation ใน source ยังไม่ยืนยันว่ามี generated artifact รุ่นตรงกันหรือ build ผ่าน

W02 ใช้ SSE: browser เปิด EventSource เพื่อรับ events จาก server ส่วน W06 ใช้ WebSocket เพื่อรับ–ส่งข้อมูล interactive terminal คำว่า Socket ใน UML Required Interface ไม่ใช่คำเดียวกับ network socket หรือ WebSocket และ browser ไม่ได้เปิด SSH เข้าตัวอุปกรณ์โดยตรง — Backend เป็นตัวกลางผ่าน Paramiko

คำว่า Session ใน ISessionHttp หมายถึง login session ของผู้ใช้ แตกต่างจาก AsyncSession ในภาพ 02/03 ซึ่งเป็น database session ไม่ควรนำสองความหมายนี้ไปอธิบายแทนกัน

หลักฐานจุดเรียก จุดประกาศ และ immutable source links รายเส้น: [CONTRACTS.md](CONTRACTS.md)

## 4. คำอธิบายแต่ละรูปย่อยสำหรับ A4

ใช้เฉพาะ 10 ไฟล์ที่อยู่ใน [A4/layout.json](A4/layout.json) การแยกภาพไม่เปลี่ยนชื่อ Interface หรือ ownership ของบริการ และกล่องที่ปรากฏซ้ำในรูปย่อยยังหมายถึง Component เดิมของ revision เดิม ไม่ได้เพิ่ม instance หรือ service อีกตัวขึ้นมา

ไฟล์ A4/01-network และ A4/02-auth-audit ที่อาจยังอยู่ในโฟลเดอร์เป็นฉบับจัดวางระหว่างทำ ไม่ใช่สองรูปเพิ่มเติมในรายการ 10 รูปนี้ เอกสารนี้ไม่เปลี่ยนสถานะงานจัดหน้าเดิมที่ผู้ใช้สั่งหยุดไว้

### 4.1 01a-enrollment — การเพิ่มอุปกรณ์และนำผลกลับเข้า Inventory

[เปิด SVG](A4/01a-enrollment.svg) · [PNG](A4/01a-enrollment.png) · [PlantUML](A4/01a-enrollment.puml)

เชื่อมกับรูปหลัก: [01-components-across-branches](01-components-across-branches.svg) · รหัสเส้น: N01, N02

คำอธิบายแบบกระชับและระดับ Component: แยกเฉพาะ DeviceManagement กับ NetworkCollection ระดับบริการภายใน Backend เส้น N01 คือการขอเก็บข้อมูล และ N02 คือการขอ apply Snapshot กลับไปยังขอบเขตจัดการอุปกรณ์

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: เลือกแยกภาพเพื่อให้อธิบายการพึ่งพาสองทิศได้ชัด โดยไม่ปนรายละเอียด SNMP/Oxian และไม่ตีความ N02 เป็นค่าตอบกลับของ N01

### 4.2 01b-discovery — Discovery และการรวบรวมข้อมูล SNMP

[เปิด SVG](A4/01b-discovery.svg) · [PNG](A4/01b-discovery.png) · [PlantUML](A4/01b-discovery.puml)

เชื่อมกับรูปหลัก: [01-components-across-branches](01-components-across-branches.svg) · รหัสเส้น: N03, N04, N05

คำอธิบายแบบกระชับและระดับ Component: NetworkCollection ขอ Snapshot จาก InventoryCollection ผ่าน N03 และใช้ Oxian discovery ผ่าน N04 ส่วน Collector ใช้ SNMP client ของ Oxian ผ่าน N05 เป็นระดับ coordinator, collector และ library

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: เลือกแสดงขอบเขตการเก็บข้อมูลและ library ที่รองรับ แยกงานจัดคิว/ประสานงานออกจากการอ่าน OID จึงตรวจได้ว่าความรับผิดชอบอยู่ที่ใด

### 4.3 02a-audit-events — การส่งเหตุการณ์ Auth ไปยัง Audit Writer

[เปิด SVG](A4/02a-audit-events.svg) · [PNG](A4/02a-audit-events.png) · [PlantUML](A4/02a-audit-events.puml)

เชื่อมกับรูปหลัก: [02-auth-audit-binding](02-auth-audit-binding.svg) · รหัสเส้น: A01, A02, A03

คำอธิบายแบบกระชับและระดับ Component: AuthenticationService และ CLI UserProvisioning ใช้บริการ record_auth_event ของ Adapter ผ่าน A01/A02 แล้ว Adapter ใช้ AuditWriter Protocol ผ่าน A03 ทุกกล่องเป็นระดับ application/support module

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: เลือกแยกภาพเส้นทางเหตุการณ์ให้เห็นจุด adapter และ dependency injection โดยไม่ลากเส้น Session provider มาทับรายละเอียด และไม่ได้แปลว่า writer เปิด transaction เอง

### 4.4 02b-auth-sessions — การตรวจสิทธิ์และผู้สร้าง Session

[เปิด SVG](A4/02b-auth-sessions.svg) · [PNG](A4/02b-auth-sessions.png) · [PlantUML](A4/02b-auth-sessions.puml)

เชื่อมกับรูปหลัก: [02-auth-audit-binding](02-auth-audit-binding.svg) · รหัสเส้น: A04, A05, A06, A07

คำอธิบายแบบกระชับและระดับ Component: A04/A05/A06 ระบุ Auth, CLI และ Reader ที่ใช้ Session Factory จริง ส่วน A07 ระบุ Reader ที่ใช้ authorize ของ Auth เป็นระดับ runtime service contracts ภายใน Backend

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: แยกการขอ Session ออกจากการเขียน Audit ทำให้เห็น ownership และเหตุผลที่ไม่มีเส้น Writer–Factory กล่อง DatabaseRuntime ไม่ใช่ PostgreSQL server

### 4.5 03-cis — องค์ประกอบ CIS ภายใน branch

[เปิด SVG](A4/03-cis.svg) · [PNG](A4/03-cis.png) · [PlantUML](A4/03-cis.puml)

เชื่อมกับรูปหลัก: [03-cis-branch-boundaries](03-cis-branch-boundaries.svg) · รหัสเส้น: S01, S02, S03, S04, S05

คำอธิบายแบบกระชับและระดับ Component: S01 เชื่อม HTTP boundary กับ service, S02 จัดหา Actor/role, S03 จัดหา Session, S04 ประเมินกฎ และ S05 ส่งเหตุการณ์เข้า branch-local audit log เป็นมุมมอง Backend boundary/service

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: แสดง dependency ที่มีจริงโดยไม่ประกบกับ Session-backed Auth, shared Writer หรือ deployment ของอีก branch เพื่อแยกสิ่งที่เขียนแล้วกับงาน integration ที่ยังต้องทำ

### 4.6 04a-config-planning — Versions, Drift และ Planning ที่ใช้ร่วมกัน

[เปิด SVG](A4/04a-config-planning.svg) · [PNG](A4/04a-config-planning.png) · [PlantUML](A4/04a-config-planning.puml)

เชื่อมกับรูปหลัก: [04-configuration-main](04-configuration-main.svg) · รหัสเส้น: C01, C02, C03

คำอธิบายแบบกระชับและระดับ Component: C01 คือ Versions ใช้ Planning, C02 คือ Drift ใช้ Planning และ C03 คือ Drift ขอให้ Versions บันทึก baseline เป็นระดับ use-case/application modules

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: เลือกแสดงความรับผิดชอบและ logic ที่ใช้ร่วม โดยซ่อนรายละเอียด template/diff/device I/O ซึ่งอธิบายต่อใน 04b กล่องที่ปรากฏซ้ำข้ามสองภาพไม่ใช่สำเนา service อีกตัว

### 4.7 04b-config-adapters — Rendering, Remediation และ device I/O

[เปิด SVG](A4/04b-config-adapters.svg) · [PNG](A4/04b-config-adapters.png) · [PlantUML](A4/04b-config-adapters.puml)

เชื่อมกับรูปหลัก: [04-configuration-main](04-configuration-main.svg) · รหัสเส้น: C04, C05, C06, C07

คำอธิบายแบบกระชับและระดับ Component: C04 คือ Planning ใช้ Render, C05 ใช้ Remediation, C06 ใช้บริการอ่าน Running Config และ C07 คือ Versions ใช้ adapter สำหรับ push/reverify เป็นระดับ module wrappers และ infrastructure adapter

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: แยก wrapper ตามงานจริง: Render ห่อ Jinja2, Remediation มี logic diff/plan และ SSH adapter ห่อ Netmiko ไม่รวมไลบรารีเป็นกล่องเดียว และไม่สับสนกับ interactive console ที่ใช้ Paramiko

### 4.8 05a-web-network — สัญญา Network ระหว่างเว็บกับ API

[เปิด SVG](A4/05a-web-network.svg) · [PNG](A4/05a-web-network.png) · [PlantUML](A4/05a-web-network.puml)

เชื่อมกับรูปหลัก: [05-web-contract-pairs](05-web-contract-pairs.svg) · รหัสเส้น: W01, W02

คำอธิบายแบบกระชับและระดับ Component: NetworkWebClient เป็นกลุ่มหน้า Inventory/Topology ส่วน NetworkHttpBoundary เป็นขอบเขต API; W01 เป็น HTTP สำหรับข้อมูลอุปกรณ์ และ W02 เป็น SSE ผ่าน EventSource

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: ใช้มุมมองข้าม browser/server จึงไม่ขยาย collector ภายใน และแยก HTTP request ทั่วไปออกจาก stream ที่เชื่อมค้างเพื่อรับ events

### 4.9 05b-web-configuration — สัญญา Configuration ระหว่างเว็บกับ API

[เปิด SVG](A4/05b-web-configuration.svg) · [PNG](A4/05b-web-configuration.png) · [PlantUML](A4/05b-web-configuration.puml)

เชื่อมกับรูปหลัก: [05-web-contract-pairs](05-web-contract-pairs.svg) · รหัสเส้น: W03, W04, W05, W06, W07

คำอธิบายแบบกระชับและระดับ Component: W03 ขอ current/preview, W04 จัดการ versions/deploy, W05 ตรวจ drift, W06 เชื่อม interactive SSH WebSocket และ W07 ขอ Device detail เป็นระดับ frontend feature group กับ API boundary

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: แยกตามบริการที่หน้าเว็บต้องใช้ ไม่ได้แปลว่ามี server ห้าตัวหรือห้า connections ตลอดเวลา เส้น WebSocket ไม่ใช่การที่ browser เปิด SSH เข้าอุปกรณ์โดยตรง

### 4.10 05c-web-identity — สัญญา Identity, Users และ Audit ระหว่างเว็บกับ API

[เปิด SVG](A4/05c-web-identity.svg) · [PNG](A4/05c-web-identity.png) · [PlantUML](A4/05c-web-identity.puml)

เชื่อมกับรูปหลัก: [05-web-contract-pairs](05-web-contract-pairs.svg) · รหัสเส้น: W08, W09, W10

คำอธิบายแบบกระชับและระดับ Component: W08 คือ Session API, W09 คือ User Admin API และ W10 คือ Audit Read API จากกลุ่ม IdentityAuditWebClient ไปยัง Backend boundary ของ auth branch

คำอธิบายเพิ่มเติมและเหตุผลแบ่งภาพ: เลือกแสดงการใช้ API ของกลุ่มหน้าเว็บ แยกจากภาพ 02 ที่อธิบายโครงสร้างบริการภายใน จึงไม่แสดง Adapter/Writer ในภาพนี้ซ้ำ

## 5. ตัวอย่างคำตอบสำหรับอธิบายต่ออาจารย์

### Component ในรูปคืออะไรในตอนเขียนโปรแกรม

Component ในรูปนี้คือกลุ่มโค้ดที่มีหน้าที่และบริการชัดเจน เช่นกลุ่มวางแผน Config กลุ่มแปลง Template หรือกลุ่มเขียน Audit ภายในอาจมี Class และฟังก์ชันหลายตัว ไม่จำเป็นต้องเป็นโปรแกรมหรือ server แยก หลักสำคัญคืออธิบายได้ว่ากลุ่มนี้ให้บริการอะไร ต้องใช้บริการอะไร และ implementation อยู่ส่วนไหนของ source

### เส้นให้กับเส้นใช้คืออะไรในงานปฏิบัติ

วงกลมหมายถึงฝ่ายที่ให้บริการ ส่วนครึ่งวงกลมหมายถึงฝ่ายที่ต้องใช้บริการ เมื่อประกบกันแสดงว่ามีการผูกสัญญาระหว่างสองส่วน เช่น Audit Adapter ต้องใช้ writer ตาม AuditWriter Protocol และ runtime ส่งฟังก์ชัน record_audit_event ให้มันจริง สำหรับภาพเว็บ การผูกสัญญาอยู่ในระดับ URL, method และข้อมูลของ HTTP/SSE/WebSocket ไม่ได้เป็น local Python call

### ถ้าไม่มี Python Interface ชื่อเดียวกับในรูปถือว่าผิดหรือไม่

ไม่จำเป็นต้องมีชื่อในภาษาโปรแกรมตรงกันทุกตัว เพราะ Interface ในแบบจำลองสรุปสัญญาของบริการได้ แต่ต้องไม่แต่ง operation หรือความสามารถที่ source ไม่มี ในชุดนี้ชื่อ IConfigRendering สรุปฟังก์ชัน render_config ที่มีจริง ส่วน AuditWriter เป็นกรณีที่มี Protocol ชื่อนี้ใน Python จริง

### ทำไมไม่ลากเส้นทุกฟังก์ชันหรือใส่ฐานข้อมูลทุกจุด

เพราะรูปต้องตอบเรื่องการแบ่งหน้าที่และการประกอบบริการในระดับที่กำหนด หากใส่ทุก helper/query จะกลายเป็นภาพรายละเอียดการเรียกที่อ่านยาก อย่างไรก็ตามต้องแจ้งขอบเขตที่ละไว้ เช่น Writer รับ Session ผ่านพารามิเตอร์ และ Drift บาง operation เปิด Session เอง จึงไม่ใช้การไม่มีเส้นบนภาพสรุปว่าไม่มีการใช้ฐานข้อมูล

### เส้นประกบหมายความว่าทดสอบผ่านแล้วหรือไม่

ไม่ใช่ เส้นอธิบายโครงสร้างและสัญญาที่พบใน source การยืนยันว่ารันร่วมกันได้ต้องมี build, integration/E2E test และสภาพแวดล้อมตรงกับ revision ที่อ้าง รูปนี้ไม่ใช่ผลทดสอบอุปกรณ์ ไม่ใช่การรับรองทุก vendor และไม่ใช่หลักฐานว่ารวมทุก branch แล้ว

## 6. ขอบเขตสำหรับนำไปใช้ในรายงาน Project 1

- เอกสารนี้เป็นคำอธิบายประกอบ ไม่ใช่บทปริญญานิพนธ์ที่จัดเลขรูป/ตารางตามบทแล้ว เมื่อนำลงเล่มให้กำหนดเลขตามตำแหน่งจริงและระบบอ้างอิงที่ยืนยันสำหรับงานนั้น
- การเรียกไฟล์เดิมว่า Code Audit 2026-10-22 คือวันที่ snapshot ไม่ใช่ชื่อรายวิชา ปัจจุบันใช้บริบท Computer Engineering Project 1 ไม่ใช่ Prepare Project
- Project 1/Project 2 เป็นรายวิชา ส่วน P1/P2 เป็นลำดับความสำคัญของฟีเจอร์ การมี source ของ discovery/push ไม่ได้เปลี่ยนขอบเขต MVP โดยอัตโนมัติ
- หากใช้กับเล่ม Network Management ให้เลือกส่วนที่เป็นขอบเขตของเล่ม และระบุส่วนใช้ร่วม/ส่วนของอีกกลุ่มให้ชัด ไม่อ้างว่ากลุ่ม (1) เป็นผู้พัฒนา Configuration หรือ CIS ทั้งหมดจากการมีรูปอยู่ในเอกสาร
- คำว่า Implemented ในที่นี้จำกัดตาม source ที่ระบุ ส่วน Tested ต้องมีผลและสภาพแวดล้อมทดสอบจริงแยกต่างหาก
- ก่อนนำส่ง คณะผู้จัดทำควรตรวจสำนวนและข้อเท็จจริงด้วยตนเอง และตรวจนโยบายการใช้ AI ของรายวิชา/อาจารย์ที่ปรึกษา เอกสารนี้ไม่ใช่การอนุมัติส่งงาน

## 7. แหล่งอ้างอิงและการสืบย้อน

### 7.1 หลัก UML

- [OMG — UML 2.5.1](https://www.omg.org/spec/UML/2.5.1): หน้าประกาศมาตรฐานและเอกสาร normative
- [Eclipse UML2 — Component](https://download.eclipse.org/modeling/mdt/uml2/javadoc/5.0.0/org/eclipse/uml2/uml/Component.html): นิยาม modularity, encapsulation และ provided/required contracts
- [UML Component Diagrams Reference](https://www.uml-diagrams.org/component-diagrams-reference.html): notation ของ Component, Interface, Port และ Assembly Connector
- [UML Port](https://www.uml-diagrams.org/port.html): Simple Port และเงื่อนไขใช้ Ball-and-Socket

รายการนี้เป็น source links สำหรับทำความเข้าใจ ยังไม่ตั้งเป็นบรรณานุกรม APA/IEEE ของเล่มโดยอัตโนมัติ เว็บ uml-diagrams.org อาจตอบช้าในบางครั้ง รายละเอียดหลักที่ใช้เขียนยึดข้อความ notation ที่ตรวจได้ในชุด audit และเอกสาร UML ที่อ้าง ไม่ได้อ้างว่าเว็บไซต์รับรองรูป MyNetMate นี้

### 7.2 หลักฐานเฉพาะระบบ

- [CONTRACTS.md](CONTRACTS.md): ผู้ต้องใช้/ผู้ให้บริการ operations และ immutable GitHub source links ของทุกเส้น
- [component-model.json](component-model.json): แบบจำลองชื่อ Part, Interface, endpoints และ evidence patterns
- [A4/layout.json](A4/layout.json): ชุดรูปย่อยที่ใช้อธิบายและรหัสเส้นในแต่ละรูป
- [BRANCH-EVIDENCE.md](BRANCH-EVIDENCE.md): ประวัติ refs ที่สำรวจในรอบ audit ไม่ใช่การยืนยัน remote HEAD วันนี้
- [REVIEW.md](REVIEW.md): บันทึกการตรวจชุดรูปเดิม ต้องอ่านตามวันที่และขอบเขตในไฟล์ ไม่แทนผลทดสอบแอป

## 8. ผลตรวจความครบถ้วนของคำอธิบาย

ตรวจทานคำอธิบายเมื่อ 23 ตุลาคม 2569 โดยเทียบเอกสารกับ component-model.json, A4/layout.json, ไฟล์ PlantUML และ source ที่ immutable revisions เดิม ไม่ได้ fetch, เปลี่ยน branch หรือเรียกใช้แอป

| รายการตรวจ | ผล | วิธีตรวจและขอบเขต |
|---|---|---|
| คำอธิบายกระชับของรูปหลัก | ครบ 5/5 รูป | มีใจความหลักและระดับ Component ก่อนส่วนละเอียด |
| คำอธิบายละเอียดของรูปหลัก | ครบ 5/5 รูป | แต่ละรูปมีตาราง Component, ทุกเส้น, เหตุผลการแบ่งภาพ และข้อจำกัด |
| กล่อง Component ในตาราง | ครบ 28/28 รายการที่ปรากฏใน 5 ภาพ | เทียบ role และ type ในแบบจำลอง; DatabaseRuntime ปรากฏในคนละ revision จึงไม่นับเป็น runtime เดียวกัน |
| เส้นในตารางคำอธิบายหลัก | ครบ 34/34 เส้น ไม่ซ้ำรหัส | เทียบ ID, ชื่อ Interface, ผู้ต้องใช้ และผู้ให้บริการตรงกับแบบจำลอง |
| จำนวนชื่อ Interface | 31 ชื่อสำหรับ 34 bindings | IRecordAuthEvent และ IAsyncSessionFactory ใช้ซ้ำหลายคู่ จึงไม่นับหนึ่งเส้นเป็นหนึ่งชนิด Interface ใหม่ |
| ฝั่ง Port และ Assembly ในต้นฉบับภาพหลัก | ตรง 34/34 bindings | ตรวจ R_/P_ อยู่ใน Component ตามผู้ต้องใช้/ผู้ให้บริการ และจับคู่ชื่อสัญญาตรงกัน |
| คำอธิบายรูปย่อย A4 | ครบ 10/10 รูปตาม layout.json | แต่ละรูปมีลิงก์ไฟล์ ระดับ Component ใจความของเส้น และเหตุผลแบ่งภาพ |
| การกระจายเส้นใน A4 | ครบ 34/34 เส้น เส้นละหนึ่งรูปย่อย | เทียบรายการใน layout กับ PlantUML ทั้ง 10 ไฟล์ รวมการตัดบรรทัดของชื่อ Interface |
| หลักฐานจุดเรียก/ผู้ให้บริการ | พบครบ 72/72 จุด จาก 40 source objects | อ่าน Git objects ตาม repo/ref/path แล้วเทียบ evidence patterns; เป็น static evidence ไม่ใช่ผลรัน |
| ลิงก์ไฟล์และภาพภายในเอกสาร | พบไฟล์ปลายทางครบ 76/76 ลิงก์ | รวมภาพ PNG ที่ฝัง 5 ภาพ ไม่พบลิงก์ไฟล์หาย |
| ตาราง Markdown | ไม่พบจำนวนคอลัมน์ผิดแถว | ตรวจทุกตารางและอ่านทวนเนื้อหา |
| ความหมายและข้อจำกัด | ระบุครบตามประเด็นสำคัญของชุดภาพ | แยก module กับ React Component, Port กับ network port, login session กับ database session, assembly กับลำดับเวลา และ implementation กับผลทดสอบ |

สรุป: ไม่พบภาพ Component หรือรหัสเส้นตกหล่นจากขอบเขตของรูปชุดนี้ คำว่า “ครบ” หมายถึงอธิบายสิ่งที่แสดงในชุดภาพและสัญญาที่กำหนด ไม่ได้หมายความว่าภาพแจกแจงทุกฟังก์ชัน ทุก dependency หรือทุกฟีเจอร์ของ MyNetMate แล้ว

การตรวจรอบนี้ไม่ใช่ UML metamodel certification, application test, build/E2E test หรือผลทดสอบกับอุปกรณ์จริง ไม่ได้ตรวจจัดหน้า A4 ใหม่ ไม่ได้แก้ภาพหรือสคริปต์เดิม และไม่ได้สร้าง PDF


