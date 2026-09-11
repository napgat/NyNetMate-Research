# Prepared-for-Implementation Notes — Authentication

> [!IMPORTANT]
> ไฟล์นี้เป็นบันทึกการเตรียมงานและประวัติการพิจารณา ไม่ใช่ Canonical Contract ล่าสุด มติปัจจุบันให้อ้างอิง `03_Component Diagram.md`, `04_API Contracts.md`, `05_Acceptance Tests.md`, `07_Test Users and Environment Policy.md` และ `../ADR_Login Rate Limiter Decisions.md` เท่านั้น
>
> **Lean P1 decision (Naphat approved):** Rate Limiter บังคับใช้เฉพาะ Canonical Client IP; ไม่มี Identifier Telemetry, Identifier Counter, HMAC Identifier หรือ `AUTH_RATE_LIMIT_HMAC_KEY`; Capacity 10,000 Keys หมายถึง IP Keys เท่านั้น; คง D3 Reservation (`Failures + In-flight < 5`) และ D15 Explicit Attempt Lifecycle; Login request ยังคงมี `identifier` สำหรับค้นหา Username/Email และห้ามส่ง Raw Failed-login Identifier เข้า Application/Audit Log
>
> เนื้อหาเก่าด้านล่างที่เสนอ HMAC/Identifier Telemetry รวมถึง D1, D2, D8–D10 และส่วน Identifier ของ D16 มีสถานะ **Superseded by Lean P1 decision** และห้ามนำไป Implement

## แผนต่อจากนี้

### Gate 0 — ปิด Runtime Configuration

ก่อนเริ่มงานใหม่:

1. Commit `feat(auth): add database-free runtime configuration contract`
2. ตรวจ Working Tree สะอาด
3. Push `feature/00-auth-core`
4. บันทึกผล `80 passed`

### Milestone 3 — Login Rate Limiter Core

ทำต่อเป็นอันดับแรกโดยใช้ Canonical Client IP และ Trusted Proxy Contract; Runtime Config ไม่ต้องมี HMAC Key สำหรับ Rate Limiter

ขอบเขต:

- Sliding window 15 นาที
- อนุญาต Login ผิด 5 ครั้ง
- ครั้งที่ 6 ต้องถูก Block
- จำกัด Store ไม่เกิน 10,000 Canonical Client IP Keys
- เมื่อ Store เต็ม ให้ Prune ข้อมูลหมดอายุก่อน หากยังเต็มด้วย Active IP Keys ให้ตอบ `503 AUTH_SERVICE_UNAVAILABLE`
- ไม่เก็บ Identifier, Identifier Counter หรือ HMAC Digest ใน Rate Limiter
- Login request ยังคงรับ `identifier` เพื่อค้นหา Username/Email แต่ห้ามเก็บหรือส่ง Raw Failed-login Identifier เข้า Log
- ใช้ Peer IP เป็นค่าเริ่มต้น
- เชื่อ Forwarded Header เฉพาะ Trusted Proxy
- รองรับ Concurrent Request แบบ Atomic
- Inject Clock เพื่อให้ Unit Test ไม่ต้องรอเวลาจริง
- ยังไม่เชื่อม Login API หรือ Database

Commit checkpoint:

```
feat(auth): add bounded login rate limiter core
```

### Milestone 4 — Auth Request Security Core

สร้าง Logic ที่ทดสอบแยกได้ก่อนเชื่อม FastAPI:

- ตรวจ Exact `Origin`
- ใช้ `Referer` เป็น fallback ตาม Contract
- ตรวจ `X-CSRF-Protection: 1`
- Endpoint ที่มี Body ต้องเป็น `application/json`
- `GET`/`HEAD` ไม่มี Side Effect
- `OPTIONS` ข้าม Guard เพื่อให้ CORS จัดการ
- สร้าง Error Code ที่ปลอดภัย
- ยังไม่ติด Guard กับ Route ของ Device/Topology

Commit checkpoint:

```
feat(auth): add request security policy core
```

### Milestone 5 — Auth Contracts และ Validation

ทำส่วนที่ไม่แตะ Database:

- Role enum: Admin, Operator, Viewer
- Permission catalog
- Default-deny permission evaluator
- Username normalization และ Regex
- Email normalization
- Password length 12–128
- Request/response schemas
- Error envelope `{error: {code, message}}`
- Unit Tests ตาม API Contract
- ยังไม่สร้าง Endpoint

Commit checkpoint:

```
feat(auth): add authentication contracts and permission policy
```

### Gate 1 — ประเมิน Database Readiness

เมื่อ Milestone 3–5 เสร็จ ให้หยุดและตรวจร่วมกับทีม:

- Central Schema ใช้อะไรเป็น Source of Truth
- Alembic baseline จะจัดการอย่างไร
- ตารางของเพื่อนกับ SQL init ตรงกันหรือยัง
- Audit Writer interface พร้อมหรือยัง
- Foundation เข้า `main` แล้วหรือยัง

หากทีมยังไม่พร้อม ให้หยุด Auth ที่ขอบเขต DB-free โดยไม่สร้าง SQLite fallback, in-memory user หรือแก้ Device/Topology แทนเพื่อน

### Milestone หลัง Database พร้อม

ค่อยแยก Branch:

```
feature/00-auth-database
```

แล้วทำตามลำดับ:

1. `users` และ `auth_sessions` models
2. Alembic migration แบบ additive
3. Auth repository
4. Login/Logout/Me service
5. Session Cookie จริง
6. Backend Session Guard
7. Audit integration
8. User Management
9. Frontend Login และ Auth state
10. RBAC integration กับ Feature ของทีม

## ข้อสรุป

ตอนนี้ยังไม่ควรไป Feature อื่น และยังไม่ควรเริ่ม Database Authentication งานถัดไปที่เหมาะที่สุดคือ Login Rate Limiter แบบ DB-free บน `feature/00-auth-core` ครับ



**พร้อมเริ่มออกแบบ Milestone ใหม่ครับ** ผลตรวจเป็นดังนี้:

- Repository อยู่ใน Backend ถูกต้อง
- Branch: `feature/00-auth-core`
- **Working Tree สะอาด**
- ประวัติ 3 Commits ล่าสุด:

```
e2a824c feat(auth): add database-free runtime configuration contract
09166d3 feat(auth): add database-free password and session token security core
1d0e9aa chore(auth): prepare backend test database foundation
```

อ่าน `AGENTS.md`, MVP Scope และ Canonical 00–07 พร้อมไฟล์อัปเดตอาจารย์แล้ว โดยไม่อ่านโฟลเดอร์ Review History และยังไม่ได้แก้ไฟล์ครับ

สิ่งที่เสร็จแล้วคือ Password/Token Security Core และ Runtime Configuration Contract ส่วนรอบนี้จะสร้าง **ตัวตัดสินว่า Login Attempt เข้าไปทำงานต่อได้หรือไม่** โดยยังไม่มี Login Service หรือ API

**Design ที่เสนอให้อนุมัติ**

**1. โครงสร้าง Key และความเป็นส่วนตัว — Superseded historical proposal**

แยก Key เป็นสองชนิดภายใน Store:

|Key|ใช้ทำอะไร|
|---|---|
|`("ip", canonical_client_ip)`|บังคับเพดานความล้มเหลวต่อ IP|
|`("identifier", hmac_digest)`|นับความล้มเหลวของ Identifier เพื่อ Telemetry/Test|

Identifier ใช้ `.lower()` ตาม Canonical แล้ว Encode UTF-8 ก่อนทำ **HMAC-SHA256** ด้วย Key จาก Runtime Settings พร้อมข้อความนำหน้าคงที่ เช่น `login-identifier:v1:` เพื่อระบุวัตถุประสงค์ของ Digest

