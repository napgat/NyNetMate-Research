ในการป้องกันเราคำนึกถึงอะไรบ้าง มีโอกาสโจมตี และ ขโมยได้กี่แบบ และมีเราวิธีป้องกัน อย่างไรบ้าง ที่ใช้ในโปรเจคของเรา 

เราควรคิดเป็น **9 กลุ่มความเสี่ยงหลัก**: 
1. ขโมย password, 
2. เดา password, 
3. รู้ว่าบัญชีมีอยู่ไหม, 
4. ขโมย session, 
5. ยัด session, 
6. สั่งงานแทนผ่าน CSRF, 
7. ข้าม RBAC, 
8. ขโมยข้อมูลจาก DB/log
9. ทำให้ระบบตรวจ session ไม่ได้

| ความเสี่ยง                                        | ผู้โจมตีทำอย่างไร                                            | สิ่งที่ MyNetMate ป้องกัน                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 1. Password รั่วจาก Database                      | ขโมยตาราง `users` แล้วนำ password ไปใช้                      | เก็บด้วย `Argon2id` ไม่เก็บ plaintext หรือ encryption ที่ถอดกลับได้                                            |
| 2. Brute force / Credential stuffing              | ลอง password จำนวนมาก หรือใช้ password ที่รั่วจากเว็บอื่น    | Password อย่างน้อย 12 ตัวอักษร, จำกัด Login ผิด 5 ครั้ง/IP/15 นาที, บันทึก Audit                               |
| 3. User enumeration                               | ลอง Login เพื่อดูว่าบัญชีนี้มีจริงไหม                        | ตอบ `401 AUTH_INVALID_CREDENTIALS` เหมือนกัน ไม่บอกว่า identifier หรือ password ผิด                            |
| 4. ดักขโมย Session Token ระหว่างทาง               | ดัก network traffic หรือ Cookie ถูกส่งบน HTTP                | `Secure` Cookie ใน Production และต้องใช้ HTTPS                                                                 |
| 5. ขโมย Token จาก JavaScript/XSS                  | Script อันตรายพยายามอ่าน Cookie                              | `HttpOnly` ทำให้ JavaScript อ่าน token ไม่ได้ และไม่เก็บใน `localStorage`                                      |
| 6. Session fixation                               | ผู้โจมตีบังคับให้เหยื่อใช้ token ที่ตนรู้                    | สร้าง opaque token ใหม่ด้วย CSPRNG ทุก Login และไม่รับ token จาก URL/body                                      |
| 7. CSRF                                           | เว็บไซต์อื่นหลอก Browser ของผู้ใช้ที่ Login อยู่ให้ส่งคำสั่ง | `SameSite=Strict`, Exact Origin/Referer check, `X-CSRF-Protection`, Exact CORS allowlist                       |
| 8. ข้ามสิทธิ์ RBAC                                | Viewer เรียก Admin API ตรง ๆ หรือแก้ role ใน request         | Backend อ่าน role จาก DB, Permission Catalog แบบ default deny, ตอบ `403` และบันทึก Audit                       |
| 9. Session ใช้ session เก่าหลัง Logout/Deactivate | ใช้ Cookie เก่าหลัง Admin ปิดบัญชีหรือเปลี่ยน role           | `auth_sessions` เป็น Source of Truth; revoke session เมื่อ logout, deactivate, role change และเปลี่ยน password |
## สิ่งที่ผู้โจมตี “ขโมย” ได้จริง

### 1. ขโมย Password

ถ้า Database รั่ว ผู้โจมตีจะได้ `password_hash` ไม่ใช่ password จริง แต่ยังอาจเดารหัสผ่านแบบ offline ได้

การป้องกันของเรา:

- `Argon2id` ทำให้การเดารหัสผ่านต้องใช้ทั้ง CPU และ RAM มาก
- salt เฉพาะแต่ละ password อยู่ใน hash
- password ยาว 12–128 ตัวอักษร
- ไม่บันทึก password ลง log หรือ Audit

