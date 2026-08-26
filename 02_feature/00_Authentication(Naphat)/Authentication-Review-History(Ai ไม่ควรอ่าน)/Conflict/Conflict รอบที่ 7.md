# สรุปการเก็บงานรองและ Audit DTO กลาง (รอบที่ 7)

เอกสารนี้สรุปการแก้ไขเพิ่มเติมตาม Feedback ครั้งล่าสุด เพื่อปิดงานรองที่เหลือทั้งหมดและเชื่อมต่อ Contract กับฝั่ง D&M ให้สมบูรณ์

สถานะปัจจุบัน: **Ready to Implement (Pending ONLY Central Schema approval)**

---

## 🔗 1. Shared Audit Contract & Dashboard Consumer
- **Auth Component Diagram (ไฟล์ 03):** ปรับแก้ `actor_user_id` ให้ถูกต้องตามหลักความปลอดภัย
  - Login ล้มเหลว (รหัสผิด) → ให้ `actor_user_id = null` (เพราะยังไม่ยืนยันตัวตน) และย้าย `user_id` ไปใส่ใน `resource_id` แทน เพื่อกันการสับสน
  - ระบุชัดเจนว่าฟิลด์ `occurred_at` ต้องมีเสมอ
  - ระบุชัดเจนว่าฟิลด์ `result` ถูกคำนวณและเก็บลง DB จริงตอนที่เรียก `record_event()` ไม่ใช่คำนวณตอน query
- **D&M API Contracts (ไฟล์ `01_Dashboard.../04_API Contracts.md`):** นำ Redaction rule ของ Auth ไปบังคับใช้ในฝั่ง Dashboard ด้วย
  - หาก `actor_user_id` เป็น null → บังคับให้ Dashboard ส่งกลับว่า `"Unknown"` ห้ามพยายามดึง identifier ดิบที่ User กรอกผิดมาแสดง
- **Permission Catalog (ไฟล์ 06):** เพิ่มกฎ `"Unknown"` เข้าไปในสิทธิ์ `activity.read_summary`

## 🛡️ 2. Transaction & Database Locks
- **Password Change (ไฟล์ 04):** ระบุชัดเจนว่าการกระทำ 3 อย่าง (Update Hash, Revoke Sessions, บันทึก Audit Log `user.password_changed`) ต้องทำแบบ Atomic ภายใน Transaction เดียวกัน
- **Last-Admin Guard (ไฟล์ 04):** ระบุชัดเจนว่าการตรวจสอบ 409 Conflict เพื่อป้องกันการ Deactivate/Demote Admin คนสุดท้าย จะต้องใช้ Database Lock (เช่น `SELECT ... FOR UPDATE`) หรือระดับ Serializable Transaction เพื่อป้องกัน Race condition

## 🔧 3. เก็บงานย่อยอื่นๆ
- **Seed Policy (ไฟล์ 07):** ลบคำว่า `NODE_ENV / ENVIRONMENT` ออก บังคับให้ใช้ชื่อ `APP_ENV` เพียงชื่อเดียว เพื่อความสม่ำเสมอกับ Acceptance Tests
- **Error Matrix (ไฟล์ 04):** เพิ่ม Error Code ที่ตกหล่น:
  - `409 AUTH_USER_ALREADY_EXISTS` (กรณี Username/Email ซ้ำ)
  - `404 AUTH_USER_NOT_FOUND` (กรณีอ้างอิง User ID ที่ไม่มีอยู่จริง)

---
> [!NOTE]
> ปัญหาเรื่องชื่อไฟล์ `รอบที่ 5` กับ `รอบที่ 6` ถูกแก้ไขไปแล้วในรอบก่อนหน้า (กู้คืนไฟล์รอบ 5 และสร้างไฟล์รอบ 6 แยกต่างหากเรียบร้อยแล้ว) ปัจจุบันเอกสาร Auth ถือว่า **สมบูรณ์ในขอบเขตของตัวเองแล้ว** เหลือเพียงแค่รอการอนุมัติ Database Schema จากเจ้าของ Central Schema เท่านั้น


