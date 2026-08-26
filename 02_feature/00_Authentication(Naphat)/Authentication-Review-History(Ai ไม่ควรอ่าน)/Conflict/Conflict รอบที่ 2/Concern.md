
## Concern สำคัญ

1. `role` อยู่ใน JWT แต่เอกสารต้องการเปลี่ยน role แล้วมีผลทันที  
    Backend ต้องอ่าน role และ `is_active` ปัจจุบันจาก DB/session ทุก protected request ห้าม authorize จาก `role` ใน JWT เพียงอย่างเดียว มิฉะนั้น role เก่ายังใช้ได้จน token หมดอายุ
    
2. [Component Diagram (line 50)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md:50) ตอบ `403` เมื่อ current password ผิด  
    แนะนำ `400 AUTH_CURRENT_PASSWORD_INVALID` หรือ `401` ที่กำหนดชัดเจน และควรมี acceptance test
    
3. Permission Catalog ทำ Credential เป็น write-only ถูกต้องแล้ว แต่ยังขาด `audit.read` สำหรับ Admin  
    และ `config.read` ให้ Viewer อ่าน Plan/Diff ได้ ควรกำหนดว่าต้องเป็น config ที่ redact secret แล้ว หรือห้าม Viewer เห็น raw generated config
    
4. [Rate Limit (line 34)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md:34) เขียน “เกิน 5 ครั้ง” แต่ API บอก “5 attempts”  
    ต้องตัดสินใจว่า request ที่ 5 หรือ 6 จะได้ `429` แล้วเขียนให้ตรงกัน
    
5. [Seed Policy (line 20)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/07_Test Users and Environment Policy.md:20) ใช้ UPSERT ได้ แต่ต้องระบุว่า rerun ห้าม reset password ของ account เดิมโดยไม่ตั้งใจ  
    และควร fail closed: ถ้า `APP_ENV` ว่างหรือค่าไม่รู้จัก ให้ seed `exit non-zero` เช่นกัน
    
6. Role description ใน [MVP (line 14)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/01_MVP - Authentication & RBAC.md:14) บอก Operator “สั่ง Push Config ได้” โดยไม่ได้บอกว่าเป็น P2; ควรเขียน P1 = Plan only, P2 = SSH Push เพื่อไม่ขัด Feature List


Edited 01_MVP%20-%20Authentication%20&%20RBAC.md
Edited 03_Component%20Diagram.md
Edited 04_API%20Contracts.md
Edited 05_Acceptance%20Tests.md
Edited 06_Permission%20Catalog.md
Edited 07_Test%20Users%20and%20Environment%20Policy.md

ผมได้จัดการแก้ไขเอกสารตามข้อกังวล (Concerns) ทั้งหมดที่ GPT เสนอมาเรียบร้อยแล้วครับ! 

✅ **รายละเอียดการแก้ไข:**
1. **[04] Authorization Guard:** เพิ่มโน้ตเตือน Backend แล้วว่าห้ามอ่าน Role จาก JWT อย่างเดียว ต้อง Query DB เสมอ เพื่อให้การเปลี่ยน Role/Deactivate มีผลทันที
2. **[03, 04, 05] Password Reset 400:** แก้ไข Flow Diagram, API Contract, และ Acceptance Test เปลี่ยนจาก `403` เป็น `400 AUTH_CURRENT_PASSWORD_INVALID`
3. **[06] Permission Catalog:** เพิ่มสิทธิ์ `audit.read` ให้ Admin และใส่เงื่อนไขให้ API ต้อง Redact ข้อมูล Secret ก่อนส่งให้ Viewer เสมอเมื่อใช้สิทธิ์ `config.read`
4. **[05] Rate Limit:** แก้ไข Acceptance Test เป็น "หากกระทำ**ครั้งที่ 6** ระบบต้องปฏิเสธ" (เพื่อความชัดเจนว่า 5 ครั้งแรกยอมให้ผิดได้)
5. **[07] Seed Policy:** เปลี่ยนเงื่อนไขเป็น `ON CONFLICT DO NOTHING` เพื่อกันรหัสใหม่ไปทับรหัสที่โดนเปลี่ยนไปแล้ว และเพิ่มกฎ Fail-Closed ว่าถ้าไม่เจอตัวแปรสภาพแวดล้อม (Empty/Null) ก็ให้สคริปต์ตายตัวเองทันที
6. **[01] Operator Role:** แก้ไขคำอธิบายให้ชัดเจนว่า "สร้าง Config Plan ได้ (ส่วนการสั่ง Push Config ลงอุปกรณ์จริงผ่าน SSH จะอยู่ในระยะ P2)"

เอกสารทั้งหมดสมบูรณ์และรัดกุมมากยิ่งขึ้นครับ! หากมีส่วนไหนต้องการปรับเพิ่มแจ้งได้เลยครับ