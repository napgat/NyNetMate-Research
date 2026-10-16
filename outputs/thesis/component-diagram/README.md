# Component Diagram — Network Management

## ไฟล์ใช้งาน

- [เอกสารหัวข้อเพิ่มเติม](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/component-diagram/component-diagram-network-management.md): ข้อความพร้อมรูปและคำอธิบายสำหรับเลือกนำลงรายงานเอง
- [รูป PNG](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/component-diagram/network-management-components.png)
- [รูป SVG](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/component-diagram/network-management-components.svg): สำหรับขยายภาพหรือจัดลงรายงานโดยไม่เสียความคมชัด
- [ต้นฉบับ PlantUML](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/component-diagram/network-management-components.puml): แก้ชื่อองค์ประกอบและความสัมพันธ์ผ่านข้อความ

ยังไม่กำหนดเลขหัวข้อหรือเลขรูป เพื่อไม่กระทบลำดับบทที่ 3 เดิม หากนำลงรายงาน เหมาะเป็นหัวข้อย่อยเพิ่มเติมภายใน 3.2 System Architecture ไม่ต้องแทน Activity หรือ Sequence Diagram

## ขอบเขตและการตีความ

- เฉพาะ Network Management ที่พบในโค้ดปัจจุบัน ไม่มีแผน Dashboard P2 / Operational Monitoring, AI, Config Generation, CIS, Deployment หรือ Version Control
- Discovery และ Topology ในภาพมาจากโครงสร้างโค้ดที่มีอยู่ ไม่ใช่การเพิ่มแผนงานอนาคตหรือเปลี่ยน Priority ของเอกสาร Scope
- `API Routers` เป็นการรวมส่วนรับคำขอไว้ในภาพเดียว ไม่ใช่ชื่อคลาสเดียวหรือ Router เดียว: Auth/Admin/Audit ประกอบใน `main.py` ขณะที่ Devices/Discovery ผ่าน `core/router.py`
- User Management อยู่ในขอบเขต Auth เพราะ HTTP Router แยกอยู่ใน `admin_router.py` แต่เรียกบริการ `AuthService` เดียวกัน จึงไม่วาดเป็น Microservice ใหม่
- `Database Session` แทน Engine / Session Factory ของ `core/database.py` ไม่ใช่ชั้น Repository กลางที่สร้างใหม่
- Library ทำงานใน Backend เดียวกัน ไม่ใช่ Container หรือ Server แยก
- NGINX และ Docker/Compose ไม่ได้แสดงในภาพเชิงตรรกะนี้ เพราะเป็นรายละเอียดการให้บริการและการติดตั้ง ไม่ได้หมายความว่าไม่มีอยู่ในระบบ
- ไม่เพิ่มเส้น Devices/Discovery → Auth หรือ → Audit เพื่ออ้างว่าผูกทุก Endpoint แล้ว: Router ที่ตรวจยังไม่ได้ประกาศ PermissionRoute / require_permission แบบ Admin/Audit
- Dashboard ปัจจุบันยังเป็น Empty State จึงไม่สร้าง Dashboard Service หรือ Metrics Interface ที่ไม่มี Implementation ขึ้นมาในภาพ
- รูปไม่มี IP, Credential, Token หรือข้อมูลจากอุปกรณ์จริง ไม่มีการรัน SNMP / Discovery เพื่อจัดทำเอกสารนี้
- การตรวจในงานนี้เป็น Source Review และตรวจการ Render รูป ไม่ใช่ผลทดสอบ End-to-End ของ MyNetMate

## หลักฐานขององค์ประกอบและเส้นเชื่อม

ตรวจจากไฟล์ปัจจุบันเมื่อ 9 ตุลาคม 2569:

| องค์ประกอบหรือความสัมพันธ์ | หลักฐาน |
|---|---|
| หลาย Router ประกอบใน FastAPI แอปเดียว | [main.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/main.py), [core/router.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/core/router.py) |
| Web UI เรียก Auth API ด้วย Cookie ที่ Browser จัดการ | [client.ts](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/authentication/client.ts) |
| User Management เรียก AuthService และตรวจ user.manage | [admin_router.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/admin_router.py) |
| Auth ใช้ Shared Audit Writer | [runtime.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/runtime.py), [audit_adapter.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/audit_adapter.py) |
| Audit Reader ใช้ Auth Authorizer และ audit.read | [Audit router.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/audit_trail/router.py) |
| Devices API รวม Inventory / Detail / Topology / Check Status | [Devices router.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/router.py) |
| Device Health ใช้ SNMP Client | [health.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/services/health.py), [collector.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/collector.py) |
| Discovery ใช้ Device Service, Collector และ oxian_py | [Discovery service.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/network_device_discovery/service.py) |
| HTTP API และ SSE สำหรับ Discovery | [Discovery router.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/network_device_discovery/router.py) |
| SQLAlchemy Engine และ Session Factory ร่วม | [database.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/core/database.py) |
| PostgreSQL / Backend / Website ใน Compose | [compose.yaml](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/compose.yaml) |
| Dashboard ปัจจุบันเป็น Placeholder | [HomePage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/home/HomePage.tsx) |

## รูปแบบ UML และการแก้ไข

ใช้สัญลักษณ์ Component แบบ UML2, วงกลม Provided Interface และลูกศร Usage Dependency ตาม [เอกสาร Component Diagram ของ PlantUML](https://plantuml.com/component-diagram) ส่วนตัวอย่างความหมายของ Component และ Interface ดู [UML Component Diagrams](https://www.uml-diagrams.org/component-diagrams.html)

Render ด้วย PlantUML 1.2026.8 บนเครื่องและ Smetana layout ไม่มีการส่งเนื้อหา Diagram ไปยัง PlantUML Server ภายนอก Renderer อยู่ใน Cache ไม่ได้เพิ่ม Dependency ให้ Backend หรือ Frontend

SHA-256 ของ Renderer ที่ตรวจเทียบกับ Asset Digest จาก Release ทางการ:
`5e1ecfa8ecd32c90b03bbf3b1eb6f020943f98ab0fcf4032be31a0002ee2c462`

แก้ไฟล์ `.puml` แล้วใช้ `render-component.ps1` เพื่อสร้าง PNG และ SVG ใหม่ รูปแบบการจัดวางแก้ผ่าน PlantUML ไม่ใช่ Draw.io

งานนี้สร้างเอกสารแยก ไม่แก้ Google Docs, รายงานเดิม, Source Code หรือโฟลเดอร์งานเพื่อน
