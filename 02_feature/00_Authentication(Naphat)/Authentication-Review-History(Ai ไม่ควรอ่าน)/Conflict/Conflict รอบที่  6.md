ใช่ครับ รอบนี้ **แก้ไขเอกสารหลักจริง** ไม่ใช่แค่สรุปของเก่าแล้ว และสถานะ `Pending shared-contract approval` ในไฟล์ถือว่าถูกต้องกว่าเดิมมาก  
[Conflict รอบที่ 5.md — เนื้อหาเรียกตัวเองว่ารอบ 6 (line 1)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/Conflict/Conflict รอบที่ 5.md:1)

สิ่งที่ปิดได้จริง:

- Banner ระบุ Central Schema delta ครบ 6 ข้อและห้าม migration ก่อน owner อนุมัติ
- Deactivate → revoke ทุก session แบบ atomic; Reactivate ไม่คืน session เก่า
- Password policy ครอบคลุม Admin Create User แล้ว
- Error matrix, 409 last-admin guard, seed password fail-closed, timestamp `NOT NULL` และ Recent Activity redaction ถูกเพิ่มจริง  
    [Schema (line 4)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/02_Database Schema.md:4) · [Admin lifecycle (line 119)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:119) · [Acceptance tests (line 29)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md:29)

ผมให้สถานะตอนนี้เป็น **“Auth-local P1: ผ่านแบบมีเงื่อนไข”** ไม่ใช่ “พร้อมทั้งระบบ 100%” เพราะเหลือ 3 จุดสำคัญ:

1. **Shared Audit Contract ยังไม่ reconcile จริง**  
    Auth มีเพียง `record_event(action, resource_type, resource_id, actor_user_id)` แต่ D&M ต้องการ `occurred_at`, `result` และ `safe error category` เพิ่มด้วย ขณะที่ Central Audit ยังใช้ `user_id` และไม่มี `result`  
    [Auth audit (line 57)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:57) · [D&M requirement (line 799)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat\)/02_Database Schema.md:799) · [Central audit schema (line 512)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Data Information.md:512)
    
    การ derive `result` จาก suffix ของ action เป็นแนวคิด Lean MVP ที่ใช้ได้ แต่ mapping ปัจจุบันยังไม่ครบ: `user.created`, `user.updated`, `user.deactivated` ไม่มี rule ชัดเจน และ `auth.permission_denied` ควรตัดสินใจให้แน่ว่าเป็น `failure` หรือ `denied` นอกจากนี้ต้องระบุว่า `result` ถูกเก็บจริงหรือคำนวณตอน query
    
2. **`actor_user_id` ถูกใช้ผิดความหมายกับ login ล้มเหลวของบัญชีที่มีอยู่**  
    ตอน password ผิด ผู้ร้องขอยังไม่ได้รับการยืนยันว่าเป็นเจ้าของบัญชี จึงไม่ควรบันทึกเป็น actor ของ user นั้น  
    [Login flow (line 22)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:22)  
    ข้อแนะนำ: `actor_user_id = null`; หากต้องการเชื่อมกับบัญชีเป้าหมาย ให้ใช้ `resource_type='user'` และ `resource_id=user_id` โดยไม่เก็บ identifier ดิบ
    
3. **Recent Activity policy ยังอยู่เฉพาะ Auth catalog**  
    Allowlist/redaction ที่เพิ่มมาเป็นทิศทางที่ดีมาก แต่ Dashboard API จริงยังเขียนเพียง “ตาม RBAC policy” จึงต้องให้ D&M รับ contract นี้ไปใช้จริง รวมถึงกรณี actor ไม่ทราบตัวตนให้แสดงเช่น `Unknown` โดยไม่เผย identifier  
    [Auth permission (line 12)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/06_Permission Catalog.md:12) · [D&M API (line 6)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat\)/04_API Contracts.md:6)
    

เก็บงานรองที่ยังเหลือ:

- Password change ควรระบุว่า update hash + revoke sessions + audit event อยู่ transaction เดียวกัน
- Last-admin guard ควร lock/serialize เพื่อกัน Admin สองคน deactivate กันพร้อมกันจนเหลือศูนย์
- Seed policy ยังเขียน `APP_ENV (หรือ NODE_ENV / ENVIRONMENT)` แต่ Acceptance Test ใช้ `APP_ENV` เดียว ควรเลือกชื่อเดียว
- Error matrix ดีขึ้นมาก แต่ยังไม่ครอบคลุม duplicate username/email และ user ID ที่ไม่มีอยู่
- ชื่อไฟล์เป็น “รอบที่ 5” แต่หัวเอกสารเป็น “รอบที่ 6”; ไม่กระทบระบบ แต่ควรจัดให้ตรงกันเพื่อ traceability

สรุป: รอบล่าสุดแก้ได้ถูกจุดและมีความคืบหน้าชัดเจนครับ เหลือการปิด **Audit DTO กลาง, Dashboard consumer contract และ Central Schema approval** เท่านั้นก่อนเรียกว่า Ready-to-Implement ทั้งระบบ โดยไม่มีไฟล์ใดถูกแก้ไขจากการตรวจนี้