ยังไม่เพิ่มการ Trim, `casefold()` หรือแปลง Email รูปแบบอื่น เพราะเอกสารกำหนด Lowercase และในอนาคตต้องใช้กฎเดียวกับ User Lookup

Store และ Attempt Handle เก็บเฉพาะ Digest ของ Identifier ไม่มี Raw Username/Email และไม่มี Password เป็น Argument ส่วน Client IP เก็บใน Memory ตามหน้าที่ของ Limiter ไม่ส่งออก Log

**Identifier Counter ไม่มีสิทธิ์บล็อกบัญชี** การตัดสิน Threshold ใช้ Client IP เท่านั้น

**2. Sliding Window และคำขอที่กำลังทำงาน**

เก็บเวลาที่ Login **ล้มเหลวจริง** เป็นรายการเรียงลำดับ ใช้ Window `900` วินาที โดยนับเฉพาะเวลา:

```
failure_time > now - 900
```

เมื่อมี 5 Failures ที่ยังไม่หมดอายุ ครั้งถัดไปถูกปฏิเสธทันที การปฏิเสธไม่เพิ่ม Failure และไม่ต่อเวลาบล็อก การ Login สำเร็จไม่ล้าง Failures เดิมของ IP

เพื่อป้องกันคำขอพร้อมกันหลบ Threshold เสนอให้มี **การจองสิทธิ์ระหว่างรอผล**:

```
Failures ใน Window + Attempts ที่กำลังทำงาน < 5
```

จึงจะเริ่ม Attempt ใหม่ได้ เมื่อทราบผล:

- **ล้มเหลว:** เปลี่ยนการจองเป็น Failure ของทั้ง IP และ Identifier ด้วยเวลาเดียวกัน
- **สำเร็จ:** คืนการจอง โดยไม่เพิ่ม Failure
- **ยกเลิก/ระบบผิดพลาด:** คืนการจองเมื่อหยุดงานนั้นแล้ว โดยไม่ตีความเป็นรหัสผ่านผิด

**ผลที่ต้องยอมรับของข้อเสนอนี้:** หาก 5 Attempts กำลังทำงานพร้อมกัน Attempt ที่ 6 จะถูกปฏิเสธชั่วคราว แม้ยังไม่ทราบว่าทั้งห้าจะล้มเหลวหรือไม่ วิธีนี้ป้องกันไม่ให้คำขอพร้อมกันเข้าไปตรวจรหัสผ่านเกินสิทธิ์ที่เหลือ

รายละเอียดการจองนี้เป็น **ข้อเสนอ Implementation** เพื่อทำตามข้อกำหนด Concurrency ไม่ใช่ข้อความที่เอกสารระบุไว้โดยตรงครับ

**3. การ Prune และ TTL**

ก่อนตัดสิน Admission ให้ลบ Failures ที่มีอายุครบ 900 วินาที แล้วลบ Key ที่ไม่มีทั้ง Failure และ Attempt ค้าง

เริ่มด้วยการตรวจ Store ทั้งชุดภายใต้ Lock เพื่อให้โค้ดอ่านง่ายและคืนพื้นที่ของ Key ที่ไม่มีคนเรียกซ้ำได้ จำนวนข้อมูลถูกจำกัดด้วยความจุ Store จึงยังไม่ต้องเพิ่ม Background Task หรือโครงสร้าง Cleanup ซับซ้อน

การหมดอายุใช้กับ Failure ที่จบแล้ว **ไม่ปล่อยการจองที่งานยังทำอยู่เพียงเพราะครบเวลา** เพราะอาจเปิดช่องให้เริ่มงานเกินเพดาน ผู้เรียกภายหลังต้องคืนการจองใน `finally` เมื่อจบงานจริง

**4. เมื่อ Store เต็ม**

เสนอให้นับเพดาน **10,000 Keys รวม IP และ Identifier** ไม่ใช่ชนิดละ 10,000

Admission จะตรวจพื้นที่สำหรับ Key ทั้งสองก่อนแก้ State:

1. Prune ข้อมูลหมดอายุก่อน
2. ถ้ามีพื้นที่ครบ จึงเพิ่ม Key และจอง Attempt พร้อมกัน
3. ถ้าไม่พอ ให้ปฏิเสธด้วยเหตุผลภายใน `capacity_exhausted`
4. ไม่ลบ Counter ที่ยังมีผลเพื่อเปิดทางให้ Key ใหม่
5. คำขอที่ใช้ Keys เดิมยังทำต่อได้หากไม่ติด Threshold

ข้อแลกเปลี่ยนคือ Store เต็มอาจทำให้ผู้ใช้ใหม่เข้าไม่ได้ชั่วคราว แต่ผู้โจมตีจะไม่สามารถหมุน Key เพื่อทำให้ Counter เดิมถูกลบทิ้งได้

ต้องจองพื้นที่ Identifier ตั้งแต่เริ่ม เพื่อไม่ให้บันทึก IP สำเร็จแต่บันทึก Identifier ไม่ได้เมื่อรู้ผลภายหลัง รายการ Failure ก็มีขอบเขต: ทุก Failure ผูกกับ IP ที่มีได้ไม่เกิน 5 รายการใน Window และไม่ถูก Evict ขณะยังมีผล

เอกสารยังไม่ได้ระบุพฤติกรรม Store เต็มโดยตรง จึงเสนอ **Fail Closed และแยกเหตุผลจากการเกิน Threshold** รอบนี้ยังไม่กำหนด HTTP Response สำหรับเหตุผลนี้

**5. Atomic และ Concurrency Boundary**

ใช้ `threading.Lock` หนึ่งตัวต่อ Limiter Instance ครอบคลุม:

- Prune → ตรวจ Threshold/ความจุ → จอง Attempt
- คืนการจอง → บันทึก IP และ Identifier
- ตรวจว่า Attempt ถูกปิดไปแล้วหรือไม่

ไม่ถือ Lock ระหว่าง User Query, Password Verify หรือ `await` ใด ๆ

Attempt Handle ต้องใช้ได้กับ Instance เจ้าของและปิดได้ครั้งเดียว เพื่อกันการเพิ่ม Failure ซ้ำหรือคืนสิทธิ์ผิดรายการ เมื่อเชื่อม Application ภายหลังต้องใช้ **Instance ร่วมกันในหนึ่ง Process/Worker** ไม่สร้างใหม่ทุก Request และยอมรับว่า Restart แล้วข้อมูลหาย

**6. Clock สำหรับ Test**

Inject `Callable[[], float]` โดยค่าปกติใช้ `time.monotonic` หน่วยวินาที ส่วน Tests ใช้ Fake Clock ที่เลื่อนเวลาเองได้

ตรวจเวลาขอบเขต `899.999`, `900` และหลัง `900` ได้โดยไม่ Sleep จริง ทุก Operation อ่านเวลาภายใน Lock เพื่อให้ลำดับข้อมูลสอดคล้องกัน

**7. Client IP และ Trusted Proxy**

Canonical กำหนดให้ใช้การประมวลผล Proxy Header ของ Server ผมตรวจ Source ของ **Uvicorn 0.52.4 ที่ติดตั้งจริง** แล้ว จึงเสนอใช้ความสามารถเดิมผ่าน Adapter ขนาดเล็ก:

