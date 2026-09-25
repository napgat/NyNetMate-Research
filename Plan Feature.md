แผนที่เหมาะที่สุดคือทำ Authentication ให้จบเป็น Full-stack slice โดยใช้ Foundation ที่มีอยู่ ไม่สร้างระบบฐานใหม่ซ้ำ

```
Foundation ที่เสร็จแล้ว
→ Repository
→ Audit Writer ขั้นต่ำ
→ Auth Service/API
→ Session/RBAC Guard
→ Test Users
→ Frontend Login
→ End-to-end Demo
→ Stabilization
```

## สถานะปัจจุบัน

Foundation ที่พร้อมแล้วบน `feature/00-auth-core`:

- Password hashing และ Dummy Hash
- Opaque session-token generation/hash
- Runtime configuration
- Trusted Proxy startup
- IP-only Login Rate Limiter
- `User` และ `AuthSession` ORM Models
- PostgreSQL SQL Init และ Database Catalog Tests

สิ่งที่ยังไม่มีจริง:

- Repository
- Auth Service และ Router
- Session/RBAC Guard
- Audit Writer
- Test-user seeding
- Frontend Authentication
- End-to-end flow

## แผนพัฒนาจากปัจจุบันจนจบ

|ลำดับ|งาน|เจ้าของหลัก|เกณฑ์ผ่าน|
|---|---|---|---|
|0|Foundation baseline|Foundation — เสร็จแล้ว|Config, Rate Limiter, Models และ PostgreSQL Schema ผ่าน Tests|
|1|Persistence Repository|Core|อ่าน/เขียน User และ Session ผ่าน PostgreSQL ได้ โดย Repository ไม่ `commit()` เอง|
|2|Audit Write-side ขั้นต่ำ|Audit/Core|มี `audit_logs`, Registry, Writer และ `record_auth_event()` ที่ Auth เรียกได้|
|3|Authentication Service|Core|Login, Logout, `/me`, Change Password ทำงานพร้อม Transaction/Audit|
|4|Session และ RBAC Guard|Core|Protected API ตรวจ Session, Active User และ Permission ทุก Request|
|5|Minimal User Management|Core|Admin ดูผู้ใช้, เปลี่ยน Role และ Deactivate ได้ พร้อม Revoke Sessions|
|6|Test Users|Foundation/Core|มี Admin, Operator, Viewer จาก Environment โดยไม่มี Default Password|
|7|Frontend Authentication|Frontend|Login, Logout, Session expiry และ Forbidden UI ทำงาน|
|8|End-to-end Tests|Core/Frontend/Audit|Demo scenario หลักผ่านตั้งแต่ Browser ถึง PostgreSQL|
|9|Stabilization|ทุกฝ่าย|Full Tests, Build, Security Review และ Documentation ตรงกับ Implementation|

### Milestone 1 — Repository

สร้าง:

- `repositories.py`
- PostgreSQL Repository Tests

ความสามารถขั้นต่ำ:

- ค้น User ด้วย normalized username/email
- อ่าน User ตาม ID
- อ่าน User พร้อม Row Lock
- สร้าง Session ด้วย token hash
- อ่าน Session พร้อม User ปัจจุบัน
- Revoke Session เดียว
- Revoke ทุก Session ของ User
- Repository ห้ามรับ Raw Session Token และห้าม `commit()` เอง

ยังไม่ทำ HTTP API ในขั้นนี้

### Milestone 2 — Audit Writer ขั้นต่ำ

ควรทำหลัง Repository เพราะ Login สำเร็จต้องสร้าง Session และ Audit Event ใน Transaction เดียวกัน

ทำเฉพาะ Write-side ที่ Auth ต้องใช้:

- `AuditLog` model และ SQL Init
- Global Action Registry
- Append-only Audit Writer
- Auth Adapter ที่รับเพียง 4 ค่า
- Redaction และ Privacy Tests
- รองรับ Transaction เดียวกับ Business Action
- รองรับ Intentional Transaction สำหรับ Login Failed และ Permission Denied

ยังไม่ต้องทำ Full Audit UI หรือ Search/Export

### Milestone 3 — Auth Service และ API

