# Acceptance Tests - Authentication

เอกสารนี้ระบุเงื่อนไขการยอมรับ (Acceptance Criteria / Tests) สำหรับฟีเจอร์ Authentication & RBAC

## Test Cases

1. **Successful Login & Session Creation:**
   - การ Login ที่ถูกต้อง จะต้องคืนค่า JWT ใน Cookie ที่เป็น `HttpOnly`
   - สามารถใช้ Cookie นั้นเรียก API `/api/auth/me` และได้ข้อมูลตนเองกลับมา
   - **Case Normalization:** ระบบต้องทำ Case Normalization สำหรับ Username/Email (บังคับให้ระบบแปลงตัวอักษรเป็นพิมพ์เล็ก `lowercase` เสมอ) และอนุญาตให้ Username มีเฉพาะตัวอักษร ตัวเลข `._-` เท่านั้น (ห้ามมี `@`)
2. **Password Security & JWT Handling:**
   - รหัสผ่านที่เก็บใน Database ต้องไม่ใช่ Plaintext และใช้ `Argon2id`
   - **ห้าม** มี JWT Token หรือ Cookie ปรากฏใน Response JSON Body หรือใน Server Logs
3. **JWT Validation:**
   - หากส่ง JWT ที่ลายเซ็น (Signature) ผิด, `iss` ผิด, `aud` ผิด หรือไม่มี Cookie แนบมา ต้องตอบ `401` เสมอ (ดู Error Matrix ใน API Contract)
4. **Failed Login Handling:**
   - หาก Login ผิด ระบบต้อง **ไม่ระบุ** ว่า Username/Email หรือรหัสผ่านกันแน่ที่มีปัญหา (ตอบ `401 AUTH_INVALID_CREDENTIALS` เหมือนกันหมด)
   - บันทึก Audit Log `user.login_failed` (ต้องไม่เก็บ Username/Email ดิบที่กรอกผิดลงไป เพราะเป็น PII)
5. **Inactive Account & Immediate Role Effect:**
   - ผู้ใช้ที่มีสถานะ `is_active=false` จะ Login ไม่ได้
   - **Immediate Effect:** ในทุกการเรียก API ตรวจสอบสิทธิ์ ระบบต้องอ่านค่า `is_active` และ Role จาก Database เสมอ (ห้ามดูแค่ใน JWT) หากถูกเปลี่ยน Role หรือ Deactivate ขณะที่ยังมี Session เดิมอยู่ ต้องบังคับใช้สิทธิ์ใหม่ หรือตัด Session ทันที (`401 AUTH_SESSION_INVALID`)
6. **Session Expiry & Revocation:**
   - Token ที่หมดอายุแล้ว หรือ Session ถูกตั้ง `is_revoked=true` ต้องตอบ `401 AUTH_SESSION_INVALID`
   - เมื่อผู้ใช้ทำการ Logout สำเร็จ (`POST /api/auth/logout`) ต้องบันทึก Audit Log action: `user.logout` เสมอ
7. **Change Password Lifecycle (Self-change):**
   - การเรียกเปลี่ยนรหัสผ่านด้วยตนเอง ต้องส่ง `current_password` มาด้วยเสมอ
   - หาก `current_password` ผิด ต้องตอบ `400 AUTH_CURRENT_PASSWORD_INVALID`
   - เมื่อเปลี่ยนรหัสผ่านสำเร็จ **ต้อง Revoke Sessions เดิมทั้งหมด** ของผู้ใช้คนนั้น (รวมถึงตัวเอง) เพื่อบังคับให้ล็อกอินใหม่
8. **Admin User Management & Safety Guard:**
   - `Admin` สามารถสร้าง User ใหม่ ระงับบัญชี และเปลี่ยน Role ได้
   - **Password Policy:** Admin สร้าง User ใหม่ต้องใช้ Password Policy เดียวกับ Self-change (ยาว 12-128 ตัวอักษร)
   - หาก Operator หรือ Viewer พยายามเรียกใช้ Endpoints กลุ่ม `/api/admin/users/*` ต้องถูกปฏิเสธด้วยสถานะ `403 AUTH_FORBIDDEN` ทันที
   - **Deactivate → Revoke:** เมื่อตั้ง `is_active=false` ให้ผู้ใช้ ระบบต้อง Revoke ทุก Session ของผู้ใช้เป้าหมายทันทีแบบ Atomic (ภายใน Transaction เดียวกัน)
   - **Reactivate ≠ Restore Session:** เมื่อเปิดบัญชีกลับมา (`is_active=true`) ห้ามคืน Session เก่า ผู้ใช้ต้อง Login ใหม่
   - **Fallback Prevention:** ระบบต้องปฏิเสธ (`409 AUTH_LAST_ADMIN_PROTECTED`) การ Demote หรือ Deactivate บัญชี Admin หากนั่นคือ Admin ที่ `is_active=true` คนสุดท้ายของระบบ
9. **Role Restrictions Enforcement:**
   - การเข้าถึง API ที่ผู้ใช้ไม่มีสิทธิ์ (เช่น Viewer เข้าไปแก้ Config) ระบบต้องตอบ `403 AUTH_FORBIDDEN` และต้องบันทึก Audit Log action: `auth.permission_denied` เสมอ
   - `Viewer` ไม่สามารถสร้าง/แก้ไข Device, CIS, Settings (ตามที่ระบุใน Permission Catalog)
   - `Operator` ไม่สามารถดึง Secret ดิบออกจาก Credential Profile ได้ (ระบบ API ห้ามคืนค่า Plaintext กลับมาเด็ดขาด)
