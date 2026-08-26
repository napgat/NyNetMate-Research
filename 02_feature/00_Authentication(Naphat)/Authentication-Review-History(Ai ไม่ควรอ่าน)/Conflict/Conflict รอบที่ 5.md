# สรุปการเก็บกวาด Conflict ขั้นสุดท้าย (รอบที่ 3-5)

เอกสารนี้สรุปการเก็บรายละเอียด (Final Polish) ในเอกสาร Authentication & RBAC ครอบคลุมรอบที่ 3 ถึง 5

---

## 🛠️ รายการที่ปรับปรุง (รอบ 3-5)

### 1. Database Schema & Data Types (ไฟล์ 02)
- แก้ไขตัวอย่าง JSON Response ใน API `/api/auth/me` จาก `"id": 1` เป็น UUID
- เพิ่มบังคับ `NOT NULL` ให้ `is_active` และ `is_revoked`
- เพิ่มคำสั่ง `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- ระบุว่า `updated_at` ควบคุมโดย Application Layer

### 2. ความสม่ำเสมอของ API และ Rate Limit (ไฟล์ 04 และ 05)
- ระบุ `email` เป็น Optional ใน Request Body
- ปรับข้อความ Rate Limit ให้ตรงกันทุกไฟล์

### 3. การควบคุมสิทธิ์ (ไฟล์ 04 และ 05)
- จำกัด Audit API ให้ Admin เท่านั้น
- เพิ่ม Test สำหรับ `user.logout`, `auth.permission_denied`, Admin-only endpoints

### 4. สคริปต์ Test Users (ไฟล์ 07)
- เปลี่ยนจาก "สร้างหรืออัปเดต" เป็น "สร้างเฉพาะเมื่อยังไม่มี"

---

> [!NOTE]
> GPT Architect ตรวจรอบนี้แล้วให้ความเห็นว่า "ปิด concern เดิมได้แล้ว แต่ยังพบปัญหาใหม่อีกหลายจุด" ซึ่งถูกนำไปแก้ไขในรอบที่ 6 (ดูไฟล์ `Conflict รอบที่ 6.md`)
