## Database Design

###  Minimal P1 Schema

Dashboard ไม่เป็นเจ้าของตารางแยก และไม่สร้างตารางชื่อ `dashboard` โดย Aggregate จากตารางต้นทาง

| ตาราง               | Field ที่ Dashboard ใช้                                           | Query หลัก                                           | Index ที่ควรพิจารณา                                                                            |
| ------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **devices**         | `id`, `hostname`, `site`, `status`, `last_seen`                   | นับอุปกรณ์แยกตามสถานะ/ไซต์                           | Index บน `status`; Partial index สำหรับ Offline เมื่อมีข้อมูลมากและ Query plan ยืนยันว่าจำเป็น |
| **scan_results**    | `device_id`, `severity`, `passed`, `scanned_at`                   | ผล Critical ที่ไม่ผ่านจากผลสแกนล่าสุด                | Composite/partial index สำหรับ `passed = false`, Severity และเวลาสแกน                          |
| **cis_overrides**   | `scan_result_id`, สถานะ/เวลาของ Override                          | ตัดรายการที่มี Active Override ออกจาก Critical count | Index บน `scan_result_id`                                                                      |
| **audit_logs**      | `user_id`, `action`, `resource_type`, `resource_id`, `created_at` | 10 กิจกรรมล่าสุด                                     | B-tree บน `created_at DESC`                                                                    |
| **system_settings** | `offline_mode`                                                    | แสดง AI mode                                         | Primary key ของ Singleton row                                                                  |

> **หมายเหตุ:** การทำ Index ต้องยืนยันด้วยข้อมูลจำลองและ `EXPLAIN ANALYZE` ไม่ควรสร้าง Index ทุกตัวล่วงหน้าโดยไม่มี Query pattern รองรับ

### 7.2 Optional Historical/P2 Schema

หาก P2 ต้องแสดง Availability ย้อนหลัง ให้เพิ่ม:

```text
device_status_checks
- id
- device_id
- status
- response_time_ms
- checked_at
- error_code
```

เมื่อปริมาณข้อมูลเพิ่มขึ้นจึงค่อยพิจารณา Retention, Partitioning, Roll-up หรือ Time-series extension เช่น TimescaleDB โดยไม่รวมความซับซ้อนนี้ไว้ใน P1
