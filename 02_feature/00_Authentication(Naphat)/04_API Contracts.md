# API Contracts - Authentication

เอกสารนี้ระบุสเปคของ API เพื่อให้ทีม Frontend และ Backend สามารถทำงานร่วมกันได้ทันที

## 1. Cookie & JWT Specification
- **JWT Algorithm:** `HS256` (Secret key ดึงจาก Environment Variable ความยาวขั้นต่ำ 32 bytes)
- **JWT Claims:**
  - `iss`: `"mynetmate_api"` (คงที่)
  - `aud`: `"mynetmate_client"` (คงที่)
  - `sub`: `user_id` (UUID)
  - `jti`: `session_id` (UUID) สำหรับเช็คสถานะการ Revoke
  - `iat`: Timestamp ที่ออก Token
  - `exp`: Timestamp ที่หมดอายุ (30 นาที)
  - `role`: Role ปัจจุบัน (`admin`, `operator`, `viewer`)
- **Cookie Setup:**
  - `Name`: `mynetmate_token`
  - `Path`: `/api` (สำคัญ: เพื่อให้ Cookie ถูกส่งไปทุกๆ Endpoint ภายใต้ /api)
  - `HttpOnly`: `true`
  - `Secure`: `true` (ใน Production)
  - `SameSite`: `Lax`
  - `Max-Age`: `1800` (30 นาที)

## 2. API Endpoints

### 2.1 Login
- **URL:** `POST /api/auth/login`
- **Rate Limit:** อนุญาตให้พยายาม Login ล้มเหลวได้ 5 ครั้งต่อ **Client IP** ภายใน 15 นาที หากกระทำครั้งที่ 6 จะถูกปฏิเสธทันที (`429 AUTH_LOGIN_RATE_LIMITED`) ระบบจะนับ Identifier (Username/Email) ควบคู่ด้วยโดยแปลงเป็น HMAC ก่อนเก็บลง Cache เพื่อใช้ทำ Alert
- **Request Body:**
  ```json
  {
    "identifier": "admin",
    "password": "Password123!"
  }
  ```
  *(Validation: `identifier` ต้องยาว 3-255 ตัวอักษร, ถ้าไม่มี `@` จะถือว่าเป็น Username ซึ่งต้องผ่าน Regex `^[a-z0-9._-]{3,100}$` / Backend จะจับ toLowerCase() ก่อนเสมอ)*
- **Response Success (200 OK):**
  ```json
  {
    "message": "Login successful"
  }
  ```
  *(Header จะแนบ `Set-Cookie` มาด้วย)*
- **Response Error:**
  - `401 AUTH_INVALID_CREDENTIALS` — Username/Email หรือ Password ผิด (ไม่ระบุว่าอันไหน)
  - `429 AUTH_LOGIN_RATE_LIMITED` — เกิน Rate Limit

