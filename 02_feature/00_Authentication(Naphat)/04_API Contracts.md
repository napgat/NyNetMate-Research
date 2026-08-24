# API Contracts - Authentication

เอกสารนี้รวบรวม Endpoint ที่เกี่ยวกับระบบ Authentication สำหรับ MyNetMate P1

## 1. Candidate API Contract

| HTTP Method | Endpoint | สิทธิ์ (Role) ที่เข้าถึงได้ | ผลลัพธ์ / การทำงานหลัก |
| :---: | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public (ทุกคน) | ตรวจสอบข้อมูล Login, ตั้งค่า JWT Cookie (`HttpOnly`), คืนค่าข้อมูล User ปัจจุบันเบื้องต้น |
| `POST` | `/api/auth/logout` | Authenticated (ทุก Role) | ลบ/Revoke Session ปัจจุบันใน Database, เคลียร์ Cookie บนเบราว์เซอร์ |
| `GET`  | `/api/auth/me` | Authenticated (ทุก Role) | คืนค่า `id`, `username`, `email`, `role`, และสิทธิ์การใช้งาน (Permissions) ของตัวเอง |
| `POST` | `/api/auth/change-password` | Authenticated (ทุก Role) | ผู้ใช้งานเปลี่ยนรหัสผ่านของตัวเอง |
| `GET`  | `/api/admin/users` | Admin | คืนค่ารายชื่อ User (ไม่คืนค่า Password Hash เด็ดขาด) |
| `POST` | `/api/admin/users` | Admin | สร้างผู้ใช้ใหม่ พร้อมกำหนด Temporary Password ให้ |
| `PATCH`| `/api/admin/users/{user_id}`| Admin | เปลี่ยน Role, หรือปรับสถานะเปิด/ปิดบัญชี (`is_active`) |
| `POST` | `/api/admin/users/{user_id}/reset-password`| Admin | Admin รีเซ็ตรหัสผ่านแบบกำหนด Temporary Password ให้เองโดยตรง (ไม่ใช่อีเมล) |
| `GET`  | `/api/audit-logs` | Admin | เรียกดู Audit Log พร้อมระบบ Filter และ Pagination |

*(หมายเหตุ: ระบบ Audit Log ควรรวมอยู่ในฟีเจอร์ Audit Trail เป็นหลัก แต่ในเอกสารนี้ระบุไว้เพื่อให้เห็นว่ามีสิทธิ์ Admin เป็นตัวควบคุม)*

## 2. Standard Error Codes (รหัสข้อผิดพลาดมาตรฐาน)

สำหรับ Endpoint ทางด้าน Auth จะใช้ Error Code มาตรฐานดังนี้:

- `401 AUTH_INVALID_CREDENTIALS` : Username หรือรหัสผ่านไม่ถูกต้อง (ห้ามบอกชัดเจนว่าตัวไหนผิด)
- `401 AUTH_SESSION_EXPIRED` : Token หมดอายุ หรือถูก Revoke แล้ว (ผู้ใช้ต้อง Login ใหม่)
- `403 AUTH_PERMISSION_DENIED` : ไม่มีสิทธิ์เข้าถึง Endpoint นี้ (ระบบจะบันทึกลง Audit Log)
- `423 AUTH_ACCOUNT_INACTIVE` : บัญชีนี้ถูกระงับการใช้งาน (แสดงผลหน้าจอทั่วไปว่าเป็นปัญหาการล็อกอิน)
- `429 AUTH_LOGIN_RATE_LIMITED` : พยายาม Login ถี่เกินไป (ป้องกัน Brute-force)

## 3. Security Considerations (ข้อควรพิจารณาเพิ่มเติม)
- **CORS / CSRF Policy:**
  - จะต้องจำกัด Origin (CORS) สำหรับ Endpoint ที่มีการเปลี่ยนแปลงสถานะ (State-changing) ให้เฉพาะ Frontend ที่อนุญาตเท่านั้น
  - อาศัย Cookie Policy แบบ `SameSite=Lax` เป็นด่านหน้าในการลดความเสี่ยง CSRF