- **Proxy ปิด:** สร้าง Options ที่ระบุ `proxy_headers=False` ชัดเจน ใช้ Peer IP
- **Proxy เปิด:** ใช้ `proxy_headers=True` พร้อม Exact Allowlist จาก Settings
- Peer อยู่นอก Allowlist: ไม่เชื่อ Header ที่ส่งมา
- Peer อยู่ใน Allowlist: ให้ Uvicorn ประมวลผล Proxy Chain
- ฝั่ง Auth อ่าน Client IP จาก ASGI Scope หลังผ่าน Server แล้ว และตรวจ/แปลงเป็นรูปแบบ IP มาตรฐาน
- หาก Client IP หายหรือไม่ถูกต้อง ให้ปฏิเสธอย่างปลอดภัย ไม่ใช้ Key ว่างหรือค่า `"unknown"`

Auth จะไม่ Parse `X-Forwarded-For` ซ้ำเอง Tests ใช้ ASGI Stub กับ Middleware ของ Uvicorn โดยไม่เปิด Server ไม่ทำ Network Request และไม่เชื่อม Startup จริง

**8. Public Interface สำหรับใช้ภายหลัง**

ชื่อที่เสนอสำหรับ Contract:

|Interface|หน้าที่|
|---|---|
|`identifier_digest(identifier)`|Normalize และสร้าง HMAC โดยไม่เก็บ Raw Identifier|
|`begin_attempt(client_ip, identifier_digest)`|คืน Attempt Handle หรือผลปฏิเสธ โดยตรวจและจองแบบ Atomic|
|`finish_attempt(handle, outcome)`|รับ `failed`, `succeeded`, `cancelled` แล้วปิด Attempt|
|`prune()`|คืนพื้นที่หมดอายุด้วย Clock ที่ Inject|
|`proxy_header_options(settings)`|แปลง Policy เป็น Options ของ Uvicorn|
|`client_ip_from_scope(scope)`|อ่านและตรวจ Client IP ที่ Server ประมวลผลแล้ว|

ผลปฏิเสธและ Error ไม่แนบ IP, Identifier หรือ HMAC Key

ภายหลัง Authentication Service ต้องเรียก `begin_attempt` **ก่อน User Query และ Argon2id** รอบนี้จะทดสอบลำดับด้วย Test Doubles เท่านั้น ไม่สร้าง Service จริง

**ไฟล์ที่เสนอ**

สำรวจแล้วว่ามีโฟลเดอร์ Authentication และ Tests จริง ชื่อไฟล์ใหม่ด้านล่างยังไม่มี:

|การเปลี่ยนแปลง|ไฟล์|เนื้อหา|
|---|---|---|
|เพิ่ม|[rate_limiter.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/rate_limiter.py)|HMAC Keys, Store, Attempt Lifecycle และ Clock Contract|
|เพิ่ม|[client_ip.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/client_ip.py)|Server Options และอ่าน Client IP|
|เพิ่ม|[test_authentication_rate_limiter.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_rate_limiter.py)|Privacy, Window, Capacity และ Concurrency|
|เพิ่ม|[test_authentication_client_ip.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_client_ip.py)|Proxy Policy กับ ASGI Stub|
|แก้|[config.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/config.py)|เพิ่ม `AUTH_RATE_LIMIT_MAX_KEYS` ค่าเริ่มต้น 10,000 และตรวจจำนวนเต็มอย่างน้อย 2|
|แก้|[test_authentication_config.py](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_config.py)|Tests ของ Max Keys และแยก Environment|
|แก้|[.env.example](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/mynetmate/backend/.env.example)|ตัวอย่าง Max Keys และข้อจำกัดหนึ่ง Worker/Restart|

ขั้นต่ำ 2 Keys เพราะหนึ่ง Attempt ใหม่อาจต้องใช้ทั้ง IP และ Identifier โดยไม่จำเป็นต้องเพิ่ม Dependency ครับ

**9. รายการ Unit Tests**

อ้างอิงหลักจาก [Acceptance Tests ข้อ 10](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md) และ [Environment Policy ข้อ 3](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/07_Test Users and Environment Policy.md):

|กลุ่ม|กรณีที่ต้องพิสูจน์|
|---|---|
|Threshold|ล้มเหลว 5 ครั้งได้; ครั้งที่ 6 ถูกปฏิเสธ และ Test Doubles ของ Query/Verifier ไม่ถูกเรียก|
|Sliding Window|ก่อนครบ 900 วินาทียังนับ; ครบแล้วหมดอายุ; Failures ต่างเวลากันหมดอายุทีละรายการ|
|ผลของ Attempt|Success ไม่เพิ่ม/ไม่ล้าง Failure; การปฏิเสธไม่ต่อเวลา; Cancellation คืนการจอง|
|IP isolation|เปลี่ยน Identifier บน IP เดิมไม่หลบ Threshold; IP อื่นมี Counter แยก|
|Identifier privacy|ตัวพิมพ์ต่างกันได้ Digest เดียวกัน; Key ต่างกันได้ Digest ต่างกัน; ตรวจด้วย HMAC Test Vector; State/Error/Log ไม่มี Raw Identifier หรือ Secret|
|ไม่มี Account Lockout|Identifier เดียวกันจาก IP อื่นยังผ่านได้เมื่อ IP นั้นมีสิทธิ์และ Store มีพื้นที่|
|Capacity|ไม่เกินความจุรวม; การสร้างสอง Keys เป็น All-or-nothing; ไม่ Evict Counter ที่ยังมีผล; Prune แล้วรับ Key ใหม่ได้|
|Concurrency|เริ่มพร้อมกันหลายคำขอผ่านได้ไม่เกินสิทธิ์ที่เหลือ; Failure ไม่สูญหาย; ปิด Handle ซ้ำ/ข้าม Instance ไม่เปลี่ยน Counter|
|Reservation cleanup|งานที่ยังทำอยู่ไม่ถูก Prune ทิ้ง; งานจบคืนสิทธิ์ได้แม้ Clock ผ่าน Window แล้ว|
|Trusted Proxy|ปิดแล้ว Header ปลอมไม่มีผล; Peer ที่ไม่เชื่อถือไม่มีผล; Proxy ที่เชื่อถือและหลาย Hop ให้ผลตาม Server Policy; IP ผิด/หายถูกปฏิเสธ|
|Configuration/restart|Max Keys มี Default และปฏิเสธค่าผิด; Instance ใหม่ไม่มี Counter เดิม|

Concurrency Tests จะประสานด้วย Barrier/Event โดยไม่มี Sleep จริง และรันเฉพาะไฟล์ที่ระบุพร้อม `--noconftest` ตามวิธีเดิม

**รอบนี้ยังไม่มีคำสั่งให้แก้หรือรันครับ** คุณอนุมัติ Design และรายชื่อไฟล์ชุดนี้ไหม โดยรวมข้อเสนอเรื่องการจอง Attempt และการปฏิเสธเมื่อ Store เต็มด้วย?


ยังไม่ควรอนุมัติ Design ครับ และยังไม่ควรให้ Agent Implement

Agent ไม่ได้ “พบค่าจากเอกสารทั้งหมด” แต่นำข้อกำหนดในเอกสารมาผสมกับข้อเสนอทางวิศวกรรมของมันเอง ซึ่งมันระบุบางจุดว่าเป็นข้อเสนอแล้ว แต่รายละเอียดเยอะจนดูคล้ายเป็นข้อสรุปที่อนุมัติแล้ว

เอกสารมีหน้าที่กำหนด “ระบบต้องมีพฤติกรรมอย่างไร” จึงไม่จำเป็นต้องล็อก Class, Function, Lock หรือโครงสร้างข้อมูลทุกตัว แต่เรื่องที่กระทบ Security และ Availability ต้องให้ทีมเลือกก่อน ไม่ควรคิดส่ง ๆ