Endpoint ขั้นต่ำ:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/change-password`

Login flow:

1. ตรวจ Origin/CSRF
2. Rate-limit Reservation
3. Normalize identifier
4. Query User
5. Argon2id/Dummy Hash
6. สร้าง Opaque Session
7. เขียน Session และ Audit ใน Transaction เดียวกัน
8. ส่ง HttpOnly Cookie

ต้องตอบ Error Envelope กลางสำหรับ `401`, `403`, `429`, `503`

### Milestone 4 — Session และ RBAC Guard

ทุก Protected API ต้อง:

- Hash Cookie token แล้วค้น `auth_sessions`
- ตรวจว่า Session ไม่ถูก revoke และยังไม่หมดอายุ
- ตรวจ User ยัง Active
- ใช้ Role ปัจจุบันจาก Database
- Default deny เมื่อไม่มี Permission
- บันทึก `auth.permission_denied`

เพิ่ม Protected Admin API ตัวอย่างเพื่อพิสูจน์ว่า Viewer ได้ `403`

### Milestone 5 — Minimal User Management

P1 ทำเฉพาะ:

- ดูรายการผู้ใช้
- สร้างผู้ใช้
- เปลี่ยน Role
- Activate/Deactivate
- ดู/Revoke Sessions ที่จำเป็น

ก่อนทำต้องปิด Open Decision เรื่อง **Admin คนสุดท้าย** และ Concurrent Requests

Deactivate, Role Change และ Password Change ต้อง Revoke Sessions ตาม Contract

### Milestone 6 — Test Users

สร้าง Seed mechanism ที่:

- รับรหัสผ่านจาก Environment
- สร้าง Admin, Operator และ Viewer
- ห้ามใช้ Default Password
- Production Guard ต้องปฏิเสธการ Seed
- รันซ้ำได้อย่างปลอดภัย
- ห้ามคืนรหัสผ่านใน API หรือ Log

### Milestone 7 — Frontend

ใช้ Stack ที่มีจริงแล้ว:

- TanStack Router
- TanStack Query
- Jotai
- Axios/OpenAPI Client

งานที่ต้องทำ:

- แยก `/login` ออกจาก `AppLayout` เพื่อไม่ให้มี Sidebar
- API Client เปิด `withCredentials: true`
- ใช้ `/me` เป็น Server State หลัก
- ไม่เก็บ Token ใน Jotai, localStorage หรือ sessionStorage
- `401` → ล้าง Auth State และไป Login
- `403` → แสดง Forbidden โดยไม่ Logout
- `429` → แสดงข้อความรอลองใหม่
- `503` → แสดง Service unavailable
- Role-based navigation เป็นเพียง UI; Backend Guard ยังเป็นตัวตัดสินจริง

Frontend ปัจจุบันครอบทุก Route ด้วย `AppLayout` จึงต้องแก้ Route Layout ก่อนสร้าง Login

### Milestone 8 — End-to-end Demo

ต้องผ่านอย่างน้อย 3 กรณี:

1. Admin และ Viewer Login ได้ และ `/me` คืน Role ถูกต้อง
2. Viewer เรียก Admin API แล้วได้ `403` พร้อม Audit Event
3. Admin Deactivate Operator ที่ Login อยู่ แล้ว Operator เรียก API เดิมได้ `401` ทันที พร้อม Audit Event

เพิ่มกรณี:

- Password ผิดได้ `401` แบบ Generic
- ครั้งที่เกิน Rate Limit ได้ `429`
- Session หมดอายุ
- Logout แล้ว Cookie เดิมใช้ไม่ได้
- CSRF/Origin ผิดได้ `403`

### Milestone 9 — Stabilization

ก่อนประกาศ Auth P1 เสร็จ:

- Backend full test suite ผ่าน
- PostgreSQL integration tests ผ่าน
- Frontend lint/build ผ่าน
- ทดสอบ Compose จากฐานข้อมูลใหม่
- ตรวจว่า Log ไม่มี Password, Token, Hash หรือ Raw Failed-login Identifier
- ตรวจ Cookie ใน Production mode
- อัปเดต OpenAPI Client
- อัปเดตเอกสารจาก Planned เป็น Implemented/Tested ตามหลักฐานจริง
- Review Diff ก่อน Commit/Push ทุก Milestone

## Dependency ที่ต้องระวัง

- SQL Init ทำงานเฉพาะ Database Volume ใหม่ ห้ามลบ Volume เดิมอัตโนมัติ
- Audit Writer ยังไม่มีใน Backend จึงเป็น Dependency ก่อน Login Service สมบูรณ์
- Backend ปัจจุบันยังใช้ CORS methods/headers แบบ wildcard ต้องปรับก่อน Auth API
- Existing Frontend Layout ยังไม่รองรับหน้า Login แยก
- Full Audit Trail UI ไม่ต้องรอให้ Auth เสร็จ—ทำเฉพาะ Writer ขั้นต่ำก่อน
- ห้ามแตะ `mynetmate/network-discovery/`

## จุดที่ไปทำ Feature อื่นได้

หลัง Milestone 1 ให้ไปทำ **Audit Writer ขั้นต่ำ** ได้ เพราะเป็น Dependency ของ Auth โดยตรง แล้วกลับมาทำ Milestone 3–9

ถือว่า Authentication P1 เสร็จจริงเมื่อ Milestone 8 ผ่าน ไม่ใช่เมื่อ Repository หรือ Backend API เสร็จเพียงอย่างเดียวครับ


---
# แผนพัฒนา Audit Trail ตั้งแต่ต้นจนจบ

จากโค้ดปัจจุบัน Audit Trail ยังไม่มี Model, Writer, Router หรือ Test โดยตรง แม้ Backend จะมี SQLAlchemy/PostgreSQL แล้วก็ตาม ส่วน Device ใช้ฐานข้อมูลจริงแต่ `commit()` ภายใน Service ซึ่งต้องปรับก่อนผูก Transaction กับ Audit ได้

## Phase 0 — ปิดการตัดสินใจด้าน Contract

1. ยืนยันใช้ `audit_logs` 9 ฟิลด์ตาม Central Schema และไม่มี `ip_address`
2. ตัดสินประเด็น 3NF เป็น **Intentional Denormalization**
    - เก็บ `result` และ `safe_error_category` เป็น Snapshot ของเหตุการณ์
    - เหตุผลคือ Registry อาจเปลี่ยนในอนาคต แต่ประวัติเก่าต้องรักษาความหมายขณะเกิดเหตุการณ์
    - ใช้ Writer Validation และ Database Constraint ควบคุมความสอดคล้อง
    - P1 ยังไม่ต้องสร้างตาราง Action Registry เพิ่ม
3. ยืนยัน Canonical Action และ Binding จาก Global Registry
4. ห้ามเพิ่ม Failure Event แบบ ad hoc
5. บันทึกการตัดสินใจนี้ในเอกสารก่อนสร้าง Migration

**เสร็จเมื่อ:** Schema, Registry และเหตุผลเรื่อง 3NF ไม่มีข้อความขัดกัน

---

## Phase 1 — Database Foundation

สร้างโครงสร้างประมาณนี้:

```
app/features/audit_trail/
├── __init__.py
├── models.py
├── registry.py
├── redaction.py
├── writer.py
├── schemas.py
├── cursor.py
├── service.py
└── router.py
```

งานฐานข้อมูล:

1. สร้าง SQLAlchemy Model `AuditLog`
2. สร้าง Alembic environment หากยังไม่มี
3. สร้าง Migration สำหรับ `audit_logs`
4. เพิ่ม Constraint:
    - `result IN ('success', 'failure')`
    - `user_id` และ `resource_id` เป็น Nullable
    - ไม่มี `ip_address`
5. เพิ่ม Index สำหรับ:
    - `(created_at, id)` เพื่อ Cursor Pagination
    - `action`
    - `resource_type`
    - `user_id`
6. ทดสอบทั้งฐานข้อมูลใหม่และฐานข้อมูลเดิมที่ต้อง Upgrade

**เสร็จเมื่อ:** Migration สร้างตารางได้จริง และ Schema ตรงกับ [Central Schema (line 201)](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\Data Information 27-06-69.md:201)

---

## Phase 2 — Registry, Redaction และ Audit Writer

### 2.1 Global Action Registry

สร้าง Mapping ในโค้ดจาก Canonical Action ไปยัง:

- Allowed `resource_type`
- `result`
- `safe_error_category`
- Actor/Resource Binding
- Transaction policy

ต้องรองรับกรณีพิเศษ เช่น `user.login_failed` ซึ่งใช้ `resource_type=auth` หรือ `user` ตามสถานการณ์

### 2.2 Server-side Redaction

สร้างฟังก์ชันกรอง:

- Password และ Password Hash
- Token และ Session Token
- Cookie Header
- Credential Secret
- Raw Failed-login Identifier
- Client IP ที่อาจหลุดเข้ามาใน `description`

สำหรับ Auth ให้ใช้ `description=null` หรือ Fixed Safe Template เป็นหลัก

### 2.3 `record_audit_event()`

Writer ต้องทำตามลำดับ:

```
รับ Event
   ↓
