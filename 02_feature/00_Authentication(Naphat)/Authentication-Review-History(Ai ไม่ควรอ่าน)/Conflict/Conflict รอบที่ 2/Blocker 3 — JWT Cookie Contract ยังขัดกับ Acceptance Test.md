
## Blocker 3 — JWT/Cookie Contract ยังขัดกับ Acceptance Test

[Acceptance Tests (line 15)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md:15) ต้องตรวจ `iss` และ `aud` แต่ [JWT Claims (line 7)](/E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md:7) ไม่มีสอง claim นี้

Cookie ยังขาด `Path=/api` ด้วย หากไม่กำหนด browser อาจส่ง cookie เฉพาะ `/api/auth/*` และไม่ส่งให้ `/api/devices`, `/api/dashboard` หรือ API feature อื่น

ต้องเพิ่ม:

- `iss`, `aud` และค่าคงที่ของทั้งสอง
- `Path=/api`
- กฎว่า cookie ตอน clear ต้องใช้ name/path/samesite/security ที่ตรงกัน



Viewed 04_API%20Contracts.md:1-140
Edited 04_API%20Contracts.md
Edited 04_API%20Contracts.md

ขอบคุณสำหรับข้อมูลเพิ่มเติมครับ! ข้อเสนอแนะเรื่อง JWT/Cookie ของ GPT ยอดเยี่ยมมาก เพราะเป็นบั๊กคลาสสิกที่ทำให้ Frontend สับสนบ่อยที่สุด (ส่ง Cookie ออกไปไม่ได้ หรือสั่ง Logout แล้ว Cookie ไม่ยอมหาย)

**🛠️ ผมได้เข้าไปแก้ไขไฟล์ `04_API Contracts.md` เพื่อปิดช่องโหว่ Blocker 3 เรียบร้อยแล้วครับ:**
1. **เพิ่มค่าคงที่ `iss` และ `aud` ลงใน JWT Claims** (`iss: "mynetmate_api"`, `aud: "mynetmate_client"`) เพื่อให้ตรงกับ Acceptance Test ที่สั่งให้ต้องตรวจสอบลายเซ็น
2. **เพิ่ม `Path: /api` ลงในสเปค Cookie** เพื่อรับประกันว่า Browser จะแนบ Cookie นี้วิ่งไปหาทุกๆ Endpoint ที่อยู่ภายใต้ `/api` (เช่น `/api/devices`) แน่นอน ไม่ใช่แค่ `/api/auth`
3. **เพิ่มกฎข้อบังคับตอน Logout** ระบุชัดเจนว่า Backend จะต้องส่ง Header `Set-Cookie` ลบข้อมูลที่ระบุ Property ครบถ้วนตรงกับตอนที่สร้างทุกประการ (`Path=/api; HttpOnly; SameSite=Lax; Secure`) มิเช่นนั้น Browser จะดื้อและไม่ยอมลบ Cookie เดิมให้ครับ
