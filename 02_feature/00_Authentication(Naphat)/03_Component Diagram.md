# Component & Flow Diagram - Authentication

## 1. Login Flow

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant A as Auth API
    participant R as In-memory Rate Limiter
    participant DB as Database
    participant L as Audit Log

    C->>A: POST /api/auth/login (Identifier, Password)
    A->>R: Check Client IP sliding window
    alt 5 Failed Attempts Already Recorded
        R-->>A: Block before User Query / Argon2id
        A-->>C: 429 AUTH_LOGIN_RATE_LIMITED
    else Attempt Allowed
        A->>A: Normalize (toLowerCase) Identifier
        A->>DB: Query User by Username or Email

        alt User Not Found
            A->>A: Verify submitted password against Dummy Argon2id Hash; ignore result
            A->>R: Record failed IP + HMAC(normalized identifier)
            A->>L: Dedicated audit transaction: user.login_failed / auth / null / null
            alt Audit Commit Failed
                A-->>C: 503 AUTH_SERVICE_UNAVAILABLE
            else Audit Committed
                A-->>C: 401 AUTH_INVALID_CREDENTIALS
            end
        else User Found
            A->>A: Verify submitted password against user.password_hash (Argon2id)
            alt Password Incorrect OR User Inactive
                A->>R: Record failed IP + HMAC(normalized identifier)
                A->>L: Dedicated audit transaction: user.login_failed / user / user_id / null
                alt Audit Commit Failed
                    A-->>C: 503 AUTH_SERVICE_UNAVAILABLE
                else Audit Committed
                    A-->>C: 401 AUTH_INVALID_CREDENTIALS
                end
            else Password Correct AND User Active
                A->>A: Generate opaque token (CSPRNG 32 bytes) + SHA-256(token)
                A->>DB: Begin transaction + Insert auth_sessions row
                A->>L: Write user.login_success in same transaction
                alt Transaction Commit Failed
                    A->>DB: Rollback session + audit row
                    A-->>C: 503 AUTH_SERVICE_UNAVAILABLE
                else Transaction Committed
                    A-->>C: 200 OK + Set-Cookie (opaque token, HttpOnly)
                end
            end
        end
    end
```

> Dummy Hash สร้างหนึ่งครั้งตอน Application Startup ด้วย Password Hasher ชุดเดียวกับผู้ใช้จริง (`Argon2id m=19456 KiB, t=2, p=1`) และไม่ผูกกับบัญชีใด Rate Limiter ต้องทำงานก่อน User Query/Argon2id ส่วน Token ดิบมีอยู่เฉพาะใน Memory ชั่วคราวระหว่างสร้าง Response และใน Cookie ของ Browser เท่านั้น ห้ามเก็บลง Database, Response JSON หรือ Log การตรวจและเพิ่ม Rate-limit Counter ต้องเป็น Atomic ภายใน Process เพื่อให้ Concurrent Request หลบ Threshold ไม่ได้

## 2. Request Security, Session & RBAC Flow

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant X as CORS / CSRF Guard
    participant G as Auth / Session Guard
    participant DB as Database
    participant P as Permission Guard
    participant L as Audit Log
    participant API as Feature API

    C->>X: Request (Session Cookie if authenticated)
    opt POST / PUT / PATCH / DELETE
        X->>X: Validate exact Origin or Referer fallback
        X->>X: Validate X-CSRF-Protection: 1
        opt Endpoint has Request Body
            X->>X: Require Content-Type application/json
        end
    end
    X->>G: Continue protected request
    alt Session Cookie Missing
        G-->>C: 401 AUTH_SESSION_MISSING
    else Session Cookie Present
        G->>G: Validate token format + SHA-256(token)
        G->>DB: Query auth_sessions JOIN users by session_token_hash
        alt Unknown / Revoked / Expired / User Inactive
            G-->>C: 401 AUTH_SESSION_INVALID
        else Active Session
            DB-->>G: user_id + current role + is_active
            G->>P: require_permission(current_role, permission_key)
            alt Permission Denied
                P->>L: Dedicated audit transaction: auth.permission_denied / auth / resource_id / user_id
                alt Audit Commit Failed
                    P-->>C: 503 AUTH_SERVICE_UNAVAILABLE
                else Audit Committed
                    P-->>C: 403 AUTH_FORBIDDEN
                end
            else Permission Granted
                P->>API: Continue Request
                API-->>C: Feature Response
            end
        end
    end
```

CSRF Guard ต้องทำงานกับ State-changing Request ทุกเส้น รวมถึง Public Endpoint เช่น `POST /api/auth/login`; Public Endpoint จะข้าม Auth/Permission Guard แล้วไปยัง Handler หลังผ่าน CSRF Guard ส่วน `OPTIONS` เป็น CORS Preflight และไม่ถือเป็น State-changing Request

การตรวจ `Content-Type` ใช้เฉพาะ Endpoint ที่มี Request Body ดังนั้น `POST /api/auth/logout` ซึ่งไม่มี Body ต้องผ่านได้โดยไม่ส่ง `Content-Type` หาก Origin/Referer และ CSRF Header ถูกต้อง Backend ต้องอ่าน Role ปัจจุบันจาก `users` ทุก Protected Request ห้ามเก็บหรือเชื่อ Role จาก Cookie และต้อง Fail Closed หาก Database ใช้งานไม่ได้

## 3. Self-Change Password Flow
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