ตรวจ Global Registry
   ↓
ตรวจ Actor/Resource Binding
   ↓
Redact description
   ↓
เพิ่ม AuditLog เข้า Session
   ↓
flush แต่ไม่ commit เอง
```

จุดสำคัญคือ Writer ไม่ควร `commit()` เอง เพราะ Business Service ต้องเป็นเจ้าของ Transaction Boundary

แยก Helper สำหรับ Intentional Audit Transaction ที่เปิด Transaction ใหม่เฉพาะ `user.login_failed` และ `auth.permission_denied`

**เสร็จเมื่อ:** Unit Test ยืนยันว่า Event ถูกต้องผ่าน และ Event ผิด Registry ถูก Reject ก่อน Insert

---

## Phase 3 — Full Audit API

พัฒนา:

```
GET /api/audit-logs
```

ความสามารถ:

- Admin หรือสิทธิ์ `audit.read` เท่านั้น
- Filter ตาม `action`, `resource_type`, `actor_user_id`, `result`, วันที่เริ่มและสิ้นสุด
- Default limit 50, สูงสุด 100
- เรียง `created_at DESC, id DESC`
- Cursor ประกอบจาก `created_at + id`
- Response ใช้ `actor_user_id` และ `occurred_at`
- คืน `description` เฉพาะค่าที่ผ่าน Redaction แล้ว
- ไม่มี `PATCH`, `PUT` หรือ `DELETE`

เพิ่ม Router เข้า `app/core/router.py`

**เสร็จเมื่อ:** Admin อ่านได้, Viewer/Operator ได้ 403 และ Cursor ไม่มีข้อมูลซ้ำหรือข้าม

---

## Phase 4 — Authentication Integration

ปัจจุบันมี Auth Model และเครื่องมือ Password/Session แล้ว แต่ยังไม่พบ Auth Router และ Login Service ที่สมบูรณ์ จึงต้องทำ Auth Workflow พร้อม Adapter

### Login สำเร็จ

```
ตรวจ Username/Password
   ↓
สร้าง auth_sessions
   ↓
record_auth_event(user.login_success)
   ↓
Commit Session + Audit พร้อมกัน
   ↓
