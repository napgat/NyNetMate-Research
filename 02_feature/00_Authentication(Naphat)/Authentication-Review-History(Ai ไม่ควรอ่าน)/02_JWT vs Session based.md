ประเภทของ Authentication มี 2 ชั้น

- **วิธีพิสูจน์ว่าเป็นใคร** ตอน Login
- **วิธีจำว่า Login แล้ว** ใน request ถัดไป
MyNetMate ใช้:

> **Username/Email + Password** เพื่อพิสูจน์ตัวตน  
> แล้วใช้ **Opaque Server-side Session ใน Cookie** เพื่อจำสถานะ Login


## 1) วิธีพิสูจน์ตัวตนตอน Login

| วิธี                          | แนวคิด                                 | เหมาะกับ MyNetMate P1 ไหม       |
| ----------------------------- | -------------------------------------- | ------------------------------- |
| Username/Email + Password     | ระบบมีบัญชีและ password hash ของตัวเอง | ใช่                             |
| OAuth/OIDC                    | Login ผ่าน Google, Microsoft เป็นต้น   | ไม่ทำ P1                        |
| SSO / LDAP / Active Directory | องค์กรกลางเป็นผู้ยืนยันตัวตน           | ไม่ทำ P1                        |
| Magic Link                    | ส่งลิงก์ Login ไปทางอีเมล              | ไม่ทำ P1                        |
| Passkey / WebAuthn            | ใช้ biometric หรืออุปกรณ์ยืนยันตัวตน   | P2/อนาคต                        |
| MFA                           | เพิ่ม OTP/Authenticator หลัง Password  | ไม่ทำ P1                        |
| API Key / Client Certificate  | ให้ระบบหนึ่งยืนยันตัวกับอีกระบบหนึ่ง   | ไม่ใช่การ Login ของผู้ใช้บนเว็บ |

ดังนั้น **Password ไม่ใช่ Session**: password ใช้พิสูจน์ตัวตนครั้งแรกเท่านั้น ไม่ควรส่ง password ทุกครั้งที่เรียก API

## 2) วิธีรักษาสถานะ Login บนเว็บ

| วิธี                       | Cookie/Token เก็บอะไร                    | Server ตรวจอะไร                 | จุดเด่น                      | ข้อจำกัด                            |
| -------------------------- | ---------------------------------------- | ------------------------------- | ---------------------------- | ----------------------------------- |
| Opaque server-side session | Token สุ่มที่ไม่มีความหมาย               | Query session และ user ใน DB    | revoke/เปลี่ยน role ได้ทันที | ต้องมี DB/session store ทุก request |
| JWT แบบ stateless          | Token ที่มี claims เช่น user/role/expiry | ตรวจ signature ของ JWT          | เหมาะกับหลาย service         | revoke หรือ role change ทันทีทำยาก  |
| JWT + `auth_sessions`      | JWT และ session row                      | ตรวจ JWT แล้วตรวจ DB อีกครั้ง   | รองรับ revoke ได้            | ซับซ้อนกว่า opaque โดยยัง query DB  |
| OAuth access token         | Token จาก Identity Provider              | ตรวจ token/issuer ตามระบบภายนอก | เหมาะกับ Login ข้ามระบบ      | เกิน scope P1                       |

## Opaque Session คืออะไร?

Opaque แปลว่า “มองจากข้างนอกแล้วไม่รู้ความหมาย”

Cookie ของ MyNetMate อาจหน้าตาประมาณนี้:

```
__Host-mynetmate_session = random-long-secret-token
```

มันไม่มี username, role หรือ user ID อยู่ข้างในเลย เหมือน “บัตรฝากของ” ที่มีเพียงหมายเลขสุ่ม

ฝั่ง Server เก็บทะเบียนไว้ใน `auth_sessions`:

```
session_token_hash → user_id → expires_at → is_revoked
```

Browser ส่ง token กลับมา → FastAPI hash token → ค้นในฐานข้อมูล → ตรวจ session, user และ role ปัจจุบัน

## ทำไม MyNetMate เลือก Opaque Session?

เพราะโจทย์ P1 ของเราต้องการสิ่งเหล่านี้:

- Admin deactivate Operator แล้วต้องตัดสิทธิ์ทันที
- Admin เปลี่ยน role แล้วสิทธิ์ใหม่ต้องมีผลทันที
- Logout ต้อง revoke session ได้
- Password change ต้อง revoke ทุก session ได้
- Admin ต้องดูและจัดการ session ได้
- ระบบมี FastAPI backend และ PostgreSQL เป็นศูนย์กลางเดียว

ถ้าใช้ JWT แบบ stateless อย่างเดียว:

```
Admin deactivate Operator
        ↓
JWT เก่ายังมีลายเซ็นถูกต้อง
        ↓
Operator อาจใช้งานต่อได้จน JWT หมดอายุ
```

ถ้าจะแก้ ต้องให้ทุก protected request ตรวจ `auth_sessions` และ `users` ในฐานข้อมูลอยู่ดี

```
JWT + auth_sessions
Cookie → ตรวจ JWT signature → Query session/user DB → ตรวจ RBAC
```

แต่ Opaque Session ทำได้ตรงกว่า:

```
Opaque session
Cookie → Query session/user DB → ตรวจ RBAC
```

ดังนั้น Opaque Session ไม่ได้ “ปลอดภัยกว่า JWT เสมอ” แต่ **เหมาะกว่าในบริบทของ MyNetMate P1** เพราะระบบยังมี backend เดียว และต้องพึ่งฐานข้อมูลเพื่อตัดสิทธิ์แบบทันทีอยู่แล้ว

ข้อแลกเปลี่ยนที่ยอมรับคือทุก protected request ต้อง query session store แต่สำหรับระบบนักศึกษา/ผู้ใช้ไม่มาก นี่เป็นความซับซ้อนที่คุ้มค่า

## คำตอบสั้นสำหรับอาจารย์

> MyNetMate ใช้ username/email และ password เพื่อพิสูจน์ตัวตน จากนั้นใช้ opaque server-side session ผ่าน HttpOnly Cookie เพื่อรักษาสถานะ Login เพราะระบบต้อง revoke session, deactivate user และเปลี่ยน RBAC ให้มีผลทันที หากใช้ JWT ร่วมกับ `auth_sessions` ก็ยังต้อง query database ทุก request อยู่แล้ว จึงเลือก opaque session ที่เรียบง่ายกว่าและตรงกับ P1 มากกว่า

อ้างอิงจาก [What is Authentication_Cookie_Session.md](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\00_Authentication(Naphat\)\\Authentication-Review-History(Ai ไม่ควรอ่าน\)\\What is Authentication_Cookie_Session.md) และ [MVP Authentication & RBAC](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\00_Authentication(Naphat\)\\01_MVP - Authentication & RBAC.md) 

