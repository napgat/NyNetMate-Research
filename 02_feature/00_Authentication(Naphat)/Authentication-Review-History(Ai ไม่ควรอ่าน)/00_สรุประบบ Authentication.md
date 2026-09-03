# สรุประบบ Authentication ของ MyNetMate

> เอกสารนี้เป็นสรุปสำหรับคนอ่าน หากรายละเอียดต่างกัน ให้ยึดไฟล์หลัก `00_Glossary.md` ถึง `07_Test Users and Environment Policy.md`

## แก่นของระบบ

Authentication เป็น **P1-INFRA** ทำหน้าที่ยืนยันตัวตน, รักษาสถานะการ Login และตรวจสิทธิ์ RBAC ของ `Admin`, `Operator`, `Viewer`

MyNetMate ใช้ **Database-backed Opaque Server-side Session** ไม่ใช้ JWT:

```text
Username/Email + Password
  → ตรวจด้วย Argon2id
  → สร้าง Session Token สุ่ม 256 bits
  → Browser เก็บ Token ดิบใน HttpOnly Cookie
  → Database เก็บเฉพาะ SHA-256(Token) ใน auth_sessions
```

Token ไม่มี `user_id`, role หรือ PII อยู่ภายใน และห้ามเก็บ Token ดิบใน Database, JSON Response หรือ Log Session มีอายุ 30 นาทีและไม่ต่ออายุอัตโนมัติ

ทุก Protected Request ต้องตรวจ Session, วันหมดอายุ, สถานะผู้ใช้ และ Role ปัจจุบันจาก Database จากนั้น Backend ตรวจ Permission แบบ **Default Deny** การซ่อนปุ่มใน Frontendเป็นเพียง UX

- ไม่มี Cookie → `401 AUTH_SESSION_MISSING`
- Session ใช้ไม่ได้ → `401 AUTH_SESSION_INVALID`
- Login แล้วแต่ไม่มีสิทธิ์ → `403 AUTH_FORBIDDEN`
- Database/Session/Mandatory Audit ล่ม → `503 AUTH_SERVICE_UNAVAILABLE`

## RBAC และการยกเลิก Session

| Role | ขอบเขต P1 |
| --- | --- |
| **Admin** | จัดการผู้ใช้, Role, Settings, Credentials, CIS Override และ Full Audit |
| **Operator** | จัดการ Device, สร้าง Config/Deployment Plan และสั่ง CIS Scan |
| **Viewer** | ดูข้อมูลที่ได้รับอนุญาตแบบ Read-only |

เมื่อเปลี่ยน Password, Role หรือ Deactivate ผู้ใช้ ระบบต้อง Revoke Session ที่เกี่ยวข้องทันที และห้าม Demote/Deactivate Admin คนสุดท้าย

## Security สำคัญใน P1

- Password ใช้ Argon2id (`m=19456 KiB, t=2, p=1`) พร้อม Random Salt และใช้ Dummy Hash เมื่อไม่พบบัญชี
- Cookie ใช้ `HttpOnly`, `SameSite=Strict` และ `Secure` ใน Production; ไม่เก็บ Token ใน `localStorage`/`sessionStorage`
- State-changing Request ตรวจ Exact `Origin`/`Referer` และ `X-CSRF-Protection: 1`; CORS ห้ามใช้ Wildcard เมื่อส่ง Cookie
- React แสดงข้อมูลเป็น Plain Text และไม่ Render HTML/Markdown ดิบ
- Login ล้มเหลวทุกสาเหตุตอบเหมือนกัน และจำกัด 5 ครั้งต่อ Client IP ใน 15 นาที
- Auth ส่ง Audit Event โดยไม่ส่ง Password, Token, Cookie, Client IP หรือ Raw Failed-login Identifier
- Action ที่เปลี่ยนข้อมูลต้อง Commit พร้อม Audit ส่วน Login Failed/Permission Denied ใช้ Audit Transaction แยก

## ขอบเขตและ Demo

P1 มี Login, Logout, Current User, Self-change Password, Admin User Management, RBAC, Session Revoke, Security Guards, Audit Events และ Test Users สาม Role

P1 ไม่มี Self-registration, Forgot/Admin Reset Password, OAuth/SSO, MFA, LDAP/AD, สิทธิ์ระดับ Field/รายอุปกรณ์, Topology และ SSH Config Push

> **Demo:** ผู้ใช้ทั้งสาม Role Login ได้; Viewer เรียก Admin API แล้วได้ `403`; Admin Deactivate Operator ที่กำลังใช้งาน ทำให้ Request ถัดไปได้ `401` ทันทีและมี Audit Event

สถานะปัจจุบันคือ **เอกสารพร้อมเริ่ม Implementation** ยังไม่ใช่หลักฐานว่า Backend/Frontend สร้างและทดสอบเสร็จแล้ว