จึงค่อยส่ง Set-Cookie
```

ถ้า Audit Write ล้มเหลว:

- Rollback Session
- ไม่ส่ง Cookie
- ตอบ `503 AUTH_SERVICE_UNAVAILABLE`

### Login ล้มเหลว

```
ตรวจ Credentials ไม่ผ่าน
   ↓
เปิด Intentional Audit Transaction
   ↓
บันทึก user.login_failed
   ↓
Commit Audit
   ↓
ตอบ 401
```

### Permission Denied

บันทึก `auth.permission_denied` ก่อนตอบ 403 โดย Actor เป็นผู้ใช้ที่ยืนยันตัวตนแล้ว

**เสร็จเมื่อ:** ผ่าน Acceptance Test สำหรับ Login Success, Login Failed, Permission Denied และ Fail Closed

---

## Phase 5 — Device Inventory Integration

ส่วนนี้มีจุดที่ต้องแก้ก่อน: `DeviceService.create()`, `update()` และ `delete()` ปัจจุบัน `commit()` ภายใน Service

ต้องปรับเป็น:

```
เริ่ม Transaction
   ↓
Create/Update/Delete Device
   ↓
record_audit_event()
   ↓
Commit หนึ่งครั้ง
```

Service ภายในควรใช้ `flush()` แล้วให้ Transaction Coordinator เป็นผู้ Commit

Event ที่ต้องผูก:

- `device.create`
- `device.update`
- `device.delete`

ทดสอบบังคับให้ Audit Insert ล้มเหลว แล้วตรวจว่า Device Mutation ถูก Rollback ด้วย

**เสร็จเมื่อ:** ไม่มีกรณี Device สำเร็จแต่ Audit หาย หรือ Audit มีแต่ Device ถูก Rollback

---

## Phase 6 — Producer อื่น

เชื่อมเมื่อ Business Mutation ของแต่ละ Feature พร้อมจริง:

|Producer|Event|
|---|---|
|Configuration Generation|`config.generate`|
|CIS Benchmark|`scan.run`, `scan.override`|
|Settings|`settings.update`|

ปัจจุบัน Config Generation และ CIS Service ยังเป็น Stub จึงไม่ควรสร้าง Audit Event ปลอมก่อน Business Logic ทำงานจริง

ทุก Feature ต้อง:

- เรียก Writer กลาง
- ใช้ Transaction เดียวกับ Mutation
- ไม่เขียน `audit_logs` โดยตรง
- ไม่สร้าง Action นอก Registry

---

## Phase 7 — D&M Recent Activity

พัฒนา:

```
GET /api/dashboard/recent-activity
```

ข้อกำหนด:

- อ่าน `audit_logs` แบบ Read-only ผ่าน ORM
- ใช้ Positive Allowlist 5 เหตุการณ์
- Default limit 10, สูงสุด 50
- เรียง `created_at DESC, id DESC`
- Cursor ใช้ `created_at + id`
- Actor หายหรือ `user_id=null` แสดง `"Unknown"`
- ห้ามเลือกหรือส่ง:
    - `description`
    - `safe_error_category`
    - Client IP
    - User-Agent
    - Error Detail และ Secret

**เสร็จเมื่อ:** Dashboard ได้เฉพาะ Safe Projection แม้ผู้เรียกเป็น Admin

---

## Phase 8 — Frontend

### Admin Full Audit Page

สร้างหน้า Read-only:

- ตาราง Audit Log
- Filter
- Load More ด้วย Cursor
- แสดง Result และ Safe Error Category
- แสดง Description ที่ผ่าน Redaction
- ไม่มีปุ่มแก้ไขหรือลบ
- ซ่อนเมนูและ Route จากผู้ใช้ที่ไม่ใช่ Admin

### Dashboard

เชื่อม Recent Activity API โดยแสดงเฉพาะ:

- Action
- Actor Display Name
- Resource Display
- Timestamp

---

## Phase 9 — Acceptance และ Security Tests

นำ Test Case ทั้ง 10 ข้อใน [Acceptance Tests](E:\\CEPP Project\\หลักศูตร\\KMITL_Knowledge\\Project\\02_feature\\11_Audit Trail(Naphat\)\\05_Acceptance Tests.md) มาทำเป็น Automated Test

แบ่งเป็น:

- Unit Test: Registry, Binding และ Redaction
- Database Integration Test: Schema, Constraint และ Transaction Rollback
- API Test: Permission, Filter และ Cursor
- Cross-feature Test: Auth, Device และ D&M
- Security Test: Password, Token, Cookie, Secret, Raw Identifier และ IP ต้องไม่ปรากฏใน Raw Row หรือ API Response

ต้องใช้ PostgreSQL สำหรับ Transaction และ Migration Test หลัก เพราะ SQLite อาจมีพฤติกรรม Constraint และ UUID ต่างกัน

---

## Phase 10 — Final Demo และ Definition of Done

Demo หนึ่งประโยค:

> “Admin เพิ่มอุปกรณ์และดูหลักฐานใน Full Audit ได้ ขณะที่ Viewer ที่ทำรายการเกินสิทธิ์ถูกปฏิเสธและเกิด `auth.permission_denied` โดย Dashboard แสดงเฉพาะกิจกรรมที่ปลอดภัย”

Audit Trail ถือว่าเสร็จเมื่อ:

- Migration ผ่าน
- Writer และ Registry ผ่าน Unit Test
- Auth และ Device ใช้ Transaction ถูกต้อง
- Full Audit จำกัด Admin
- D&M ใช้ Positive Allowlist
- ไม่มี IP หรือ Secret ใน Raw Row/API
- ไม่มี Update/Delete Audit API
- Acceptance Test ทั้ง 10 ข้อผ่าน
- Demo ทำงานจาก Business Action จริง ไม่ใช่ Seed Data

## ลำดับเวลาที่แนะนำ

|สัปดาห์|งาน|
|---|---|
|1|ปิด Contract/3NF, Model, Migration, Registry, Redaction|
|2|Audit Writer, Unit Test, Full Audit API|
|3|Auth Adapter และ Device Transaction Integration|
|4|D&M, Frontend, Acceptance Test และ Demo rehearsal|

Critical path คือ:

```
Schema → Registry/Redaction → Writer → Full API
                         ├→ Auth Integration
                         ├→ Device Integration
                         └→ D&M Projection
                                  ↓
                         Acceptance Tests → Demo
