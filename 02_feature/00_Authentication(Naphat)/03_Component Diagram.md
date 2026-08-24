# Component & Flow - Authentication

เอกสารนี้อธิบายถึงขั้นตอนการทำงาน (User Flows) สิทธิการเป็นเจ้าของข้อมูล (Data Ownership) และข้อตกลงการเชื่อมต่อกับฟีเจอร์อื่น (Dependency Contract)

## 1. User Flows (กระบวนการทำงาน)

1. **Login สำเร็จ (Login Succeeded)**
   - ผู้ใช้ส่ง `username` (หรือ `email`) และ `password`
   - ระบบตรวจสอบ Hash (ด้วย Argon2id), `is_active=true` และ Rate Limit
   - สร้าง Session ลงใน `auth_sessions` และสร้าง JWT Cookie (`HttpOnly`)
   - บันทึก Audit Log `auth.login_succeeded`
   - คืนค่า Profile / Permissions เบื้องต้นให้ UI
2. **Login ล้มเหลว (Login Failed)**
   - Credential ไม่ถูกต้อง, `is_active=false`, หรือโดน Rate Limit
   - ระบบตอบกลับข้อความทั่วไป (Generic Message) ว่า "Username/Email หรือรหัสผ่านไม่ถูกต้อง"
   - บันทึก Audit Log `auth.login_failed` (ไม่เก็บรหัสผ่านหรือ Token ที่ใช้พยายามเข้าสู่ระบบลง Log)
3. **เรียก API ที่ไม่มีสิทธิ์ (Permission Denied)**
   - Middleware ตรวจสอบ Session ก่อน (Token ยังไม่หมดอายุ)
   - Permission Guard ตรวจสอบว่า Role ปัจจุบันมีสิทธิ์เรียก Endpoint นี้หรือไม่
   - หากไม่มีสิทธิ์ จะตอบกลับด้วย HTTP Status `403 Forbidden`
   - บันทึก Audit Log `auth.permission_denied`
   - UI (Frontend) จะทำการซ่อนหรือ Disable ปุ่มล่วงหน้าเป็นเพียงแค่ UX
4. **Token หมดอายุ หรือ Session ถูก Revoke (Unauthorized)**
   - Middleware ตรวจสอบ Session แล้วพบว่าถูกตั้งค่า `is_revoked=true` หรือเลยเวลา `expires_at`
   - ระบบตอบกลับด้วย HTTP Status `401 Unauthorized` (พร้อม Error Code `AUTH_SESSION_EXPIRED`)
   - ล้างค่า Cookie ฝั่งเบราว์เซอร์
   - Redirect ผู้ใช้กลับไปหน้า Login พร้อมข้อความ "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่"
5. **การจัดการผู้ใช้โดย Admin (User Management)**
   - Admin สร้าง User พร้อมระบุรหัสผ่านชั่วคราว (Temporary Password) และ Role
   - (แนะนำ) ให้ผู้ใช้ใหม่ต้องเปลี่ยนรหัสผ่านเมื่อ Login ครั้งแรก
   - Admin สามารถระงับบัญชี (`is_active=false`) หรือเปลี่ยน Role ได้
   - **กฎเกณฑ์:** Admin ไม่สามารถ Deactivate ตัวเอง หรือทำให้ระบบไม่มี Admin ที่ Active เหลืออยู่เลย

## 2. Data Ownership และ Dependency Contract

| ระบบ / ฟีเจอร์ที่เป็นเจ้าของ (Owner) | ข้อมูลที่เป็นเจ้าของ | Contract ที่ส่งออกให้ฟีเจอร์อื่นเรียกใช้ |
| :--- | :--- | :--- |
| **Auth & RBAC** | `users`, `auth_sessions`, นโยบายสิทธิ์ (Permission Policy) | `Principal {user_id, role, is_active}`, ฟังก์ชัน `require_permission()` |
| **Audit Trail** | `audit_logs` | ฟังก์ชันบันทึกเหตุการณ์ `record_event(actor, action, target, outcome, metadata)` |
| **Device Inventory** | `devices`, `credentials`, `interfaces` | ข้อมูลอุปกรณ์/Interface แบบ Read-only สำหรับ Dashboard / NTV |
| **Dashboard** | View Model / Aggregation | อ่านจำนวนอุปกรณ์, สถานะ, Audit แบบ Read-only ผ่าน Service |
| **NTV (P2)** | Topology View, ตำแหน่งอุปกรณ์ (Placement), Link | เรียก Auth เพื่อตรวจสอบสิทธิ์การเข้าถึง และส่ง Event เข้า Audit |
| **CIS Validation** | Scan Result, Override Domain | รับ Principal จาก Auth (อนุญาต Override เฉพาะ Admin) |
| **Config Generation** | Request, Config Preview, Plan | รับ Principal จาก Auth เพื่อบันทึกผู้สร้าง และ Audit Action |

## 3. กฎเกณฑ์ที่ทุกฟีเจอร์ต้องปฏิบัติตามร่วมกับระบบ Auth
1. **Source of Truth for Identity:** ทุกฟีเจอร์ต้องรับ `user_id` และข้อมูลผู้ใช้ปัจจุบันจาก **Auth Context (Server-side)** เท่านั้น ห้ามรับรหัสผู้ใช้ที่แฝงมาใน Request Body
2. **Centralized Auditing:** ทุกฟีเจอร์ต้องส่งบันทึกเหตุการณ์ผ่าน Service กลางของ **Audit Trail** ห้ามเขียนตาราง `audit_logs` ด้วยตัวเองอย่างกระจัดกระจาย
3. **No PII/Secrets in Audit:** ข้อมูล Metadata ที่บันทึกลง Audit ต้องเป็นแบบ Allowlist ห้ามมี รหัสผ่าน, SSH Key, SNMP Community, JWT, Cookie, หรือ Credential อื่นๆ
4. **Role Enforcement:** ฟีเจอร์อื่นไม่ต้องสนใจวิธีการทำงานของ Auth (เช่น การเข้ารหัส ถอดรหัส) สิ่งที่ต้องการรับรู้คือ `role` หรือ `permission` เพื่อนำไปบังคับใช้สิทธิ์ของตนเองต่อไป (เช่น CIS Validation ตัดสินด้วย Role Admin)
5. **No DB Duplication:** NTV หรือ Dashboard อ่าน `user_id`, `role`, และ `is_active` จากระบบ Auth แต่ห้ามสร้างคอลัมน์เก็บ username หรือรหัสผ่านซ้ำ
