# MyNetMate Auth: อ่านก่อนลงมือเชื่อม Foundation กับ Core

> เอกสารอธิบายงานสำหรับคนลงมือพัฒนา ไม่ใช่สัญญาออกแบบฉบับใหม่
> ตรวจจาก Backend Branch `feature/00-auth-core` วันที่ 24 กันยายน 2026

## 1. ตอนนี้ระบบอยู่ตรงไหน

MyNetMate ต้องมี Login ที่ใช้ Session ในฐานข้อมูลและ Cookie ที่ JavaScript อ่านไม่ได้ แต่ตอนนี้ **ยังไม่มี Login API ที่ใช้งานจริง**

งานที่มีแล้วบน `feature/00-auth-core` ได้แก่ ตัวเข้ารหัสรหัสผ่าน, ตัวสร้าง Session Token, ตัวนับการลอง Login ต่อ IP (Rate Limiter), โครงสร้างข้อมูล User/Session, SQL พื้นฐาน และการตรวจค่า Environment สำหรับ Auth

Frontend มีหน้า `/login` แบบข้อความชั่วคราวและตั้ง API Client ให้ส่ง Cookie แล้ว ทั้งสองส่วนยังไม่ได้เชื่อมเป็นการ Login จริง

## 2. ปัญหาเล็ก ๆ ที่ต้องแก้ก่อนให้ Core ทำต่อ

ไฟล์ `mynetmate/backend/app/server.py` เป็นตัวเริ่ม Backend แบบมาตรฐาน มันอ่านและตรวจค่า Auth เช่น จะเชื่อ Proxy หรือไม่ และจะเชื่อ IP ของ Proxy ตัวใด

แต่หลังตรวจค่าแล้ว มันส่งข้อความ `"app.main:app"` ให้ Uvicorn ไปโหลดแอปเอง ส่วน `mynetmate/backend/app/main.py` สร้างแอปโดยไม่ได้รับชุดค่า Auth ที่เพิ่งตรวจมา

ผลคือ **ตัวเปิดเซิร์ฟเวอร์รู้ค่า Auth แต่ตัวแอปยังไม่ได้รับค่า object เดียวกัน** หาก Core สร้าง Rate Limiter ในแอปโดยอ่าน Environment อีกครั้ง สองส่วนอาจใช้ค่าคนละชุด เราจึงต้องส่งค่าที่ตรวจแล้วเข้าแอปให้ชัดเจนก่อน

นึกภาพง่าย ๆ: `server.py` เป็นคนตรวจใบตั้งค่า, `main.py` เป็นคนเปิดร้าน, Rate Limiter เป็นสมุดนับจำนวนครั้ง ตอนนี้คนเปิดร้านยังไม่ได้รับใบตั้งค่าที่ตรวจแล้ว

## 3. ใครรับผิดชอบอะไร

- **Foundation (งานรอบนี้):** ส่ง Auth Settings object ที่ตรวจแล้วจาก `server.py` เข้าแอป, คง Uvicorn หนึ่ง Worker, และให้ Uvicorn ประมวลผล Proxy Header เพียงจุดเดียว
- **Core (งานถัดไป):** ใช้ Settings object นั้นสร้าง Rate Limiter หนึ่งตัวเมื่อแอปเริ่ม และให้ทุกคำขอใช้ตัวนับเดียวกัน
- **งานภายหลัง:** Auth Repository, Audit Writer, Login API, Session Guard, RBAC และหน้า Login จริง

Foundation รอบนี้ไม่ต้องสร้าง Login API หรือเขียนขั้นตอนตรวจรหัสผ่าน

## 4. ผลลัพธ์ที่ Foundation ต้องทำให้ได้

ลำดับการทำงานที่ต้องการคือ:

1. `app.server.main()` โหลดและตรวจ `AuthRuntimeSettings` **หนึ่งครั้ง**
2. ส่ง Settings object ตัวนั้นเข้า `create_app(auth_settings=settings)`
3. ส่ง FastAPI app object ที่สร้างแล้วให้ `uvicorn.run(...)` โดยกำหนด `workers=1` และไม่เปิด Reload
4. ตั้งค่า `proxy_headers` และ `forwarded_allow_ips` ของ Uvicorn จาก Settings object **ตัวเดียวกัน**
5. เก็บ Settings ที่แอปได้รับไว้ให้ Lifespan/Core ใช้ต่อ โดยไม่อ่าน Environment ซ้ำ

