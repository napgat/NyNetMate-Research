# Candidate API สำหรับ NTV แบบ Evidence-based

> Link จาก LLDP/CDP แสดงอัตโนมัติโดยไม่ต้องเรียก Confirm API ระบบคำนวณ `one_sided`, `corroborated`, `needs_review`, `conflict` และ `stale` จาก Observation ที่มี

| API                                                                   | หน้าที่                                                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `GET /topologies/{topology_id}`                                       | โหลด Managed Node, Current Link, Evidence Assessment, Layout และ Freshness                       |
| `GET /topologies/{topology_id}/issues`                                | โหลดเฉพาะ Needs Review, Conflict และ Observation ที่ถูกรายงานว่าผิด                              |
| `POST /devices/enroll`                                                | ระบุ Known Device และ Credential Profile เพื่อเริ่ม Read-only Collection; อยู่ในขอบเขต Inventory |
| `POST /devices/{device_id}/collections`                               | สั่ง Re-collect แบบ Read-only                                                                    |
| `GET /device-collections/{collection_id}`                             | อ่านสถานะและผลของ Collection Job                                                                 |
| `PATCH /topologies/{topology_id}/nodes/{device_id}/position`          | แก้เฉพาะตำแหน่ง Node บน View                                                                     |
| `POST /topology-link-observations/{observation_id}/incorrect-reports` | รายงานว่า Observation ที่แสดงอาจไม่ถูกต้อง พร้อมเหตุผล โดยไม่แก้ Raw Data                        |
| `POST /topology-link-conflicts/{conflict_id}/resolve`                 | บันทึกผลการตรวจ Conflict พร้อมเหตุผลและผู้ดำเนินการ                                              |
| `POST /topology-link-overrides`                                       | สร้าง Manual Override จาก Device/Interface ที่เก็บจากอุปกรณ์จริง                                 |
| `POST /topology-link-overrides/{override_id}/verify`                  | ตรวจ Manual Override ตาม RBAC/Policy เพราะเป็นข้อมูลจากมนุษย์                                    |
| `POST /topology-link-overrides/{override_id}/archive`                 | เลิกใช้ Override โดยยังเก็บประวัติและ Audit Trail                                                |

## API ที่ไม่ต้องมี

- ไม่ต้องมี `confirm` สำหรับ LLDP/CDP Observation ปกติ
- ไม่ใช้ `reject` เป็นขั้นตอนบังคับของทุก Link
- ไม่ใช้ `POST/PATCH/DELETE /topologies/{id}/links` เป็น CRUD ทั่วไปสำหรับ Raw Link
- ไม่อนุญาตให้แก้ Source/Destination Endpoint ของ Raw Observation

คำสั่งจากผู้ใช้มีเฉพาะการรายงานข้อมูลผิด การ Resolve Conflict และการจัดการ Manual Override ส่วน Current Link ปกติสร้างโดย Reconciliation Service จาก Observation อัตโนมัติ
