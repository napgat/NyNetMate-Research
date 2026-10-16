# บันทึกตรวจหลักฐานเพิ่มเติม — 9 ตุลาคม 2569

อ่านเพื่อทำเอกสารใหม่ ไม่แก้รายงานเดิม เอกสารออนไลน์ โค้ดระบบ หรือโฟลเดอร์งานเพื่อน

## Snapshot และการแบ่งงาน

- Backend HEAD: `b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4`
- Website HEAD: `3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251`
- Docs HEAD: `850d3a53e93f003b2801b7cf421192bf2ab07611`
- Backend/Website/Docs working tree สะอาดก่อนและหลังตาม `verification.json`; ทดสอบในสำเนา Temp; ไม่แก้หรือรันโฟลเดอร์ `mynetmate/network-discovery/`
- Backend `3f7ac59`, `b862c60` และ Website `8c662c2`, `7522d2a` เป็น Auth/Users/Audit ในนาม NaphatJa
- Backend `b2387b6` และ Website `167eb88` เป็นการปรับ Topology ของ Chatnarint Boonsaeng ใช้อธิบายบริบท ไม่อ้างเป็นงานนภัทร
- Docker: Backend `aa0a205` NaphatJa เป็น Merge การรวม Architecture/Auth; Website `c487bd1` NaphatJa เป็นการสร้าง API client ระหว่าง Docker build ไม่ยืนยัน Deploy ผ่าน
- ภาพร่วมและ Topology เดิมต้องยืนยันเครดิตรายชิ้น ไม่แจกเครดิตจากชื่อโฟลเดอร์เพียงอย่างเดียว

## สิ่งที่ตรวจจากโค้ด

- `main.py` เชื่อม Auth `/api/auth`, Admin `/api/admin`, Audit `/api/audit-logs` แยกจาก Core `/api/v1`
- Session Guard Hash Cookie Token; Repository ตรวจ Session/User/Role/Active/expiry/revoked ปัจจุบัน
- Service ส่ง Login Grant หลัง Commit; Auth/User mutation เรียก Audit ใน Business Transaction; failed login/permission denied ใช้ Transaction บันทึกแยกตามเงื่อนไข
- Admin Router ใช้ `user.manage`; Audit Router ใช้ `audit.read`; Devices/Discovery Router ไม่มี Shared Permission Guard ในส่วนที่ตรวจ
- Admin Service ใช้ `pg_advisory_xact_lock` และอ่านบัญชีซ้ำ; ป้องกัน Admin คนสุดท้ายและ Revoke Session เมื่อ Role เปลี่ยน/Deactivate
- Writer Insert/Flush ไม่เป็นเจ้าของ Transaction; Redaction ลด Description ทุกข้อความเป็น NULL; Audit ไม่มี Client IP
- Reader ทำ Explicit Projection/Outer Join ชื่อปัจจุบัน/Keyset Cursor เวลาและ ID; ปฏิเสธแถวที่ไม่ตรง Canonical Contract
- HomePage เป็น Dashboard Empty/ทางลัด; ไม่พบ Dashboard API ใน Router List; `/health` คืน status/app/version ไม่ตรวจฐานข้อมูลจริง

## ผลรันและข้อจำกัด

1. Backend Python 3.11/uv.lock, เฉพาะ Auth/Audit `-m not database`: **1,003 passed / 16 skipped / 137 deselected**
2. 15 Skipped ต้องมี Disposable PostgreSQL inspection; 1 ต้องมี TEST_DATABASE_URL ตรวจเหตุผลจาก XML
3. Frontend ใช้ `bun install --frozen-lockfile`, Bun `1.4.2`; Auth/Audit Unit **17 pass / 0 fail**
4. Clean-copy `bun run build` **exit 2**: TS2307 ไม่พบ `@/client` และ generated react-query client พร้อม Type Error ต่อเนื่อง จึงยังไม่ผ่าน
5. Dockerfile ระบุ Generate OpenAPI client ก่อน Build จึงลอง Export Schema จาก `app.openapi()` ในสำเนาแบบ Offline ไม่มีการเริ่ม Server/เชื่อมฐานข้อมูล/เรียกอุปกรณ์
6. Schema Export สำเร็จ แต่ `openapi:generate` **exit 1**: `Cannot read properties of undefined (reading 'importFileExtension')` ในตัวสร้าง client ไม่มีการแก้โค้ดเพื่อกลบผล และไม่ได้รัน Build หลัง Generation สำเร็จ
7. **Root Cause ของ Generator ยังไม่ยืนยัน** ต้องตรวจ Dependency/Config/Environment ตาม Lockfile และเทียบสภาพแวดล้อมทีม ไม่สรุปความผิดของผู้พัฒนารายใด
8. PostgreSQL, Browser E2E, Docker Deploy และ Lab/Hardware ไม่ได้รันรอบนี้; Unit/HTTP จำลอง/Build เป็นหลักฐานคนละประเภท