คำว่า “ตัวเดียวกัน” หมายถึง Python object เดียวกันจริง ๆ ไม่ใช่เพียงมีข้อความหรือค่าเท่ากัน

Uvicorn เป็นผู้จัดการ Proxy Header ตาม Trusted Proxy IP ที่ระบุไว้ แอปและ Core อ่าน Client IP จาก `request.client.host` และไม่ประมวลผล `X-Forwarded-For` ซ้ำ

## 5. ทำทีละช่วงอย่างไร

### ช่วง A: อ่านโค้ดและ Test เดิม

อยู่บน Backend Branch `feature/00-auth-core` และตรวจว่า Working Tree สะอาด จากนั้นอ่าน:

- `mynetmate/backend/app/server.py`: จุดโหลด Settings และจุดเรียก Uvicorn
- `mynetmate/backend/app/main.py`: `create_app()`, `lifespan()` และตัวแปร `app` เดิม
- `mynetmate/backend/tests/test_authentication_startup.py`: Test ที่ปัจจุบันคาดว่า Uvicorn ได้ข้อความ `"app.main:app"`

### ช่วง B: เขียน Test ของพฤติกรรมใหม่

Test ควรพิสูจน์ว่า Loader ถูกเรียกครั้งเดียว, Uvicorn ได้ FastAPI app object, แอปถือ Settings object **ตัวเดียวกับ** ที่ Loader คืนมา, ค่าเริ่มต้นปิด Proxy Header, เปิดแล้วส่งเฉพาะ Exact Trusted Proxy IP และยังมีหนึ่ง Worker

Test เดิมที่คาดว่า Uvicorn ได้ข้อความ `"app.main:app"` ต้องปรับให้ตรงกับพฤติกรรมใหม่ การเห็น Test ใหม่ล้มก่อนแก้ Implementation เป็นเรื่องปกติ

### ช่วง C: แก้เฉพาะ Foundation

ปรับ `server.py` ให้สร้างแอปจาก Settings ที่ตรวจแล้วก่อนเรียก Uvicorn และปรับ `create_app()` ให้รับ Settings นี้อย่างชัดเจน ระวังตัวแปร `app = create_app()` เดิมที่ Tests/เครื่องมืออื่น import อยู่: เส้นทางที่ไม่ได้รับ Settings ต้องไม่แอบโหลดค่าใหม่หรือเปิด Auth Runtime ด้วยค่าไม่ผ่านการตรวจ

ยังไม่ต้องสร้าง Limiter ในช่วงนี้ นั่นเป็นงาน Core ที่ตามมา

### ช่วง D: ตรวจผล

รัน Startup Tests ที่เกี่ยวข้อง แล้วตรวจ `git diff --check` และ `git status --short` ผลที่ต้องการคือ Tests ยืนยัน Settings ตัวเดียว, Proxy Policy เดิมยังผ่าน, และมีเฉพาะไฟล์ที่ตั้งใจแก้

เมื่อ Foundation ผ่านแล้ว จึงส่งข้อตกลงให้ Core: “สร้าง Limiter ใน Lifespan จาก Settings ที่แอปได้รับไว้แล้ว; ไม่โหลด Environment อีกครั้ง”

## 6. เรื่องที่ไม่ต้องตัดสินในงานนี้

เอกสาร Auth กำหนดแล้วว่า P1 ใช้ Rate Limiter ใน Memory ของ Backend หนึ่ง Process/Worker, จำกัดตาม Canonical Client IP และให้ Uvicorn จัดการ Proxy Header จาก Exact Trusted Proxy IP Allowlist

ยังไม่ต้องตัดสินรูปแบบ Login Response, เชื่อม Database, เขียน Audit หรือทำหน้า Login จริงในรอบ Foundation นี้

## 7. เอกสารอ้างอิง

- `02_feature/00_Authentication(Naphat)/04_API Contracts.md` — Session, Rate Limit และ Client IP Contract
- `02_feature/00_Authentication(Naphat)/07_Test Users and Environment Policy.md` — ค่า Environment และหนึ่ง Worker
- `02_feature/00_Authentication(Naphat)/ADR_Login Rate Limiter Decisions.md` — การประมวลผล Trusted Proxy และข้อจำกัดของ Limiter

หากโค้ดหรือ Branch เปลี่ยนหลังวันที่ตรวจ ให้ดูไฟล์จริงอีกครั้งก่อนลงมือ
