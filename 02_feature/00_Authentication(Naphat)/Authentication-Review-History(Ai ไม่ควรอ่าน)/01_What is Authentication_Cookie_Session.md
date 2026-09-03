# แก่นของ Authentication

ระบบต้องตอบ 3 คำถาม:
1. **Authentication:** คุณคือใคร? 
2. **Session:** ระบบจำได้อย่างไรว่าคุณ Login แล้ว?
3. **Authorization/RBAC:** เมื่อรู้ว่าเป็นใคร คุณทำอะไรได้บ้าง?

ในระบบ Mynetmate ตอบว่า
```
Login พิสูจน์ตัวตน
        ↓
Session จดจำการ Login
        ↓
RBAC ตรวจสิทธิ์ Admin / Operator / Viewer
```

# ทำไมต้องมี Session?
HTTP ไม่จดจำผู้ใช้ แต่ละ request แยกจากกัน :

```
Request 1: POST /api/auth/login
Request 2: GET /api/devices
Request 3: POST /api/config/generate
```

ถ้าไม่มี Session เมื่อถึง Request 2 เซิร์ฟเวอร์จะไม่รู้ว่าคนนี้เพิ่ง Login สำเร็จ
Session จึงเป็นหลักฐานชั่วคราวที่เชื่อม request เหล่านี้เข้ากับผู้ใช้คนเดิม

## Cookie คืออะไร?

![[Pasted image 20260901170951.png|415]]

Cookie คือข้อมูลชิ้นเล็กที่เว็บไซต์ฝากให้ Browser เก็บไว้ เมื่อ Browser เรียกเว็บไซต์เดิมอีกครั้ง มันจะส่ง Cookie กลับไปให้อัตโนมัติ

ใน MyNetMate Cookie เก็บเพียง **opaque session token** เช่น:
```
__Host-mynetmate_session = k7dP...random...xQ
```

Token นี้:

- เป็นค่าสุ่ม 256 bits
- ไม่มี username, role หรือข้อมูลผู้ใช้อยู่ข้างใน
- เปรียบเสมือน “หมายเลขบัตรฝากของ”
- คนที่ถือ Token สามารถอ้าง session นั้นได้ จึงต้องปกป้องเหมือนรหัสลับ

## แล้ว `auth_sessions` คืออะไร?

`auth_sessions` คือตารางฝั่ง Server เปรียบเสมือนสมุดทะเบียนบัตรฝากของ

Browser Cookie
┌─────────────────────────┐
│ Random session token    │
└────────────┬────────────┘
             │ Browser ส่งมากับ request
             ▼
FastAPI คำนวณ SHA-256(token)
             │
             ▼
Database: auth_sessions 
┌─────────────────────────┐
│ session_token_hash      │
│ user_id                 │
│ expires_at              │
│ is_revoked              │
└─────────────────────────┘

Browser เก็บ Token ดิบ แต่ฐานข้อมูลเก็บเฉพาะ hash หากฐานข้อมูลรั่ว ผู้โจมตีจึงไม่สามารถนำ hash ไปใส่ Cookie แล้วใช้งานแทนผู้ใช้ได้โดยตรง

## Login ของ MyNetMate ทำงานอย่างไร?

1. ผู้ใช้กรอก username/email และ password
2. FastAPI ค้นหาผู้ใช้ในตาราง `users`
3. ตรวจ password กับ `password_hash` ที่สร้างด้วย Argon2id
4. ตรวจว่า `is_active=true`
5. สร้าง opaque token ใหม่
6. เก็บ hash ของ Token ลง `auth_sessions`
7. ส่ง Token ดิบกลับผ่าน HttpOnly Cookie
8. บันทึก `user.login_success` ลง Audit Trail

ถ้าข้อมูลผิด ระบบตอบเพียง `401 AUTH_INVALID_CREDENTIALS` โดยไม่บอกว่าผิดที่ username หรือ password


## Request หลังจาก Login

เมื่อเรียก protected API:

1. Browser แนบ Cookie ให้อัตโนมัติ
2. FastAPI อ่าน Token จาก Cookie
3. Hash Token แล้วค้น `auth_sessions`
4. ตรวจว่า session มีอยู่จริง
5. ตรวจว่าไม่ถูก revoke
6. ตรวจว่ายังไม่หมดอายุ
7. ตรวจว่า user ยัง active
8. อ่าน role ปัจจุบันจาก `users`
9. ตรวจ permission ที่ API ต้องการ

ผลลัพธ์สำคัญ:

- ยังไม่ได้ Login → `401`
- Session หมดอายุหรือถูก revoke → `401`
- Login แล้วแต่ไม่มีสิทธิ์ → `403`


## Logout และ Deactivate

Logout ไม่ใช่แค่ลบ Cookie:

1. ตั้ง `auth_sessions.is_revoked=true`
2. สั่ง Browser ลบ Cookie
3. บันทึก `user.logout`

หาก Admin deactivate Operator ระบบจะ revoke ทุก session ของ Operator ด้วย ดังนั้น protected request ถัดไปจะถูกปฏิเสธทันที

## Cookie Security

Cookie ของ MyNetMate มีการป้องกันหลัก:

- `HttpOnly`: JavaScript อ่าน Token ไม่ได้
- `Secure`: Production ส่ง Cookie ผ่าน HTTPS เท่านั้น
- `SameSite=Strict`: ลดการส่ง Cookie จากเว็บไซต์อื่น
- `Path=/`: ใช้กับ API ภายในเว็บไซต์
- ไม่เก็บใน `localStorage`
- ไม่ส่ง Token กลับมาใน JSON

เพราะ Browser ส่ง Cookie อัตโนมัติ ระบบจึงต้องมี CSRF protection เพิ่มด้วย เช่น ตรวจ `Origin` และ `X-CSRF-Protection`

อ้างอิงแบบระบบจริง: [04_API Contracts.md](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\00_Authentication(Naphat\)\\04_API Contracts.md)

## โมเดลที่แนะนำสำหรับเรียน

ถ้าในตัวเลือกของคุณมีโมเดลเหล่านี้:

- **GPT-5.6 Terra, reasoning medium/high:** แนะนำสำหรับถามตอบและเรียนทุกวัน สมดุลระหว่างความสามารถกับความเร็ว
- **GPT-5.6 Sol, reasoning high:** ใช้ตรวจสถาปัตยกรรม จำลองคำถามอาจารย์ และตรวจคำตอบเชิงลึก
- **GPT-5.6 Luna:** ใช้สร้าง flashcard, quiz หรือถามคำถามสั้น ๆ จำนวนมาก
