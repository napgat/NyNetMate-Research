# สรุปการ Reconcile Shared Contract ขั้นสุดท้าย (รอบที่ 8)

เอกสารนี้สรุปการแก้ไขเพื่อให้ Shared Contract ระหว่างระบบ Auth, Audit (Central Schema) และ Dashboard ตรงกัน 100% 

สถานะปัจจุบัน: **Pending Central Schema + D&M/Audit shared-contract approval**

---

## 🛑 1. การปรับปรุง Audit DTO และ Central Schema
- **Database Schema (ไฟล์ 02):**
  - อัปเดต Warning Banner ให้ระบุชัดเจนว่า **ขอเพิ่มคอลัมน์ `result` และ `safe_error_category` ลงในตาราง `audit_logs` ส่วนกลาง** เพื่อให้รองรับ D&M Requirement ได้จริง
- **Component Diagram (ไฟล์ 03):**
  - ปรับชื่อพารามิเตอร์ของ `record_event()` กลับไปใช้ **`user_id` และ `created_at`** เพื่อให้ตรงกับ Central Schema แบบเป๊ะๆ (แทนการใช้ `actor_user_id` หรือ `occurred_at`)
  - เปลี่ยนจากการ "อนุมาน result จาก string suffix" เป็นการสร้าง **ตาราง Mapping (Canonical Action Names)** แบบตายตัว และระบุว่าถ้ามี action แปลกปลอมหลุดมา ระบบจะต้อง **Reject ทันที**

## 🛑 2. Dashboard Consumer Contract (D&M)
- **D&M API Contracts (ไฟล์ข้ามโฟลเดอร์ `01_Dashboard.../04_API Contracts.md`):**
  - นำกฎ Redaction ของ Auth ไปเขียนทับใน API `/api/dashboard/recent-activity` ให้เหมือนกันทุกคำ: **"หาก actor เป็น null ให้แสดง 'Unknown' ห้ามเผย identifier ดิบ, และห้ามแสดง IP, User-Agent, Error Detail, Secret, หรือ Full Audit Description"**

## ✅ 3. Acceptance Tests ที่เพิ่มเข้ามา (ไฟล์ 05)
- **Failed Login Target Binding:** ล็อกอินรหัสผิด `user_id=null` (เพราะยังไม่รู้ว่าใช่เจ้าของจริงไหม) แต่เอาไอดีบัญชีที่พยายามเข้าใช้ไปใส่ใน `resource_id`
- **Dashboard Recent Activity Redaction:** เช็คเรื่องแสดงคำว่า `Unknown` และต้องไม่มี PII/Error Detail หลุด
- **Password Change Atomic Rollback:** หากเกิดข้อผิดพลาดตอนเขียน Audit Log ระบบจะต้อง Rollback การอัปเดตรหัสผ่านและการเตะ session กลับสู่สภาพเดิม
- **Concurrent Last-Admin Lock:** Admin 2 คนพยายามทำลายบัญชีซึ่งกันและกันพร้อมกัน (Race condition) จะต้องมีอย่างน้อยหนึ่งคนที่โดน 409 เสมอ



ตรวจต่อครบแล้วครับ: รอบ 8 แก้ไขจริงและยกระดับเอกสารได้มาก แต่ยัง **ไม่ reconcile Shared Audit Contract 100%** ตามที่หัวเอกสารอ้าง

สิ่งที่ผ่านจริง:

- เพิ่ม `result` และ `safe_error_category` เป็น Central Schema delta แล้ว
- เปลี่ยนจาก suffix matching เป็น canonical action mapping และ reject action ที่ไม่รู้จัก
- D&M Recent Activity ใช้ redaction rule ตรงกับ Auth แล้ว
- เพิ่ม tests สำหรับ failed-login target binding, redaction, rollback และ concurrent last-admin  
    [Round 8 summary (line 9)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/Conflict/Conflict รอบที่ 8.md:9) · [D&M API (line 6)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat\)/04_API Contracts.md:6)

แต่ยังเหลือ P1 contract gaps ที่ต้องเก็บก่อนเรียก “เสร็จ”:

1. **Audit writer signature ขัดกับ flow**  
    `record_event()` ใหม่บังคับ 7 fields รวม `result`, `safe_error_category`, `created_at` แต่ Login และ Password flows ยังเรียกเพียง 4 arguments  
    [Signature (line 59)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:59) · [Login flow (line 17)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:17)
    
    ข้อแนะนำ Lean P1: ให้ caller ส่ง 4 fields เดิม แล้ว audit registry เติม `result`, safe category และ server timestamp จาก canonical mapping เอง จะปลอดภัยและทำให้ flow ปัจจุบันถูกต้อง
    
2. **ชื่อ DTO ยังไม่เป็นหนึ่งเดียว**  
    Component เปลี่ยนเป็น `user_id` / `created_at` เพื่อให้ตรง Central แต่ D&M ยังใช้ `actor_user_id` / `occurred_at`; Acceptance Test และ Full Audit API ยังใช้ `actor_user_id`  
    [Auth contract (line 70)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:70) · [Acceptance test (line 48)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md:48)
    
    เลือกหนึ่งชื่อกลาง หรือเขียน mapping ให้ชัดว่า storage `user_id`/`created_at` แปลงเป็น consumer DTO `actor_user_id`/`occurred_at` ที่ชั้น API
    
3. **Central Schema ยังเป็น proposal และรายละเอียด migration ไม่พอ**  
    ตอนนี้ระบุเพียง `VARCHAR` สำหรับ `result` และ `safe_error_category` แต่ยังไม่กำหนด nullable, length, allowed values หรือ mapping กับ `created_at` เดิม  
    [Schema delta (line 11)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/02_Database Schema.md:11)  
    แนะนำ `result NOT NULL` พร้อม allowlist `success|failure`; `safe_error_category` เป็น nullable และ allowlist ที่จำกัด
    
4. **Reject unknown action ต้องเป็น Global Catalog หรือ Auth-only wrapper**  
    ตาราง action ปัจจุบันมีเฉพาะ Auth/User แต่ function ยกตัวอย่าง `device` ด้วย หากเป็น shared `record_event()` จริง มันจะ reject Audit events ของ Device, CIS, Config และ Dashboard  
    ทางแก้คือเปลี่ยนเป็น `record_auth_event()` หรือให้ Central Audit Catalog รวม action ของทุก feature
    
5. **Tests ยังขาดบางกรณีที่รอบ 8 เพิ่มเอง**  
    ควรเพิ่ม test ว่า `result`/safe category ถูกเขียนตาม mapping, unknown action ถูก reject, และ redaction ไม่ส่ง Secret หรือ Full Audit Description ด้วย—not only IP/User-Agent/Error Detail
    

สรุปสถานะที่ถูกต้องคือ:

> **Pending Central Schema + D&M/Audit shared-contract approval**

ไม่ใช่ “shared contract ตรงกัน 100%” ในตอนนี้ครับ รอบ 8 ปิด concern สำคัญได้หลายข้อแล้ว เหลือการทำชื่อ DTO, audit writer และ schema delta ให้เป็น contract เดียวกันจริง ๆ เท่านั้น ไม่มีไฟล์ใดถูกแก้ไขจากการตรวจนี้