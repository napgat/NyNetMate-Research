# XSS และ CSRF สำหรับ Authentication P1

เอกสารนี้อธิบายมาตรการป้องกัน XSS และ CSRF ที่ใช้กับ Authentication ของ MyNetMate โดยแยกให้ชัดระหว่างการป้องกันต้นเหตุ การลดความเสียหาย และสิ่งที่ยังอยู่นอกขอบเขต P1

| ภัยคุกคาม | ระดับที่ P1 ตั้งเป้า | สรุป |
| --- | --- | --- |
| **XSS** | P1 baseline | ไม่ render untrusted HTML และใช้ React JSX แสดงข้อความตามปกติ พร้อมลดความเสียหายหาก XSS หลุดเข้ามา |
| **CSRF** | Strong P1 protection | ป้องกันเว็บภายนอกสั่ง action แทนผู้ใช้หลายชั้น หาก Backend บังคับใช้ guard กับทุก state-changing endpoint |

## 1. XSS: เราป้องกันอย่างไร และถึงขั้นใด?

XSS คือกรณีที่ผู้โจมตีทำให้ JavaScript ของตนรันบนหน้าเว็บ MyNetMate เช่น ผ่านข้อมูลที่ระบบนำไปแสดงโดยไม่ escape หรือ sanitize

### 1.1 การลดความเสียหายที่ Auth มีอยู่แล้ว

- Cookie เป็น `HttpOnly` ทำให้ JavaScript อ่าน session token ออกจาก Cookie โดยตรงไม่ได้
- ไม่เก็บ token ใน `localStorage` หรือ `sessionStorage`
- ไม่ส่ง token ใน JSON, URL, Application Log หรือ Audit Log
- Production ใช้ `Secure` Cookie ผ่าน HTTPS
- Session มีอายุจำกัด และ revoke ได้ทันทีเมื่อ logout, password change, role change หรือ deactivate

มาตรการเหล่านี้ลดโอกาสที่ XSS จะอ่าน token แล้วนำไปใช้ในเครื่องอื่นได้โดยตรง

> `HttpOnly` ไม่ได้หยุด XSS ไม่ให้รัน และไม่ได้หยุด script อันตรายจากการยิง API ใน Browser ของเหยื่อเอง

ตัวอย่าง: script ที่รันใน origin ของ MyNetMate อาจเรียก `POST /api/admin/users/...` ได้ เพราะ Browser ส่ง Cookie ให้อัตโนมัติ ผู้โจมตีไม่จำเป็นต้องอ่าน token

### 1.2 XSS Prevention Scope สำหรับ P1

P1 ของ MyNetMate ไม่รองรับการรับหรือ render ข้อมูลประเภท HTML, Rich Text หรือ Markdown จากผู้ใช้หรือ API โดยตรง ข้อมูลข้อความทุกชนิด เช่น username, device name, description, audit description และ config preview ต้องถูกแสดงเป็น Plain Text ผ่าน React JSX ปกติ

ข้อกำหนดสำหรับ Frontend:

- ห้ามใช้ `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML` หรือ `document.write` กับข้อมูลที่มาจากผู้ใช้หรือ API
- ห้าม render HTML ที่ยังไม่ผ่านการตรวจสอบ
- หากในอนาคตจำเป็นต้องแสดง HTML หรือ Markdown ที่ไม่น่าเชื่อถือ ต้องทำ Security Review ใหม่ และ sanitize ข้อมูลด้วย library ที่เหมาะสมก่อน render

**Acceptance Test:** เมื่อระบบได้รับข้อความ เช่น `<img src=x onerror=alert(1)>` ในฟิลด์ข้อความ ระบบต้องแสดงข้อความนั้นเป็นตัวอักษร และต้องไม่เกิด JavaScript execution

### 1.3 ข้อสรุประดับการป้องกัน XSS

> **P1 ลดโอกาสเกิด XSS ในพื้นผิวหลักด้วยการไม่ render untrusted HTML และใช้ React JSX แสดงข้อความตามปกติ พร้อมลดความเสียหายหาก XSS หลุดเข้ามาด้วย HttpOnly Cookie, การไม่เก็บ token ใน Web Storage และการ revoke session ได้ทันที**

P1 ยังไม่มี Content Security Policy (CSP), Rich Text Sanitization หรือมาตรการ XSS ขั้นสูง จึงไม่ควรอ้างว่าป้องกัน XSS ได้ 100% CSP เป็นมาตรการ hardening ที่แนะนำในอนาคต หากทีมเพิ่ม CSP ต้องทดสอบกับ Frontend และ deployment topology จริง