## สิ่งที่เอกสารล็อกไว้แล้ว

รายการเหล่านี้ไม่ต้องเลือกใหม่:

|เรื่อง|ค่าจากเอกสาร|
|---|---|
|Window|15 นาที หรือ 900 วินาที|
|Failed attempts|อนุญาต 5 ครั้ง|
|การปฏิเสธ|ครั้งที่ 6 ต้องถูกปฏิเสธ|
|ลำดับ|ตรวจ Rate Limit ก่อน User Query และ Argon2id|
|Storage|Bounded in-memory TTL store|
|Capacity เริ่มต้น|10,000 Keys|
|Identifier|Normalize เป็น lowercase แล้วทำ HMAC|
|Privacy|ห้ามเก็บ Raw Username/Email|
|Account lockout|ห้ามใช้ Identifier Counter ล็อกบัญชี|
|Concurrency|การตรวจและเพิ่ม Counter ต้อง Atomic|
|Deployment|หนึ่ง Process/Worker|
|Restart|Counter หายได้|
|Proxy|ปิดเป็นค่าเริ่มต้นและเชื่อเฉพาะ Exact Allowlist|

ค่าพวกนี้ Agent ห้ามเปลี่ยนเอง

## สิ่งที่ไม่มีในเอกสารและ Agent เสนอขึ้นมา

|ข้อเสนอ|สถานะ|
|---|---|
|ใช้ HMAC-SHA256|ยังไม่ได้ล็อก Algorithm ในเอกสาร|
|เติม `login-identifier:v1:` ก่อน HMAC|Domain-separation proposal|
|ใช้ Tuple `("ip", value)`|รูปแบบ Internal Key|
|จอง Attempt ที่กำลังทำงาน|เปลี่ยนพฤติกรรมจาก “5 ครั้งที่ล้มเหลว”|
|Login สำเร็จไม่ล้าง Failure|เอกสารไม่ได้ระบุ|
|Request ที่ถูก Block ไม่เพิ่ม Failure|เอกสารไม่ได้ระบุ|
|Entry หมดอายุเมื่อครบ 900 วินาทีพอดี|Boundary semantics ยังไม่ได้ล็อก|
|10,000 Keys รวม IP และ Identifier|เอกสารไม่ได้บอกว่านับรวมหรือแยก|
|Store เต็มแล้ว Fail Closed|กระทบ Availability และยังไม่ได้อนุมัติ|
|ค่า `max_keys` ขั้นต่ำ 2|เกิดจาก Design สอง Key ของ Agent|
|Full-store prune ทุก Request|เป็น Performance choice|
|ใช้ `threading.Lock`|เป็น Concurrency implementation choice|
|ใช้ `time.monotonic`|เป็น Testing/Clock design choice|
|Reject เมื่อ Client IP หาย|ยังไม่มี Error behavior ใน Contract|
|ชื่อ `begin_attempt`/`finish_attempt`|เป็น API ภายในที่ Agentตั้งเอง|

## จุดที่ต้องระวังเป็นพิเศษ

ข้อเสนอ “จอง Attempt” หมายความว่า หากมี Login 5 Request พร้อมกัน Request ที่ 6 จะถูกปฏิเสธ แม้ 5 Request แรกอาจ Login สำเร็จทั้งหมด นี่ไม่เท่ากับข้อความในเอกสารที่บอกให้นับ Login ที่ล้มเหลว จึงต้องให้คุณเลือกโดยรู้ Trade-off ก่อน

อีกจุดคือ Store เต็มแล้ว Fail Closed หาก Capacity รวม IP และ Identifier เข้าด้วยกัน Identifier Telemetry อาจทำให้ผู้ใช้ใหม่ Login ไม่ได้ ทั้งที่เอกสารบอกว่า Identifier Counter ไม่มีสิทธิ์ทำ Account Lockout จึงต้องพิจารณาว่าจะกลายเป็นการปิดกั้นทางอ้อมหรือไม่

ส่วนชื่อฟังก์ชัน, Tuple และ Clock abstraction เป็นรายละเอียดภายใน Agent สามารถเสนอได้ แต่ต้องมีเหตุผลและ Tests ไม่ใช่สุ่มตั้ง

สรุปคือ:

- ค่า Security Contract: ห้ามคิดเอง
- พฤติกรรมที่ผู้ใช้สังเกตได้: คุณ/ทีมต้องเลือก
- รายละเอียดโค้ดภายใน: Agent เลือกได้หลังอธิบายเหตุผล
- ถ้าเอกสารไม่ระบุและมีผลต่อ Security/Availability: ต้องถือเป็น `Pending Decision`

ส่งข้อความนี้กลับไปหา Agent ได้เลย:

ยังไม่อนุมัติ Design และห้ามเริ่ม Implementation

ข้อเสนอรอบก่อนมีการเลือกรายละเอียดที่เอกสารไม่ได้กำหนดไว้หลายรายการ ฉันต้องการพิจารณาและเลือกเองก่อน

ให้จัดทำ Decision Matrix ใหม่ โดยแยกเป็นสามกลุ่ม:

1. `LOCKED BY DOCUMENT` — มีค่าระบุชัดในเอกสารแล้ว พร้อมอ้างชื่อไฟล์และหัวข้อ
    
2. `OWNER DECISION REQUIRED` — เอกสารไม่ระบุและมีผลต่อ Security, Availability หรือพฤติกรรมที่ผู้ใช้สังเกตได้
    
3. `INTERNAL IMPLEMENTATION DETAIL` — ไม่มีผลต่อ External Contract และสามารถมอบให้ผู้พัฒนาเลือกได้ภายใต้ Tests
    

สำหรับ `OWNER DECISION REQUIRED` ให้แสดงตัวเลือกที่เป็นไปได้อย่างน้อย 2 ตัวเลือกต่อเรื่อง โดยระบุ:

- พฤติกรรมของแต่ละตัวเลือก
    
- ข้อดี
    
- ข้อเสีย
    
- Security impact
    
- Availability impact
    
- Test impact
    
- ความสัมพันธ์กับข้อความในเอกสาร
    

ห้ามเลือกตัวเลือกแทนฉัน ห้ามใช้คำว่า Approved, Final หรือ Default เว้นแต่ค่าดังกล่าวมีระบุในเอกสาร Canonical จริง

อย่างน้อยต้องแยก Decision ต่อไปนี้ออกมา:

- HMAC algorithm และการใช้ Domain-separation prefix
    
- วิธีนับ Attempt ที่กำลังทำงานพร้อมกัน
    
- Login สำเร็จควรล้าง Failure หรือไม่
    
- Request ที่ถูกปฏิเสธควรเพิ่ม Counter หรือไม่
    
- Boundary ที่เวลา 900 วินาที
    
- Capacity 10,000 Keys นับรวม IP/Identifier หรือแยก
    
- Store เต็มแล้วควร Fail Closed, Evict หรือใช้พฤติกรรมอื่น
    
- Identifier Telemetry สามารถทำให้ Login ถูกปฏิเสธทางอ้อมได้หรือไม่
    
- Pruning strategy
    
- Lock/concurrency mechanism
    
- Missing/invalid Client IP behavior
    
- วิธีเชื่อม Trusted Proxy กับ Uvicorn
    
- Public interface และ Attempt lifecycle
    

ยังห้ามแก้ไฟล์ รันคำสั่งที่เปลี่ยน State, Commit หรือ Push

ตอบกลับเป็น Decision Matrix ที่อ่านง่ายก่อน แล้วรอให้ฉันเลือกทีละ Decision

