# Acceptance Tests — Evidence-based Link Flow

| Test ID | Acceptance Test | Priority |
|---|---|---|
| `AT-NTV-R01` | การกรอก IP อย่างเดียวโดยยังเชื่อมต่อหรือเก็บข้อมูลไม่สำเร็จต้องไม่สร้าง Verified Topology Node | Must |
| `AT-NTV-R02` | เมื่อ Manual Enrollment เชื่อมต่ออุปกรณ์สำเร็จ Node ต้องอ้าง `device_id` และข้อมูลที่ Collector เก็บจริง | Must |
| `AT-NTV-R03` | Discovery Candidate ที่ตอบ Ping แต่ Authentication/Collection ล้มเหลวต้องแสดงเป็น Candidate/Error ไม่ใช่ Managed Topology Node | Must |
| `AT-NTV-R04` | เมื่อมี LLDP/CDP Observation ที่ Resolve Endpoint ได้ ระบบต้องแสดง Link อัตโนมัติโดยไม่รอ Confirm พร้อม Source, Port, Collection Run และเวลาตรวจล่าสุด | Must |
| `AT-NTV-R05` | การลาก Node แล้ว Reload ต้องคงตำแหน่งเดิมและต้องไม่เปลี่ยน Device/Interface/Observation/Current Link | Must |
| `AT-NTV-R06` | ผู้ใช้แก้ Endpoint ของ Raw Observation ไม่ได้ และการ Report Incorrect ต้องเก็บ Raw Observation เดิมพร้อมเหตุผล/ผู้รายงาน/เวลา | Must |
| `AT-NTV-R07` | Manual Override เลือก Interface ที่ไม่มีใน Inventory หรือ Device ที่ Collection ไม่สำเร็จไม่ได้ | Must |
| `AT-NTV-R08` | Manual Override ต้องมีเหตุผล หลักฐาน ผู้สร้าง เวลา Lifecycle และ Audit Log | Must |
| `AT-NTV-R09` | เมื่อ Observation ใหม่ขัดกับ Manual Override หรือ Current Link ระบบต้องแสดง Conflict และไม่เขียนทับหลักฐานฝ่ายใดอัตโนมัติ | Must |
| `AT-NTV-R10` | การเปลี่ยนสายจริงและ Re-collect ต้องทำให้ Link ใหม่ปรากฏ และ Link เดิมเป็น Stale/Needs Review โดยยังตรวจย้อนหลังได้ | Must |
| `AT-NTV-R11` | Viewer ดู Evidence Assessment ได้แต่ Report Incorrect, Resolve Conflict, Re-collect หรือจัดการ Override ไม่ได้; Admin/Operator ทำได้ตาม RBAC | Must |
| `AT-NTV-R12` | Collection/Discovery นอก Allowlist ของ Isolated Lab ต้องถูกปฏิเสธและบันทึก Audit | Must |
| `AT-NTV-R13` | One-sided Observation ที่ Resolve Endpoint ได้ต้องแสดงเป็น Link พร้อมป้าย One-sided โดยไม่สร้าง Exception Review อัตโนมัติเพียงเพราะพบจากฝั่งเดียว | Must |
| `AT-NTV-R14` | เมื่ออุปกรณ์ทั้งสองฝั่งรายงาน Endpoint คู่เดียวกัน ระบบต้องรวมเป็น Link เดียวและแสดง Corroborated โดยไม่ให้ผู้ใช้ Confirm | Must |
| `AT-NTV-R15` | Observation ที่จับคู่ Remote Device/Interface ไม่ได้ต้องอยู่ใน Needs Review/Pending List และห้ามสร้าง Verified Node สมมติ | Must |
