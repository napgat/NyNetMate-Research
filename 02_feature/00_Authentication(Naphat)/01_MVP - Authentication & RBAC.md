# MVP Scope - Authentication & RBAC

เอกสารนี้ระบุขอบเขตการทำงาน (MVP Scope) และสิทธิ์การเข้าถึง (RBAC Matrix) ของระบบ Authentication สำหรับ MyNetMate ในระยะ P1 (อ้างอิงจากบทวิเคราะห์ ChatGPT Architect)

## 1. Authentication MVP Summary

สำหรับ MVP P1 ระบบ Authentication จะเป็น Local Authentication แบบขนาดเล็กแต่ครอบคลุมวงจรความปลอดภัยที่จำเป็น:

- **Login:** เข้าสู่ระบบด้วย `username` หรือ `email` + รหัสผ่าน
- **Password Storage:** ใช้ `Argon2id` ห้ามเก็บรหัสผ่านเป็น Plaintext หรือใช้ Reversible Encryption
- **Session Management:**
  - ใช้ JWT Access Token อายุ 30 นาที (ยังไม่มี Refresh Token ใน P1)
  - เก็บใน `HttpOnly`, `Secure` (เมื่อขึ้น Production), `SameSite=Lax` Cookie เพื่อความปลอดภัย
  - ตรวจสอบความถูกต้องของ Session ผ่านตาราง `auth_sessions` เสมอ (Server-side revocation)
- **Security Check:** ตรวจสอบค่า `is_active` และ Role ของผู้ใช้จาก Database ในทุก ๆ Request สำคัญ เพื่อให้การระงับบัญชี (Deactivate) หรือเปลี่ยนสิทธิ์มีผลทันที
- **Rate Limit & Error Message:** ป้องกันการโจมตีแบบ Brute-force ด้วย Rate Limit และแสดงข้อความผิดพลาดแบบ General เสมอ (เช่น "อีเมล/ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง") เพื่อไม่ให้เดาได้ว่าบัญชีมีอยู่จริงหรือไม่
- **Authorization:** บังคับใช้การตรวจสอบสิทธิ์ที่ Backend เสมอ (Backend Enforcement) 
- **Audit Log:** บันทึกเหตุการณ์เกี่ยวกับ Authentication (Login สำเร็จ/ล้มเหลว, Logout, Permission Denied)
- **Scope Definition:**
  - **P1 (MVP):** Local login, JWT session, 3 roles, Admin user management แบบพื้นฐาน, API protection, Auth audit, Test users
  - **P2:** Network Discovery/Topology authorization, AI feature permissions, SSH push authorization, Session management แบบละเอียด
  - **Out of Scope (ตัดออกถาวร/ยังไม่ทำ):** OAuth/SSO, MFA, LDAP/AD, การยืนยันอีเมล, ส่งลิงก์เปลี่ยนรหัสผ่านทางอีเมล, Resource/Field-level Permission

## 2. RBAC Matrix

ระบบมี 3 Roles หลัก ได้แก่ `Admin` (ควบคุมระบบ), `Operator` (ปฏิบัติการระบบ), `Viewer` (อ่านอย่างเดียว)

| ความสามารถ / ฟีเจอร์ (Feature)                | Admin | Operator |        Viewer         |
| :-------------------------------------------- | :---: | :------: | :-------------------: |
| **Dashboard & Monitoring**                    |       |          |                       |
| ดู Dashboard, System Health                   |   ✅   |    ✅     |           ✅           |
| ดู Recent activity แบบสรุป                    |   ✅   |    ✅     |           ✅           |
| **Audit Trail**                               |       |          |                       |
| ดู Audit log แบบเต็ม / เหตุการณ์ Auth         |   ✅   |    ❌     |           ❌           |
| **Device Inventory**                          |       |          |                       |
| ดู Device / Group / สถานะ                     |   ✅   |    ✅     |           ✅           |
| เพิ่ม/แก้ไขข้อมูล/นำ Device ออก               |   ✅   |    ✅     |           ❌           |
| **Credential Management**                     |       |          |                       |
| สร้าง/แก้ไข Credential Profile                |   ✅   |    ❌     |           ❌           |
| เลือก Credential Profile เพื่อ Enroll อุปกรณ์ |   ✅   |    ✅     |           ❌           |
| **Configuration Management**                  |       |          |                       |
| Config Builder, Preview, CIS Scan, Plan/Diff  |   ✅   |    ✅     | ✅ (อ่านได้อย่างเดียว) |
| CIS Override (ยกเว้นกฎ CIS) พร้อมเหตุผล       |   ✅   |    ❌     |           ❌           |
| **System Settings & Users**                   |       |          |                       |
| User management (สร้าง/แก้ไข role/deactivate) |   ✅   |    ❌     |           ❌           |
| Offline mode และ สวิตช์เปิด/ปิด CIS rule      |   ✅   |    ❌     |           ❌           |
| **Network Topology (P2)**                     |       |          |                       |
| ดู Topology / Warning                         |   ✅   |    ✅     |           ✅           |
| Re-collect, สร้าง/แก้ไข Shared Layout         |   ✅   |    ✅     |           ❌           |
| **Deployment (P2)**                           |       |          |                       |
| Human-confirmed SSH deploy (สั่ง Push Config) |   ✅   |    ✅     |           ❌           |
ทำไมต้องมี 3 Roles 2 Role ไม่ได้หรอ
## 3. Assumptions & Open Questions (ข้อตกลงและคำถามที่เปิดไว้)

| คำถาม                                | Default ที่แนะนำ (และใช้เป็นสมมติฐานใน P1)                                                                 |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **ใช้ Username, Email หรือทั้งคู่?** | รองรับทั้งคู่ (ทั้งคู่ต้อง Unique) อีเมลสามารถใส่ได้แต่จะไม่มีระบบยืนยันอีเมลใน P1                         |
| **อายุ Session และ Refresh Token**   | 30 นาที และ **ไม่มี** Refresh Token ใน P1 เพื่อลดความซับซ้อน                                               |
| **เก็บ JWT ไว้ที่ไหน?**              | `HttpOnly` Cookie เพื่อป้องกัน XSS Frontend ไม่จำเป็นต้องอ่าน Token                                        |
| **การ Logout**                       | เป็น Server-side Revoke (ลบ session ID ในตาราง `auth_sessions`)                                            |
| **Operator และ Credential**          | Operator เลือกใช้ Credential Profile ได้ แต่เข้าไปดูรหัสผ่าน/Secret ไม่ได้ และแก้ไขไม่ได้                  |
| **การ Reset รหัสผ่าน**               | ไม่มีระบบอีเมล Admin สามารถกำหนด Temporary Password ให้ใหม่แบบ Manual ได้                                  |
| **ใครสามารถดู Audit Log ของ Auth?**  | เฉพาะ Admin เท่านั้น (ในหน้า Audit Trail) ส่วน Role อื่นดูได้แค่ Recent Activity ใน Dashboard ตามสิทธิ์    |
| **สถานะของ NTV**                     | ฟีเจอร์ Topology วางไว้อยู่ใน P2 การเตรียมสิทธิ์ RBAC ไว้เพื่อล่วงหน้าเท่านั้น                             |
| **Test Users สำหรับ Development**    | Seed เฉพาะตอน Development และ Test ห้ามมีผู้ใช้เริ่มต้นที่มีรหัสผ่านเดาได้ใน Production (ต้องใช้ Env Vars) |
