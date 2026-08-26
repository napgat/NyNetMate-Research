# Data Ownership and Event Catalog

เอกสารนี้กำหนดการเป็นเจ้าของข้อมูล (Data Ownership) และแค็ตตาล็อกเหตุการณ์มาตรฐาน (Canonical Events)

## 1. Data Ownership
- **Schema Owner:** โครงสร้างตาราง `audit_logs` อ้างอิงตาม **Central Schema** (`Data Information.md`) อย่างสมบูรณ์ ห้ามสร้าง Schema แข่งขัน
- **Write Owner:** Feature Audit Trail เป็นเจ้าของฟังก์ชันภายใน (เช่น `record_audit_event`) ที่ Feature อื่น (Producers) ต้องเรียกใช้
- **Read Owner:** 
  - Feature Audit Trail เป็นเจ้าของ Full Audit API (`GET /api/audit-logs`) สำหรับ Admin
  - Feature D&M เป็นเจ้าของ `GET /api/dashboard/recent-activity` โดยจะอ่านตรงจากฐานข้อมูลด้วย SQLAlchemy ORM ในโหมด Read-only (แบบจำกัดข้อมูล)

## 2. Event Catalog (Canonical Actions)
Action ทั้งหมดต้องอยู่ในรูปแบบ `resource_type.action` 

### 2.1 Authentication & User Management
- `user.login_success`
- `user.login_failed`
- `user.logout`
- `user.password_changed`
- `user.deactivated`
- `user.created`
- `user.updated`
- `user.deleted`
- `auth.permission_denied`

### 2.2 Device Inventory
- `device.create`
- `device.update`
- `device.delete`

### 2.3 Configuration Management
- `config.generate`
- `config.deploy` (P2)

### 2.4 CIS Benchmark
- `scan.run`
- `scan.override`

### 2.5 System Settings
- `settings.update`

## 3. Data Integrity & Nullability Rules
- **`user_id` (Actor):** อนุญาตให้เป็น `NULL` ได้เฉพาะเหตุการณ์ที่ไม่มีตัวตนผู้ใช้ชัดเจนในระบบ เช่น `user.login_failed` ด้วย username ที่ไม่มีในฐานข้อมูล หรือ Background Task
- **`resource_id`:** อนุญาตให้เป็น `NULL` ได้ หากเหตุการณ์นั้นไม่ได้กระทำต่อ Resource เฉพาะเจาะจง หรือ Resource นั้นไม่สามารถระบุ ID ได้
- **Redaction Rule:** ห้ามเก็บ Password (ทั้งแบบ Plaintext และ Hash), Credential Secret, Token หรือ PII ของบุคคลภายนอกลงในฟิลด์ `description` เด็ดขาด หากมีการพยายามแทรกข้อมูลเหล่านี้ ต้องทำ Data Masking ก่อนบันทึกลง `audit_logs`