รอบ 7 **แก้จริงและแก้ถูกจุดหลายเรื่อง** โดยเฉพาะการแก้ attribution ของ failed login, Dashboard `Unknown`/redaction, transaction ของเปลี่ยนรหัสผ่าน, last-admin lock, seed `APP_ENV` เดียว และ error code เพิ่มเติม

- Failed login ที่รหัสผิดไม่อ้างผู้ใช้เป้าหมายเป็น actor แล้ว — ถูกต้อง  
    [Actor policy (line 68)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:68)
- D&M รับ `activity.read_summary` และ redaction/`Unknown` แล้ว — เป็นความคืบหน้าจริง  
    [D&M Recent Activity API (line 6)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat\)/04_API Contracts.md:6)
- Password change เป็น transaction เดียว และ last-admin guard ระบุ locking แล้ว  
    [Auth API contracts (line 79)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:79)

แต่ผมยังไม่เห็นด้วยกับสถานะ **“Pending ONLY Central Schema approval”** ครับ สถานะที่ถูกต้องคือ:

> **Pending Central Schema + D&M/Audit shared-contract approval**

เหตุผลหลักคือ Shared Audit DTO ยังไม่ reconcile จริง:

- Auth บอกว่า `record_event()` จะคำนวณและ “เขียน `result` ลง DB” แต่ Central `audit_logs` ยังไม่มี `result` หรือ `safe_error_category`
- Function signature ไม่มี `safe_error_category` ทั้งที่บอกว่าจะส่งให้ D&M
- Auth ใช้ `actor_user_id` / `occurred_at` แต่ Central และ Full Audit API ยังใช้ `user_id` / `created_at`
- Auth เองยังเขียนว่า “ต้องรอ D&M รับ contract นี้” อยู่  
    [Auth interop note (line 94)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:94) · [Central audit schema (line 517)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Data Information.md:517) · [D&M required fields (line 805)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat\)/02_Database Schema.md:805)

จุดนี้ไม่ใช่แค่ wording: ต้องตัดสินใจให้ชัดว่า

- `result` และ `safe_error_category` จะเก็บใน Central Audit จริง หรือคำนวณตอนอ่าน
- `actor_user_id` เป็นชื่อ DTO ที่ map จากคอลัมน์ `user_id` เดิม หรือจะ rename schema
- `occurred_at` map กับ `created_at` อย่างไร
- action ที่ไม่รู้จักต้องถูก reject; ไม่ควรใช้กฎ string matching แล้ว default เป็น `success`

อีกจุดเล็กที่ยังไม่ตรงกันคือ Auth catalog ห้ามเผย `Error Detail` และ `Full Audit Description` แต่ D&M API ระบุห้ามเพียง IP, User-Agent และ Secret จึงควรยก redaction rule ให้ตรงกันทุกคำ  
[Auth redaction policy (line 12)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/06_Permission Catalog.md:12)

ก่อนเรียก Ready-to-Implement ควรเพิ่ม Acceptance Tests สำหรับ:

- failed login ของบัญชีที่มีอยู่: `actor_user_id=null`, แต่ target อยู่ใน `resource_id`
- `result` / safe error category และ Dashboard `Unknown`/redaction
- password-change rollback เมื่อ audit write ล้มเหลว
- Admin สองคน demote/deactivate พร้อมกันแล้วระบบยังเหลือ active Admin อย่างน้อยหนึ่งคน

สรุป: **รอบ 7 เป็นรอบที่แก้ได้มีคุณภาพและใกล้เสร็จจริงที่สุด** แต่ยังเหลือ shared audit contract ที่ต้องให้ Central Schema owner และ D&M owner ยืนยันร่วมกัน จึงยังไม่ควรบอกว่าเหลือเพียง Central Schema อย่างเดียวครับ