ผมแนะนำให้คิดเป็น 2 สาย: เรื่องที่ต้องคุยข้ามทีม กับเรื่องที่ Auth ล็อกเองได้ทันที

| ลำดับ | เรื่อง                                | เหตุผล / ค่าที่แนะนำ                                                                                                                                                                                                                                                                                                                             |
| ----- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | **#5 Audit integration**              | คุยกับ Audit ก่อน เพราะเป็น Shared Contract และเอกสารยังระบุ `Delta pending confirmation` อยู่ อย่ารอแก้โค้ด: ยืนยันให้ชัดว่า P1 ไม่เขียน IP ลง `audit_logs`, Auth ส่งเฉพาะ canonical event และข้อมูลที่ redact แล้ว                                                                                                                             |
| 2     | **#4 Argon2id + Dummy Hash**          | ล็อกก่อนเขียน Login และ Seed User เลือก Argon2id `m=19456 KiB, t=2, p=1` เป็น baseline แล้ว benchmark ให้การ verify ต่ำกว่า ~1 วินาที กรณีไม่พบบัญชีให้ verify กับ dummy hash ก่อนตอบ `401` เพื่อลด timing-based username enumeration [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| 3     | **#1 Rate-limit storage + Client IP** | กระทบโครงสร้าง runtime มากที่สุด แนะนำ P1 ใช้ bounded in-memory TTL store ได้ **เฉพาะ** deployment แบบ FastAPI process เดียว; ถ้ามีหลาย instance ต้อง Shared Cache เช่น Redis ภายหลัง ส่วน IP: เชื่อ `X-Forwarded-For` ได้เฉพาะเมื่อ request มาจาก Trusted Proxy ที่ตั้งค่าไว้ มิฉะนั้นใช้ IP ที่เชื่อมต่อจริง                                   |
| 4     | **#2 Error Response JSON**            | ล็อกพร้อม API ก่อน Frontend เริ่ม แนะนำรูปเดียว เช่น `{ "error": { "code": "AUTH_SESSION_INVALID", "message": "Your session has expired. Please sign in again." } }` ห้ามมีรายละเอียดภายในหรือข้อมูลลับ                                                                                                                                          |
| 5     | **#3 UI เมื่อได้ 401/403**            | ต้องตัดสินใจพร้อมข้อ 2: `401` ล้าง local user state แล้วกลับหน้า Login; `403` ให้อยู่หน้าเดิมและแจ้ง “ไม่มีสิทธิ์” โดยห้าม logout; `429` อยู่หน้า Login และแจ้งให้รอสักครู่                                                                                                                                                                      |

สรุปเป็นแผนลงมือ:

1. วันนี้คุยและปิด #5 กับ Audit
2. ก่อนเขียน `POST /login` ให้ล็อก #4 และ #1
3. ก่อนเริ่ม React Login/Route Guard ให้ล็อก #2 กับ #3 เป็นชุดเดียว
4. จากนั้นเริ่มทำ Schema → Password/Session service → Auth Guard → Login/Logout/Me → RBAC → Frontend ได้

จุดสำคัญคือ **#2 กับ #3 ไม่ควรคิดแยกกัน** เพราะ Error Code คือสัญญาระหว่าง Backend กับ UX ของ Frontend ครับ




**#5 Audit integration**
คุยกับ Audit ก่อน เพราะเป็น Shared Contract และเอกสารยังระบุ `Delta pending confirmation` อยู่ อย่ารอแก้โค้ด: ยืนยันให้ชัดว่า P1 ไม่เขียน IP ลง `audit_logs`, Auth ส่งเฉพาะ canonical event และข้อมูลที่ redact แล้ว2

**Audit integration** คือการเชื่อม Auth เข้ากับ “สมุดบันทึกกลาง” ของระบบ ไม่ใช่ให้ Auth สร้างตารางหรือ API Audit ของตัวเอง

ภาพที่ถูกต้องคือ:

```
Auth endpoint
  → record_auth_event() ของ Auth
  → แปลง/ตรวจ event ตามกติกา Auth
  → record_audit_event() ของ Audit Trail
  → INSERT audit_logs ใน DB transaction เดียวกัน

Admin → GET /api/audit-logs → Audit Trail เป็นเจ้าของ
Dashboard → อ่าน Recent Activity แบบ read-only และ redact ข้อมูล
```

