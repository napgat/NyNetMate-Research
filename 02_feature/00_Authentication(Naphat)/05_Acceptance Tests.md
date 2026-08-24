# Acceptance Tests - Authentication

เอกสารนี้ระบุเงื่อนไขการยอมรับ (Acceptance Criteria / Tests) สำหรับฟีเจอร์ Authentication & RBAC

## Test Cases

1. **Successful Login & Session Creation:**
   - การ Login ที่ถูกต้อง จะต้องคืนค่า JWT ใน Cookie ที่เป็น `HttpOnly`
   - สามารถใช้ Cookie นั้นเรียก API `/api/auth/me` และได้ข้อมูลตนเองกลับมา
2. **Password Security:**
   - รหัสผ่านที่เก็บใน Database ต้องไม่ใช่ Plaintext
   - รหัสผ่านสามารถตรวจสอบความถูกต้องด้วยอัลกอริทึม `Argon2id` ได้
3. **Failed Login Handling:**
   - หาก Login ผิด ระบบต้อง **ไม่ระบุ** ชัดเจนว่า Identifier (Username/Email) หรือรหัสผ่านกันแน่ที่มีปัญหา (ป้องกันการทำ User Enumeration)
   - ระบบต้องบันทึกเหตุการณ์ลง Audit ว่า Failed (โดยไม่บันทึกรหัสผ่านลง Log)
4. **Inactive Account:**
   - ผู้ใช้ที่มีสถานะ `is_active=false` จะไม่สามารถ Login ได้เด็ดขาด
5. **Session Expiry & Revocation:**
   - Token ที่หมดอายุแล้ว หรือ Session ที่ถูก Revoke จากตาราง `auth_sessions` แล้ว เมื่อเรียก Protected API ต้องตอบ `401 Unauthorized`
6. **Logout Functionality:**
   - หลังจาก Logout เสร็จสิ้น หากนำค่า Cookie เดิมไปพยายามเรียก API ป้องกัน จะไม่สามารถเข้าถึงได้อีกต่อไป
7. **Viewer Role Restrictions:**
   - `Viewer` ไม่สามารถเรียก API เพื่อสร้าง/แก้ไข/ลบ Device (Inventory) ได้
   - `Viewer` ไม่สามารถแก้ไข กฎ CIS (CIS Override) ได้
   - `Viewer` ไม่สามารถจัดการ User / Settings ระบบได้
8. **Operator Role Restrictions:**
   - `Operator` สามารถจัดการ Device Metadata ได้ แต่ **ไม่สามารถ** สร้างหรือเรียกดู Secret ภายใน Credential Profile ได้
9. **Admin User Management:**
   - `Admin` สามารถสร้าง User ใหม่ได้
   - `Admin` สามารถเปลี่ยน Role ของคนอื่นได้
   - `Admin` สามารถระงับ (Deactivate) ผู้ใช้อื่นได้
10. **Admin Fallback Prevention:**
    - ระบบป้องกันไม่ให้ `Admin` ระงับ (Deactivate) ผู้ใช้ระดับ Admin "คนสุดท้าย" ของระบบ
    - ระบบป้องกันไม่ให้ User ระงับการใช้งานบัญชีของตนเอง (Self-deactivation) ผ่าน API ทั่วไป
11. **Dashboard Visibility:**
    - ทุก Role (`Admin`, `Operator`, `Viewer`) สามารถดูหน้า Dashboard Summary และ System Health ได้
12. **Audit & Log Data Masking:**
    - หน้า Recent Activity บน Dashboard (สำหรับทุก Role) จะต้องไม่เปิดเผยข้อมูล Password, Token หรือ Credential Secret 
13. **Topology View (P2 Integration Check):**
    - `Viewer` สามารถดู Topology (NTV) ได้
    - `Viewer` พยายามเรียก `POST collection` หรือ `PATCH position` ของ NTV จะต้องได้สถานะ `403 Forbidden`
14. **Audit Logging for 403 Forbidden:**
    - ทุกคำขอ (Request) ที่ได้รับ `403 Forbidden` จากการละเมิดสิทธิ์ (Authorization) จะต้องถูกบันทึกลงใน Audit Log เป็นเหตุการณ์ `auth.permission_denied`
15. **Audit Log Data Integrity:**
    - เหตุการณ์ Login/Logout/Denied ต้องระบุเวลา, สถานะผลลัพธ์ (Outcome), และผู้กระทำ (Actor)
    - กรณี Login ไม่สำเร็จ Actor อาจเป็น Null หรือเป็นข้อความระบุชั่วคราว
    - **ห้าม** มีข้อมูล Secret รั่วไหลลงใน Audit Log
16. **Environment Policy (Test Users):**
    - ข้อมูลผู้ใช้ทดสอบ (Test Users) ที่ครอบคลุมทั้ง 3 Roles สามารถใช้/สร้าง (Seed) ได้เฉพาะใน Environment แบบ Development / Test เท่านั้น
    - ห้ามมี Default User ที่ตั้งรหัสผ่านพื้นฐานเดาได้ ในการรันโหมด Production เด็ดขาด
