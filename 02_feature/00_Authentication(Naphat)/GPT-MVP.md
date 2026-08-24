อ่านเอกสารตามที่กำหนดแล้ว โดยพบว่าโฟลเดอร์ `00_Authentication(Naphat)` ยังว่าง และไม่มีไฟล์ Audit Trail แยกต่างหาก จึงยึดข้อกำหนดจาก Feature List, Device Inventory schema, Dashboard และ NTV เป็นฐานออกแบบ
## 1. Authentication MVP Summary

P1 ควรเป็น Local Authentication แบบเล็กแต่ครบวงจร:

- Login ด้วย `username` หรือ `email` + password
- เก็บ password ด้วย Argon2id(ทำไม);ห้ามเก็บ plaintext หรือ reversible encryption ([OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))
- JWT access token อายุ 30 นาที เก็บใน `HttpOnly`, `Secure` (production), `SameSite=Lax` cookie
- JWT มี `sub`, `jti`, `iat`, `exp`, `iss`, `aud`; ห้ามใส่ password, credential, IP หรือ PII เกินจำเป็น
- ตรวจ `is_active` และ role จากฐานข้อมูลทุก request สำคัญ เพื่อให้การปิดบัญชี/เปลี่ยน role มีผลทันที
- Login rate limit และข้อความผิดพลาดแบบเดียวกันสำหรับ user/password/account ที่ใช้ไม่ได้
- Logout ต้อง revoke session ฝั่ง server และล้าง cookie
- Route/API protection เป็น backend enforcement เสมอ; การซ่อนปุ่มใน UI เป็นเพียง UX
- Audit: `auth.login_succeeded`, `auth.login_failed`, `auth.logout`, `auth.permission_denied`
- P1 ไม่มี OAuth/SSO, MFA, email verification, email reset password, LDAP/AD, resource/field-level permission

ขอบเขต:

|ระยะ|รายการ|
|---|---|
|P1|Local login, JWT session, 3 roles, admin user management แบบพื้นฐาน, API protection, auth audit, test users|
|P2|Network Discovery/Topology authorization, AI feature permissions, SSH push authorization, session management ที่ละเอียดขึ้น|
|Out of scope|OAuth/SSO, MFA, LDAP/AD, email reset/verify, field/device-specific ACL, delegated administration|

ข้อเสนอสำคัญ: เพิ่มตาราง `auth_sessions` ภายใต้ Auth ownership แม้ schema กลางเดิมมีเพียง `users` เพื่อให้ logout/revoke ทำงานจริง ไม่ใช่แค่ลบ cookie ฝั่ง browser

## 2. RBAC Matrix

`Admin` ควบคุมระบบ, `Operator` ทำงานปฏิบัติการที่ไม่ใช่การตั้งค่าสิทธิ์/ความปลอดภัยสูง, `Viewer` อ่านอย่างเดียว

| ความสามารถ                                   | Admin | Operator | Viewer                    |
| -------------------------------------------- | ----- | -------- | ------------------------- |
| Dashboard, System Health                     | ✓     | ✓        | ✓                         |
| Recent activity แบบสรุป                      | ✓     | ✓        | ✓                         |
| Audit log แบบเต็ม/เหตุการณ์ auth             | ✓     | –        | –                         |
| ดู Device/Group/สถานะ                        | ✓     | ✓        | ✓                         |
| เพิ่ม/แก้ metadata/นำ Device ออกจากการจัดการ | ✓     | ✓        | –                         |
| สร้างหรือแก้ Credential Profile              | ✓     | –        | –                         |
| เลือก Credential Profile เพื่อ enroll        | ✓     | ✓        | –                         |
| Config Builder, Preview, CIS Scan, Plan/Diff | ✓     | ✓        | อ่านผลที่แชร์แล้วเท่านั้น |
| CIS Override พร้อมเหตุผล                     | ✓     | –        | –                         |
| User management, role, deactivate user       | ✓     | –        | –                         |
| Offline mode และ CIS rule toggles            | ✓     | –        | –                         |
| NTV P2: ดู topology/warning                  | ✓     | ✓        | ✓                         |
| NTV P2: re-collect, shared layout            | ✓     | ✓        | –                         |
| P2: Human-confirmed SSH deploy               | ✓     | ✓        | –                         |

ข้อสอดคล้องกับเอกสาร:

- Dashboard ระบุให้ทุก role อ่าน Summary/Health ได้ และ Viewer ต้องเห็นเฉพาะ read-only state
- Inventory ระบุให้ Admin/Operator ทำ Manual Enrollment ได้
- NTV ระบุไว้ชัดว่า Viewer ดูได้ แต่ห้าม re-collect และห้ามแก้ Shared Layout
- CIS override ต้องเป็น Admin ตาม schema Device Inventory
- Topology เป็น P2 ตาม Feature List แม้เอกสาร NTV เรียกว่า “MVP”; ควรตีความว่าเป็น MVP ของโมดูล NTV ในช่วง P2

## 3. User Flows