หน้าที่แต่ละฝ่ายคือ:

- **Auth** เป็น Producer: รู้ว่าเกิด Login, Logout, เปลี่ยนรหัส, Deactivate, Permission Denied
- **Audit Trail** เป็น Owner ของ `audit_logs`, Global Action Registry, ฟังก์ชันเขียนกลาง และ Full Audit API
- **D&M** เป็น Consumer: อ่านเฉพาะกิจกรรมที่อนุญาตไปแสดง Dashboard แต่ไม่มีสิทธิ์แก้หรือเปิดข้อมูลลับ

ตามเอกสารปัจจุบัน Auth ควรเรียก wrapper ของตัวเองด้วยข้อมูลเพียง 4 ค่า:

```
record_auth_event(action, resource_type, resource_id, actor_id)
```

แล้ว wrapper จะ map เป็นข้อมูล Audit กลางเอง เช่น:

|เหตุการณ์ Auth|`result`|`safe_error_category`|`actor_id`|
|---|---|---|---|
|Login สำเร็จ|`success`|`null`|user ที่ login สำเร็จ|
|ไม่พบบัญชี|`failure`|`authentication_error`|`null`|
|พบบัญชีแต่รหัสผิด|`failure`|`authentication_error`|`null`|
|Permission denied|`failure`|`authorization_error`|user ที่ยืนยันตัวตนแล้ว|

กรณี Login ผิดต้องจำกฎนี้:

- ไม่พบบัญชี: `resource_type=auth`, `resource_id=null`
- บัญชีมีจริงแต่รหัสผิด: `resource_type=user`, `resource_id=<id ผู้ใช้เป้าหมาย>`
- ทั้งสองกรณี `actor_id=null` เพราะยังพิสูจน์ไม่ได้ว่าใครเป็นคนพิมพ์

กฎสำคัญคือ Auth **ห้าม** เขียน SQL ลง `audit_logs` เอง และห้ามสร้าง action เองนอก Registry; Audit Writer จะตรวจ action/resource/result/error category ก่อนบันทึกเสมอ [Event Catalog](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\02_Data Ownership and Event Catalog.md)

เรื่อง IP ที่ทำให้สถานะยัง pending คือ:

- `auth_sessions.ip_address` เก็บเพื่อวิเคราะห์ Session ฝั่ง Auth ได้
- แต่ P1 ตกลงว่า **ห้าม copy IP นั้นลง `audit_logs`**
- Dashboard ห้ามแสดง IP, `description`, หรือ `safe_error_category`
- Full Audit ของ Admin เห็น `description` ได้เฉพาะที่ redact แล้ว และ Auth ควรส่ง `description=null` หรือข้อความ template ที่ปลอดภัย ไม่ส่ง password, token, cookie, secret หรือ username ที่พิมพ์ผิดเด็ดขาด

จึงไม่ใช่ข้อขัดแย้งว่าห้ามเก็บ IP ทุกที่ แต่คือ **ห้าม IP เข้า Audit Trail และห้ามออก Dashboard** [Audit API Contract](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\04_API Contracts.md)

ที่ต้องยืนยันกับ Audit มีเพียงนี้:

1. Auth จะไม่ส่ง Client IP เข้า `record_audit_event()` หรือ `audit_logs`
2. Auth จะส่ง event ตาม Registry เท่านั้น
3. Auth จะใช้ Audit Writer กลางและ DB transaction เดียวกับ business action
4. Auth จะไม่ส่ง raw identifier, password, token หรือ secret เข้า `description`

เมื่อ Auth ยืนยัน 4 ข้อนี้ แล้ว Audit Owner อัปเดต matrix จาก `Delta pending confirmation` เป็น Reconciled ก็ถือว่า integration ปิดได้ครับ [Integration Matrix](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\06_Integration Contract Matrix.md)



## Verdict: Approved with Conditions

เนื้อหาโดยรวมตรงกับ Contract ปัจจุบัน โดยเฉพาะ ownership, canonical events, null actor และการไม่เก็บ IP ใน `audit_logs` แต่ควรแก้ 3 จุดก่อนใช้เป็นข้อสรุป

1. **Transaction ต้องแยกกรณี**

