# ผลตรวจทาน Component Diagrams — Revision 2

วันที่: 2026-10-22

## ข้อสรุป

ภาพชุดนี้ใช้ UML Component internal-structure views โดยมี Part ที่ระบุ role : ComponentType และ Simple Ports สองฝั่งของแต่ละ Assembly Connector ใช้ Ball-and-Socket ไม่ใช้หัวลูกศร ทุกเส้นมีชื่อสัญญา operations และหลักฐาน source ตาม immutable revision กำกับ

เป็นแบบจำลอง logical modules ของโค้ดที่เลือก ไม่ใช่ภาพ Class Diagram, execution trace, deployment topology หรือผลยืนยันว่าทุก branch รวมกันแล้ว และไม่ใช่การประกาศว่าส่งออก XMI/ผ่าน UML metamodel conformance test

## 1. ตรวจเชิงกลไก

| รายการ | ผล |
|---|---|
| จำนวนภาพ | 5 |
| Named interface bindings | 34 |
| Endpoint Ports | 68 (หนึ่งคู่ต่อสัญญา) |
| Source evidence checks | 72 / 72 ผ่าน |
| Immutable source objects ที่อ่าน | 40 |
| Endpoint Part อยู่ใน assembly เดียวกัน | ผ่านทุกสัญญา |
| Required/Provided Port และชื่อ Interface จับคู่ครบ | ผ่านทุกสัญญา |
| ไม่มี arrow tokens ใน PlantUML | ผ่านทั้ง 5 ภาพ |
| PlantUML checkonly | ผ่านทั้ง 5 ภาพ |
| SVG parse และ PNG signature | ผ่านทั้ง 5 ภาพ |
| ต้นฉบับที่ render กับไฟล์ที่ส่งให้ผู้ใช้ | SHA-256 ตรงกันทั้ง 5 ภาพ |

รายละเอียดเครื่องอ่านได้: [verification-report.json](verification-report.json)

สคริปต์ตรวจ literal source patterns เป็นการยืนยันว่าจุดเรียกและจุดประกาศมีอยู่ตาม revision ไม่ได้พิสูจน์ behavior/type compatibility ทั้งหมดโดยอัตโนมัติ จึงตรวจด้วยการอ่าน signatures และ call sites ประกอบตามหัวข้อถัดไป

## 2. ตรวจความหมายและ Interface compatibility

| กลุ่ม | สิ่งที่ทวนด้วยการอ่านโค้ด | ผล / ข้อจำกัด |
|---|---|---|
| N01–N03 | collect_target, apply_snapshot, collect กับ call arguments | consumer เรียก operation ที่ provider ให้จริง; N01/N02 เป็นคนละสัญญา ไม่ใช่ Request/Response |
| N04–N05 | discover/discover_stream, SnmpClient และ dependency revision | ใช้ Python library ตาม lockfile ไม่อ้างว่า backend เรียก Rust; walk override ฝั่ง MyNetMate ไม่ถูกย้ายไปอ้างเป็นของ Oxian |
| A01–A03 | record_auth_event, AuditWriter.__call__, record_audit_event และ runtime injection | Protocol รับ keyword arguments ที่ implementation รองรับ; runtime ส่ง callable จริงให้ AuthService แล้วใช้ใน Adapter |
| A04–A07 | factory access, async with, bound authorize callable | factory ถูกส่งผ่าน runtime/router จริง; Reader ใช้ authorize ของ AuthService; ไม่มีเส้น Writer เรียก Factory |
| S01–S03 | router calls, Depends(get_db), role dependencies | HTTP boundary ขอ Session และส่ง db เข้า Service; role source เป็น unverified headers ตามที่ code ระบุ |
| S04–S05 | evaluate_config และ audit.record_audit_event | provider ตรงกับ branch; Audit ไป log ไม่ใช่ shared Writer และไม่สวมชื่อ AuditWriter Protocol |
| C01–C03 | build_plan, connection/capture facade, record_version | call sites อยู่ใน main เดียวกัน; ไม่วาดการเรียกไป CIS branch |
| C04–C07 | render_config, remediation functions, capture/push adapter | แสดง wrapper modules จริง ไม่สร้าง Component รวมไลบรารี; การมี push code ไม่ใช่การอนุญาตให้รัน |
| W01–W10 | generated-client call symbols, routes, SSE URL และ WebSocket URL | แยก Interface ตามหน้าที่/transport ที่ต่างกัน และแยก revision pairs; ไม่รับรอง build/E2E โดยการอ่าน source อย่างเดียว |