### 2.2 Get Current User (Me)
- **URL:** `GET /api/auth/me`
- **Request:** (แนบ Cookie อัตโนมัติ)
- **Response Success (200 OK):**
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "demo_admin",
    "email": "admin@kmitl.ac.th",
    "role": "admin",
    "is_active": true
  }
  ```
  *(หมายเหตุ: `email` อาจเป็น `null` หากผู้ใช้ไม่ได้ระบุ)*

### 2.3 Logout
- **URL:** `POST /api/auth/logout`
- **Response Success (204 No Content):** (ไม่มี Body)
  *(Backend จะอัปเดต DB `is_revoked=true` และตั้งค่า Header ลบ Cookie: `Set-Cookie: mynetmate_token=; Max-Age=0; Path=/api; HttpOnly; SameSite=Lax; Secure`)*
  *(หมายเหตุ: การสั่งลบ Cookie ของ Browser จำเป็นต้องระบุแอตทริบิวต์ Name, Path, Domain, Secure, SameSite ให้ตรงกับตอนที่สร้างทุกประการ ไม่เช่นนั้น Browser จะไม่ยอมลบ)*

### 2.4 Self-Change Password
- **URL:** `POST /api/auth/change-password`
- **Request Body:**
  ```json
  {
    "current_password": "OldPassword123!",
    "new_password": "NewPassword456!"
  }
  ```
  *(Validation: `new_password` ต้องยาว 12-128 ตัวอักษร)*
- **Response Success (204 No Content):** (ไม่มี Body)
  *(Backend จะ Revoke Session ทั้งหมดของผู้ใช้นี้ทิ้งทันที และลบ Cookie เพื่อบังคับให้ผู้ใช้ล็อกอินใหม่ โดยการ Update Password Hash, Revoke Sessions, และบันทึก Audit Log ต้องเกิดขึ้นภายใน Database Transaction เดียวกันแบบ Atomic)*
- **Response Error:**
  - `400 AUTH_CURRENT_PASSWORD_INVALID` — รหัสผ่านปัจจุบันไม่ถูกต้อง

### 2.5 Authorization Guard (Backend)
- **สำคัญ:** ในทุกๆ Protected Request Backend จะต้อง Query ตาราง `auth_sessions` และ `users` เพื่อตรวจสอบสิทธิ์ โดยใช้เงื่อนไข (Predicates) ให้ครบถ้วน: `JWT.jti = session_id`, `JWT.sub = user_id`, `is_revoked = false`, และ `expires_at > now()` จากนั้นให้อ่าน `is_active` และ `role` ปัจจุบันจาก DB มาบังคับใช้ **ห้าม** เชื่อถือและ Authorize สิทธิ์จากค่า `role` ใน JWT Payload เพียงอย่างเดียว มิเช่นนั้นการเปลี่ยน Role/Deactivate จะไม่มีผลจนกว่า Token จะหมดอายุ

### 2.6 Admin User Management
- **Authorization:** ต้องมี Permission `user.manage` (เฉพาะ Admin)
- **GET `/api/admin/users` (List Users):**
  - **Query Params:** `?page=1&limit=50&status=active` (Optional)
  - **Response (200 OK):**
    ```json
    {
      "data": [
        { "id": "uuid", "username": "operator_1", "email": null, "role": "operator", "is_active": true }
      ],
      "meta": { "total": 1, "page": 1, "limit": 50 }
    }
    ```
- **POST `/api/admin/users` (Create User):**
  - **Request Body:**
    ```json
    {
      "username": "new_op",
      "email": "new_op@kmitl.ac.th",
      "password": "InitialPassword123!",
      "role": "operator"
    }
    ```
    *(Validation: Username format, `email` เป็น Optional (ส่งได้หรือไม่ส่งก็ได้), `password` ต้องยาว 12-128 ตัวอักษร, `role` ∈ [admin, operator, viewer])*
  - **Response (201 Created):** คืนค่า User Object ที่เพิ่งสร้าง (ไม่มี Password)
  - *(Side Effect: ต้องบันทึก Audit Log `user.created` โดย `actor_id` = Admin, `resource_id` = User ใหม่)*
- **PATCH `/api/admin/users/{user_id}` (Update User):**
  - **Request Body:**
    ```json
    {
      "role": "viewer",
      "is_active": false
    }
    ```
  - **Side Effects (ต้องทำแบบ Atomic ภายใน Transaction เดียวกัน):**
    - หากตั้ง `is_active` เป็น `false` → Backend ต้อง **Revoke ทุก Session ของผู้ใช้เป้าหมาย** ทันที เพื่อไม่ให้มี Session ค้าง
    - หาก Reactivate (`is_active` เปลี่ยนจาก `false` เป็น `true`) → **ห้ามคืน Session เก่า** ผู้ใช้ต้องล็อกอินใหม่เท่านั้น
    - ระบบจะต้องบันทึก Audit Log `user.deactivated` หรือ `user.updated` เสมอ
    - หากเปลี่ยน Role → ระบบจะ Enforce Role ใหม่ผ่าน Authorization Guard ใน Request ถัดไป
  - **Response (200 OK):** คืนค่า User Object ที่อัปเดตแล้ว

### 2.7 Audit Logs API
- **Authorization:** ต้องมี Permission `audit.read` (เฉพาะ Admin เท่านั้น Operator/Viewer ต้องไปใช้ API หมวด Dashboard แยกต่างหากเพื่อดูสรุป Activity)
- **GET `/api/audit-logs`:**
  - **Query Params:** `?page=1&limit=50&action=user.login_failed` (Optional)
  - **Response (200 OK):**
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "action": "user.login_failed",
          "resource_type": "auth",
          "resource_id": null,
          "actor_user_id": null,
          "result": "failure",
          "safe_error_category": "authentication_error",
          "occurred_at": "2026-08-26T12:00:00Z"
        }
      ],
      "meta": { "total": 150, "page": 1, "limit": 50 }
    }
    ```

## 3. Error Response Matrix

| สถานการณ์ | HTTP Status | Error Code |
| :--- | :--- | :--- |
| Login ผิด (ไม่ระบุว่าอันไหน) | `401` | `AUTH_INVALID_CREDENTIALS` |
| Session หมดอายุหรือถูก Revoke | `401` | `AUTH_SESSION_INVALID` |
| JWT Signature / iss / aud ผิด | `401` | `AUTH_TOKEN_INVALID` |
| ไม่มี Cookie แนบมา | `401` | `AUTH_TOKEN_MISSING` |
| ไม่มีสิทธิ์ (Role ไม่พอ) | `403` | `AUTH_FORBIDDEN` |
| Origin ไม่อยู่ใน Allowlist | `403` | `AUTH_ORIGIN_REJECTED` |
| Current password ผิด (เปลี่ยนรหัส) | `400` | `AUTH_CURRENT_PASSWORD_INVALID` |
| Rate Limit (Login ครั้งที่ 6+) | `429` | `AUTH_LOGIN_RATE_LIMITED` |
| สร้างบัญชีแต่ Username/Email ซ้ำ | `409` | `AUTH_USER_ALREADY_EXISTS` |
| อ้างอิง User ID ที่ไม่มีอยู่จริง | `404` | `AUTH_USER_NOT_FOUND` |
| Demote/Deactivate Admin คนสุดท้าย | `409` | `AUTH_LAST_ADMIN_PROTECTED` (ต้องใช้ DB Lock เช่น `SELECT ... FOR UPDATE` หรือ Serializable Transaction เพื่อกัน Race Condition) |

## 4. CORS & CSRF
- **CORS Allowed Origins:** ระบุ Exact URL (เช่น `https://mynetmate.app`) ห้ามใช้ `*`
- **CORS Credentials:** `Access-Control-Allow-Credentials: true`
- **CSRF Check:** คำขอประเภท State-changing (`POST`, `PUT`, `PATCH`, `DELETE`) Backend ต้องตรวจสอบว่า `Origin` ตรงกับที่อนุญาตเท่านั้น