ข้อความ “ใช้ transaction เดียวกับ business action” ใช้กับเหตุการณ์ที่มีการเปลี่ยนข้อมูล เช่น:

- Login สำเร็จ: สร้าง session + audit event
- เปลี่ยนรหัสผ่าน
- สร้าง/แก้ไข/Deactivate ผู้ใช้

แต่ `user.login_failed` ต้องบันทึกให้สำเร็จแม้ Authentication ถูกปฏิเสธ เพราะไม่มี business action ที่จะ commit หากนำไปรวมกับ transaction ที่ rollback อาจทำให้หลักฐาน Login ล้มเหลวหาย

ควรแก้ข้อ 3 เป็น:

> Auth action ที่เปลี่ยนข้อมูลต้องเขียน Audit ใน transaction เดียวกัน ส่วน `user.login_failed` ต้องใช้ intentional audit transaction ที่ commit ได้ แม้การ Login จะถูกปฏิเสธ

2. **Auth caller ไม่ควรส่ง `description`**

Contract ปัจจุบันกำหนด wrapper เพียง 4 ค่า: [Auth Component Diagram](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\00_Authentication(Naphat\)\\03_Component Diagram.md)

ดังนั้นให้เปลี่ยนจาก:

> Auth ควรส่ง `description=null` หรือข้อความ template

เป็น:

> Auth caller ไม่ส่ง `description`; `record_auth_event()` หรือ Audit Writer กำหนดให้เป็น `null` หรือ fixed safe template ภายในเท่านั้น

3. **แก้รูปแบบตาราง**

หัวตารางปัจจุบันเลื่อนผิด ควรเป็น:

|เหตุการณ์ Auth|`result`|`safe_error_category`|`actor_id`|
|---|---|---|---|
|Login สำเร็จ|`success`|`null`|ผู้ใช้ที่ Login สำเร็จ|
|ไม่พบบัญชี|`failure`|`authentication_error`|`null`|
|พบบัญชีแต่รหัสผิด|`failure`|`authentication_error`|`null`|
|Permission denied|`failure`|`authorization_error`|ผู้ใช้ที่ยืนยันตัวตนแล้ว|

ส่วนอื่นถูกต้องตามหลักฐาน:

- Audit เป็นเจ้าของ writer, registry และ Full Audit API: [Event Catalog](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\02_Data Ownership and Event Catalog.md)
- `audit_logs` ไม่มี IP แต่ `auth_sessions.ip_address` ยังมีได้: [Central Schema](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\Data Information 27-06-69.md)
- D&M ห้ามส่ง IP, description และข้อมูลละเอียดอ่อน: [Audit API Contract](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\04_API Contracts.md)
- Matrix ยังเป็น `Delta pending confirmation` จริง: [Integration Matrix](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\06_Integration Contract Matrix.md)

หลังแก้สามจุดนี้ เนื้อหา #5 พร้อมใช้คุยเพื่อปิด Audit integration ได้ครับ


ผมเห็นด้วยกับ Audit ทั้ง 3 ข้อ และต้องแก้คำอธิบายเดิมของผม 2 จุดครับ

1. เรื่อง Transaction — Audit ถูกต้อง  
    ผมพูดกว้างเกินไปว่า “ทุกอย่างอยู่ transaction เดียวกัน” ซึ่งใช้ไม่ได้กับ `user.login_failed`
    
    กติกาที่ถูกต้องคือ:
    
    - มีการเปลี่ยนข้อมูล: ใช้ transaction เดียวกัน  
        เช่น Login สำเร็จ = สร้าง session + audit, เปลี่ยนรหัส, สร้าง/แก้/Deactivate ผู้ใช้  
        ถ้า Audit เขียนไม่ได้ ต้อง rollback business action ด้วย
        
    - Login ล้มเหลว: ใช้ intentional audit transaction แยก แล้ว commit log แม้สุดท้าย API ตอบ `401`  
        มิฉะนั้นหลักฐาน failed login จะหายไปพร้อม transaction ที่ rollback
        