10. **Rate Limiting:**
    - ระบบอนุญาตให้พยายาม Login ล้มเหลวได้สูงสุด 5 ครั้งต่อ **Client IP** ภายใน 15 นาที หากกระทำ**ครั้งที่ 6** ระบบต้องปฏิเสธคำขอจาก Client IP นั้นทันที (ตอบ `429 AUTH_LOGIN_RATE_LIMITED`)
    - ระบบจะนับ Identifier (Username/Email) ควบคู่ด้วยโดยแปลงเป็น HMAC ก่อนเก็บลง Cache เพื่อใช้ทำ Alert หรือจำกัด Threshold ที่สูงกว่า
    - ระบบจะปลดล็อกอัตโนมัติเมื่อครบ 15 นาที
11. **CORS / Origin Protection:**
    - ระบบปฏิเสธคำขอประเภท State-changing (`POST`, `PUT`, `PATCH`, `DELETE`) ที่มาจาก `Origin` ที่ไม่อยู่ใน Allowlist (ตอบ `403 AUTH_ORIGIN_REJECTED`)
12. **Audit Log Data Integrity:**
    - เหตุการณ์ต้องระบุ `action` (ใช้ Canonical Action Names: `user.login_success`, `user.login_failed`, `user.logout`, `user.password_changed`, `user.created`, `user.updated`, `user.deactivated`, `auth.permission_denied`) และ `resource_type`
    - ระบบเก็บข้อมูลลงตารางกลางด้วยคอลัมน์ `user_id`, `created_at` แต่ตอนตอบกลับ API `/api/audit-logs` จะต้อง Map ชื่อเป็น `actor_user_id` และ `occurred_at` เสมอ
    - กรณีที่เข้าถึงโดยไม่ทราบตัวตน (เช่น Login ผิดพลาดของ Hacker) ค่า `actor_user_id` และ `resource_id` จะต้องยอมรับค่า **NULL** ได้
13. **Environment Policy (Test Users):**
    - ข้อมูลผู้ใช้ทดสอบ (Seed Test Users) ทั้ง 3 Roles จะถูกสร้างตามไฟล์ `07_Test Users and Environment Policy.md`
    - ถ้ารันคำสั่ง Seed บน `APP_ENV=production` หรือ `APP_ENV` ว่าง/ไม่มีค่า โปรแกรม Seed ต้อง `exit non-zero` ทันที
    - ถ้า Environment Variable สำหรับ Password ว่างหรือไม่ผ่าน Policy (สั้นกว่า 12 ตัวอักษร) โปรแกรม Seed ต้อง `exit non-zero` ทันที
14. **Failed Login Target Binding:**
    - หากมีการพยายาม Login เข้าบัญชีที่มีอยู่จริงแต่รหัสผ่านผิด Audit Log ต้องบันทึกว่า `actor_id = null` (เนื่องจากผู้กระทำยังยืนยันตัวไม่ได้) แต่ต้องบันทึก `resource_id` เป็น ID ของบัญชีเป้าหมายนั้น
15. **Dashboard Recent Activity Redaction:**
    - การดึงข้อมูลผ่าน API `/api/dashboard/recent-activity` หากเหตุการณ์นั้นมี `actor_user_id = null` ข้อมูลที่ตอบกลับต้องแสดงคำว่า `Unknown` แทน
    - ต้องไม่มีการหลุด PII หรือข้อมูลลับใดๆ ทั้งสิ้น (ได้แก่: ห้ามแสดง IP Address, ห้ามแสดง User-Agent, ห้ามแสดง Error Detail, ห้ามแสดง Secret, ห้ามแสดง Full Audit Description)
16. **Password Change Atomic Rollback:**
    - หากระบบสามารถ Update Password Hash และ Revoke Sessions ได้สำเร็จ แต่ไม่สามารถเขียน Audit Log ลง Database ได้ ระบบจะต้อง Rollback การกระทำทั้งหมดใน Transaction นั้น กลับสู่สถานะเดิม และตอบ `500 Internal Server Error`
17. **Concurrent Last-Admin Lock:**
    - หาก Admin 2 คน พยายามทำการ Deactivate หรือ Demote อีกฝ่ายหนึ่ง **ในเวลาเดียวกัน** ระบบจะต้อง Serialize การทำงานด้วย Database Lock และต้องมีอย่างน้อยหนึ่งคนที่ถูกปฏิเสธด้วย `409 AUTH_LAST_ADMIN_PROTECTED` เพื่อให้ระบบเหลือ Admin ที่ `is_active=true` อย่างน้อย 1 คนเสมอ
18. **Audit Writer Registry Rules:**
    - ฟังก์ชัน `record_auth_event()` ต้องรับข้อมูลเพียง 4 พารามิเตอร์ และสามารถหาค่า `result`, `safe_error_category` และ `created_at` ออกมาเขียนลง DB ได้อย่างถูกต้องตาม Mapping Table
    - หากมีการเรียก `record_auth_event()` โดยใส่ Action ที่ไม่ได้อยู่ใน Canonical Action Names (เช่น ส่ง Action ของระบบ Device) ฟังก์ชันต้อง Reject และโยน Exception ทันที
19. **Topology View `[P2 Integration Test]`:**
    - *หมายเหตุ: นำไปทดสอบในระยะ P2 เท่านั้น ไม่บังคับสำหรับการส่งมอบ P1*
    - `Viewer` สามารถดู Topology (NTV) ได้
    - `Viewer` พยายามเรียก `POST collection` หรือ `PATCH position` ของ NTV จะต้องได้สถานะ `403 Forbidden`
