
### 7. Audit contract ยังมี nullability conflict

Acceptance Test บอกว่าทุก event ต้องระบุ `resource_id` แต่ login failed อาจไม่มี user/resource ที่ทราบแน่ชัด

ควรกำหนด:

- `user_id=null`
- `resource_id=null`
- `resource_type="auth"` หรือ `"user"`
- `action="user.login"`
- `outcome="failure"`

พร้อมระบุว่า `resource_id` nullable

Central `audit_logs` ยังต้องเพิ่ม `outcome` และ `metadata JSONB` ก่อน contract นี้จะใช้ได้จริง


### วิเคราะห์ข้อ 7: Audit contract ยังมี nullability conflict

**ปัญหานี้คืออะไร?**
GPT กำลังชี้ให้เห็นช่องโหว่ทางลอจิกของการเก็บ Log ครับ สมมติว่ามีแฮกเกอร์พิมพ์มั่วๆ เข้ามาว่า `Username: hacker123` แล้วระบบปฏิเสธการล็อกอิน
*   ถ้า Acceptance Test บังคับว่าทุก Event ต้องมี `user_id` หรือ `resource_id`... **คำถามคือ แล้วเราจะเอา ID ของใครมาใส่ล่ะ ในเมื่อ user คนนี้ไม่มีอยู่จริงในระบบ?**

**วิธีแก้ไขปัญหา Nullability (ตามที่ GPT เสนอ):**
ถูกต้องตามที่ GPT แนะนำเลยครับ คือในฐานข้อมูล (Central Schema) คอลัมน์ `user_id` และ `resource_id` **จะต้องยอมรับค่าว่างได้ (Nullable)**

**แต่เดี๋ยวก่อน! เราต้องเอามาปรับให้เข้ากับ "Lean MVP" ที่เราเพิ่งคุยกันไป:**
จำได้ไหมครับว่าข้อก่อนหน้านี้ เราตกลงกันว่า **"เราจะไม่เพิ่มฟิลด์ `outcome` และ `metadata JSONB` เพื่อลดภาระคนทำ Database"** (กลับไปใช้โครงสร้าง 11 ตารางเดิม)

ดังนั้น ข้อมูล Audit Log สำหรับเคส **"ล็อกอินล้มเหลว"** ในโปรเจกต์ของเรา หน้าตาจะออกมาเป็นแบบนี้ครับ (ไม่ต้องง้อ `outcome`):

- `user_id` = **NULL** (เพราะไม่รู้ว่าเป็นใคร หรือเป็นไอดีเถื่อน)
- `resource_id` = **NULL** 
- `resource_type` = `"auth"`
- `action` = **`"user.login_failed"`** (ใช้การตั้งชื่อ Action บอกสถานะแทนการใช้ฟิลด์ `outcome`)

### สิ่งที่เราต้องไปปรับในเอกสาร
1. **ใน `05_Acceptance Tests.md`:** ต้องแก้ประโยคที่เคยเขียนว่า "เหตุการณ์ต้องระบุ action, outcome, resource_type, resource_id เสมอ" 
👉 **เปลี่ยนเป็น:** "เหตุการณ์ต้องระบุ `action` และ `resource_type` ส่วน `user_id` และ `resource_id` สามารถเป็น **NULL** ได้ในกรณีที่ล็อกอินไม่สำเร็จ (Unknown User)"

แบบนี้เราจะได้ทั้งอุดช่องโหว่เรื่อง Null ตามที่ GPT เตือน และยังรักษาจุดยืนเรื่องการประหยัดเวลาทำ Database ของทีมไว้ได้ด้วยครับ!

ข้อ 8 ต่อเลยไหมครับ? (ผมจะเอาสรุปข้อนี้ไปทบไว้ให้ในข้อถัดไปด้วยครับ)