2. เรื่อง `description` — Audit ถูกต้อง  
    Auth caller ส่งได้แค่ 4 ค่าเท่านั้น:
    
    ```
    action, resource_type, resource_id, actor_id
    ```
    
    ดังนั้นคำที่ถูกต้องคือ:
    
    > Auth caller ไม่ส่ง `description`; `record_auth_event()` หรือ Audit Writer กำหนดเป็น `null` หรือ fixed safe template ภายในเท่านั้น
    
    และถึงจะเป็น template ก็ห้ามใส่ password, token, cookie, secret หรือ raw username/email ที่กรอกผิด
    
3. ตาราง — ใช้รูปนี้ครับ
    

|เหตุการณ์ Auth|`result`|`safe_error_category`|`actor_id`|
|---|---|---|---|
|Login สำเร็จ|`success`|`null`|ผู้ใช้ที่ Login สำเร็จ|
|ไม่พบบัญชี|`failure`|`authentication_error`|`null`|
|พบบัญชีแต่รหัสผิด|`failure`|`authentication_error`|`null`|
|Permission denied|`failure`|`authorization_error`|ผู้ใช้ที่ยืนยันตัวตนแล้ว|

ผมขอเพิ่มข้อที่ต้องล็อกอีกข้อหนึ่งด้วย: ถ้า intentional audit transaction ของ `user.login_failed` เขียนไม่สำเร็จ จะตอบอะไร? ค่าแนะนำคือ **ไม่ออก session เด็ดขาด และตอบ `503` แบบ generic** เพราะระบบ Audit/DB กลางผิดปกติ ไม่ควรแกล้งตอบ `401` แล้วทำให้หลักฐานสำคัญหายเงียบ ๆ

สรุป: Audit review นี้ถูกต้อง และหลังปรับ 3 จุดพร้อมล็อก policy กรณี Audit write ล้มเหลว ก็สามารถปิด Auth ↔ Audit integration ได้อย่างมีหลักฐานครับ


| 2   | **#4 Argon2id + Dummy Hash** | ล็อกก่อนเขียน Login และ Seed User เลือก Argon2id `m=19456 KiB, t=2, p=1` เป็น baseline แล้ว benchmark ให้การ verify ต่ำกว่า ~1 วินาที กรณีไม่พบบัญชีให้ verify กับ dummy hash ก่อนตอบ `401` เพื่อลด timing-based username enumeration [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |


ข้อนี้คือการล็อก “วิธีเก็บและตรวจรหัสผ่าน” ก่อนทำ Login ครับ

ให้สรุปเป็นกติกานี้ได้เลย:

- ใช้ **Argon2id** เก็บ password ทุกบัญชี รวมถึง Seed User
- ใช้ baseline `m=19456 KiB` (= 19 MiB), `t=2`, `p=1`
    - `m` = ใช้หน่วยความจำ 19 MiB ต่อการ hash/verify
    - `t` = ทำซ้ำ 2 รอบ
    - `p` = ใช้ parallelism 1
- Library สร้าง salt ใหม่ให้ทุก password เอง และเก็บค่า parameter + salt + hash ไว้ใน PHC string เดียวใน `users.password_hash`
- ต้อง benchmark บนเครื่อง/Container ที่ใช้ Demo จริง: การ verify หนึ่งครั้งควรต่ำกว่า ~1 วินาที เพื่อไม่ให้ Login ช้าเกินไปหรือเปิดช่อง DoS ง่าย
- Seed script ต้องเรียก Password Hasher ตัวเดียวกับระบบ Login ห้ามมีค่าพิเศษสำหรับ Seed

**Dummy Hash** มีไว้ป้องกันการเดาชื่อผู้ใช้จากเวลา Response

```
กรอกชื่อที่ไม่มีในระบบ
  → Backend ก็ยัง verify password กับ dummy_hash
  → ใช้เวลาพอ ๆ กับกรณีมี user แต่รหัสผิด
  → ตอบ 401 AUTH_INVALID_CREDENTIALS เหมือนเดิม
```

ลำดับ Login ที่แนะนำ:

```
1. ตรวจ Rate Limit
2. หา user จาก username/email
3. ไม่พบ user → verify(input_password, dummy_hash) แล้วทิ้งผล
4. พบบัญชี → verify(input_password, user.password_hash)
5. ผิด / inactive → audit login_failed และตอบ 401 แบบเดียวกัน
6. ถูกต้อง + active → สร้าง opaque session และ audit login_success
```

