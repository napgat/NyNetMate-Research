API contract ยังขาดข้อมูล implement

[04_API Contracts.md (line 5)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:5) ยังไม่มี:

- Request/response schema ราย endpoint
- HTTP success status เช่น `200`, `201`, `204`
- Login/profile/user DTO
- Pagination/filter parameters
- Cookie flags `HttpOnly`, `Secure`, `SameSite`
- JWT claim valuesของ `iss`, `aud`, `sub`, `jti`, `iat`, `exp`
- Rate-limit threshold และช่วงเวลา
- Validation สำหรับ username/email/role

ดังนั้นคำว่า “ข้อมูลพร้อม Implement” ยังเร็วเกินไป


ประโยคที่ GPT บอกว่า **"ข้อมูลพร้อม Implement ยังเร็วเกินไป"** แปลภาษาคนง่ายๆ คือ: 
> **"เอกสารที่คุณเขียนมาเนี่ย มันเป็นแค่ 'เมนูอาหาร' แต่โปรแกรมเมอร์ต้องการ 'สูตรทำอาหาร' ครับ"**

ตอนนี้เอกสาร `04_API Contracts.md` ของเราบอกแค่ว่ามี API ชื่ออะไรบ้าง (เช่น มี `/api/auth/login`) แต่ถ้าพรุ่งนี้เพื่อนที่เป็นคนทำ Frontend ต้องมาเขียนโค้ดต่อ API เขาจะเกิดคำถาม (เดา) ทันทีว่า:
1. **Request/Response Schema:** "ตอนส่งข้อมูล Login ต้องส่งชื่อตัวแปรเป็น JSON ว่า `username` หรือ `user` หรือ `identifier`?" และ "ตอนตอบกลับ Backend จะส่งข้อมูลหน้าตาแบบไหนกลับมา?"
2. **HTTP Success Status:** "ถ้า Login สำเร็จ Backend จะตอบรหัส `200 OK` ใช่ไหม? แล้วตอนสร้าง User ใหม่ล่ะ จะตอบ `201 Created` หรือเปล่า?"
3. **Validation:** "ช่อง Username บังคับพิมพ์กี่ตัวอักษร? ห้ามเว้นวรรคไหม?"
4. **Rate Limit:** "ที่บอกว่ากัน Brute-force สรุปว่ายอมให้ล็อกอินผิดได้กี่ครั้ง? (เช่น 5 ครั้งใน 15 นาที)"
5. **JWT Claims:** "ข้างใน Token ซ่อนข้อมูลอะไรไว้บ้าง? ชื่อตัวแปรข้างในเขียนยังไง?"

สรุปคือ GPT ในฐานะซีเนียร์โปรแกรมเมอร์ (Senior Developer) กำลังบ่นว่า **เอกสารยังไม่ละเอียดพอที่จะให้โปรแกรมเมอร์สองคน (Front กับ Back) เอาไปแยกกันเขียนโค้ดโดยไม่ต้องโทรคุยกันครับ**

---

### เราจะจัดการเรื่องนี้ยังไงดี? (Action Plan)

เพื่อให้เอกสารของเราสมบูรณ์แบบระดับ **"พร้อมให้โปรแกรมเมอร์ก๊อปปี้ไปเขียนโค้ดได้เลย (Ready to Implement)"** และเพื่อ **เคลียร์ Scope ที่เราคุยกันไว้ก่อนหน้า (ตัดฟีเจอร์รหัสชั่วคราวทิ้ง)** ผมขอเสนอแผนรวบยอดดังนี้ครับ:

ผมจะทำการเขียนไฟล์ `04_API Contracts.md` ขึ้นมาใหม่ทั้งหมด โดยจะใส่ข้อมูลเหล่านี้ลงไป:
1. **ตัด API ทิ้ง:** ลบ Endpoint `/reset-password` และลบคอลัมน์ `must_change_password` ออกให้หมด (ตามที่เราตกลงกันว่าไม่ทำ)
2. **ใส่รายละเอียด JSON (DTO):** เขียนโครงสร้าง JSON Request/Response ให้เห็นชัดๆ ว่าต้องส่งตัวแปรชื่ออะไร
3. **ใส่ Status Code:** ระบุ `200`, `201`, `204` ให้ครบ
4. **ใส่ Validation & Rate Limit:** ระบุกฎ (เช่น ห้ามมี `@` ใน Username, Login ผิดได้ 5 ครั้งใน 15 นาที)
5. **ใส่ข้อมูล Cookie & JWT:** ระบุธง `HttpOnly, Secure, SameSite=Lax` และข้อมูลใน Payload ให้ชัดเจน

รวมถึงผมจะไปตามลบเรื่องรหัสผ่านชั่วคราวในไฟล์ `03_Component Diagram.md` และ `05_Acceptance Tests.md` ออกให้ด้วย เพื่อให้เอกสารทั้งชุดสอดคล้องกัน 100%

**ให้ผมจัดการ "ล้างไพ่" แล้วอัปเกรดเอกสารชุดนี้ให้เป็นระดับ Pro เลยไหมครับ?** (ใช้เวลาแปปเดียวครับ ผมจะรันคำสั่งแก้ไฟล์ให้ทันที)