## 4. Audit Trail Contract (Reconciled DTO)
ส่วน Authentication จะสร้างข้อมูลส่งให้ระบบ Audit ผ่าน Auth-only wrapper function `record_auth_event()`:

### 4.1 Caller Function Signature (Auth Layer)
Caller (เช่น Login Flow) จะเรียกใช้ด้วย 4 Business Arguments พื้นฐาน โดย DB Session/Transaction ถูก Inject ผ่าน Auth Audit Adapter หรือ Request-scoped Service Context และไม่นับเป็น Business Argument:
```
record_auth_event(
    action:         str,        -- Canonical Action Name (ดูตาราง 4.2)
    resource_type:  str,        -- เช่น 'auth', 'user'
    resource_id:    UUID|null,  -- ID ของเป้าหมาย (nullable)
    actor_id:       UUID|null   -- ID ของผู้กระทำที่ยืนยันตัวตนแล้ว (nullable)
)
```

Auth Caller **ห้ามส่ง** `description` หรือ Client IP เข้า Wrapper นี้ `record_auth_event()` หรือ Audit Writer ต้องกำหนด `description` เป็น `null` หรือ Fixed Safe Template ภายในเท่านั้น และต้องไม่คัดลอก `auth_sessions.ip_address` ลง `audit_logs`

**กฎเรื่อง `actor_id`:** ต้องเป็น ID ของผู้ใช้ที่ **ยืนยันตัวตนสำเร็จแล้ว** เท่านั้น
- Login สำเร็จ → `actor_id = user_id` ของผู้ Login
- Login ล้มเหลว (password ผิด) → `actor_id = null` (ยังไม่รู้ว่าใครคือผู้กระทำจริง) แต่ใช้ `resource_type='user'` + `resource_id=target_user_id` เพื่อชี้ไปที่บัญชีเป้าหมาย
- Login ล้มเหลว (ไม่พบบัญชี) → `actor_id = null`, `resource_id = null`
- Admin ระงับบัญชี → `actor_id = admin_id`, `resource_id = target_user_id`

### 4.2 Canonical Mapping & DTO Translation

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

*(หมายเหตุ: ค่า Enum ของ `safe_error_category` สำหรับฝั่ง Auth ที่เปิดให้ใช้งานใน P1 คือ `authentication_error`, `authorization_error`, และ `null` เท่านั้น ส่วน `validation_error` และ `server_error` ถือเป็น Reserved ไว้ก่อน ยังไม่อนุญาตให้ใช้งานจนกว่าจะมีการเพิ่ม Registry Entry ใหม่)*

### 4.3 Transaction Boundary

- `user.login_success`, `user.logout`, `user.password_changed`, `user.created`, `user.updated` และ `user.deactivated` ต้องเขียน Audit ด้วย DB Session และ Transaction เดียวกับ Business Action หาก Audit Write ล้มเหลวต้อง Rollback Business Action และตอบ `503 AUTH_SERVICE_UNAVAILABLE`
- `user.login_failed` ไม่มี Business Action ที่จะ Commit จึงต้องเปิด Intentional Audit Transaction แยกและ Commit Audit Row ก่อนตอบ `401 AUTH_INVALID_CREDENTIALS`; หาก Audit Commit ล้มเหลวให้ตอบ `503 AUTH_SERVICE_UNAVAILABLE`
- `auth.permission_denied` ต้องบันทึกด้วย Intentional Audit Transaction ที่ Commit ได้แม้ Request หลักถูกปฏิเสธด้วย `403`; หาก Audit Store ใช้งานไม่ได้ให้ Fail Closed และตอบ `503 AUTH_SERVICE_UNAVAILABLE`

### 4.4 Data Storage & Consumer API Mapping

เพื่อยุติปัญหาการใช้ชื่อ Field ไม่ตรงกันระหว่าง Database, Auth API และ D&M Contract ระบบกำหนดกฎการ Mapping ดังนี้:

| Auth Function Caller | Central DB Storage (`audit_logs`) | Full Audit API DTO (Admin Only) |
| :--- | :--- | :--- |
| `actor_id` | `user_id` | `actor_user_id` |
| (computed now) | `created_at` | `occurred_at` |
| (mapped) | `result` | `result` |
| (mapped) | `safe_error_category` | `safe_error_category` |

> [!NOTE]
> **สถานะสัญญา (Approved & Reconciled):**
> 1. **D&M Projection (Recent Activity):** D&M จะดึงข้อมูลไปแสดงเฉพาะ `action`, ชื่อผู้กระทำ (`actor display name` หรือ `Unknown`), เป้าหมาย (`resource display`), และ `timestamp` **โดยห้ามส่ง `safe_error_category`, `description`, และ `ip_address` ไปให้ D&M เด็ดขาด** ตามข้อกำหนดเรื่อง Data Privacy
> 2. **Central Schema:** ตาราง `audit_logs` กลางได้รับการอัปเดตเพื่อเพิ่มคอลัมน์ `result` และ `safe_error_category` เรียบร้อยแล้ว รองรับการจัดเก็บค่าที่ `record_auth_event()` คำนวณไว้ได้อย่างสมบูรณ์
> 3. **Cross-feature Sign-off:** Auth ยืนยันว่าจะไม่ส่ง Client IP หรือ `description` จาก Caller เข้า Audit Writer และ D&M Contract ยืนยันว่าจะไม่เลือกหรือส่ง IP/Description ออก Recent Activity แล้ว สถานะร่วมอ้างอิง `02_feature/11_Audit Trail(Naphat)/06_Integration Contract Matrix.md`