สำหรับบัญชี inactive ให้ verify กับ hash จริงแล้วทิ้งผลเช่นกัน ก่อนตอบ `401` เพื่อไม่ให้เวลาต่างจากบัญชีปกติ

ค่า `m=19456, t=2, p=1` เป็น baseline ที่ OWASP แนะนำสำหรับ Argon2id; หาก benchmark ช้าหรือกิน RAM เกินบนเครื่อง Demo ให้เปลี่ยนได้ แต่ต้องบันทึกค่าที่เลือกและใช้ค่าเดียวกันทั้ง Seed/Login/Change Password ครับ [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)



| 3   | **#1 Rate-limit storage + Client IP** | กระทบโครงสร้าง runtime มากที่สุด แนะนำ P1 ใช้ bounded in-memory TTL store ได้ **เฉพาะ** deployment แบบ FastAPI process เดียว; ถ้ามีหลาย instance ต้อง Shared Cache เช่น Redis ภายหลัง ส่วน IP: เชื่อ `X-Forwarded-For` ได้เฉพาะเมื่อ request มาจาก Trusted Proxy ที่ตั้งค่าไว้ มิฉะนั้นใช้ IP ที่เชื่อมต่อจริง |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
ข้อนี้คือการตัดสินใจว่า ระบบจะ “จดจำนวนครั้งที่ Login ผิด” ไว้ที่ไหน และจะรู้ IP จริงของผู้ใช้ได้อย่างไร

## 1. Rate-limit ทำงานอย่างไร

ตาม Contract ปัจจุบัน:

```
IP เดียว Login ผิดได้ 5 ครั้งใน 15 นาที
ครั้งที่ 6 → ตอบ 429 AUTH_LOGIN_RATE_LIMITED
ครบ 15 นาที → ทดลองใหม่ได้
```

ตัวอย่างข้อมูลชั่วคราว:

```
192.168.1.10 → ผิด 5 ครั้ง → หมดอายุ 14:30
192.168.1.20 → ผิด 2 ครั้ง → หมดอายุ 14:35
```

Backend ต้องตรวจ Rate Limit **ก่อน** Query User และทำ Argon2id เพื่อไม่ให้ผู้โจมตียิง Request จำนวนมากจนกิน RAM/CPU

## 2. จะเก็บ Counter ไว้ที่ไหน

|ตัวเลือก|ข้อดี|ข้อเสีย|
|---|---|---|
|Memory ใน FastAPI|ง่าย ไม่เพิ่มระบบใหม่ เร็ว|Restart แล้ว Counter หาย และแต่ละ Worker เห็นข้อมูลไม่ตรงกัน|
|PostgreSQL|ทุก Worker เห็นตรงกันและไม่หายเมื่อ Restart|เพิ่มตาราง, Write เยอะ, Cleanup ซับซ้อน|
|Shared Cache เช่น Redis|รองรับหลาย Worker, TTL เหมาะกับ Rate Limit|เพิ่ม Infrastructure และ Dependency ใหม่|

คำแนะนำสำหรับ MyNetMate P1:

> ใช้ **bounded in-memory TTL store** และรัน FastAPI เพียง **1 process/worker**

เหมาะกับ Capstone และ Demo ที่ Backend มี instance เดียว ไม่จำเป็นต้องเพิ่ม Redis หรือตารางใหม่

เงื่อนไขสำคัญ:

- Counter ต้องหมดอายุอัตโนมัติใน 15 นาที
- จำกัดจำนวน key สูงสุดเพื่อป้องกัน Memory เต็ม
- Restart แล้ว Counter หายถือเป็นข้อจำกัดที่ยอมรับใน P1
- ถ้าอนาคตใช้หลาย Worker/หลาย Container ต้องเปลี่ยนเป็น Shared Cache
- ห้ามประกาศว่า in-memory limiter รองรับระบบ distributed

## 3. Identifier เก็บอย่างไร

นอกจาก IP ระบบจะติดตาม username/email ที่ถูกลองด้วย แต่ห้ามเก็บข้อความดิบ:

```
normalize(identifier)
        ↓
HMAC(RATE_LIMIT_HMAC_KEY, identifier)
        ↓
เก็บเฉพาะค่าที่อ่านย้อนกลับไม่ได้
```