วิธีนี้จะทำให้คุณเป็นคนตัดสินพฤติกรรมของระบบ ส่วน Agent ทำหน้าที่อธิบายทางเลือกและผลกระทบครับ


รับทราบครับ **Design รอบก่อนยังไม่ได้รับอนุมัติ และผมจะไม่เริ่ม Implementation** รายการด้านล่างแยกข้อกำหนดจากเอกสารออกจากสิ่งที่คุณต้องเลือก โดยไม่มีการเลือกให้ล่วงหน้า

เอกสารอ้างอิงใน Matrix:

- **D00:** [00_Glossary.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/00_Glossary.md) — แถว Login Rate Limiter และ Trusted Proxy
- **D01:** [01_MVP - Authentication & RBAC.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/01_MVP - Authentication & RBAC.md) — §1.3 Lean P1 Implementation Decisions
- **D03:** [03_Component Diagram.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/03_Component Diagram.md) — §1.4 Responsibility และ Interface Contract; §2 Login Sequence Flow
- **D04:** [04_API Contracts.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/04_API Contracts.md) — §2.1 Login; §3.2 Error Matrix
- **D05:** [05_Acceptance Tests.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/05_Acceptance Tests.md) — ข้อ 1 Case Normalization; ข้อ 10 Rate Limiting
- **D07:** [07_Test Users and Environment Policy.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/00_Authentication(Naphat\)/07_Test Users and Environment Policy.md) — §3 Auth Runtime Security Environment

**1. `LOCKED BY DOCUMENT`**

| เรื่อง                   | ข้อกำหนดที่ระบุไว้                                                                                                    | อ้างอิง                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Storage                  | Bounded In-memory Sliding-window TTL Store                                                                            | D01 §1.3; D04 §2.1         |
| Threshold                | อนุญาต Login ล้มเหลว 5 ครั้งต่อ Client IP ภายใน 15 นาที                                                               | D04 §2.1; D05 ข้อ 10       |
| ลำดับการปฏิเสธ           | ครั้งที่ 6 ถูกปฏิเสธก่อน User Query และ Argon2id                                                                      | D03 §2; D05 ข้อ 10         |
| ผลเมื่อเกิน Threshold    | `429 AUTH_LOGIN_RATE_LIMITED`                                                                                         | D04 §2.1 และ §3.2          |
| ความจุ                   | ค่าเริ่มต้นสูงสุด 10,000 Canonical Client IP Keys; มีชื่อ Config `AUTH_RATE_LIMIT_MAX_KEYS`                             | D04 §2.1; D07 §3           |
| Identifier               | ใช้ Lookup Username/Email เท่านั้น; Rate Limiter ไม่รับหรือเก็บ และห้ามส่ง Raw Failed-login Identifier เข้า Log       | D04 §2.1; D05 ข้อ 1 และ 10 |
| Identifier Counter       | **Superseded by Lean P1 decision:** ไม่มี Identifier Counter หรือ Identifier Telemetry                                 | ADR Lean P1                |
| HMAC Identifier/Key      | **Superseded by Lean P1 decision:** ไม่ใช้ HMAC Identifier และไม่มี Runtime Secret สำหรับหน้าที่นี้                    | ADR Lean P1                |
| Atomicity                | ตรวจและเพิ่ม Counter แบบ Atomic ภายใน Process; Concurrent Attempts ต้องไม่หลบ Thresholdหรือทำให้จำนวนหาย              | D03 §2; D05 ข้อ 10         |
| Trusted Proxy            | ค่าเริ่มต้นปิด ใช้ Peer IP; เปิดได้เมื่อกำหนด Exact IP Allowlist; ห้าม Wildcard และห้ามเชื่อ Header จาก Client โดยตรง | D04 §2.1; D07 §3           |
| Process                  | P1 ใช้หนึ่ง Process/Worker; Restart แล้ว Counter หายเป็นข้อจำกัดที่ยอมรับ                                             | D04 §2.1; D07 §3           |
| ขอบเขตที่ตัดออก          | Redis, Database Table, Distributed Limiter, CAPTCHA และ Account Lockout                                               | D01 §1.3                   |

**Inject Clock และห้าม Sleep จริง** เป็นข้อกำหนดที่คุณเพิ่มสำหรับ Milestone นี้โดยตรง จึงต้องปฏิบัติตาม แม้ไม่ได้ระบุเป็น Interface ใน Canonical

**2. `OWNER DECISION REQUIRED`**

ตัวเลือกที่ระบุว่า “ต้องปรับ Contract” มีไว้ให้เห็นผลของการเลือก ไม่ถือว่าเข้ากับเอกสารปัจจุบันโดยอัตโนมัติ

**D1 — HMAC algorithm — Superseded by Lean P1 decision**

| ตัวเลือก / พฤติกรรม | ข้อดี / ข้อเสีย                     | Security impact                                        | Availability impact                           | Test impact                                         | ความสัมพันธ์กับเอกสาร                     |
| ------------------- | ----------------------------------- | ------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| A: HMAC-SHA256      | Digest 32 bytes; ต้องตกลงรูปแบบเก็บ | ใช้ Key ป้องกันการคำนวณ Identifier Digest โดยไม่มี Key | ใช้ Memory ต่อ Digest น้อยกว่า B              | Known-answer vector, Key เปลี่ยนแล้ว Digest เปลี่ยน | เอกสารระบุ HMAC แต่ไม่ระบุ Hash algorithm |
| B: HMAC-SHA512      | Digest 64 bytes; ใช้พื้นที่มากกว่า  | เป็น HMAC อีกชุดหนึ่ง ไม่ได้แก้ Key รั่วหรือ Key อ่อน  | Memory มากกว่า; ความเร็วต้องวัดกับเครื่องจริง | ใช้ Vector และความยาวของ SHA512                     | เอกสารไม่ได้ตัดตัวเลือกนี้ออก             |

**D2 — Domain-separation prefix — Superseded by Lean P1 decision**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: HMAC เฉพาะ Normalized Identifier|Input เรียบง่าย; ต้องรักษาว่า Key ใช้เพื่อหน้าที่นี้เท่านั้น|ไม่มีการแยกวัตถุประสงค์ในข้อความที่ HMAC|ไม่มีผลต่อ Admission โดยตรง|ตรวจ Digest ของ Identifier ตรง ๆ|เอกสารไม่ได้บังคับ Prefix|
|B: HMAC Prefix คงที่ตามด้วย Identifier|แยกวัตถุประสงค์ได้; ต้องล็อก Prefix/Encoding และเปลี่ยนแล้ว Digest เปลี่ยน|ลดการใช้ Digest ข้ามวัตถุประสงค์เมื่อเผลอใช้ Key ร่วมกัน แต่ไม่แทนกฎแยก Key|การเปลี่ยนรูปแบบทำให้ Telemetry คนละชุด|ตรวจ Prefix, Encoding และความต่างข้ามวัตถุประสงค์|เป็นรายละเอียดเพิ่มเติมที่ต้องเลือก|

