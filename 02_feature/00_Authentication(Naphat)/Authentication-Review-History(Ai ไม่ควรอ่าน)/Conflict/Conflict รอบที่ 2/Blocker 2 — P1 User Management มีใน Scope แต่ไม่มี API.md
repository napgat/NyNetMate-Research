
## Blocker 2 — P1 User Management มีใน Scope แต่ไม่มี API

[01_MVP (line 19)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/01_MVP - Authentication & RBAC.md:19) ระบุว่า Admin สร้าง user, deactivate และเปลี่ยน role ได้

แต่ [API Contract (line 20)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:20) มีเพียง Login, Me, Logout และ Self-change password ไม่มี endpoint สำหรับ:

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{user_id}`

และไม่มี `GET /api/audit-logs` แม้ Audit Trail เป็น P1 และควรมี `audit.read` สำหรับ Admin

ดังนั้นต้องเติม API DTO, status code, validation และ authorization ของ User Management ก่อนเรียกว่า ready to implement



Viewed 04_API%20Contracts.md:1-84
Edited 04_API%20Contracts.md

ขอบคุณที่ส่ง Blocker 2 มาให้ครับ! นี่เป็นความผิดพลาดของผมเองที่ไปโฟกัสแค่ API ฝั่ง Authentication (ล็อกอิน/ออกจากระบบ) จนลืมไปว่า MVP ของเราตกลงกันว่าจะยังมีระบบ **"User Management ขั้นพื้นฐาน"** (สร้างบัญชี, ปิดบัญชี, เปลี่ยน Role) อยู่ด้วย

**🛠️ ผมได้แก้ไขไฟล์ `04_API Contracts.md` เรียบร้อยแล้ว โดยเพิ่มสิ่งเหล่านี้เข้าไปครับ:**
1. **เพิ่ม 2.5 Admin User Management:**
   - `GET /api/admin/users`: ดึงรายชื่อผู้ใช้ทั้งหมด (มี Pagination)
   - `POST /api/admin/users`: สร้างผู้ใช้ใหม่ (ส่ง username, email, password, role) คืนค่า `201 Created`
   - `PATCH /api/admin/users/{user_id}`: อัปเดตข้อมูล (เช่น เปลี่ยน role เป็น admin, หรือระงับบัญชี `is_active: false`) คืนค่า `200 OK`
   - *ระบุเงื่อนไขว่า API ทั้งหมดนี้ต้องตรวจสอบ Authorization ว่าผู้เรียกมี Permission `user.manage` เท่านั้น*
2. **เพิ่ม 2.6 Audit Logs API:**
   - `GET /api/audit-logs`: ดึงประวัติ Audit Trail (รองรับ Pagination และการกรองด้วย `action`)
   - *ผูกเข้ากับ Permission `audit.read` สำหรับ Admin*

แบบนี้โปรแกรมเมอร์ Frontend สามารถนำ DTO (โครงสร้าง JSON) และ Endpoint เหล่านี้ไปเขียนหน้าจัดการผู้ใช้ได้ทันทีครับ!

