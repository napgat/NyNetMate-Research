# สรุปการแก้ไข Conflict และ Blocker (รอบที่ 2)

เอกสารนี้สรุปการดำเนินการปรับปรุงเอกสาร Authentication & RBAC ทั้งหมด (`01` ถึง `07`) เพื่อตอบสนองต่อ Blocker 3 จุด และ Concern อีก 6 ข้อจาก GPT Architect ให้เอกสารมีสถานะ "Ready to Implement 100%" อย่างแท้จริง

---

## 🛑 การแก้ไข Blocker (3 จุดหลัก)

### Blocker 1: Schema ขัดกับ Central Schema แบบรุนแรง (Foreign Key พัง)
- **ปัญหา:** เอกสาร Auth ให้ `id` เป็น `SERIAL` (Integer) แต่ Central Schema เป็น `UUID` รวมทั้งมีความขัดแย้งเรื่อง Email Nullability 
- **การแก้ไข (ที่ไฟล์ 02):**
  - อัปเดต `users.id` และ `auth_sessions.user_id` เป็น `UUID` ทั้งระบบ
  - ปรับ `email` เป็น Optional (เอา `NOT NULL` ออก) ให้ตรงกับ Central Schema
  - เพิ่มโค้ด SQL: `CHECK (username ~ '^[a-z0-9._-]{3,100}$')` เพื่อทำ Regex Guard ระดับฐานข้อมูล
  - ใส่ป้าย `> [!WARNING] PROPOSED SCHEMA CHANGE` ตัวใหญ่ไว้บนสุด เพื่อเตือนสติว่านี่คือ 12 ตารางที่เสนอไปทับ 11 ตารางเดิม

### Blocker 2: P1 User Management มีแต่ใน Scope แต่ไม่มี API Contract
- **ปัญหา:** ไฟล์ 01 ระบุว่า Admin จัดการ User ได้ แต่ไฟล์ 04 ไม่มี Endpoint ให้เรียก
- **การแก้ไข (ที่ไฟล์ 04):**
  - สร้าง Endpoint กลุ่ม `Admin User Management` แบบครบถ้วน: `GET /api/admin/users`, `POST /api/admin/users`, และ `PATCH /api/admin/users/{user_id}`
  - สร้าง Endpoint สำหรับ Audit: `GET /api/audit-logs` เพื่อให้ Admin อ่านประวัติได้จริง

### Blocker 3: JWT/Cookie Contract ขัดกับ Acceptance Test
- **ปัญหา:** Test สั่งให้ตรวจ `iss`/`aud` แต่สเปคไม่มี และ Cookie ขาดกำหนด `Path` ทำให้ส่งไปหา API ฟีเจอร์อื่นไม่ได้
- **การแก้ไข (ที่ไฟล์ 04):**
  - ระบุค่าคงที่ `iss: "mynetmate_api"` และ `aud: "mynetmate_client"` ลงใน JWT Claims
  - บังคับแอตทริบิวต์ `Path=/api` สำหรับ Cookie
  - เพิ่มกฎตอน Logout ว่า "Backend ต้องสั่งลบ Cookie ด้วยแอตทริบิวต์ (Name, Path, Domain, Secure, SameSite) ที่ตรงกับตอนสร้างทุกประการ Browser ถึงจะยอมลบ"

---

## ⚠️ การแก้ไข Concern (6 จุดย่อย)

### Concern 1: ห้ามเชื่อใจ Role ใน JWT เพื่อ Immediate Effect
- **การแก้ไข (ที่ไฟล์ 04 และ 05):** เพิ่มหมายเหตุกำกับอย่างชัดเจนว่า ในทุกๆ Protected Request ฝั่ง Backend **ห้าม** ยึด Role จาก JWT payload อย่างเดียว จะต้องไปอ่าน `is_active` และ Role ปัจจุบันจาก Database/Session เสมอ เพื่อให้การ Deactivate/Change Role มีผลทันที

### Concern 2: Current Password ผิด ไม่ควรตอบ 403
- **การแก้ไข (ที่ไฟล์ 03, 04, 05):** เปลี่ยน Response Status ของกรณีเปลี่ยนรหัสผ่านแล้วใส่รหัสเดิมผิด จาก `403 Forbidden` เป็น `400 AUTH_CURRENT_PASSWORD_INVALID`

### Concern 3: Permission Catalog ยังขาดการครอบคลุมบางจุด
- **การแก้ไข (ที่ไฟล์ 06):**
  - เพิ่มสิทธิ์ `audit.read` สำหรับ Admin
  - บังคับเงื่อนไขในสิทธิ์ `config.read` ว่า หากเป็น Viewer เรียกดู API ต้อง **Redact (เซ็นเซอร์) ข้อมูล Secret ออกจาก Raw Config ก่อนเสมอ** 

### Concern 4: การระบุตัวเลข Rate Limit กำกวม
- **การแก้ไข (ที่ไฟล์ 05):** ปรับคำอธิบายให้ชัดเจนทางคณิตศาสตร์: "ระบบอนุญาตให้พยายาม Login ล้มเหลวได้สูงสุด 5 ครั้ง ภายใน 15 นาที หากกระทำ**ครั้งที่ 6** ระบบต้องปฏิเสธคำขอ (429) ทันที"

### Concern 5: Test Users Script อาจเผลอทับรหัสผ่านเดิม และไม่ปลอดภัยพอ
- **การแก้ไข (ที่ไฟล์ 07):**
  - เปลี่ยนวิธีจาก `UPSERT` เป็น `ON CONFLICT DO NOTHING` เพื่อป้องกันสคริปต์ไปรีเซ็ตรหัสผ่านของผู้ใช้ทดสอบที่เปลี่ยนรหัสตัวเองไปแล้ว
  - เพิ่มกฎแบบ **Fail-Closed**: ถ้าตัวแปร `APP_ENV` เป็นค่าว่างเปล่า (Empty/Null) หรือค่าที่ไม่รู้จัก สคริปต์ต้องทำลายตัวเอง (`exit non-zero`) ทันที ห้ามทำงานต่อ

### Concern 6: หน้าที่ Operator เขียนล้ำขอบเขต P1
- **การแก้ไข (ที่ไฟล์ 01):** ปรับคำอธิบายให้ชัดว่า Operator มีสิทธิ์ "สร้าง Config Plan" เท่านั้น ส่วน "การสั่ง Push Config ลงอุปกรณ์ผ่าน SSH" จะเป็นขอบเขตของระยะ P2 อย่างชัดเจน



