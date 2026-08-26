# MVP Scope - Authentication & RBAC

เอกสารนี้กำหนดขอบเขต (Scope) การทำงานขั้นต่ำ (MVP) ของฟีเจอร์ Authentication และการควบคุมสิทธิ์ (RBAC) สำหรับ MyNetMate (Phase 1)

## 1. Core Architecture
- **Authentication:** อาศัย JSON Web Token (JWT) ส่งผ่าน `HttpOnly` Cookie
- **Password Hashing:** บังคับใช้อัลกอริทึม `Argon2id` เพื่อความปลอดภัยสูงสุดสำหรับระบบใหม่
- **Session Management:** มีตาราง `auth_sessions` เพื่อรองรับการยกเลิกสิทธิ์ (Revoke/Deactivate) แบบมีผลทันที

## 2. Role-Based Access Control (RBAC)
ระบบกำหนดสิทธิ์ผู้ใช้งานเป็น 3 ระดับ (Roles) เพื่อรักษาสมดุลระหว่าง Operation และ Security Compliance:

1. **Admin:** เจ้าของระบบ ดูแลเรื่อง Security และ User Management 
2. **Operator:** วิศวกรหน้างาน จัดการอุปกรณ์ และสร้าง Config Plan ได้ (ส่วนการสั่ง Push Config ลงอุปกรณ์จริงผ่าน SSH จะอยู่ในระยะ P2) แต่ยุ่งกับ User/Security ไม่ได้
3. **Viewer:** ผู้เยี่ยมชม ดู Dashboard และ Topology ได้อย่างเดียว ป้องกัน Human Error

## 3. User Management Scope (P1)
ระบบรองรับฟังก์ชันจัดการผู้ใช้ขั้นพื้นฐาน ดังนี้:
- ✅ Admin สามารถ **สร้างผู้ใช้ใหม่** (Create User) ได้
- ✅ Admin สามารถ **ระงับผู้ใช้** (Deactivate/Disable) ได้
- ✅ Admin สามารถ **เปลี่ยน Role** ของผู้ใช้อื่นได้
- ✅ ผู้ใช้งานสามารถ **เปลี่ยนรหัสผ่านของตนเอง** (Self-change Password) ได้
- ❌ **ไม่รองรับ** ระบบ Admin รีเซ็ตรหัสผ่านให้ผู้ใช้อื่น (Admin Reset Password / Temporary Password) เพื่อลดความซับซ้อนของ Flow ในระยะ P1
- ❌ **ไม่รองรับ** ระบบสมัครสมาชิกเอง (Self-Registration) และระบบลืมรหัสผ่าน (Forgot Password via Email)