1. Login สำเร็จ  
    ผู้ใช้ส่ง identifier/password → ตรวจ hash, `is_active`, rate limit → สร้าง session และ JWT cookie → บันทึก `auth.login_succeeded` → คืน profile/permissions
    
2. Login ล้มเหลว  
    Credential ไม่ถูกต้อง, account ไม่ active หรือถูก rate-limit → ตอบข้อความทั่วไป “username/email หรือ password ไม่ถูกต้อง” → บันทึก `auth.login_failed` โดยไม่เก็บ password/token
    
3. เรียก API ที่ไม่มีสิทธิ์  
    Middleware ตรวจ session ก่อน → permission guard ตรวจ role → ตอบ `403 Forbidden` → UI ซ่อน/disable action → บันทึก `auth.permission_denied`
    
4. Token หมดอายุหรือ session ถูก revoke  
    ตอบ `401 Unauthorized` พร้อม error code `AUTH_SESSION_EXPIRED` → ล้าง local auth state → redirect ไป Login พร้อมข้อความ “Session หมดอายุ กรุณาเข้าสู่ระบบใหม่”
    
5. Admin จัดการผู้ใช้  
    Admin สร้าง user พร้อม temporary password, กำหนด role → user เปลี่ยน password เมื่อ login ครั้งแรก → Admin เปลี่ยน role/deactivate ได้ แต่ห้าม deactivate ตัวเองหรือทำให้ระบบไม่มี Admin ที่ active
    
6. Operator ทำงานหลัก  
    Operator enroll device ใน Isolated Lab, สร้าง config, scan CIS และดู Plan ได้ แต่ไม่เห็น credential secret, ไม่ override CIS และไม่แก้ user/settings
    

## 4. Data Ownership และ Dependency Contract

| Owner             | เป็นเจ้าของ                                 | Contract ที่ส่งออก                                             |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------- |
| Auth & RBAC       | `users`, `auth_sessions`, permission policy | `Principal {user_id, role, is_active}`, `require_permission()` |
| Audit Trail       | `audit_logs`                                | `record_event(actor, action, target, outcome, metadata)`       |
| Device Inventory  | `devices`, `credentials`, `interfaces`      | device/interface แบบ read-only ให้ Dashboard/NTV               |
| Dashboard         | view model/aggregation                      | อ่าน Device, Validation, Audit ผ่าน repository เท่านั้น        |
| NTV (P2)          | topology view, placement, link projection   | เรียก Auth เพื่อตรวจสิทธิ์ และส่ง event ให้ Audit              |
| CIS Validation    | scan result, override domain                | รับ principal; Admin-only สำหรับ override                      |
| Config Generation | request/config preview/plan                 | รับ principal เพื่อบันทึก creator และ audit action             |

กติกากลาง:

- ทุก feature รับ `user_id` จาก Auth context เท่านั้น ไม่รับจาก request body
- ทุก feature ส่ง audit event ผ่าน Audit service; ห้ามเขียน `audit_logs` กระจัดกระจาย
- Audit metadata เป็น allowlist และห้ามมี password, SSH key, SNMP community, JWT, cookie หรือ raw credential
- Client IP ที่เอกสาร Inventory เสนอให้เก็บ เป็น PII ภายในระบบ; หากส่งออก AI ภายหลังต้องผ่าน masking pipeline
- NTV อ่าน `user_id`, role และ active state จาก Auth แต่ไม่เก็บ username/password ซ้ำ
- Auth ไม่ตัดสิน business rule เช่น “CIS scan ผ่านหรือไม่” และไม่เชื่อมต่ออุปกรณ์เครือข่าย

## 5. Candidate API Contract

|Endpoint|สิทธิ์|ผลลัพธ์หลัก|
|---|---|---|
|`POST /api/auth/login`|Public|ตั้ง JWT cookie, คืน current user|
|`POST /api/auth/logout`|Authenticated|revoke current session, clear cookie|
|`GET /api/auth/me`|Authenticated|`id`, `username`, `email`, `role`, permissions|
|`POST /api/auth/change-password`|Authenticated|เปลี่ยน password ของตนเอง|
|`GET /api/admin/users`|Admin|รายชื่อ user แบบไม่คืน password hash|
|`POST /api/admin/users`|Admin|สร้าง user พร้อม temporary password|
|`PATCH /api/admin/users/{user_id}`|Admin|เปลี่ยน role/active state|
|`POST /api/admin/users/{user_id}/reset-password`|Admin|กำหนด temporary password; ไม่ใช่ email reset|
|`GET /api/audit-logs`|Admin|audit log แบบ filter/pagination|

มาตรฐาน error:

- `401 AUTH_INVALID_CREDENTIALS`
- `401 AUTH_SESSION_EXPIRED`
- `403 AUTH_PERMISSION_DENIED`
- `423 AUTH_ACCOUNT_INACTIVE` ภายใน service แต่ UI ควรแสดง generic login error
- `429 AUTH_LOGIN_RATE_LIMITED`

## 6. Acceptance Tests