P1 แนะนำให้ Identifier Counter ใช้สำหรับตรวจจับ/ทดสอบเท่านั้น ยังไม่ต้อง Lock Account เพื่อป้องกันผู้โจมตีจงใจทำให้บัญชีคนอื่นถูกล็อก

## 4. ปัญหา Client IP กับ Reverse Proxy

ถ้า Browser เชื่อมต่อ FastAPI โดยตรง:

```
Browser → FastAPI
```

FastAPI อ่าน IP จาก Connection ได้เลย

แต่ Production มักเป็น:

```
Browser → Nginx/Reverse Proxy → FastAPI
```

FastAPI อาจมองเห็น IP ของ Nginx แทน IP ผู้ใช้ จึงต้องอ่าน forwarded header ที่ Proxy ใส่มา

ปัญหาคือผู้โจมตีสามารถปลอม `X-Forwarded-For` ได้ หาก Backend เชื่อ Header จากทุกคน:

```
ผู้โจมตีส่ง X-Forwarded-For: IP-ปลอม
→ เปลี่ยน IP ทุกครั้ง
→ หลบ Rate Limit
```

กฎที่ควรล็อก:

- ถ้า Request มาจาก Trusted Reverse Proxy ที่กำหนดไว้ จึงอนุญาตให้อ่าน Client IP จาก Forwarded Header
- ถ้าไม่ได้มาจาก Trusted Proxy ให้ใช้ IP จาก Connection
- ห้ามเชื่อ `X-Forwarded-For` จาก Internet โดยตรง
- Production ควรปิดไม่ให้ผู้ใช้เข้าถึง FastAPI โดยตรง ต้องผ่าน Reverse Proxy เท่านั้น

## ข้อสรุปสำหรับ P1

> MyNetMate ใช้ bounded in-memory TTL Rate Limiter ใน FastAPI process เดียว โดยจำกัด Login ผิด 5 ครั้งต่อ Client IP ภายใน 15 นาที ตรวจ limiter ก่อน Argon2id และเชื่อ Forwarded Header เฉพาะจาก Trusted Proxy เท่านั้น ส่วน Identifier จะ Normalize และ HMAC ก่อนเก็บชั่วคราว