**D3 — Attempts ที่กำลังทำงานพร้อมกัน — Accepted: Reservation (ตัวเลือก A)**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: จองสิทธิ์ โดยนับ `Failures + In-flight` ก่อนเริ่ม|กัน Concurrent Bypass ได้; อาจปฏิเสธก่อนทราบผลทั้งห้า|จำกัดงานที่เข้าไปตรวจรหัสผ่านตามสิทธิ์ที่เหลือ|ผู้ใช้ที่รหัสถูกอาจถูกปฏิเสธชั่วคราวเมื่อสิทธิ์ถูกจองเต็ม|หลายคำขอพร้อมกัน, คืนสิทธิ์, Success/Cancel|รองรับ Atomicity แต่การปฏิเสธเพราะ In-flight ไม่ได้ระบุไว้|
|B: Serialize ต่อ IP ให้รอผลก่อนตรวจคำขอถัดไป|ตัดสินจาก Failures จริง; ต้องกำหนดจำนวนผู้รอและเวลารอ|กัน Bypass ได้ถ้าครอบคลุมตลอด Attempt และตรวจใหม่หลังรอ|เพิ่ม Latency; งานช้าหนึ่งรายการขวาง IP เดียวกัน|ลำดับผู้รอ, Queue เต็ม, Cancellation|รองรับ Atomicity แต่ Queue/Timeout ต้องเลือกเพิ่ม|

การแยก `check()` กับ `record_failure()` แล้ว Lock เฉพาะแต่ละฟังก์ชัน **ยังไม่ใช่ตัวเลือกที่ผ่านข้อกำหนด** เพราะคำขอพร้อมกันอาจผ่าน Check ก่อนมีใครบันทึก Failure

**D4 — Login สำเร็จล้าง Failures หรือไม่**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: เก็บ Failures จนหมด Window|ประวัติ Window ต่อเนื่อง; ผู้ใช้ที่กลับมาสำเร็จยังมี Failures ค้าง|Success ไม่ช่วยรีเซ็ตงบการลองผิด|ผู้ใช้หลัง NAT ยังได้รับผลจาก Failures เดิม|Success ไม่เปลี่ยนรายการ Failures|สอดคล้องการนับ Failures ใน Window; เอกสารไม่กล่าวเรื่อง Reset|
|B: Success ล้าง Failures ของ IP|ฟื้นการใช้งานเร็ว; บัญชีที่รู้รหัสสามารถช่วยล้าง Counter ของ IP|เปิดทางให้ใช้ Success รีเซ็ตงบการลองผิด|ผู้ใช้ IP เดียวกันได้โควตากลับมา|Reset เมื่อ Success และผลต่อ Concurrent Attempts|เปลี่ยนผลของ Threshold ภายใน 15 นาที ต้องชี้แจง/ปรับ Contract ให้ชัด|

**D5 — Request ที่ถูกปฏิเสธเพิ่ม Counter หรือไม่**

| ตัวเลือก / พฤติกรรม                                              | ข้อดี / ข้อเสีย                                                          | Security impact                                | Availability impact                                      | Test impact                              | ความสัมพันธ์กับเอกสาร                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| A: ไม่เพิ่ม Failure และไม่ต่ออายุบล็อก                           | เวลาฟื้นตัวคาดการณ์ได้; ไม่ได้นับปริมาณคำขอที่ถูกบล็อกใน Failure Counter | ผู้โจมตีต่อเวลาบล็อกด้วยคำขอที่ถูกปฏิเสธไม่ได้ | ฟื้นเมื่อ Failures เดิมหมดอายุ                           | Rejection ซ้ำไม่เปลี่ยน Counter/Expiry   | ตรงความหมาย Login ล้มเหลวที่ผ่านการตรวจแล้วใน D03               |
| B: เพิ่ม Counter ของ Rejection แยกเพื่อ Telemetry โดยไม่ใช้บล็อก | เห็นปริมาณคำขอที่ถูกบล็อก; เพิ่ม State/Memory                            | ไม่เปลี่ยน Threshold หากแยกจริง                | เพิ่มภาระ Store ต้องกำหนดขอบเขต                          | แยก Counter และพิสูจน์ว่าไม่ต่อเวลาบล็อก | เป็น Telemetry เพิ่มเติม ไม่ได้ระบุไว้                          |
| C: เพิ่ม Failure/ต่อเวลาบล็อกจาก Rejection                       | กดดันผู้ส่งคำขอต่อเนื่อง; อาจบล็อกยาวไม่สิ้นสุด                          | ผู้โจมตีทำให้ IP ร่วมถูกบล็อกต่อเนื่องได้      | ผู้ใช้หลัง NAT อาจเข้าไม่ได้แม้ Failures จริงเก่าหมดแล้ว | Rejection ต่อเนื่องและการต่อ Window      | เปลี่ยนความหมาย Failure และการปลดเมื่อครบเวลา ต้องปรับ Contract |

**D6 — Boundary ที่อายุ 900 วินาที**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: หมดอายุเมื่อ `age >= 900`|ขอบเขตตรงเวลาครบ; ต้องใช้ Predicate เดียวทุกจุด|ไม่บล็อกเกินอายุที่กำหนด|คืนสิทธิ์ที่เวลา 900 ได้|ก่อน 900, เท่ากับ 900, หลัง 900|เข้ากับข้อความ “เมื่อครบ 15 นาที” มากกว่า แต่เอกสารไม่มี Predicate|
|B: หมดอายุเมื่อ `age > 900`|ใช้ Window แบบรวมจุดขอบ; เท่ากับ 900 ยังนับ|เข้มขึ้นที่จุดขอบ|คืนสิทธิ์หลังผ่านจุด 900|ต้องยืนยันว่าเท่ากับ 900 ยังถูกนับ|มีความตึงกับข้อความ “เมื่อครบ 15 นาที”; ต้องยืนยันความหมายให้ชัด|

**D7 — เวลาเริ่มนับ Failure**

เรื่องนี้แยกจาก D6 เพราะมีผลเมื่อ Attempt ใช้เวลานาน

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: ใช้เวลาเริ่ม Attempt เมื่อภายหลังทราบว่าล้มเหลว|ผูกกับเวลาที่คำขอเข้ามา; ผลอาจมาถึงเมื่อเวลาเกือบหมดแล้ว|Attempt ช้าเหลือเวลาถูกนับสั้นลง|คืนสิทธิ์เร็วกว่าการนับจากผล|Begin และ Finish อยู่คนละเวลา|เอกสารไม่กำหนด Timestamp|
|B: ใช้เวลาที่ทราบผลล้มเหลว|นับ Failure ใหม่ครบ Window; ผู้ใช้รอผลแล้วจึงเริ่มช่วงนับ|Failure อยู่ใน Window เต็มหลังตรวจพบ|เวลารวมตั้งแต่เริ่มคำขออาจเกิน 15 นาที|Completion ต่างลำดับและเวลา|D03 บันทึกหลังทราบผล แต่ไม่ได้ล็อก Timestamp|

**D8 — ความจุ 10,000 Keys — Superseded by Lean P1 decision**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: IP และ Identifier ใช้งบร่วมรวม 10,000|มีเพดานเดียว; ทั้งสองชนิดแย่งพื้นที่กัน|Identifier จำนวนมากกินพื้นที่ IP ได้|IP ใหม่อาจเข้าไม่ได้จาก Telemetry|จำนวนรวม, การเพิ่มสอง Key พร้อมกัน|ตีความ 10,000 เป็นเพดาน Store ทั้งชุด|
|B: แบ่งโควตา IP/Identifier โดยผลรวม 10,000|กันพื้นที่ให้แต่ละหน้าที่; ต้องเลือกสัดส่วน และอาจเหลือพื้นที่ที่อีกฝั่งใช้ไม่ได้|จำกัดผลกระทบข้ามชนิด Key|ฝั่งหนึ่งอาจเต็มขณะอีกฝั่งว่าง|แต่ละโควตาและเพดานรวม|รักษาเพดานรวม แต่เอกสารไม่ระบุสัดส่วน|
|C: ชนิดละ 10,000 รวมได้ 20,000|แต่ละชนิดมีพื้นที่มากขึ้น; Memory รวมเพิ่ม|ขยายพื้นที่ที่ผู้โจมตีทำให้เต็มได้|รองรับ Keys มากขึ้น|เพดานแยกและเพดานรวมใหม่|ไม่ควรตีความว่าเอกสารรองรับอยู่แล้ว ต้องยืนยัน/ปรับความหมายความจุ|

