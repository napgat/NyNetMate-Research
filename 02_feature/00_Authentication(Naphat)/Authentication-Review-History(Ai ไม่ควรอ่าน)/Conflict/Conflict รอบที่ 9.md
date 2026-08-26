# สรุปการ Reconcile Shared Contract ขั้นสูงสุด (รอบที่ 9)

เอกสารนี้สรุปการปิดช่องโหว่ระหว่าง 3 ระบบ (Auth, D&M, Central Schema) ตาม Feedback ที่ถูกต้องและแม่นยำของ GPT Architect

สถานะปัจจุบัน: **Pending Central Schema + D&M/Audit shared-contract approval**

---

## 🛑 1. Audit Writer Signature & Data Flow (ไฟล์ 03)
- เปลี่ยนชื่อฟังก์ชันจาก `record_event()` เป็น **`record_auth_event()`** (Auth-only wrapper) 
- ฟังก์ชันนี้ **รับเพียง 4 พารามิเตอร์** จาก Caller (เช่น หน้า Login): `action`, `resource_type`, `resource_id`, `actor_id`
- ฟังก์ชันจะทำหน้าที่เป็น Registry Map โดยดึงค่า `result`, `safe_error_category` และ `created_at` ออกมาจาก Canonical Mapping Table เองอัตโนมัติ
- **Reject Unknown Action:** หากมี Caller เผลอส่ง Action ที่ไม่ได้อยู่ในตาราง (เช่น เผลอส่ง Event ของระบบ Device เข้ามา) `record_auth_event()` จะโยน Exception ทันที เพื่อป้องกันข้อมูลขยะ

## 🛑 2. DTO Name Translation (ไฟล์ 03, 04, 05)
แก้ปัญหาความสับสนของชื่อตัวแปรที่ใช้ไม่เหมือนกันในแต่ละ Layer โดยกำหนดตาราง Mapping ชัดเจน:
- **ชั้น Auth Caller:** ส่งเป็น `actor_id`
- **ชั้น Database Storage:** บันทึกลงตารางกลางเป็น `user_id` และ `created_at` (ตาม Central Schema)
- **ชั้น Consumer API (D&M / Auth API):** แปลงกลับเป็น `actor_user_id` และ `occurred_at` เสมอก่อนส่งออกไปที่ Response DTO

## 🛑 3. Central Schema Delta (ไฟล์ 02)
- อัปเดตรายการขอแก้ Central Schema ข้อ 7 ให้ละเอียดถึงระดับ Constraint:
  `result VARCHAR(20) NOT NULL CHECK (result IN ('success', 'failure'))`
  `safe_error_category VARCHAR(100) NULL`

## ✅ 4. อัปเดต Acceptance Tests (ไฟล์ 05)
- **Test 12 (Data Integrity):** บังคับใช้กฎการ Map ชื่อ DTO จาก `user_id/created_at` ไปเป็น `actor_user_id/occurred_at` ตอนตอบ API
- **Test 15 (Redaction):** เพิ่มการเช็คว่าต้องไม่มี `Secret` หรือ `Full Audit Description` หลุดออกมาด้วย (ให้ตรงกับ Auth Catalog ทุกคำ)
- **Test 18 (Audit Writer Registry Rules):** ตรวจสอบว่า `record_auth_event()` รับ 4 ตัวแปร, เติมค่าที่เหลือให้ถูกต้อง, และ Reject Action นอกระบบ

---
> [!NOTE]
> ระบบ Authentication ถือว่าเขียน Contract จบสมบูรณ์แล้วจริงๆ การเดินหน้าต่อในระยะ Implementation ต้องรอ 2 อย่าง:
> 1. เจ้าของ **Central Schema** อนุมัติการเพิ่มคอลัมน์และเปลี่ยนประเภทข้อมูล
> 2. เจ้าของ **D&M/Audit** รับทราบและตกลงใช้ DTO Naming + Redaction Policy ตรงกัน


ตรวจแล้วครับ — **รอบ 9 แก้ mismatch หลักจากรอบ 8 ได้จริง** และเป็นรอบแรกที่ Audit contract ภายในเอกสาร Auth สอดคล้องกันพอสมควร

ผ่านจริง:

- เปลี่ยนเป็น `record_auth_event()` แบบ Auth-only และ caller ส่ง 4 arguments ตรงกับ Login/Password flows แล้ว
- Registry map เป็นแบบตายตัว, เติม `result` / safe category / server time เอง และ reject action ของ feature อื่น
- กำหนด storage-to-consumer DTO mapping ชัด: `actor_id → user_id → actor_user_id`, `created_at → occurred_at`
- Central Schema delta ระบุ constraint ของ `result` และ `safe_error_category` แล้ว
- Full Audit API และ Acceptance Tests ใช้ response DTO ใหม่ครบ  
    [Auth wrapper and mapping (line 57)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:57) · [Schema delta (line 11)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/02_Database Schema.md:11) · [Audit API response (line 125)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:125) · [Tests (line 63)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md:63)

ดังนั้นข้อสรุปของ Gemini รอบนี้ **เกือบถูกต้อง**: Auth contract พร้อมในขอบเขตตัวเอง และควรรอ Central Schema + D&M/Audit owner อนุมัติจริงก่อน migration หรือ shared implementation

ยังมี concern ที่ควรเก็บเป็น P1 implementation rule:

1. **Admin user lifecycle ยังไม่ผูก Audit event แบบบังคับ**  
    มี canonical `user.created`, `user.updated`, `user.deactivated` แล้ว แต่ API ยังไม่ระบุชัดว่า Create/PATCH ต้อง emit event ใด และ Deactivate ต้องทำ `update user + revoke sessions + audit` ใน transaction เดียวกัน  
    [Admin API (line 111)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:111) · [Action registry (line 78)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:78)
    
2. **Authorization Guard ต้องล็อก predicate ให้ชัดก่อนเขียนจริง**  
    ควรระบุและทดสอบว่า session query ต้องจับคู่ `JWT.jti = session_id`, `JWT.sub = user_id`, `is_revoked=false`, `expires_at > now()` และอ่าน `is_active`/role ปัจจุบันจาก DB—not only “query ผ่าน session_id”
    
3. **Recent Activity ของทุก role ยังควรมี event allowlist**  
    Redaction ดีแล้ว แต่ Viewer/Operator ยังอาจเห็นเหตุการณ์ security-sensitive เช่น failed login, permission denied หรือ user deactivation ผ่าน Action/Username/Target ได้ ควรกำหนดรายการเหตุการณ์ที่ summary แสดงได้ต่อ role เพิ่มอีกชั้น  
    [Summary permission (line 12)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/06_Permission Catalog.md:12)
    

สรุป: รอบ 9 ปิดข้อขัดแย้งด้าน DTO, audit writer และ schema proposal ได้ถูกทางแล้ว ผมอนุมัติสถานะ **“Pending Central Schema + D&M/Audit shared-contract approval”** ได้ครับ ไม่ควรเรียกว่า migration-ready จนกว่าสอง owner จะรับ contract นี้ร่วมกัน และไม่มีไฟล์ใดถูกแก้จากการตรวจครั้งนี้

2:20 PM