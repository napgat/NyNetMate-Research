
Admin ไม่ควรอ่าน Credential Secret เดิมได้

[Permission Catalog (line 17)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/06_Permission Catalog.md:17) ระบุว่า Admin สามารถ “ดู Secret”

แนะนำให้ `credential.manage` หมายถึง:

- สร้าง profile
- ตั้งหรือหมุนเวียน secret ใหม่
- แก้ metadata
- deactivate/delete profile

แต่ API ห้ามคืน plaintext secret หลังบันทึกแล้ว แม้เป็น Admin การถอดรหัสควรทำเฉพาะ backend service ตอนเชื่อมต่ออุปกรณ์



เรื่อง **"Admin ไม่ควรอ่าน Credential Secret (รหัสผ่านอุปกรณ์) เดิมได้"** เป็นหลักการออกแบบระดับ Enterprise ที่ถูกต้องมากๆ ครับ (ระบบระดับโลกอย่าง Ansible Tower หรือ HashiCorp Vault ก็ใช้หลักการนี้)

### แนวคิดเรื่องนี้ (Write-Only Secret) คืออะไร?

รหัสผ่านที่ใช้เข้า Router หรือ Switch ถือเป็นกุญแจที่สำคัญที่สุดของระบบ (ถ้าหลุดไป แฮกเกอร์ยึด Network ได้เลย) ดังนั้น กฎเหล็กคือ **"รหัสผ่านอุปกรณ์ ต้องเป็นแบบหยอดกระปุก (Write-Only)"**

- **Admin ทำได้แค่ "ใส่" รหัสผ่านลงไปตอนสร้าง**
- **ถ้า Admin จำรหัสเดิมไม่ได้ หรืออยากเปลี่ยน** ก็ทำได้แค่ **"เขียนทับ (Overwrite/Rotate)"** ด้วยรหัสใหม่เท่านั้น
- **ระบบ Backend จะไม่มี API ไหนเลยที่คายรหัสผ่าน (Plaintext) กลับมาให้หน้าเว็บ (Frontend)** แม้คนขอดูจะเป็น Admin ก็ตาม หน้าเว็บจะแสดงแค่จุดไข่ปลา `********` หรือแสดงสถานะแค่ว่า `is_password_set: true`
- **ใครมีสิทธิ์ถอดรหัส?** มีแค่เซิร์ฟเวอร์ Backend เท่านั้นที่ถอดรหัสได้ และจะถอดรหัสออกมาใช้ "เฉพาะเสี้ยววินาที" ที่กำลังจะต่อ SSH (Netmiko) เข้าอุปกรณ์จริงเท่านั้น ใช้เสร็จก็ลบทิ้งจาก Memory ทันที

### ถ้าจะปรับ เราจะปรับเอกสารอย่างไร? (แผนการแก้ไข)

เมื่อถึงเวลาที่คุณสั่งให้ผมอัปเดตเอกสาร ผมจะปรับจุดนี้ครับ:

1. **ในไฟล์ `06_Permission Catalog.md`:**
    
    - **เดิม:** `credential.manage` = "สร้าง แก้ไข หรือดูข้อมูล Credential Profile รวมทั้ง Secret"
    - **แก้เป็น:** `credential.manage` = "สร้าง Profile, อัปเดตข้อมูล (Metadata), ตั้งรหัสผ่านอุปกรณ์ใหม่ (Overwrite/Rotate) และลบ Profile ได้ **แต่ไม่สามารถเรียกดู Secret เดิมที่บันทึกไปแล้วได้ (Write-only)**"
2. **ในไฟล์ `04_API Contracts.md` (ถ้าเราจะทำฉบับละเอียด):**
    
    - จะระบุใน Schema เลยว่า API ที่ใช้ดึงข้อมูล Credential (GET) จะคืนค่าแค่ `id`, `name`, `username` และบอกแค่ว่าเซ็ต Password ไว้หรือยัง (เช่น `has_secret: true`) แต่จะไม่ส่งตัว Password กลับมาเด็ดขาด

แนวคิดนี้จะทำให้ระบบ MyNetMate ของเราปลอดภัยในระดับเดียวกับเครื่องมือ Enterprise จริงๆ เลยครับ และใช้ตอบคำถามอาจารย์ตอนดีเฟนด์โปรเจกต์ได้หล่อมากด้วย