```

จุดเสี่ยงหลักที่สุดตอนนี้คือ Transaction Boundary ของ Device และ Auth Workflow ที่ยังไม่สมบูรณ์ ไม่ใช่ตัวตาราง `audit_logs` เองครับ

---
# แผนพัฒนา Dashboard & Monitoring (D&M) จากงานออกแบบจนถึงตรวจรับ

> **สถานะ ณ 24 กันยายน 2026:** มีเอกสารขอบเขตและ UI Design ของ P1 แล้ว แต่ยังไม่ถือว่าพัฒนา Dashboard แบบ Full-stack หรือทดสอบผ่าน แผนนี้ระบุลำดับงาน ไม่ใช่รายงานว่างานทั้งหมดเสร็จแล้ว
>
> **หลักตัดสินขอบเขต:** ยึด [MVP Scope ของโครงการ](../../MyNetMate%20Weight%20Feature%20List%20%28AI%20คิด%29.md) และ [UI Design ของ D&M P1](07_UI%20Design%20Dashboard%20P1.md) งาน Monitoring เชิงลึกอยู่ P2 และเริ่มหลัง P1 ใช้งานได้จริง

## ผลลัพธ์ปลายทางที่ต้องการ

ผู้ใช้เข้าสู่ระบบแล้วเห็นหน้า Dashboard ที่สรุปจำนวน/สถานะอุปกรณ์ จำนวน Config ผลตรวจ Critical กิจกรรมล่าสุด และสถานะระบบ กดไปยังหน้าของ Feature เจ้าของข้อมูลได้ตามสิทธิ์ โดยแยก **ศูนย์**, **ยังไม่มีข้อมูล**, **อ่านข้อมูลไม่ได้** และ **ข้อมูลเก่า** ออกจากกันอย่างชัดเจน หน้า Dashboard ไม่สั่งตรวจอุปกรณ์ ไม่สแกน Security และไม่อ้างว่าเป็นข้อมูล Real-time

**Demo หนึ่งประโยค:** “ผู้ใช้ Login → เห็นภาพรวมจากข้อมูลจริงของระบบ → กดรายการที่สนใจไปยัง Feature เจ้าของข้อมูล → ตรวจดูกิจกรรมล่าสุดที่ผ่านการปกปิดข้อมูลและสถานะระบบได้”

## ลำดับงาน P1

| ระยะ | งานที่ต้องทำ | ผลส่งมอบ / เกณฑ์ผ่านก่อนเดินต่อ | สถานะปัจจุบัน |
| --- | --- | --- | --- |
| **0. ยืนยันฐานงาน** | ตรวจ Scope, เอกสาร D&M, Source code และสถานะ Git ของแต่ละ Repository; แยก Planned/Prototype/Implemented/Tested | รายการสิ่งที่มีจริงและสิ่งที่ยังขาด ไม่ใช้เอกสารออกแบบแทนหลักฐานว่าโค้ดเสร็จ | เริ่มแล้ว; Frontend ปัจจุบันยังเป็นหน้า Dashboard placeholder |
| **1. ปิดแบบ UI และ Flow** | ทบทวนการ์ด, ลำดับสายตา, สิ่งที่เกิดเมื่อกด, Drawer ของ D&M, สิทธิ์ และข้อความ Loading/Empty/Error/Stale ใน [UI Design](07_UI%20Design%20Dashboard%20P1.md) กับทีม/อาจารย์ | ทีมยอมรับหน้าที่จะแสดงและจุดที่กดได้; ไม่มี Flow ที่ล้ำเข้า P2 หรือออกแบบหน้าของเพื่อนแทน | มีร่างครบ; ยังรอยืนยันจุดเชื่อมต่อ |
| **2. ปิดสัญญาข้อมูลกับ Feature เจ้าของ** | ยืนยันนิยามตัวเลข Field เวลา สถานะ และ Route ตามรายการด้านล่าง; บันทึกเจ้าของข้อมูลและตัวอย่างข้อมูลจริง/จำลอง | ทุก Metric มี Source of Truth, สูตรนับ, เวลาอ้างอิง, กรณี No Data/Failure และปลายทางที่กดแล้วไม่พาไป 404 | Audit ยืนยันแล้ว; ที่เหลือบางส่วนยัง Pending |
| **3. ทำเอกสารออกแบบให้ตรงกัน** | ปรับ [Glossary](../00_Glossary.md), [Component Diagram](03_Component%20Diagram.md), [API Contracts](04_API%20Contracts.md), [Acceptance Tests](05_Acceptance%20Tests%20และ%20Success%20Metrics.md) ตามมติระยะ 2; ระบุ DTO, สิทธิ์, Pagination และข้อผิดพลาด | เอกสารทั้งสี่ใช้คำ/สถานะ/Route เดียวกัน; ไม่มี `site_id` หรือ Enum เก่าที่ไม่มี Contract รองรับ | ยังต้องปรับหลังปิด Contract |
| **4. พัฒนา API ฝั่ง D&M** | ทำบริการสรุปแบบ **อ่านข้อมูลจากเจ้าของ** และ API สำหรับ Summary, Recent Activity, System Health; ตรวจสิทธิ์และปกปิดข้อมูลที่ Backend | API คืนข้อมูลจริงหรือสถานะไม่พร้อมอย่างตรงไปตรงมา; ไม่สร้างตาราง Summary/Findings ซ้ำใน P1; ไม่เรียก AI เพื่อคำนวณ Metric | ยังไม่ยืนยันว่ามี implementation ครบ |
| **5. พัฒนาหน้า Dashboard** | แทนหน้า placeholder ด้วย UI ตามแบบ; เชื่อม API, ทำสถานะ Loading/Empty/Error/Stale, คำอธิบายเวลา, Drawer, ทางลัดและการแสดงตามสิทธิ์ | ผู้ใช้ทั้ง 3 Role เห็นข้อมูลที่ได้รับอนุญาต; ข้อมูลขาดบางส่วนไม่ทำให้ทั้งหน้าพัง; ใช้ได้บนจอเล็กและคีย์บอร์ด | ยังไม่เริ่มตามแบบใหม่นี้ |
| **6. เชื่อม Flow ข้าม Feature** | เชื่อมการกดไป Device Inventory, Configuration, Security และ Full Audit เฉพาะ Route/Filter ที่เจ้าของยืนยัน; หากปลายทางยังไม่พร้อมให้ซ่อนหรือบอกว่าไม่พร้อม | กดแล้วไปยังรายการที่สัมพันธ์กับตัวเลขจริง หรือระบุข้อจำกัดชัดเจน; ไม่แอบอ้างว่า Pre-filter สำเร็จ | รอ Route/Filter บางส่วน |
| **7. ทดสอบและแก้ไข** | ทดสอบ Unit, API, Integration, UI และ Demo scenario; ใช้ทั้งข้อมูลปกติ ไม่มีข้อมูล ข้อมูลเก่า และแหล่งข้อมูลล้มเหลว | ผ่านรายการทดสอบด้านล่างและ [Acceptance Tests](05_Acceptance%20Tests%20และ%20Success%20Metrics.md) ฉบับที่ปรับแล้ว; บันทึกผลจริง | ยังไม่ทดสอบ Full-stack D&M |
| **8. ส่งมอบ P1** | Demo ให้ทีม/อาจารย์, เก็บภาพ/ผลทดสอบ, ปรับเอกสารตามสิ่งที่ทำจริง และระบุข้อจำกัดที่ยังเหลือ | มี Demo แบบ End-to-end จากข้อมูลจริง, ผลทดสอบ, รายการ Known Limitations และผู้รับผิดชอบงานต่อ | ยังไม่ถึงขั้นส่งมอบ |

### สิ่งที่ต้องตกลงในระยะ 2

| เจ้าของข้อมูล | คำตอบที่ D&M ต้องได้รับ |
| --- | --- |
| Device Inventory | นิยาม Reachability เทียบกับ Maintenance; อุปกรณ์ที่ยังไม่เคยตรวจ; Field และความหมายของเวลาตรวจล่าสุด; วิธีนับ; Route และตัวกรองรายการอุปกรณ์ |
| Configuration | “จำนวน Config” หมายถึงรายการใดและนับจากสถานะใด; Route รายการ/Builder; สิทธิ์ทางลัด |
| Security & Validation | “Critical” นับผลตรวจล่าสุดอย่างไร รวม/ไม่รวม Override อย่างไร; กรณียังไม่เคยสแกน; Route และ Filter ผลตรวจ |
| Authentication & Audit | ใช้ Contract ที่ยืนยันแล้วสำหรับ Positive Allowlist 5 Event, DTO, Cursor, Redaction และสิทธิ์; ทวนกับ Schema/โค้ดก่อนเชื่อมจริง |
| Settings/System | Offline Mode อ่านจากแหล่งใด; Backend/Database Health ตรวจอย่างไร; Timeout และความหมายของสถานะไม่พร้อม |

**งานที่ทำระหว่างรอทีมได้:** ทำ UI ด้วยข้อมูลจำลองที่ติดป้ายว่าเป็น Mock, เขียน Test Case และกำหนดรูปแบบ DTO ที่รอยืนยันได้ แต่ห้ามตรึง Enum/ชื่อ Field ที่ยังไม่ยืนยันหรือแสดง Mock เป็นข้อมูลจริง

## เกณฑ์ทดสอบขั้นต่ำก่อน Demo

1. ตัวเลขแต่ละการ์ดตรงกับข้อมูลต้นทางและนิยามที่เจ้าของยืนยัน; Maintenance ไม่ถูกนับเป็น Offline โดยอัตโนมัติ
2. กรณีไม่มีข้อมูล ไม่เคยตรวจ อ่านไม่ได้ และข้อมูลเก่า แสดงต่างจากค่า `0` และไม่กล่าวว่าเป็นข้อมูลปัจจุบัน
3. Recent Activity แสดงเฉพาะ Event ที่อนุญาต, เรียงและแบ่งหน้าแบบ Cursor ได้, Unknown Actor เป็น `Unknown`; Response ไม่มี IP, User-Agent, Secret, Description เต็ม หรือรายละเอียด Error
4. Viewer, Operator, Admin เห็น/กดได้ตามสิทธิ์ และ Backend ปฏิเสธคำขอที่ไม่มีสิทธิ์จริง ไม่พึ่งการซ่อนปุ่มเพียงอย่างเดียว
5. หาก Security, Config หรือ Audit ดึงข้อมูลไม่ได้ ส่วนอื่นของ Dashboard ยังใช้งานได้และส่วนที่ผิดพลาดมีข้อความ/ปุ่มลองใหม่เฉพาะส่วน
6. การกดการ์ด/ทางลัดไปยัง Route ที่มีจริงและแสดงรายการสัมพันธ์กับจำนวน; ถ้าปลายทางยังไม่พร้อมต้องไม่มีลิงก์เสีย
7. ทดสอบจอเล็ก การใช้คีย์บอร์ด ป้ายข้อความที่ไม่พึ่งสีอย่างเดียว และประเมินเวลาตอบ API ด้วยข้อมูลจำลอง 1,000 อุปกรณ์; เป้าหมาย 1 วินาทีเป็น **เป้าหมายที่ต้องวัด** ไม่ใช่ผลที่รับรองแล้ว

## หลัง P1 ผ่าน: ตัดสินใจเริ่ม P2 แยกต่างหาก

เมื่อ P1 Demo และทดสอบผ่านแล้ว จึงทบทวน [ขอบเขต Operational Monitoring P2](../P2_Operational_Monitoring/MVP%20D%26M.md) กับเวลาและข้อมูลจาก Network Discovery ที่มีจริง: Manual Refresh, Operational Snapshot, Interface/VLAN/WAN/Route Visibility, Expected State, Problem Summary และ Drill-down เชิงลึก จากนั้นค่อยปิด Ownership/Schema/API/UI และทำ Demo scenario ของ P2 ใหม่ **เอกสาร P2 ที่มีอยู่ยังไม่ใช่คำยืนยันว่าจะพัฒนาทั้งหมดทันที**

## ขั้นตอนถัดไปทันที

1. ส่ง UI Design และตารางคำถามระยะ 2 ให้เจ้าของแต่ละ Feature ตอบเฉพาะข้อมูลที่ D&M ต้องใช้
2. รวบรวมคำตอบเป็น Decision/Contract เดียว แล้วแก้ API Contract และ Acceptance Tests ให้ตรงกัน
3. เมื่อผ่านสองข้อแรก จึงเริ่มงาน Backend/Frontend โดยแยกงานที่ทำด้วย Mock ได้ออกจากงานที่ต้องใช้ข้อมูลจริง
---
ได้ครับ ผมจะวางเป็น **แผนพัฒนา NTV จากต้นแบบที่เพื่อนทำอยู่ → ระบบที่เดโมกับข้อมูลจาก Isolated Lab ได้จริง** โดยยังไม่ถือว่า NTV ถูกยืนยันเป็นงาน Full-stack ของเทอมนี้ เพราะ[สถานะในเอกสารยังเป็น Undecided](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization(Naphat\)/00_README - AI Navigation.md) แผนนี้ใช้เมื่อทีมตกลงรับงานและจัดเวลาให้แล้ว

เป้าหมายเดโมในหนึ่งประโยคคือ: **“ระบบอ่านข้อมูล Router/Switch ใน Lab ผ่าน SNMP และ LLDP แล้วแสดงว่าอุปกรณ์ต่อกันที่พอร์ตใด พบข้อมูลเมื่อใด; เมื่อเปลี่ยนสายและสั่งเก็บข้อมูลใหม่ ผังกับคำเตือนเปลี่ยนตามหลักฐาน โดยไม่ต้องวาดเส้นเอง”**

|ขั้น|งานที่ต้องทำตามลำดับ|ถือว่าเสร็จเมื่อ|
|---|---|---|
|**0. ตกลงขอบเขตกับทีม**|ยืนยันว่าจะทำ NTV ในรอบนี้หรือ P2, ใครเป็นเจ้าของแต่ละส่วน และใช้[เกณฑ์ทดสอบ NTV](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization(Naphat\)/05_Acceptance Tests.md) เป็นนิยามคำว่า “เสร็จ”|ทีมตอบได้ว่าจะเดโมอะไร ใช้อุปกรณ์/ตัวจำลองใด และอะไรไม่ทำ|
|**1. กันความเสี่ยงก่อนสแกนจริง**|บังคับสิทธิ์และ Lab allowlist ที่ backend ทั้ง IP เริ่มต้น **และอุปกรณ์เพื่อนบ้านที่ระบบจะตามไปค้นหา**; บันทึก Audit; ไม่ส่ง SNMP Community ใน URL; เอา IP Gateway `161.246.0.1` ที่เขียนตายตัวออก|คำขอสแกนนอก Lab ถูกปฏิเสธ แม้ผู้ใช้แก้ URL เอง|
|**2. ตกลงสัญญาข้อมูลกับเพื่อน**|Inventory ส่ง `device_id`/`interface_id` และสถานะเก็บข้อมูล; Discovery ส่ง Collection Run กับ LLDP Observation; NTV เป็นเจ้าของการสรุป Current Link, Warning และ Layout; Auth/Audit เป็นบริการกลาง|ทุกฝ่ายมีตัวอย่างข้อมูลเข้า–ออกชุดเดียวกัน และรู้ว่าใครสร้าง/แก้ตารางใด|
|**3. ทำเส้นทางข้อมูลเล็กที่สุดให้ครบก่อน**|เลือกอุปกรณ์ 2 ตัวกับ LLDP 1 เส้น: เก็บข้อมูล → บันทึกหลักฐาน → อ่าน API → แสดง Node, Link และพอร์ตสองฝั่งบนหน้าที่มีอยู่|เดโม “2 อุปกรณ์ 1 สาย” ได้จริงโดยไม่ใช้ Node/Link สมมติ|
|**4. ทำ Schema และกติกา Link ให้ครบ**|จบ Constraint/Index/Migration จาก[ร่าง Database Schema](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization(Naphat\)/02_Database Schema.md); แยก Observation ที่รักษาประวัติออกจาก Link ปัจจุบัน; จับคู่หลักฐานแบบ One-sided/Corroborated และแสดง Unresolved/Conflict/Stale; รองรับสายขนานคนละพอร์ต|เก็บประวัติได้ และการเก็บข้อมูลรอบใหม่ไม่ลบหรือเขียนทับหลักฐานเดิมแบบเงียบ ๆ|
|**5. ปรับ API และหน้าผัง**|ให้ API ส่งที่มา เวลา พอร์ต และสถานะหลักฐาน; ปรับ SVG/Dagre ที่มีอยู่ให้แสดงข้อมูลเหล่านี้; กด Node/Link ดูรายละเอียด; มีหน้าสถานะว่าง/โหลดไม่สำเร็จ; ลาก Node และบันทึกตำแหน่งโดยไม่เปลี่ยน Link จริง|Reload แล้วตำแหน่งยังอยู่ และผู้ใช้แยกได้ว่าเส้นใดเชื่อถือได้หรือควรตรวจต่อ|
|**6. ทำ Re-collect ให้ปลอดภัย**|Admin/Operator สั่งเก็บใหม่แบบ read-only และดูผลของงาน; Viewer ดูได้อย่างเดียว; การเปลี่ยนสายจริงต้องทำให้ Link ใหม่ปรากฏและ Link เดิมขึ้นคำเตือนตามกติกา|เดโมเปลี่ยนสาย → Re-collect → เห็นผลใหม่พร้อมประวัติได้|
|**7. ทดสอบและปิดงาน**|ทดสอบกติกาจับคู่ Link, API, สิทธิ์, allowlist, UI และกรณีข้อมูลไม่ครบ; เริ่มจาก fixture/ตัวจำลอง แล้วทดสอบ Isolated Lab กับอุปกรณ์จริงตามรุ่นที่มี; บันทึกผลรองรับ Cisco/Huawei/MikroTik แยกกัน|ผ่าน Acceptance Tests ที่ทีมรับไว้ มีหลักฐานเดโมและข้อจำกัดของแต่ละรุ่นชัดเจน|

ลำดับที่ผมแนะนำให้ลงมือจริงคือ **ขั้น 0–2 ก่อน แล้วรีบทำขั้น 3 ให้เห็นระบบครบเส้นทางหนึ่งเส้น** จากนั้นค่อยขยายความถูกต้องในขั้น 4–7 จะทำให้รู้เร็วว่า Collector, ฐานข้อมูล และหน้าเว็บคุยกันได้จริงหรือไม่

หน้าที่เพื่อนทำอยู่ **ใช้ต่อได้** โดยเฉพาะ Canvas, ไอคอน, Zoom/Pan และ Auto-layout; ไม่จำเป็นต้องเริ่ม UI ใหม่ แต่ต้องแก้ส่วนที่ยังไม่ตรงกับ[NTV MVP](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization(Naphat\)/01_MVP - MyNetMate NTV.md) ส่วน **Manual Override, Confirm/Reject Link, AI และการแก้ Configuration จากหน้า NTV** ไม่ใส่ในแผน MVP นี้ครับ