คำสั่ง เวลา Exit Code และสถานะ Repository อยู่ใน `verification.json`/Log แต่ละขั้น

## เอกสารออนไลน์และบทที่ 3

- อ่านได้ผ่าน Google Drive แบบอ่านอย่างเดียว: [เอกสารรายงานความคืบหน้า Project 1](https://docs.google.com/document/d/1bgBgFPAoSGiob5yRsHnE9WyIwqhd6PmakMJAyo3S82c/edit)
- Modified Time ที่คืน: `2026-10-09T04:02:14.259Z`
- อ่านเนื้อหา Network Management บทที่ 3/ส่วนความคืบหน้า เทียบกับไฟล์ภายในเครื่อง
- เนื้อหารวมหลายส่วนและหัวข้อครั้งที่ 4 ยังมีหัวข้อครั้งที่ 3/วันที่/เปอร์เซ็นต์ย้อนหลังบางส่วน จึงไม่คัดลอกเป็นค่าปัจจุบัน
- การอ่าน Text ไม่รับรองภาพทุกภาพ/ทุก Tab หรือผู้สร้างภาพ; ไม่จัดเก็บหรือเผยแพร่ Raw Doc ทั้งฉบับ; P2 ใช้ UI ภายในเครื่องตามคำขอ
- ตรวจ Architecture, Activity Login/Add Device/Discovery, Use Case/Description, Sequence ชุด naphat, ER Chapter 3.6, UI Chapter 3.8, Navigation/Wireframe/P2 Notes
- เลือก Sequence Login/Users/Audit; ไม่ใช้ Dashboard/Topology Sequence เป็นหลักฐาน Implementation ครบ
- ภาพเดิมคัดลอกโดยไม่แก้ ตรวจ Hash ใน `artifact-qa.json`; Overview เป็นภาพสรุปเพิ่มใหม่ ไม่ใช่ภาพ Deployment

## ปรับชุดนำเสนอตาม Component Diagram เพิ่มเติม — 9 ตุลาคม 2569

- อ่านเอกสาร `outputs/thesis/component-diagram/component-diagram-network-management.md`, README, PlantUML และผลตรวจ Render พร้อมตรวจภาพ PNG ที่ผู้ใช้เพิ่มมา
- ตรวจ Auth runtime เชื่อม Shared Audit Writer และ Audit Reader ใช้ Auth authorizer/Session Factory จากไฟล์ปัจจุบันแบบอ่านอย่างเดียว สอดคล้องกับลูกศรที่อธิบายในภาพ
- ใช้ภาพนี้แทนภาพสรุปสีเป็นภาพ A; คัดลอก PNG/SVG/PlantUML โดยไม่แก้ต้นทาง เพิ่มบทพูด ลำดับชี้และหลักฐาน E16 ในชุดนำเสนอ
- ขอบเขต Component เฉพาะ Network Management ไม่มี P2/Configuration Management; กล่อง Backend เป็นโมดูลในแอปเดียว Library ไม่ใช่บริการแยก Database Session แทน Engine/Factory ไม่ใช่ทุกคำขอร่วม Transaction เดียวกัน
- Auth/Users/Audit ระบุเป็นงานพัฒนาของนภัทร ส่วน Devices/Discovery/Library ใช้เป็นบริบทของทีม ไม่มีข้ออ้างว่าทุก Endpoint ถูก Guard/Audit แล้ว
- ภาพสรุปสีเดิมเก็บเป็นภาพเสริม และแผน Dashboard/P2 ในชุดนำเสนอยังคงแยกสถานะตามคำขอเดิม
- การปรับครั้งนี้เป็นการตรวจเอกสาร/โครงสร้างโค้ดและการแสดงผลไฟล์ ไม่มีการรันทดสอบระบบใหม่ ผลทดสอบเดิมในชุดนี้มาจากการตรวจวันที่ 9 ตุลาคม 2569 ตาม Log ไม่ได้อ้างการตรวจหรือแก้ Google Docs เพิ่มเติม
