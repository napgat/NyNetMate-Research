ดังนั้นเอกสารตอนนี้อยู่ในสถานะ **เกือบพร้อม implement** มากกว่ารอบก่อนอย่างชัดเจน

แต่ยังมี concern ที่ควรเก็บอีก 5 จุด:

1. `GET /api/auth/me` ยังตอบ `"id": 1` ทั้งที่ schema เปลี่ยนเป็น UUID แล้ว  
    ต้องเปลี่ยนตัวอย่างเป็น `"id": "uuid"` เพื่อไม่ให้ Frontend กำหนด type ผิด
    
2. `is_active` ใน schema ขาด `NOT NULL`  
    ควรเป็น `BOOLEAN NOT NULL DEFAULT TRUE` เพื่อไม่ให้เกิดสถานะ `NULL` ที่ guard ตีความไม่ชัด
    
3. `gen_random_uuid()` ต้องพึ่ง PostgreSQL extension  
    Alembic migration ต้องเปิด `pgcrypto` ก่อน หรือเปลี่ยนไป generate UUID ใน application layer
    
4. `/api/audit-logs` ไม่ควรให้ Operator/Viewer เรียก แม้เป็น “แบบจำกัด”  
    Permission Catalog ระบุ `audit.read` สำหรับ Admin เท่านั้นอยู่แล้ว ส่วน Operator/Viewer ควรใช้ endpoint Dashboard Recent Activity ของ D&M แยกต่างหาก เพื่อไม่ให้ Audit API กลายเป็นช่องข้อมูลรั่ว
    
5. Acceptance Tests ยังไม่มี test ตรง ๆ สำหรับ:
    
    - logout ต้องสร้าง `user.logout`
    - permission denied ต้องสร้าง `auth.permission_denied`
    - Admin user-management endpoints ถูกปฏิเสธสำหรับ Operator/Viewer
    - ห้าม deactivate/demote Admin คนสุดท้ายผ่าน `PATCH`




Edited 02_Database%20Schema.md
Edited 04_API%20Contracts.md
Edited 04_API%20Contracts.md
Edited 05_Acceptance%20Tests.md

ผมได้จัดการเก็บกวาดจุดเล็กจุดน้อยที่เหลืออีก 5 ข้อให้เรียบร้อยแล้วครับ! 

✅ **สิ่งที่ปรับปรุงเพิ่ม:**
1. **[ไฟล์ 04] API /me:** เปลี่ยนตัวอย่างจาก `"id": 1` เป็น UUID `123e4567-...` เพื่อไม่ให้ Frontend สร้าง Interface (Type) ผิด
2. **[ไฟล์ 02] Database Schema:** เพิ่ม `NOT NULL` ให้ `is_active` เป็น `BOOLEAN NOT NULL DEFAULT TRUE` เพื่อปิดช่องโหว่สถานะ Null
3. **[ไฟล์ 02] Database Schema:** เพิ่มบรรทัด `CREATE EXTENSION IF NOT EXISTS pgcrypto;` ไว้ด้านบนสุด เพื่อให้ Alembic Migration สามารถสร้าง `gen_random_uuid()` ได้ไม่พัง
4. **[ไฟล์ 04] Audit Logs API:** กำหนด Authorization ให้เข้มงวดสุดๆ ว่า "เฉพาะ Admin เท่านั้น" และลบข้อยกเว้นสำหรับ Operator/Viewer ทิ้ง (ให้สอง Role นี้ไปดึงสรุป Log เอาจาก API ฝั่ง Dashboard แทน เพื่ออุดรอยรั่ว Audit)
5. **[ไฟล์ 05] Acceptance Tests:** เพิ่มเคสครอบคลุมครบทั้งหมด:
   - สั่ง Logout ต้องได้ log `user.logout`
   - เรียกใช้ API ที่ไม่มีสิทธิ์ ต้องตอบ `403` พร้อมสร้าง log `auth.permission_denied`
   - Operator/Viewer ห้ามยุ่งกับ `/api/admin/users/*` เด็ดขาด
   - เขียนกำกับชัดๆ ว่า "ห้าม Deactivate หรือเปลี่ยน Role ของ Admin (is_active=true) คนสุดท้ายในระบบ"

ตอนนี้เอกสารน่าจะคมกริบแบบหาที่ติไม่ได้แล้วครับ! ทุกอย่างพร้อมสำหรับขั้นตอน Implementation 100% แล้วครับ 🚀