อ้างอิง: [04_API Contracts.md](../04_API%20Contracts.md) ระบุ `HttpOnly`, `Secure` และ `SameSite`; [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## 2. CSRF: เราป้องกันอย่างไร และถึงขั้นใด?

CSRF คือกรณีที่เว็บไซต์อื่นหลอก Browser ของผู้ใช้ที่ Login อยู่ให้ส่งคำสั่งมาที่ MyNetMate เช่น หลอกให้ deactivate user หรือแก้ role

สำหรับทุก state-changing request (`POST`, `PUT`, `PATCH`, `DELETE`) ระบบกำหนดให้ผ่านเงื่อนไขดังนี้:

1. Cookie ใช้ `SameSite=Strict` ซึ่งทำให้ Browser ไม่แนบ Cookie กับ request ที่เป็น cross-site ตามปกติ จึงลด CSRF จากเว็บไซต์ภายนอกได้
2. `Origin` ต้องตรงกับ Exact Allowlist
3. หากไม่มี `Origin` ต้องตรวจ `Referer` แล้วเทียบเฉพาะ origin แบบ exact
4. หากไม่มีทั้งคู่หรือไม่ตรง ต้องตอบ `403 AUTH_ORIGIN_REJECTED`
5. ต้องมี Custom Header `X-CSRF-Protection: 1`
6. หาก header หายหรือค่าผิด ต้องตอบ `403 AUTH_CSRF_REJECTED`
7. CORS ต้องใช้ exact allowed origins, `allow_credentials=true` และกำหนด methods/headers ที่อนุญาตอย่างชัดเจน รวมถึง `X-CSRF-Protection`; ห้าม wildcard เมื่อเปิด credentials
8. Endpoint ที่ออกแบบให้มี request body ต้องรับเฉพาะ `Content-Type: application/json`
9. ห้ามมี state-changing `GET`

`X-CSRF-Protection: 1` เป็น custom request header ไม่ใช่ secret token จุดประสงค์คือบังคับให้ Cross-origin JavaScript ต้องผ่าน CORS preflight และให้ Backend ตรวจ Origin/Referer ซ้ำอีกชั้น

`SameSite=Strict` เป็นเพียง Defense in Depth ไม่ใช่การป้องกันเพียงชั้นเดียว เพราะยังมีกรณี XSS ใน origin ของเราเอง, ความต่างระหว่าง same-site กับ same-origin, และความเสี่ยงจากการตั้งค่า Cookie หรือ CORS ผิดในอนาคต

ภาพรวม:

```text
เว็บไซต์ผู้โจมตี
  → Browser พยายามส่ง POST พร้อม Cookie
  → Origin ไม่ตรง หรือไม่มี custom header ที่กำหนด
  → FastAPI ตอบ 403
```

### 2.1 Architecture Decision สำหรับ P1

**P1 ไม่เพิ่ม CSRF library ใหม่** ให้ใช้ FastAPI `CORSMiddleware` ร่วมกับ CSRF Guard กลางของระบบตาม contract นี้

เหตุผล: P1 เป็น React + FastAPI แบบ same-site ใน Production, Cookie ใช้ `SameSite=Strict` และ contract มี Origin/Referer/custom-header guard ชัดเจนอยู่แล้ว การเพิ่ม library แบบ Double Submit Cookie จะเพิ่ม CSRF token และ Cookie อีกชุด รวมทั้งต้องเปลี่ยน Frontend/API contract โดยยังไม่มีประโยชน์ชัดเจนสำหรับ scope ปัจจุบัน

นี่ไม่ใช่การสร้าง cryptography เอง แต่เป็น request-validation policy ที่รวมในจุดเดียวและทดสอบได้

```text
React API client
  → credentials: "include"
  → X-CSRF-Protection: 1
  → POST / PUT / PATCH / DELETE

FastAPI CSRF Guard
  → ตรวจ Origin หรือ Referer
  → ตรวจ custom header
  → ตรวจ Content-Type เฉพาะ endpoint ที่รับ body
  → ไม่ผ่าน = 403
```

### 2.2 สิ่งที่ใช้ใน P1

| ส่วน | ทางเลือก |
| --- | --- |
| CORS | FastAPI `CORSMiddleware` |
| Cookie | `HttpOnly`, `Secure` ใน Production, `SameSite=Strict`, host-only |
| CSRF | Guard กลางใน FastAPI สำหรับ unsafe methods |
| Frontend | API client wrapper ใส่ `credentials: "include"` และ `X-CSRF-Protection: 1` อัตโนมัติ |
| Test | ทดสอบ positive/negative CSRF ทุกกรณีสำคัญ |

### 2.3 สิ่งที่ต้องทำเมื่อเริ่ม Implement

1. ตั้งค่า `ALLOWED_ORIGINS` จาก environment เป็น exact origin สำหรับ development และ production
2. ตั้ง `CORSMiddleware` ให้ `allow_credentials=true` และกำหนด origins, methods และ headers แบบ explicit
3. สร้าง CSRF Guard กลางที่ทำงานกับ `POST`, `PUT`, `PATCH`, `DELETE` ทุก endpoint
4. ให้ guard ตรวจ `Origin` ก่อน; หากไม่มีจึง parse `Referer` เพื่อเทียบ origin แบบ exact
5. ตรวจ `X-CSRF-Protection: 1`; ตรวจ `Content-Type: application/json` เฉพาะ endpoint ที่รับ body
6. ให้ React เรียกผ่าน API client กลาง ไม่ให้แต่ละหน้าตั้ง header เอง
7. เขียน acceptance/integration tests อย่างน้อย:
   - Origin ถูกและ header ถูก → ผ่าน
   - Origin เป็นเว็บอื่น → `403 AUTH_ORIGIN_REJECTED`
   - ไม่มี Origin/Referer → `403 AUTH_ORIGIN_REJECTED`
   - header หายหรือผิด → `403 AUTH_CSRF_REJECTED`
   - `GET` ห้ามเปลี่ยนข้อมูล
   - CORS ไม่รับ wildcard เมื่อเปิด credentials

### 2.4 เมื่อไรจึงควรใช้ Library?

หากอนาคตมี Frontend คนละ domain จริง, server-rendered form หลายหน้า หรือทีมต้องการใช้ Double Submit Cookie ให้เลือก library เพียงหนึ่งตัว เช่น `starlette-csrf` หรือ `fastapi-csrf-protect` และต้องออกแบบ contract ใหม่ให้ชัดเจน

รูปแบบนั้นจะเพิ่ม:

```text
CSRF token cookie แยกจาก session cookie
        +
React อ่าน CSRF token แล้ว echo ใน header
        +
middleware ตรวจว่า token cookie กับ header ตรงกัน
```

### 2.5 ข้อสรุประดับการป้องกัน CSRF

> **มาตรการนี้แข็งแรงพอสำหรับ P1 แบบ same-site React + FastAPI หาก Backend บังคับใช้ CSRF Guard กับทุก state-changing endpoint และมี test ครบ แต่ไม่ป้องกัน XSS ที่รันใน origin ของเราเอง**

CORS เพียงอย่างเดียวไม่ใช่ CSRF protection; จุดตัดสินสำคัญคือ Backend ต้องตรวจ Origin/Referer และ custom header ทุกครั้ง

อ้างอิง: [04_API Contracts.md](../04_API%20Contracts.md), [05_Acceptance Tests.md](../05_Acceptance%20Tests.md) และ [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## 3. Origin คืออะไร?

**Origin** คือ “ที่มาของหน้าเว็บ” ซึ่งประกอบด้วย:

```text
scheme + host + port
```

ตัวอย่าง:

```text
https://mynetmate.app
└── https = scheme, mynetmate.app = host, 443 = port ปริยาย
```

สิ่งเหล่านี้เป็นคนละ origin:

```text
http://localhost:5173
http://localhost:8000
https://localhost:5173
https://api.mynetmate.app
```

แม้ชื่อจะคล้ายกัน แต่ protocol หรือ port ต่างกันก็เป็นคนละ origin

สำหรับ MyNetMate:

- **Production ที่แนะนำ:** React และ FastAPI อยู่ภายใต้โดเมนเดียว เช่น `https://<โดเมนจริงของทีม>` และ Frontend เรียก API ด้วย `/api/...` Browser จึงมองเป็น same origin
- **Development:** Frontend และ FastAPI อาจคนละ port จึงเป็น cross origin และต้องใส่ origin ของ Frontend แบบ exact ใน CORS allowlist

ตัวอย่าง หาก Frontend รันที่ `http://localhost:5173` Backend ต้องอนุญาตค่าเต็มนี้ ไม่ใช่อนุญาตเพียง `localhost`

```text
Allowed Origin: http://localhost:5173
```

เมื่อผู้ใช้ส่ง state-changing request Browser จะส่ง header ประมาณนี้:

```text
Origin: https://<โดเมนจริงของทีม>
```

FastAPI ตรวจว่า origin อยู่ใน allowlist หรือไม่:

- ตรง → ดำเนินการต่อ
- เป็น `https://evil.example` → `403 AUTH_ORIGIN_REJECTED`

`https://mynetmate.app` เป็นเพียงตัวอย่างในเอกสารปัจจุบัน ก่อน deploy ทีมต้องยืนยันโดเมนจริงและใส่ exact origin ใน environment/config
