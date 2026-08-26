### 9. Test users ยังไม่มีแผนสร้างจริง

มีเพียง policy แต่ยังไม่มี:

- Username ของสาม role
- Environment variable names
- Seed command/condition
- Idempotency
- Production guard

แนะนำสร้าง `07_Test Users and Environment Policy.md` เช่น:

- `demo_admin`
- `demo_operator`
- `demo_viewer`
- รหัสผ่านจาก `MYNETMATE_SEED_ADMIN_PASSWORD` เป็นต้น
- Seed ทำงานเฉพาะ `APP_ENV=development|test`
- Production ต้องปฏิเสธการ startup หากเปิด seed users



> **📝 สรุปมติที่ตกลงแล้ว (ข้อ 1 - 8):**
> 1. **Login:** Case-insensitive และ ห้ามมี `@` ใน Username
> 2. **Backend Enforcement:** Backend บล็อก API ทุกตัวที่ไม่มีสิทธิ์ (ห้ามพึ่งแค่ Frontend)
> 3. **ลด Scope MVP:** ตัด Admin Reset, Temp Password, และ `must_change_password`
> 4. **Session Lifecycle:** มีแค่เปลี่ยนรหัสผ่านตัวเอง (Self-change) -> Revoke อุปกรณ์อื่น -> ล็อกอินใหม่
> 5. **Audit Contract (Lean):** ตัด `outcome` ใช้ชื่อ `action` แทน และยอมให้ ID เป็น `NULL`
> 6. **Rate Limit:** ล็อกอินผิด 5 ครั้งใน 15 นาที บล็อก IP+Username (ใช้ HMAC ซ่อนข้อมูล)

---

### วิเคราะห์ข้อ 9: Test users ยังไม่มีแผนสร้างจริง (ต้องทำเอกสารเพิ่ม)

**ปัญหานี้คืออะไร?**
ที่ผ่านมาเราเขียนในเอกสารแค่หล่อๆ ว่า *"ต้องใช้ข้อมูลทดสอบ (Seed) เฉพาะตอน Development เท่านั้นนะ และรหัสผ่านห้าม Hardcode"* 
แต่ GPT มองว่าถ้าส่งให้โปรแกรมเมอร์ทำ โปรแกรมเมอร์จะชะงักทันที เพราะไม่รู้ว่าจะต้องตั้งชื่อ User ว่าอะไร? ใช้ตัวแปรชื่ออะไร? และรันคำสั่งไหน?

นี่คือหัวข้อที่บอกว่าเราทำงานระดับ **DevSecOps** จริงๆ ครับ ผมเห็นด้วย 100% ว่าควรสร้างไฟล์ **`07_Test Users and Environment Policy.md`** แยกออกมา เพื่อบอก "สูตรสำเร็จ" ให้เพื่อนโปรแกรมเมอร์เอาไปเขียนสคริปต์ (Seed Script) ตามนี้ครับ:

1. **ชื่อบัญชีและตัวแปรแวดล้อม (Env Vars):** กำหนดให้เป๊ะไปเลย
   - Role Admin: `demo_admin` (รับรหัสผ่านจาก `MYNETMATE_SEED_ADMIN_PASSWORD`)
   - Role Operator: `demo_operator` (รับรหัสผ่านจาก `MYNETMATE_SEED_OPERATOR_PASSWORD`)
   - Role Viewer: `demo_viewer` (รับรหัสผ่านจาก `MYNETMATE_SEED_VIEWER_PASSWORD`)

2. **Idempotency (รันซ้ำได้ไม่พัง):** 
   - สคริปต์นี้ต้องเขียนแบบเช็คก่อนสร้าง (เช่น `IF NOT EXISTS`) หมายความว่าถ้าเผลอกดรันคำสั่งสร้าง User ซ้ำ 10 รอบ ฐานข้อมูลก็ต้องไม่พัง และไม่สร้าง User เบิ้ลซ้ำซ้อน

3. **Production Guard (ยามเฝ้าโปรดักชัน):** 
   - เราต้องเขียนดักในโค้ดว่า ถ้าระบบกำลังรันบนโหมดของจริง (`APP_ENV=production`) แล้วมีคนเผลอไปรันคำสั่ง Seed ยัด User ทดสอบเหล่านี้เข้าไป **เซิร์ฟเวอร์ Backend จะต้อง Crash และปฏิเสธการทำงาน (Shut down) ทันที** เพื่อป้องกันระบบโดนแฮกผ่านรหัสผ่านทดสอบที่หลุดรอดไป

### สิ่งที่เราต้องทำ
เดี๋ยวในขั้นตอนอัปเดตเอกสารทั้งหมด ผมจะสร้างไฟล์ที่ 7 คือ **`02_feature/00_Authentication(Naphat)/07_Test Users and Environment Policy.md`** ขึ้นมาใหม่ เพื่อใส่ข้อมูลตัวแปรและกฎพวกนี้ให้เพื่อนที่ทำ Backend ก๊อปปี้ไปตั้งค่าได้เลยครับ
