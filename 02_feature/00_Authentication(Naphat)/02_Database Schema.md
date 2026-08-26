> [!NOTE]
> **APPROVED SCHEMA:** โครงสร้างฐานข้อมูลในหน้านี้ (ใช้ `Argon2id` และเพิ่ม `auth_sessions`) ได้รับการอนุมัติและอัปเดตลงใน Central Schema (`Data Information.md`) เป็นส่วนหนึ่งของระบบ 12 ตารางเรียบร้อยแล้ว

# Authentication Database Schema

เอกสารนี้ระบุโครงสร้างฐานข้อมูลเฉพาะส่วนที่เกี่ยวข้องกับ Authentication & RBAC

## 1. Table: `users`
เก็บข้อมูลผู้ใช้งานระบบ (แก้ไขให้ตรงกับ Central Schema ในส่วนของ UUID และ Email Optional)

```sql
-- ต้องเปิด Extension นี้ก่อนเพื่อใช้ gen_random_uuid()
-- Alembic migration ต้องรัน CREATE EXTENSION ก่อน CREATE TABLE
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL 
        CHECK (username = lower(username)) 
        CHECK (username ~ '^[a-z0-9._-]{3,100}$'),
    email VARCHAR(255) UNIQUE 
        CHECK (email = lower(email)),
    password_hash VARCHAR(255) NOT NULL, -- ต้องเข้ารหัสด้วย Argon2id เสมอ
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
**Database Guards & Validations:**
- `id` ใช้ `UUID` เพื่อให้สอดคล้องกับตาราง `devices` และ `audit_logs` ใน Central Schema
- `updated_at` ควบคุมโดย Application Layer (Backend กำหนดเวลาใหม่ทุกครั้งที่มีการแก้ไข) ไม่ต้องใช้ Database Trigger เพื่อความเรียบง่าย
- `email` เป็น Optional (ไม่บังคับ) ตามที่ระบุไว้ใน Central Schema
- `username` ถูกจำกัดความปลอดภัยระดับ Database ด้วย `CHECK (username ~ '^[a-z0-9._-]{3,100}$')` (ไม่อนุญาตให้มี `@` ป้องกันการสับสนกับ Email)
- `last_login_at` ถูก **ตัดออก** เนื่องจากสามารถ Query จาก `auth_sessions.created_at` ได้โดยตรง
- `must_change_password` ถูก **ตัดออก** ในระยะ P1 เนื่องจากไม่มีฟีเจอร์ Admin Reset Password

## 2. Table: `auth_sessions` (Table ที่ 12 ของระบบ)
ตารางนี้จำเป็นสำหรับ P1 เพื่อรองรับการเตะผู้ใช้ออก (Revoke) และบังคับใช้การเปลี่ยนสิทธิ์ทันที (Immediate Role Effect)

```sql
CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Index สำหรับ Performance ในการค้นหา Session
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_expires_at ON auth_sessions(expires_at);
```