**D9 — Store เต็ม — Superseded by Lean P1 decision**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: Prune แล้วปฏิเสธงานที่ต้องใช้พื้นที่ใหม่|ไม่ทิ้ง Counter ที่ยังมีผล; รับงานใหม่ไม่ได้เมื่อเต็ม|รักษา Threshold ของ IP เดิม แต่เสี่ยงโจมตีให้เต็ม|ผู้ใช้ใหม่ถูกปฏิเสธ|เต็มจริง, ไม่มี Partial Write, คืนพื้นที่แล้วรับได้|เอกสารไม่ระบุพฤติกรรมนี้|
|B: Evict ข้อมูลที่ยังมีผลเพื่อรับ Key ใหม่|รับผู้ใช้ใหม่ได้; สูญเสีย Counter ก่อนหมดอายุ|ถ้า Evict IP ผู้โจมตีอาจหมุน Keys เพื่อหลบ Threshold|ผู้ใช้ใหม่เข้าได้มากกว่า A|Eviction และการโจมตีด้วย Key Churn|Evict IP ที่ยังมี Failures ขัดการรักษา Threshold; ต้องปรับ Contract|
|C: ยอมทิ้งเฉพาะ Identifier Telemetry ก่อน|รักษา IP Counter ได้; Telemetry ไม่ครบ|ไม่ล้างงบ Failure ของ IP|ลดการปฏิเสธที่เกิดจาก Telemetry; หาก IP เต็มยังต้องมีนโยบาย|Telemetry หลุดได้แต่ IP Enforcement ไม่เปลี่ยน|ต้องเลือกว่าการนับ Identifier ยอมสูญเสียได้หรือไม่|

การเลือกปฏิเสธเพราะ Store เต็มยังต้องเลือก **ผลตอบกลับภายหลัง** เอกสารกำหนด `429` สำหรับ Threshold แต่ไม่ได้กำหนดเหตุการณ์ Capacity เต็มโดยตรง

**D10 — Identifier Telemetry ทำให้ Login ถูกปฏิเสธทางอ้อมได้หรือไม่ — Superseded by Lean P1 decision**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: ต้องบันทึกทั้ง IP และ Identifier ได้จึงรับ Attempt|Telemetry ครบทุก Failure ที่รับไว้; Telemetry กลายเป็นเงื่อนไข Admission|Identifier ใหม่จำนวนมากอาจทำให้เกิด Capacity Denial|Login ถูกปฏิเสธแม้ IP ยังไม่ถึง Threshold|พื้นที่เหลือให้ IP แต่ไม่พอ Identifier|เอกสารบังคับนับควบคู่ แต่ไม่ได้ระบุให้การบันทึกสำเร็จเป็นเงื่อนไข Login|
|B: IP Enforcement ต้องทำได้ ส่วน Identifier ยอม Drop เมื่อเต็ม|Telemetry ไม่ขวาง Login; ข้อมูลตรวจสอบไม่ครบ|รักษา IP Limit ได้ แต่เสียหลักฐาน Telemetry บางส่วน|Login ยังไปต่อเมื่อ IP มีพื้นที่และสิทธิ์|Drop Identifier แล้ว IP Counter ยังถูกต้อง|ต้องยืนยันข้อยกเว้นต่อข้อความ “นับ Identifier ควบคู่”|

ทั้งสองตัวเลือกต้องไม่มี Threshold ของ Identifier ที่ใช้ล็อกบัญชีโดยตรง

**D11 — Pruning strategy**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: ล้างข้อมูลหมดอายุที่คืนพื้นที่ได้ทั้งหมดก่อนปฏิเสธเพราะเต็ม|ไม่ปฏิเสธทั้งที่มีพื้นที่หมดอายุ; อาจใช้เวลาต่อ Operation มาก|รักษา State ที่ยังมีผล|Admission อาจช้าลงเมื่อ Store ใหญ่|เต็มด้วยข้อมูลหมดอายุแล้วต้องรับได้|เอกสารไม่กำหนดเวลาหรือวิธี Prune|
|B: จำกัดงาน Prune ต่อ Operation และอาจปฏิเสธชั่วคราว|จำกัดงานต่อ Request; อาจมีพื้นที่หมดอายุที่ยังไม่ถูกคืน|ต้องแยกการตรวจ Expiry ออกจากการลบจริงเพื่อไม่บล็อกผิด|อาจปฏิเสธทั้งที่มีข้อมูลหมดอายุค้าง|Cleanup Budget, False-full และการฟื้นตัว|พฤติกรรมปฏิเสธชั่วคราวต้องตัดสินใจเพิ่ม|

หลังเลือกผลที่ต้องการแล้ว การใช้ Scan, Heap หรือ Expiry Queue เป็นรายละเอียดภายใน หากยังให้ผลและขอบเขตทรัพยากรตรงกัน

**D12 — Lock/concurrency mechanism**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: Core แบบ Synchronous ที่รับหลาย Threads ได้|เรียกจาก Threads ได้; Lock อาจทำให้ผู้เรียกรอ|ต้องทำ Transition ทั้งชุด Atomic|ถ้าเรียกบน Event Loop ต้องมีงานใน Lock สั้น|Thread Barrier, Race และ Atomic Capacity|ตรง Single-process ได้ แต่เอกสารไม่ล็อกรูปแบบผู้เรียก|
|B: Core แบบ Async ที่ใช้ภายใน Event Loop เดียว|ผู้รอ Lock ยอมคืน Event Loop; ใช้ข้าม Thread/Loop โดยตรงไม่ได้|ต้องป้องกันการใช้นอก Concurrency Boundary|เหมาะกับผู้เรียก Async แต่มีข้อจำกัดการใช้งาน|Concurrent Tasks, Cancellation และ Loop Boundary|เอกสารไม่ได้ระบุว่า Core ต้องเป็น Sync หรือ Async|

เมื่อเลือก Concurrency Boundary แล้ว **Lock เดียวหรือหลาย Lock** เป็นรายละเอียดภายในได้ หากไม่มีพฤติกรรมรอ/ปฏิเสธหรือข้อจำกัดใหม่ และผ่าน Tests เดียวกัน

**D13 — Missing/invalid Client IP**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: ปฏิเสธ Attempt ด้วย Error ที่ปลอดภัย|ไม่ทำงานโดยไม่มี IP ที่ใช้บังคับกฎ; ต้องกำหนดการ Map Error|ไม่เกิดช่องข้าม Per-IP Limit|Transport/Proxy ผิดอาจทำให้ Login ใช้ไม่ได้|ไม่มี Client, IP ผิด และไม่เรียกงานถัดไป|เอกสารไม่ได้กำหนดกรณี IP ใช้ไม่ได้|
|B: รวมเข้า Bucket สำหรับ Unknown Client|ยังให้โอกาส Login แบบจำกัด; ผู้ใช้ไม่ทราบ IP ใช้งบร่วมกัน|คนหนึ่งใช้โควตาทั้งกลุ่มได้ และไม่ใช่การแยกตาม IP จริง|อาจยังใช้ได้บางครั้ง แต่เกิดการบล็อกร่วม|Unknown หลายรายใช้ Bucket เดียวและไม่ Unbounded|ต้องยืนยันข้อยกเว้นจากการบังคับตาม Client IP|