OWASP แนะนำให้ใช้ password hash แบบช้าและ memory-hard เช่น Argon2id เพราะ fast hash อย่าง SHA-256 ทำให้ผู้โจมตีเดารหัสผ่านได้รวดเร็วเกินไป [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

### 2. ขโมย Session Token

Session token คือ bearer secret: ใครถือ token ได้ก็อาจสวมรอยเป็นผู้ใช้ได้จนกว่า session จะหมดอายุหรือถูก revoke

หากข้อมูลที่ผู้ใช้กรอก เช่น device name, description, audit message หรือข้อมูลจาก API ถูกนำไปแสดงเป็น HTML ดิบ ผู้โจมตีอาจฝัง script ได้

ผลอาจเป็น:

- หลอกหรือเปลี่ยนข้อมูลบนหน้าจอ
- ยิง API แทนผู้ใช้ที่ Login อยู่
- ทำ action ในสิทธิ์ของ Admin
- พยายามขโมยข้อมูลที่หน้าเว็บเข้าถึงได้
- 
การป้องกันของเรา:

- token สุ่ม 256 bits
- Browser เก็บ token ดิบใน HttpOnly Cookie เท่านั้น
- Database เก็บแค่ `SHA-256(token)`
- ไม่ส่ง token ผ่าน URL, JSON, `Authorization` header, `localStorage` หรือ log
- session หมดอายุภายใน 30 นาที
- Admin deactivate user → revoke ทุก session ทันที
- เปลี่ยน password → revoke ทุก session ทันที

### 3. ขโมยสิทธิ์ด้วยการแก้ Frontend

ผู้โจมตีแก้ปุ่มใน Browser หรือยิง API ตรงได้เสมอ เช่น Viewer พยายาม `POST /api/admin/users`

การป้องกันคือ **ห้ามเชื่อ Frontend**:

```
Frontend ซ่อนปุ่ม = UX
Backend ตรวจ Permission = Security
```

Backend จะตรวจ session, user status และ permission จาก Database ทุก request หากไม่มีสิทธิ์ตอบ `403 AUTH_FORBIDDEN` และบันทึก `auth.permission_denied`
	__
### 4. หลอก Browser ให้ทำคำสั่งแทนผู้ใช้: CSRF

แม้ JavaScript อ่าน HttpOnly Cookie ไม่ได้ แต่ Browser อาจส่ง Cookie ให้อัตโนมัติเมื่อถูกหลอกให้ส่ง request ไปยังเว็บเรา

ผู้ใช้ Admin Login ค้างไว้ แล้วไปเปิดเว็บผู้โจมตี เว็บนั้นอาจพยายามสั่ง action แทน Admin เช่นเปลี่ยน role หรือ deactivate ผู้ใช้ โดย Browser อาจแนบ Cookie ให้อัตโนมัติ

ผลคือ:

> ผู้ใช้ไม่ได้กดปุ่มใน MyNetMate เอง แต่ระบบเห็นว่า request มาจาก session ของ Admin

สำหรับระบบที่จัดการ user, credentials และ config นี่เป็นความเสี่ยงจริง แม้ P1 จะยังไม่มี SSH Push ก็ตาม

จึงต้องป้องกันเพิ่ม:

- `SameSite=Strict`
- ตรวจ `Origin` หรือ `Referer`
- ต้องมี header `X-CSRF-Protection: 1`
- CORS ใช้ exact origin ห้าม `*`
- State-changing API รับ JSON เท่านั้น

## ความเสี่ยงที่ยังเหลือใน P1

ต้องตอบอาจารย์อย่างซื่อสัตย์ว่า “ลดความเสี่ยง” ไม่ใช่ “ป้องกันได้ 100%”

- ยังไม่มี MFA: ถ้า password ถูกขโมย ผู้โจมตียัง Login ได้
- Rate limit ตาม IP ช่วยได้ แต่ผู้โจมตีอาจกระจายหลาย IP ได้
- `HttpOnly` ลดการขโมย Cookie จาก XSS แต่ XSS ยังอาจสั่ง API แทนผู้ใช้ได้ จึงต้องบังคับ safe rendering และห้าม render untrusted HTML ใน P1; CSP เป็นมาตรการ hardening ที่แนะนำในอนาคต
- หากเครื่องผู้ใช้ติด malware หรือผู้โจมตีเข้าถึง Browser ที่ Login อยู่ อาจใช้ session ได้
- หาก Database ล่ม ระบบเลือก **fail closed** คือปฏิเสธ protected request เพื่อไม่ให้หลุดสิทธิ์ แต่ผู้ใช้จะใช้งานไม่ได้ชั่วคราว
- MFA, SSO/OAuth, email recovery, LDAP และ device trust ยังอยู่นอก P1



> `P1 Security Implementation Checklist`

ให้รวม checklist สั้น ๆ ว่า implement ต้องมี:

- Argon2id และไม่มี plaintext password
- Opaque token + hash ใน `auth_sessions`
- HttpOnly/Secure/SameSite cookie
- Session expiry/revoke/fail closed
- Backend RBAC/default deny
- CSRF Guard และ exact CORS
- React safe rendering / ไม่มี raw HTML
- Rate limit + generic login error
- Audit redaction + security events
- Acceptance tests ของ `401`, `403`, revoke, CSRF และ XSS
