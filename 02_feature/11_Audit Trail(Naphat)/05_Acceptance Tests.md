# Acceptance Tests - Audit Trail

เอกสารนี้ระบุเงื่อนไขการทดสอบ (Acceptance Criteria) เพื่อให้มั่นใจว่าฟีเจอร์ Audit Trail ทำงานได้ตาม MVP Scope อย่างถูกต้องและปลอดภัย

## Test Case 1: Transaction Bounding (Rollback)
- **สถานการณ์:** ผู้ใช้พยายามแก้ไขอุปกรณ์ (Device Update) แต่เกิด Error ที่ระดับฐานข้อมูล (เช่น Unique constraint ของ IP ซ้ำ) ทำให้ Business Action ถูก Rollback
- **สิ่งที่คาดหวัง:** Audit Log เหตุการณ์ `device.update` จะต้องไม่ปรากฏในฐานข้อมูล (ต้องถูก Rollback ไปพร้อมกับ Business Action ยกเว้นกรณีที่เป็นการตั้งใจดักจับ Error และบันทึกเป็น `failure` ใหม่)

## Test Case 2: Append-Only Policy
- **สถานการณ์:** มีผู้ไม่หวังดีหรือมีโค้ดบั๊กพยายามยิงคำสั่ง `UPDATE audit_logs SET...` หรือเรียกใช้ `session.delete(audit_log_entry)`
- **สิ่งที่คาดหวัง:** 
  - ระบบ Backend ไม่ส่งออก API สำหรับการแก้ไข (PATCH/PUT) หรือลบ (DELETE) `audit-logs`
  - การใช้งานในระดับ Application Layer ไม่มีฟังก์ชันลบหรือแก้

## Test Case 3: Admin Full Read Access
- **สถานการณ์:** Admin เรียกใช้ `GET /api/audit-logs`
- **สิ่งที่คาดหวัง:** 
  - ได้รับ HTTP 200 OK
  - ข้อมูลที่ตอบกลับมีฟิลด์ครบถ้วน ได้แก่ `ip_address`, `safe_error_category`, `description`
  - สามารถใช้ Filter เช่น ค้นหาเฉพาะ `action=user.login_failed` ได้อย่างถูกต้อง

## Test Case 4: Operator and Viewer Denied Access
- **สถานการณ์:** Operator หรือ Viewer พยายามเรียก `GET /api/audit-logs`
- **สิ่งที่คาดหวัง:** ได้รับ HTTP 403 Forbidden 

## Test Case 5: Secret and PII Redaction
- **สถานการณ์:** Admin เปลี่ยนรหัสผ่านของ User หรือสร้าง Profile Credential ใหม่
- **สิ่งที่คาดหวัง:** ใน `description` ของ Audit Log จะต้องไม่มีค่า Password (ไม่ว่าจะเป็น Plaintext หรือ Hash) หรือ Credential Secret ปรากฏอยู่ หากพยายามตรวจหาด้วย Regex หรือ String matching ต้องไม่พบ

## Test Case 6: Null Actor on Anonymous Action
- **สถานการณ์:** มีการพยายามล็อกอินด้วย Username ที่ไม่เคยมีในระบบ
- **สิ่งที่คาดหวัง:**
  - สร้าง Audit Log ที่มี `action = user.login_failed`
  - ฟิลด์ `user_id = null`
  - ฟิลด์ `result = failure`
  - ฟิลด์ `safe_error_category = authentication_error`

## Test Case 7: Pagination Validity
- **สถานการณ์:** มีข้อมูล Audit Log 1,000 แถว Admin เรียกดูทีละ 50 แถวโดยระบุ limit/offset หรือ cursor
- **สิ่งที่คาดหวัง:** จำนวนข้อมูลที่ถูกตอบกลับไม่เกิน 50 แถว และเมื่อเรียกหน้าถัดไป ข้อมูลต้องถูกต้อง ไม่ข้ามและไม่ซ้ำ ( Tie-breaker ด้วย `id` หรือ `created_at` อย่างถูกต้อง )