**D14 — วิธีเชื่อม Trusted Proxy กับ Uvicorn**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: ให้ Uvicorn ประมวลผล Header ผ่าน Server Options แล้ว Auth อ่าน Scope|ประมวลผลครั้งเดียวที่ Server; ต้องส่ง Options ให้ถูกตอนเริ่มระบบ|หากเปิด Trust ผิด Auth จะได้รับ Client IP ที่ผิดตั้งแต่ต้น|Deployment ผิดอาจรวมผู้ใช้เป็น Proxy IP หรือปฏิเสธ IP|Server Options และ ASGI Scope ผ่าน Stub|ตรง D04 ที่ให้ Server ทำ Proxy Processing|
|B: ใช้ `ProxyHeadersMiddleware` ของ Uvicorn ครอบ ASGI Application โดยปิดการประมวลผลซ้ำที่ Server|Boundary ทดสอบเป็นชิ้นได้; ต้องควบคุมลำดับและห้ามทำซ้ำ|ประมวลผลสองรอบอาจทำให้ Trust Chain ผิด|เพิ่มเงื่อนไขในการประกอบ Application|Middleware Order, Trusted/Untrusted Peer และห้าม Double Processing|ใช้กลไก Uvicorn แต่ตำแหน่งการเชื่อมไม่ได้ระบุในเอกสาร|

ทั้งสองแบบต้องใช้ Exact Allowlist และไม่เชื่อ Header จาก Peer ที่ไม่อนุญาต รอบนี้ทำได้เพียง Contract/Adapter และ Tests โดยยังไม่เชื่อม Startup จริง

**D15 — Public interface และ Attempt lifecycle — Accepted: Explicit lifecycle (ตัวเลือก B)**

|ตัวเลือก / พฤติกรรม|ข้อดี / ข้อเสีย|Security impact|Availability impact|Test impact|ความสัมพันธ์กับเอกสาร|
|---|---|---|---|---|---|
|A: `begin` คืน Handle แล้วผู้เรียก `finish/cancel`|ลำดับชัดและประกอบ Service ได้อิสระ; ผู้เรียกอาจลืมปิด|ต้องกัน Handle ปลอม/ซ้ำ/ข้าม Instance|Handle ค้างอาจกินสิทธิ์ไม่สิ้นสุด|ทุก Outcome, Double Finish, Missing Finish|D03 ระบุ Rate Limit Port แต่ไม่ระบุ Signature|
|B: Context Manager ครอบอายุ Attempt และระบุผลก่อนออก|ช่วย Cleanup เมื่อออกจาก Scope; ต้องกำหนดว่า Exception/Cancel หมายถึงอะไร|ลดการลืมคืนสิทธิ์ แต่ห้ามคืนขณะงานเบื้องหลังยังทำอยู่|ฟื้นสิทธิ์ได้เมื่อจบ Scope อย่างถูกต้อง|Normal Exit, Exception, Cancellation, Background Work|เป็นทางเลือกของ Interface ที่เอกสารไม่ได้กำหนด|

มติปัจจุบันใช้ Explicit Outcome และ Idempotent Cleanup: คืน Reservation เมื่อ Error/Cancel เกิดก่อนทราบผลและงานตรวจหยุดจริง; หากทราบผลล้มเหลวแล้วต้องคง Failure แม้ Audit/System ขั้นถัดไปผิดพลาดหรือ Request ถูก Cancel

**3. `INTERNAL IMPLEMENTATION DETAIL`**

กลุ่มนี้มอบให้ผู้พัฒนาเลือกได้ **หลังจากคุณเลือกพฤติกรรมที่เกี่ยวข้องแล้ว** และต้องไม่เพิ่มข้อจำกัดที่ผู้เรียกสังเกตได้โดยไม่แจ้ง

|รายละเอียด|ขอบเขตที่มอบให้เลือกได้|Tests/เงื่อนไขกำกับ|
|---|---|---|
|Container ของ Failure timestamps|Deque, List หรือโครงสร้างอื่นที่ให้ผล Window เดียวกัน|Boundary, ลำดับ Completion, Memory ไม่โตไร้ขอบเขต|
|รูปแบบ Key ภายใน|Canonical Client IP เท่านั้น|IPv4-mapped IPv6 ถูก Normalize เป็น IPv4 และไม่มี Identifier State|
|โครงสร้างค้นหา Expiry|Scan, Heap, Queue ตามนโยบาย D11 ที่เลือก|ไม่สูญเสีย Active Counter และไม่ทำให้ Metadata โตไม่จำกัด|
|จำนวน Lock และลำดับการถือ Lock|ภายใต้ Concurrency Boundary ที่เลือกใน D12|ไม่ Deadlock, ไม่หลบ Threshold, Capacity Atomic|
|Fake Clock ใน Tests|Callable หรือคลาสช่วยทดสอบ|เลื่อนเวลาได้ ไม่มี Sleep จริง|
|ชื่อ Private Helpers และการแยกโมดูล|ไม่เปลี่ยน Public Interface|ต้องเสนอรายชื่อไฟล์ให้คุณอนุมัติก่อนสร้างตามกติกางานนี้|

**Historical prompt ปิดแล้ว:** D1/D2 ถูก Supersede และ P1 ไม่มี Identifier Digest


ตอนนี้ควรคุยกับ `Doc Agent` เป็นหลักครับ เพราะปัญหาคือ “เอกสารยังไม่ได้กำหนดพฤติกรรมบางส่วน” ไม่ใช่ปัญหาการเขียนโค้ด

บทบาทที่เหมาะสม:

|Agent|หน้าที่|
|---|---|
|`Doc`|ตรวจช่องว่างของ Contract, อธิบายตัวเลือก และบันทึกสิ่งที่คุณอนุมัติ|
|`Core`|ตรวจว่าตัวเลือกนั้น Implement/Test ได้อย่างไร แล้วเขียนโค้ดหลังตัดสินใจ|
|`Foundation`|ดูเฉพาะ Environment, Startup, Uvicorn, Proxy และการประกอบระบบร่วม|

การแบ่ง Decision:

- D1–D10, D13 และ D15: คุยกับ `Doc` ก่อน แล้วให้ `Core` ตรวจผลกระทบ
- D11–D12 เรื่องโครงสร้าง Prune, Sync/Async และ Lock: ให้ `Core` เสนอได้ เพราะเป็นรายละเอียด Implementation
- D14 Trusted Proxy/Uvicorn: ให้ `Foundation` ตรวจร่วมกับ `Core`
- การเชื่อม Runtime Loader เข้า Startup, จำนวน Worker และ Environment injection: `Foundation` เป็นเจ้าของ

ลำดับที่ควรทำ:

1. สั่ง `Core Agent` ให้หยุดที่ Decision Matrix และยังไม่ Implement
2. ส่ง Matrix ให้ `Doc Agent` ตรวจว่าข้อใดควรเป็น Canonical Contract
3. คุณนั่งเลือกทีละ Decision
4. ให้ `Doc Agent` บันทึกเฉพาะสิ่งที่คุณอนุมัติ
5. ส่ง Contract ฉบับตัดสินแล้วให้ `Core Agent` Implement
6. เมื่อถึง Startup/Proxy integration จึงให้ `Foundation Agent` เข้ามาตรวจ

หากต้องเลือกคุยเพียงตัวเดียวตอนนี้ ให้เลือก `Doc Agent` เพราะ Core ไม่ควรเป็นทั้งผู้เสนอ Design และผู้อนุมัติ Design ของตัวเอง ส่วน Foundation ยังไม่ควรเข้ามาตัดสินพฤติกรรม Rate Limiter ครับ