แนวคิด Login Throttling นี้ตรงกับคำแนะนำให้ป้องกันการโจมตีแบบอัตโนมัติของ [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#login-throttling) ครับ


| 4   | **#2 Error Response JSON** | ล็อกพร้อม API ก่อน Frontend เริ่ม แนะนำรูปเดียว เช่น `{ "error": { "code": "AUTH_SESSION_INVALID", "message": "Your session has expired. Please sign in again." } }` ห้ามมีรายละเอียดภายในหรือข้อมูลลับ |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

`Error Response JSON` คือ “รูปแบบมาตรฐาน” ที่ Backend ใช้ตอบเมื่อเกิดข้อผิดพลาด เพื่อให้ Frontend ไม่ต้องเดาว่า Error แต่ละ API หน้าตาอย่างไร

ตัวอย่าง ถ้า Session หมดอายุ:

```
{
  "error": {
    "code": "AUTH_SESSION_INVALID",
    "message": "Your session is invalid or has expired."
  }
}
```

ความหมายของแต่ละส่วน:

- HTTP Status เช่น `401` บอกประเภทปัญหากว้าง ๆ
- `error.code` บอกเหตุผลที่แน่นอนให้ Frontend ตัดสินใจ
- `error.message` เป็นข้อความปลอดภัยสำหรับแสดงกับผู้ใช้
- ห้ามมี Stack Trace, SQL Error, Password, Token หรือข้อมูลภายใน

## ทำไมต้องมี `error.code`

เพราะ HTTP Status เดียวกันอาจมีหลายกรณี:

```
401 AUTH_INVALID_CREDENTIALS
→ Login ผิด ให้อยู่หน้า Login

401 AUTH_SESSION_MISSING
→ ยังไม่ได้ Login ให้ไปหน้า Login

401 AUTH_SESSION_INVALID
→ Session หมดอายุหรือถูก Revoke
→ ล้าง user state แล้วไปหน้า Login
```

ถ้ามีเพียง `401` Frontend จะแยกสามกรณีนี้ไม่ได้ หรืออาจต้องอ่านข้อความ `message` ซึ่งเปลี่ยนภาษาแล้วระบบพัง

ดังนั้น Frontend ต้องตัดสินใจจาก `error.code` ไม่ใช่ `message`

## รูปแบบที่แนะนำสำหรับ MyNetMate

ข้อผิดพลาดทั่วไป:

```
{
  "error": {
    "code": "AUTH_FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

Validation Error:

```
{
  "error": {
    "code": "AUTH_REQUEST_INVALID",
    "message": "Request validation failed.",
    "fields": [
      {
        "field": "new_password",
        "code": "INVALID_LENGTH",
        "message": "Password must be 12-128 characters."
      }
    ]
  }
}
```

`fields` มีเฉพาะ `400/422` ที่เกี่ยวกับแบบฟอร์ม และห้ามส่งค่าที่ผู้ใช้กรอกกลับมาใน Error

## Error หลักของ Auth

|HTTP|`error.code`|Frontend ทำอะไร|
|---|---|---|
|`400`|`AUTH_CURRENT_PASSWORD_INVALID`|แสดง Error ที่ช่องรหัสผ่านปัจจุบัน|
|`401`|`AUTH_INVALID_CREDENTIALS`|อยู่หน้า Login และแสดงข้อความกลาง|
|`401`|`AUTH_SESSION_MISSING`|ไปหน้า Login|
|`401`|`AUTH_SESSION_INVALID`|ล้าง user state แล้วไปหน้า Login|
|`403`|`AUTH_FORBIDDEN`|อยู่หน้าเดิมและแสดงว่าไม่มีสิทธิ์|
|`403`|`AUTH_ORIGIN_REJECTED`|แสดง Error ทั่วไปและบันทึกฝั่ง Server|
|`403`|`AUTH_CSRF_REJECTED`|แสดง Error ทั่วไปและบันทึกฝั่ง Server|
|`404`|`AUTH_USER_NOT_FOUND`|แจ้งว่าไม่พบผู้ใช้เป้าหมาย|
|`409`|`AUTH_USER_ALREADY_EXISTS`|แจ้ง Username/Email ซ้ำ|
|`409`|`AUTH_LAST_ADMIN_PROTECTED`|แจ้งว่าห้ามปิด Admin คนสุดท้าย|
|`422`|`AUTH_REQUEST_INVALID`|แสดง Validation Error|
|`429`|`AUTH_LOGIN_RATE_LIMITED`|แจ้งให้รอก่อนลองใหม่|
|`503`|`AUTH_SERVICE_UNAVAILABLE`|แจ้งว่าระบบชั่วคราวไม่พร้อม ห้ามออก Session|

กรณี Login ผิดต้องตอบเหมือนกันเสมอ:

```
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid username/email or password."
  }
}
```

ห้ามแยกว่าไม่พบ Username, Email ไม่มีในระบบ, บัญชี inactive หรือ Password ผิด เพื่อป้องกัน User Enumeration

## ข้อสรุปที่ควรล็อก

> Auth API ทุก Error ใช้ `{ "error": { "code", "message" } }` เป็นรูปแบบกลาง เพิ่ม `fields` ได้เฉพาะ Validation Error ที่ปลอดภัย Frontend ตัดสินพฤติกรรมจาก `error.code` และห้าม Backend ส่งข้อมูลลับหรือรายละเอียดภายในระบบใน Error Response ครับ


ข้อนี้คือการกำหนดว่า Frontend ต้องทำอะไรเมื่อ Backend บอกว่า `401` หรือ `403` เพื่อไม่ให้ผู้ใช้เจอหน้าค้าง หรือถูก Logout ผิดกรณี

## ความแตกต่างหลัก

- `401 Unauthorized` = Backend ยืนยันไม่ได้ว่าผู้ใช้กำลัง Login อยู่
- `403 Forbidden` = Backendรู้แล้วว่าเป็นใคร แต่ Role ไม่มีสิทธิ์ทำสิ่งนั้น

ชื่อ HTTP อาจทำให้งง แต่จำง่าย ๆ ว่า:

```
401 = ไม่รู้ว่าเป็นใครแล้ว
403 = รู้ว่าเป็นใคร แต่ไม่อนุญาต
```

## พฤติกรรมที่ควรล็อก

|Error Code|UI ต้องทำอะไร|
|---|---|
|`AUTH_INVALID_CREDENTIALS`|อยู่หน้า Login แสดง “Username/Email หรือ Password ไม่ถูกต้อง”|
|`AUTH_SESSION_MISSING`|ไปหน้า Login โดยไม่จำเป็นต้องแจ้งว่า Session หมดอายุ|
|`AUTH_SESSION_INVALID`|ล้าง Auth state และข้อมูล cache ของผู้ใช้เดิม ไปหน้า Login พร้อมแจ้ง “Session หมดอายุหรือถูกยกเลิก”|
|`AUTH_FORBIDDEN`|ห้าม Logout ให้อยู่หน้าเดิมหรือแสดงหน้า Access Denied|
|`AUTH_ORIGIN_REJECTED`|ไม่ Logout แสดงว่า Request ถูกปฏิเสธด้านความปลอดภัย|
|`AUTH_CSRF_REJECTED`|ไม่ Logout แสดง Error ทั่วไป และไม่ Retry Request อัตโนมัติ|

## กรณี Session หมดอายุ

เพราะ Session Token อยู่ใน `HttpOnly` Cookie JavaScript อ่านวันหมดอายุไม่ได้ Frontend จะรู้เมื่อเรียก API แล้ว Backend ตอบ:

```
{
  "error": {
    "code": "AUTH_SESSION_INVALID",
    "message": "Your session is invalid or has expired."
  }
}
```

Frontend จึงต้อง:

```
ได้รับ AUTH_SESSION_INVALID
  → ล้างข้อมูล user ใน Zustand
  → ล้าง TanStack Query cache ที่เป็นข้อมูลผู้ใช้เดิม
  → ไป /login
  → แสดง “Session หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง”
