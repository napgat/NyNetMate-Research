## Blocker 1 — Schema ยังขัดกับ Central Schema

[Authentication Schema (line 10)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/02_Database Schema.md:10) ใช้ `id SERIAL` และ `auth_sessions.user_id INTEGER`

แต่ [Central Schema (line 382)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Data Information.md:382) ใช้ `users.id UUID` และ feature อื่นอ้าง `users` ด้วย UUID

ถ้า implement ตามไฟล์ Auth ตอนนี้ FK เช่น `devices.created_by`, audit log และ config history จะชนชนิดข้อมูลทันที

ยังมีความต่างเพิ่ม:

- Auth บังคับ `email NOT NULL` แต่ Central Schema ระบุ email optional
- Auth บอกว่า schema สอดคล้อง Central แต่ Central ยังใช้ bcrypt และสรุป 11 ตาราง
- Regex username ถูกเขียนไว้เป็นคำอธิบาย แต่ไม่มี `CHECK (username ~ ...)` ใน SQL จริง

ต้องแก้ก่อนเริ่ม migration:

- ใช้ `users.id UUID`
- ใช้ `auth_sessions.user_id UUID`
- ตัดสินใจว่า email optional หรือ mandatory ให้ตรงกัน
- ใส่ regex `CHECK` ใน SQL จริง
- เปลี่ยน Central Schema หรือใส่ป้าย `Proposed Schema Change` ใน Auth Schema


Created 02_Database%20Schema.md

โอ้โห! GPT จับบั๊กได้ระดับ "ลึกและคมมาก" ครับ นี่คือบั๊กระดับที่ถ้าหลุดไปถึงตอนเขียนโค้ด (Alembic Migration) ระบบฐานข้อมูลจะพังยับเยินทันทีตอนเชื่อม Foreign Key แน่นอนครับ เพราะ Integer กับ UUID มัน Join ตารางกันไม่ได้! 

ผมกราบขออภัยที่ตอนรันสคริปต์ "ชำระล้าง" ผมเผลอลบป้ายประกาศ "Proposed Schema Change" ทิ้งไปด้วย และลืมตรวจสอบ Data Type ของ Central Schema แบบละเอียดครับ

**🛠️ ผมได้เข้าไปแก้ไขไฟล์ `02_Database Schema.md` ทันทีเรียบร้อยแล้วครับ โดยอัปเดตดังนี้:**
1. **เปลี่ยน `id` และ `user_id`** จาก `SERIAL/INTEGER` เป็น `UUID` (เพื่อให้ Join กับ Central Schema ได้แบบไร้รอยต่อ)
2. **ปรับ `email` เป็น Optional** (เอา `NOT NULL` ออกเพื่อให้ตรงกับ Central Schema)
3. **เขียนโค้ด SQL Guard จริงๆ:** เพิ่ม `CHECK (username ~ '^[a-z0-9._-]{3,100}$')` ลงไปในก้อน `CREATE TABLE` เลย (ไม่ได้ปล่อยลอยๆ ไว้แค่ในคำอธิบายแล้วครับ)
4. **ติดป้ายเตือน (Banner):** ใส่คำเตือน `> [!WARNING] PROPOSED SCHEMA CHANGE` ตัวใหญ่เบ้อเริ่มไว้บนสุดของไฟล์ เพื่อให้ทีมรู้ว่าไฟล์นี้กำลังเสนอขอแก้ Central Schema

นี่เพิ่ง Blocker ที่ 1 เอง ส่ง Blocker ที่ 2 และ 3 รวมถึง Concern อื่นๆ ตามมาได้เลยครับ ผมรอชำระล้างให้อีกรอบ! 🚀