สัญญาที่ขึ้นต้น I เป็น model-level API contracts ไม่จำเป็นต้องมีภาษาโปรแกรมประกาศ Interface/Protocol ชื่อนั้น แต่ต้องมี operations ที่ฝั่ง consumer ใช้และ provider รองรับ ซึ่งแสดงใน [CONTRACTS.md](CONTRACTS.md)

## 3. ตรวจภาพจริง

ตรวจ PNG ของทั้ง 5 ภาพหลัง render แบบ local และเก็บภาพที่แก้ไขล่าสุด:

- ภาพ 01: Socket/Ball ของ N02 ย้อนฝั่งถูกต้องตามผู้ให้–ผู้ใช้; ย้าย Port เพื่อไม่ให้เส้นย้อนตัดชื่อ Component และเพิ่ม UML Comment อ้าง implementation ใน Collector เพื่อแก้ข้อจำกัดการคำนวณความสูงกล่องของ renderer
- ภาพ 02: ไม่มี Writer–Session Factory assembly; Reader authorization และ Auth/CLI factory connections อยู่คนละสัญญา
- ภาพ 03: ไม่มีเส้น CIS Service–Session Factory หรือเส้นข้ามไป Auth/Writer/deployment ของอีก branch
- ภาพ 04: Render, Remediation และ Netmiko adapter แยกกัน ไม่มีสายเชื่อมทับข้อความใน Component
- ภาพ 05: สามกรอบ client/server ไม่เชื่อมข้ามกัน; HTTP, SSE และ interactive WebSocket แยกตามสัญญาที่ประกาศ
- ทุกภาพ: ตรวจว่าเห็นกรอบ Component, Ports, สัญลักษณ์ประกบ และชื่อ contract ครบ ไม่มีหัวลูกศร
- Legend เป็นข้อความอธิบาย ไม่ใช่ส่วนประกอบซอฟต์แวร์ และทุกไฟล์มี SVG สำหรับขยายอ่าน

## 4. ขอบเขตของการยืนยัน

ยืนยันความสอดคล้องของแบบจำลองกับ code snapshots และ notation ตามแหล่งอ้างอิง ไม่ใช่การรับรองความถูกต้องทุกมุมของ UML โดยเครื่องมืออัตโนมัติ และไม่ใช่ผลว่าแอปทั้งระบบพร้อมใช้งาน

ไม่ได้รัน API server, pytest, frontend build, database migrations, E2E tests, network discovery หรือ SSH/device commands ในรอบนี้ ไม่ยืนยัน hardware compatibility หรือการบังคับ CIS gate ที่ยังไม่พบการผูกต่อ

ไม่ได้แก้ไฟล์แอป เปลี่ยน checkout/fetch, commit, push หรือแก้ protected network-discovery folder การอ่าน Oxian ใช้ bare copy ที่เตรียมไว้ในการสำรวจเดิมเท่านั้น

## 5. อ้างอิงที่ใช้ตรวจ

- [UML Component Diagrams Reference](https://www.uml-diagrams.org/component-diagrams-reference.html)
- [UML Port — Simple Port และ Assembly](https://www.uml-diagrams.org/port.html)
- [PlantUML Component Diagram](https://plantuml.com/component-diagram)
- Source links รายสัญญาใน [CONTRACTS.md](CONTRACTS.md) และ source object SHA ใน [component-model.json](component-model.json)