```

ต้องล้าง Query cache ด้วย เพราะถ้าเพียงกลับหน้า Login ข้อมูลของ Admin คนเดิมอาจยังค้างอยู่ใน Browser แล้วผู้ใช้คนถัดไปเห็นได้

## กรณีถูก Deactivate หรือเปลี่ยน Role

```
Operator กำลังใช้งาน
  → Admin Deactivate Operator
  → Backend Revoke Session ทั้งหมด
  → Operator เรียก API ครั้งถัดไป
  → ได้ 401 AUTH_SESSION_INVALID
  → Frontend ล้าง state/cache และกลับหน้า Login
```

นี่คือ Demo Scenario สำคัญของ Authentication

## กรณี 403

ตัวอย่าง Viewer พยายามเปิดหน้าจัดการผู้ใช้:

```
Viewer ยัง Login ถูกต้อง
  → เรียก Admin API
  → Backend ตอบ 403 AUTH_FORBIDDEN
  → Frontend แสดง Access Denied
  → Session Viewer ยังใช้งาน Dashboard ต่อได้
```

ห้ามล้าง Session เมื่อได้ `403` เพราะผู้ใช้ยัง Login ถูกต้อง เพียงไม่มีสิทธิ์เฉพาะการกระทำนั้น

## Frontend Route Guard

Frontend ควรซ่อนเมนูหรือป้องกัน Route ตาม Role เพื่อ UX:

- Viewer ไม่เห็นเมนู User Management
- Operator ไม่เห็น Settings ของ Admin
- Admin เห็นหน้าจัดการผู้ใช้

แต่ถ้าผู้ใช้พิมพ์ URL เองหรือเรียก API โดยตรง Backend ยังต้องตรวจ Permission และตอบ `403` เพราะ Frontend Route Guard ไม่ใช่มาตรการ Security จริง

## ข้อสรุปที่ควรล็อก

> `AUTH_SESSION_MISSING`/`AUTH_SESSION_INVALID` จาก Protected API ให้ล้าง Auth state และกลับหน้า Login ส่วน `AUTH_FORBIDDEN`, `AUTH_ORIGIN_REJECTED` และ `AUTH_CSRF_REJECTED` ห้าม Logout ผู้ใช้ Frontend ต้องตัดสินพฤติกรรมจาก `error.code` และต้องล้างข้อมูล cache ของผู้ใช้เดิมเมื่อ Session สิ้นสุดครับ