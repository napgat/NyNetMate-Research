# Database Schema - Authentication

เอกสารนี้ระบุโครงสร้างฐานข้อมูลสำหรับส่วน Authentication ใน P1 ซึ่งประกอบด้วยตารางผู้ใช้งานและตารางจัดการเซสชันเพื่อรองรับ Server-side Revocation (ไม่อนุญาตให้ใช้แบบลบ Cookie อย่างเดียว)

## Table: `users`
ตารางเก็บข้อมูลผู้ใช้งานของระบบ MyNetMate

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | รหัสผู้ใช้ |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อผู้ใช้งาน (ใช้สำหรับ Login) |
| `email` | VARCHAR(255) | UNIQUE, NULL | อีเมล (สามารถใช้ Login ได้, ไม่มี Email Verification ใน P1) |
| `password_hash` | VARCHAR(255)| NOT NULL | รหัสผ่านที่เข้ารหัสด้วย Argon2id เท่านั้น |
| `role` | VARCHAR(20) | NOT NULL | ประเภทผู้ใช้งาน (`admin`, `operator`, `viewer`) |
| `is_active` | BOOLEAN | DEFAULT TRUE, NOT NULL | สถานะการเปิดใช้งานบัญชี (Soft Deactivate) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | เวลาที่สร้างบัญชี |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | เวลาที่อัปเดตข้อมูลบัญชีล่าสุด |
| `last_login_at`| TIMESTAMP | NULL | เวลาที่ Login สำเร็จครั้งล่าสุด |

**หมายเหตุ**:
- ห้ามเก็บรหัสผ่านเป็น Plaintext หรือใช้ Reversible Encryption ทุกกรณี
- การลบผู้ใช้ (Delete User) ควรใช้เป็น Soft Delete (ตั้ง `is_active` = false) แทน เพื่อป้องกันไม่ให้ข้อมูลในตารางอื่น (เช่น Audit Trail) เกิด Orphan record

## Table: `auth_sessions`
ตารางสำหรับการจัดการ Session และ Token Revocation (เพื่อรองรับการบังคับ Logout จากเซิร์ฟเวอร์)

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | รหัส Session (สอดคล้องกับค่า `jti` ใน JWT) |
| `user_id` | UUID | FOREIGN KEY (users.id) | รหัสผู้ใช้ที่เป็นเจ้าของ Session |
| `created_at` | TIMESTAMP | DEFAULT NOW() | เวลาที่สร้าง Session (เมื่อ Login สำเร็จ) |
| `expires_at` | TIMESTAMP | NOT NULL | เวลาที่ Session หมดอายุ (30 นาที) |
| `ip_address` | VARCHAR(45) | NULL | (สำหรับแสดงผล/วิเคราะห์) PII ต้องผ่านการ Mask ก่อนส่งออกภายนอก |
| `user_agent` | TEXT | NULL | อุปกรณ์/เบราว์เซอร์ที่ใช้ Login |
| `is_revoked` | BOOLEAN | DEFAULT FALSE, NOT NULL | สถานะถูกยกเลิก (เช่น เมื่อกด Logout) |

**หมายเหตุ**: 
- เมื่อผู้ใช้ Login จะสร้าง Record ในนี้ และนำ `id` ไปบรรจุในตัวแปร `jti` ของ JWT
- ระบบ Backend จะตรวจสอบตารางนี้ทุกครั้งสำหรับ Request ที่สำคัญ ว่า `is_revoked` ต้องเป็น `FALSE` และเวลายังไม่เกิน `expires_at`
- การเก็บ IP Address เพื่อความปลอดภัย ถือว่าเป็น PII หากมีการดึงข้อมูลส่วนนี้ส่งออกไปใช้งานข้างนอกหรือ AI จะต้องผ่าน PII Masking เสมอ
