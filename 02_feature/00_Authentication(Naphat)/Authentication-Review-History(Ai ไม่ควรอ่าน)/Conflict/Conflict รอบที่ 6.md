# สรุปการแก้ไข Conflict รอบที่ 6

เอกสารนี้สรุปการแก้ไขตาม Feedback ของ GPT Architect ที่ตรวจพบว่ารอบ 5 เป็นเพียง "สรุปของเก่า" แต่ยังไม่ได้แก้ปัญหาใหม่จริง รอบนี้ได้เข้าไปแก้ไขไฟล์หลักจริงทุกจุด

สถานะปัจจุบัน: **Pending shared-contract approval** (รอเจ้าของ Central Schema อนุมัติ delta)

---

## 🛑 Blocker: Central Schema ยังไม่ reconcile

### สิ่งที่ทำ (ที่ไฟล์ 02)
- ขยาย Banner `> [!WARNING]` ให้ระบุ **Delta ทั้งชุด 6 ข้อ** ที่ต้องได้รับอนุมัติจากเจ้าของ `Data Information.md`:
  1. เพิ่มตาราง `auth_sessions` (ตารางที่ 12)
  2. เปลี่ยน Password hashing จาก `bcrypt` เป็น `Argon2id`
  3. เปลี่ยน `role` จาก ENUM เป็น `VARCHAR(50) + CHECK`
  4. เพิ่ม `CHECK` constraints สำหรับ lowercase username/email
  5. ตัด `last_login_at` ออก (ใช้ `auth_sessions.created_at` แทน)
  6. ตัด `must_change_password` ออก
- เพิ่ม `NOT NULL` ให้ `created_at` และ `updated_at` ในตาราง `users`

### สิ่งที่รอ
- เจ้าของ `Data Information.md` ต้องอนุมัติ delta ทั้ง 6 ข้อ ก่อนเริ่ม Alembic migration

---

## ⚠️ High: Audit Contract ใช้ชื่อ Action ไม่ตรงกัน

### ปัญหา
- Glossary เดิมใช้: `auth.login_succeeded`, `auth.login_failed`
- Component Diagram ใช้: `user.login_success`, `user.login_failed`
- D&M Audit Contract (DM-DEP-AUD-01) บังคับให้ส่งฟิลด์ `result` มาด้วย แต่ Auth ตัด `outcome` ทิ้งไปแล้ว

### สิ่งที่ทำ (ที่ไฟล์ 00, 03, 04, 05)
- ประกาศ **Canonical Action Names** ชุดเดียว ใช้ข้ามทั้งระบบ:

| Action | หมายถึง | Inferred result |
| :--- | :--- | :--- |
| `user.login_success` | Login สำเร็จ | `success` |
| `user.login_failed` | Login ล้มเหลว | `failure` |
| `user.logout` | Logout สำเร็จ | `success` |
| `user.password_changed` | เปลี่ยนรหัสผ่านตัวเอง | `success` |
| `user.created` | Admin สร้างบัญชีใหม่ | `success` |
| `user.updated` | Admin แก้ไขข้อมูล/Role | `success` |
| `user.deactivated` | Admin ระงับบัญชี | `success` |
| `auth.permission_denied` | เข้าถึง API ที่ไม่มีสิทธิ์ | `failure` |

- เปลี่ยนฟิลด์ `user_id` ของ function เป็น `actor_user_id` ให้ตรงกับ D&M contract
- ออกแบบ **Interop Strategy** กับ D&M: Backend function `record_event()` จะอนุมาน `result` จาก suffix ของชื่อ action (`_success`/`_changed` → `success`, `_failed`/`_denied` → `failure`) โดยไม่ต้องเพิ่มคอลัมน์ `outcome`

---

## ⚠️ High: Deactivate ไม่ Revoke Sessions ของเป้าหมาย

### สิ่งที่ทำ (ที่ไฟล์ 04 และ 05)
- เพิ่ม **Side Effects** ใน `PATCH /api/admin/users/{user_id}`:
  - Deactivate (`is_active=false`) → **Revoke ทุก Session ของผู้ใช้เป้าหมาย** แบบ Atomic (ภายใน Transaction เดียวกัน)
  - Reactivate (`is_active=true`) → **ห้ามคืน Session เก่า** ผู้ใช้ต้อง Login ใหม่
- เพิ่ม Acceptance Test สำหรับทั้งสองกรณี

---

## ⚠️ P1: Dashboard Recent Activity ไม่มีกติกา Redaction

### สิ่งที่ทำ (ที่ไฟล์ 06)
- อัปเดต Permission `activity.read_summary` ให้ระบุ Allowlist:
  - ✅ แสดงได้: Action, Username ของผู้กระทำ, Resource Type/Name, Timestamp
  - ❌ ห้ามแสดง: IP Address, User-Agent, Error Detail, Secret, Full Audit Description

---

## 🔧 รายการเก็บงานย่อย (Minor Fixes)

| ข้อ | ปัญหา | การแก้ไข | ไฟล์ |
| :--- | :--- | :--- | :--- |
| Rate Limit enforcement key | API ไม่ระบุว่าบล็อกที่ระดับใด | ระบุ "ต่อ **Client IP**" ในทุกไฟล์ตรงกัน | 04, 05 |
| Password Policy ไม่ครอบคลุม Admin Create | POST สร้าง User ไม่ระบุ Policy | บังคับ 12-128 ตัวอักษรเหมือน Self-change | 04, 05 |
| Seed password validation | ไม่มีการเช็ค password ว่าง | เพิ่มกฎ Fail-Closed: exit non-zero ก่อนแตะ DB | 07 |
| `created_at`/`updated_at` ไม่มี NOT NULL | อาจเกิด NULL ได้ | เพิ่ม `NOT NULL` ใน SQL | 02 |
| JSON example มี `// comment` | ไม่ใช่ JSON valid | ย้าย comment ไว้นอก JSON block เป็นคำอธิบาย | 04 |
| Response ไม่รองรับ `email: null` | email optional แต่ example ไม่โชว์ | เพิ่ม `"email": null` ใน example + โน้ต | 04 |
| Error Matrix ไม่มี | ไม่รู้ว่ากรณีไหนตอบ code อะไร | สร้างตาราง Error Response Matrix ครบ 9 กรณี | 04 |
| Last-admin guard ใช้ 403 | ไม่เหมาะสม ควรเป็น Conflict | เปลี่ยนเป็น `409 AUTH_LAST_ADMIN_PROTECTED` | 04, 05 |

---

## 📋 ไฟล์ที่ถูกแก้ไขในรอบนี้

| ไฟล์ | การเปลี่ยนแปลงหลัก |
| :--- | :--- |
| `00_Glossary.md` | เปลี่ยน Audit Event names เป็น Canonical format + เพิ่ม D&M interop note |
| `02_Database Schema.md` | ขยาย delta list, เพิ่ม NOT NULL timestamps, เพิ่ม last_login_at note |
| `03_Component Diagram.md` | เพิ่ม Canonical Action list, Interop Strategy กับ D&M, เปลี่ยน user_id → actor_user_id |
| `04_API Contracts.md` | เขียนใหม่ทั้งไฟล์: Deactivate side effects, Error Matrix, email null, password policy |
| `05_Acceptance Tests.md` | เขียนใหม่ทั้งไฟล์: Deactivate→Revoke test, Reactivate test, seed password guard, error codes |
| `06_Permission Catalog.md` | เพิ่ม Redaction allowlist สำหรับ activity.read_summary |
| `07_Test Users.md` | เพิ่มกฎ Password Validation (Fail-Closed) |