1. Login ถูกต้องออก JWT cookie ที่เป็น HttpOnly และเรียก `/me` ได้
2. Password ที่เก็บใน DB ไม่ใช่ plaintext และตรวจด้วย Argon2id ได้
3. Login ผิดไม่บอกว่า identifier ใดมีอยู่จริง และมี audit failed event
4. Account ที่ `is_active=false` login ไม่ได้
5. Token หมดอายุ/revoke แล้ว protected API ตอบ `401`
6. Logout ทำให้ session เดิมเรียก protected API ไม่ได้
7. Viewer เรียก Device create/update/delete, CIS override, user/settings API ไม่ได้
8. Operator enroll/edit device metadata ได้ แต่สร้าง/อ่าน secret ของ credential profile ไม่ได้
9. Admin สร้าง user, เปลี่ยน role และ deactivate user ได้
10. ระบบป้องกันการ deactivate Admin คนสุดท้ายและ self-deactivation
11. Dashboard Summary/Health อ่านได้ครบทั้งสาม role
12. Dashboard Recent Activity แบบปกติไม่เปิดเผย password, token หรือ credential secret
13. NTV P2: Viewer ดู topology ได้ แต่ `POST collection` และ `PATCH position` ได้ `403`
14. ทุก `403` ที่เกิดจาก authorization สร้าง `auth.permission_denied` audit event
15. Audit log ของ login/logout/denied มีเวลา, outcome, actor หรือ null actor กรณี login ไม่สำเร็จ และไม่มี secret
16. Test users ทั้งสาม role ใช้ได้เฉพาะ development/test environment และไม่มี default password ใน production

## 7. รายการเอกสารและหัวข้อที่ Antigravity Gemini 3.1 Pro ต้องสร้าง

สร้างใน [02_feature/00_Authentication(Naphat)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)):

1. `00_Authentication MVP Scope.md`  
    เป้าหมาย P1/P2/Out of Scope, security principles, assumptions
    
2. `01_RBAC Matrix and Permission Catalog.md`  
    ตาราง role-to-permission, endpoint-to-permission, UI visibility rules
    
3. `02_Data Model and Session Design.md`  
    `users`, `auth_sessions`, role enum, constraints, soft deactivate, password lifecycle
    
4. `03_Authentication and Authorization Flows.md`  
    Login/logout/expiry/denied/admin user management พร้อม sequence diagrams
    
5. `04_API Contracts.md`  
    Request/response schemas, cookie policy, status/error codes, CORS/CSRF policy
    
6. `05_Audit Event Contract.md`  
    Event taxonomy, mandatory fields, metadata allowlist, PII/secret prohibition, Dashboard dependency
    
7. `06_Acceptance Tests.md`  
    Acceptance tests ข้างต้น พร้อม Pytest/Jest mapping
    
8. `07_Integration Contracts.md`  
    Contract กับ Dashboard, Device Inventory, Config Gen, CIS, Audit และ NTV P2 รวม dependency/order
    
9. `08_Test Users and Environment Policy.md`  
    Dev/test seed strategy, ห้าม hardcode production credential, `.env` requirements
    

## 8. Open Questions พร้อม Default ที่แนะนำ

|คำถาม|Default ที่แนะนำ|
|---|---|
|ใช้ username, email หรือทั้งคู่|รองรับทั้งคู่ โดยทั้งสอง unique; email เป็น optional เพื่อไม่เพิ่ม email verification|
|อายุ session|30 นาที, ไม่มี refresh token ใน P1|
|เก็บ JWT ที่ใด|HttpOnly cookie ตาม Feature List; frontend ไม่อ่าน token|
|Logout ต้อง revoke server-side หรือไม่|ต้อง revoke ผ่าน `auth_sessions`|
|Operator จัดการ credential ได้หรือไม่|ไม่ได้; เลือกใช้ profile ได้แต่ไม่เห็น/แก้ secret|
|Admin reset password ได้หรือไม่|ได้แบบ manual temporary password; ไม่ทำ email reset|
|ใครดู audit log เต็มได้|Admin เท่านั้น; Dashboard feed เป็นมุมมองจำกัดสำหรับทุก role|
|NTV อยู่ P1 หรือ P2|P2 ตาม Feature List; RBAC contract เตรียมไว้ล่วงหน้า|
|ป้องกัน CSRF อย่างไร|ตรวจ Origin สำหรับ state-changing request และใช้ cookie policy ที่เข้มงวด|
|Test users|seed เฉพาะ development/test; password มาจาก environment variable และไม่ใช้ใน production|

ประเด็นที่ควรยืนยันกับทีมก่อนเริ่มเขียนเอกสารคือ “Admin reset password แบบ manual” จะอยู่ P1 หรือจำกัดให้สร้างผู้ใช้ผ่าน seed/CLI ก่อน หากต้องการ MVP ที่เล็กที่สุด ผมแนะนำให้คง manual reset ไว้เฉพาะ Admin เพราะสอดคล้องกับ User Management P1 โดยไม่ต้องทำระบบอีเมลครับ