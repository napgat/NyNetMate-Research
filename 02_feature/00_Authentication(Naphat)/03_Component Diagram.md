# Component & Flow Diagram - Authentication

## 1. Login Flow

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant A as Auth API
    participant DB as Database
    participant L as Audit Log

    C->>A: POST /api/auth/login (Identifier, Password)
    A->>A: Normalize (toLowerCase) Identifier
    A->>DB: Query User by Username or Email
    
    alt User Not Found OR is_active=false
        A->>L: record_auth_event('user.login_failed', 'auth', null, null)
        A-->>C: 401 AUTH_INVALID_CREDENTIALS
    else User Found
        A->>A: Verify Password (Argon2id)
        alt Password Incorrect
            A->>L: record_auth_event('user.login_failed', 'user', user_id, null)
            A-->>C: 401 AUTH_INVALID_CREDENTIALS
        else Password Correct
            A->>DB: Insert into auth_sessions
            A->>L: record_auth_event('user.login_success', 'auth', null, user_id)
            A-->>C: 200 OK + Set-Cookie (JWT)
        end
    end
```

## 2. Self-Change Password Flow
เมื่อผู้ใช้ต้องการเปลี่ยนรหัสผ่านของตนเอง

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth API
    participant DB as Database
    participant L as Audit Log

    C->>A: POST /api/auth/change-password (current_password, new_password)
    A->>DB: Verify current_password
    alt Valid
        A->>DB: Update password_hash (Argon2id)
        A->>DB: UPDATE auth_sessions SET is_revoked = true WHERE user_id = {id}
        A->>L: record_auth_event('user.password_changed', 'user', user_id, user_id)
        A-->>C: 204 No Content (Clear Cookie / Force Re-login)
    else Invalid
        A-->>C: 400 AUTH_CURRENT_PASSWORD_INVALID
    end
```

## 3. Audit Trail Contract (Reconciled DTO)
ส่วน Authentication จะสร้างข้อมูลส่งให้ระบบ Audit ผ่าน Auth-only wrapper function `record_auth_event()`:

### 3.1 Caller Function Signature (Auth Layer)
Caller (เช่น Login Flow) จะเรียกใช้ด้วย 4 Arguments พื้นฐาน:
```
record_auth_event(
    action:         str,        -- Canonical Action Name (ดูตาราง 3.2)
    resource_type:  str,        -- เช่น 'auth', 'user'
    resource_id:    UUID|null,  -- ID ของเป้าหมาย (nullable)
    actor_id:       UUID|null   -- ID ของผู้กระทำที่ยืนยันตัวตนแล้ว (nullable)
)
```

**กฎเรื่อง `actor_id`:** ต้องเป็น ID ของผู้ใช้ที่ **ยืนยันตัวตนสำเร็จแล้ว** เท่านั้น
- Login สำเร็จ → `actor_id = user_id` ของผู้ Login
- Login ล้มเหลว (password ผิด) → `actor_id = null` (ยังไม่รู้ว่าใครคือผู้กระทำจริง) แต่ใช้ `resource_type='user'` + `resource_id=target_user_id` เพื่อชี้ไปที่บัญชีเป้าหมาย
- Login ล้มเหลว (ไม่พบบัญชี) → `actor_id = null`, `resource_id = null`
- Admin ระงับบัญชี → `actor_id = admin_id`, `resource_id = target_user_id`

### 3.2 Canonical Mapping & DTO Translation

ฟังก์ชัน `record_auth_event()` ทำหน้าที่เป็น Registry Map มันจะดึงค่า `result`, `safe_error_category` และ `created_at` (now()) อัตโนมัติจากตารางด้านล่าง หากมีการส่ง Action ที่ไม่อยู่ในตารางนี้เข้ามา ฟังก์ชันต้อง **Reject (โยน Exception) ทันที** (ช่วยป้องกันการส่ง Action ของระบบอื่นเช่น `device` ผิดเข้ามา)

| Action | `resource_type` | `result` | `safe_error_category` |
| :--- | :--- | :--- | :--- |
| `user.login_success` | `auth` | `success` | `null` |
| `user.login_failed` | `user` / `auth` | `failure` | `'authentication_error'` |
| `user.logout` | `auth` | `success` | `null` |
| `user.password_changed` | `user` | `success` | `null` |
| `user.created` | `user` | `success` | `null` |
| `user.updated` | `user` | `success` | `null` |
| `user.deactivated` | `user` | `success` | `null` |
| `auth.permission_denied`| `auth` | `failure` | `'authorization_error'` |

*(หมายเหตุสำหรับ D&M: ค่า Enum ของ `safe_error_category` สำหรับฝั่ง Auth ที่อนุญาตให้มีคือ `authentication_error`, `authorization_error`, `invalid_request`, `server_error`, หรือ `null` เท่านั้น ห้ามใช้รูปแบบอื่น)*

### 3.3 Data Storage & Consumer API Mapping

เพื่อยุติปัญหาการใช้ชื่อ Field ไม่ตรงกันระหว่าง Database, Auth API และ D&M Contract ระบบกำหนดกฎการ Mapping ดังนี้:

| Auth Function Caller | Central DB Storage (`audit_logs`) | Consumer API DTO (ส่งให้ D&M และ Frontend) |
| :--- | :--- | :--- |
| `actor_id` | `user_id` | `actor_user_id` |
| (computed now) | `created_at` | `occurred_at` |
| (mapped) | `result` | `result` |
| (mapped) | `safe_error_category` | `safe_error_category` |

> [!NOTE]
> **สถานะสัญญา (Approved & Reconciled):**
> 1. **D&M Contract (DM-DEP-AUD-01):** ฝั่ง Auth จะนำข้อมูลจาก Database Storage แปลงเป็นชื่อ `actor_user_id` และ `occurred_at` ในชั้น API Response เพื่อให้ตรงกับ D&M DTO Requirement ทุกประการ
> 2. **Central Schema:** ตาราง `audit_logs` กลางได้รับการอัปเดตเพื่อเพิ่มคอลัมน์ `result` และ `safe_error_category` เรียบร้อยแล้ว รองรับการจัดเก็บค่าที่ `record_auth_event()` คำนวณไว้ได้อย่างสมบูรณ์
