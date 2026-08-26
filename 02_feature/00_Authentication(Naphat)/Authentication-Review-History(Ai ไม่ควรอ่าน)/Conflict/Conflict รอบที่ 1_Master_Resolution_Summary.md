# Master Resolution Summary (Lean MVP P1)

เอกสารนี้สรุปข้อตกลงและแนวทางการแก้ไข (Resolution) จากการนำข้อเสนอแนะของ GPT Architect (9 ข้อ) มาวิเคราะห์ร่วมกับข้อจำกัดด้านเวลาของการทำโปรเจกต์จบ (MVP) เพื่อให้ทีมสามารถพัฒนาระบบได้อย่างรวดเร็วและปลอดภัยที่สุด

เป้าหมายหลัก: **"ตัดฟีเจอร์ที่ไม่จำเป็นออก เพื่อลดความซับซ้อน แต่ยังคงสถาปัตยกรรมความปลอดภัยที่สำคัญไว้"**

---

### สรุปมติการแก้ไขทั้ง 9 ข้อ

#### 1. Source of Truth กลางยังไม่ถูก reconcile จริง
- **มติ:** ฝั่ง Auth จะปรับลดความซับซ้อนลงเพื่อพบกันครึ่งทางกับ Central Schema
- **Action:** เพิ่มตาราง `auth_sessions` (เพื่อใช้เตะแฮกเกอร์) และใช้ `Argon2id`
- **ตัดทิ้ง:** ตัดคอลัมน์ `must_change_password`, `outcome`, และ `metadata` ทิ้ง เพื่อลดภาระฝั่ง Database (ลด Scope)

#### 2. Case-insensitive login ยังขัดกับ Database constraint
- **มติ:** ไม่แก้ Database ให้ซับซ้อน (ไม่ใช้ `CITEXT`) แต่บังคับใช้กฎที่ Backend
- **Action:** Backend ต้องแปลง Identifier เป็นตัวพิมพ์เล็ก (Lowercase) เสมอก่อนบันทึกหรือค้นหา
- **Action:** **ห้ามมีเครื่องหมาย `@` ใน Username** เพื่อป้องกันการชนกัน (Collision) กับ Email

#### 3. `must_change_password` ยังไม่มี Backend Enforcement Contract
- **มติ:** **ตัดฟีเจอร์นี้ทิ้งทั้งระบบ**
- **เหตุผล:** เราตกลงกันว่าจะไม่มีฟีเจอร์ "Admin ตั้งรหัสผ่านชั่วคราวให้ลูกน้อง" ใน MVP เราจะใช้วิธี Seed ข้อมูลทดสอบเอา ดังนั้นจึงไม่ต้องเหนื่อยเขียน Backend Middleware ดัก API

#### 4. API contract ยังขาดข้อมูล implement
- **มติ:** ยอมรับข้อติชม และจะอัปเกรดเอกสาร `04_API Contracts.md` ให้สมบูรณ์
- **Action:** จะเพิ่มรายละเอียด JSON Schema (DTO), HTTP Status Codes (200, 201, 204), กฎ Validation, และรายละเอียดภายใน JWT Payload ให้โปรแกรมเมอร์นำไปเขียนโค้ดต่อได้ทันที (โดยตัด API รีเซ็ตรหัสผ่านทิ้งไปตามข้อ 3)

#### 5. Admin ไม่ควรอ่าน Credential Secret เดิมได้
- **มติ:** เห็นด้วย 100% ว่ารหัสผ่านอุปกรณ์ต้องเป็น Write-Only
- **Action:** แก้ไข Permission Catalog (`credential.manage`) ให้ Admin ทำได้แค่ "สร้าง, อัปเดตข้อมูลอื่น, เซ็ตรหัสผ่านใหม่ (Overwrite), หรือลบ" เท่านั้น **ระบบ API จะไม่คืนค่า Secret (Plaintext) กลับมาให้ UI เด็ดขาด**

#### 6. Password/session lifecycle ยังคลุมเครือ
- **มติ:** ความซับซ้อนหายไปเยอะมากเพราะเราตัด Admin Reset Password (ข้อ 3)
- **Action:** เหลือแค่กรณีเปลี่ยนรหัสผ่านตัวเอง (Self-change password) ซึ่งเมื่อทำสำเร็จ ระบบจะ Revoke Session อื่นๆ ทั้งหมด และบังคับให้ผู้ใช้กลับไปล็อกอินใหม่

#### 7. Audit contract ยังมี nullability conflict
- **มติ:** ยอมรับว่าตอนล็อกอินผิดพลาด จะไม่มี User ID ให้บันทึก
- **Action:** ในฐานข้อมูล `user_id` และ `resource_id` จะต้องเป็น **Nullable** 
- **Action:** เนื่องจากเราตัดฟิลด์ `outcome` ไปแล้ว (ข้อ 1) เราจะใช้การบันทึก `action="user.login_failed"` ร่วมกับ `user_id=null` แทน

#### 8. Rate limit ยังทดสอบไม่ได้ (ไม่มีตัวเลขตายตัว)
- **มติ:** กำหนดตัวเลขตายตัว (Magic Number) สำหรับ MVP
- **Action:** ล็อกอินผิด **5 ครั้ง ภายใน 15 นาที** จะถูกบล็อก (ปลดล็อกอัตโนมัติเมื่อครบ 15 นาที)
- **Action:** บล็อกทั้งระดับ Client IP และ Username/Email โดยฝั่ง Backend ต้องนำ Identifier ไปทำ Hash (HMAC) ก่อนเก็บใน Cache เพื่อป้องกัน PII รั่วไหล

#### 9. Test users ยังไม่มีแผนสร้างจริง
- **มติ:** เป็น Best Practice ที่ต้องทำ เพื่อไม่ให้ Hardcode รหัสผ่าน
- **Action:** สร้างไฟล์ `07_Test Users and Environment Policy.md` แยกออกมา
- **Action:** กำหนดชื่อ Role ตายตัว (`demo_admin`, `demo_operator`, `demo_viewer`) และรับรหัสผ่านจาก Environment Variable
- **Action:** สคริปต์นี้ต้องมี **Production Guard** (ถ้ารันสคริปต์นี้บน `APP_ENV=production` เซิร์ฟเวอร์ต้อง Crash ทันทีเพื่อป้องกันความเสี่ยง)
