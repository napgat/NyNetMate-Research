### คำอธิบายแต่ละเส้นในภาพ

| เส้นในภาพ                                                                       | ความหมายที่อธิบายอาจารย์                                                                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ผู้ใช้ → Auth API: `Login: identifier + password`                               | ผู้ใช้ส่ง username/email และ password เข้ามาเพื่อขอเข้าสู่ระบบผ่าน API                                                          |
| Auth API → Auth Service                                                         | API ส่งงานตรวจสอบตัวตนให้ชั้น Service เพื่อแยก business logic ออกจาก endpoint                                                   |
| Auth Service → `users`: `ค้นหาผู้ใช้`                                           | ระบบค้นหาบัญชีผู้ใช้จาก username/email ที่ปรับรูปแบบแล้ว เช่น แปลงเป็นตัวพิมพ์เล็ก                                              |
| Auth Service → Auth Service: `ตรวจ Password ด้วย Argon2id`                      | ถ้าพบผู้ใช้ ระบบนำ password ที่ผู้ใช้ส่งมาเปรียบเทียบกับ password hash ด้วย Argon2id โดยไม่ถอดรหัสหรือเก็บ password ดิบ         |
| Auth Service → `auth_sessions`: `Login สำเร็จ: สร้าง opaque token และเก็บ hash` | เมื่อ Login สำเร็จ ระบบสร้าง session token แบบสุ่ม แล้วเก็บเฉพาะ hash ของ token ในฐานข้อมูล จึงไม่มี token ดิบรั่วใน DB         |
| Auth Service → Audit Writer: `login_success / login_failed`                     | ไม่ว่า Login สำเร็จหรือล้มเหลว ระบบสร้าง Audit Event เพื่อให้ตรวจสอบย้อนหลังได้                                                 |
| Auth API → ผู้ใช้: `Set-Cookie: HttpOnly session token`                         | Browser ได้รับ token ผ่าน HttpOnly Cookie ซึ่ง JavaScript อ่านไม่ได้ ช่วยลดความเสี่ยงจาก XSS                                    |
| ผู้ใช้ → Auth Guard: `เรียก API พร้อม Session Cookie`                           | หลัง Login แล้ว Browser จะส่ง Cookie นี้ติดไปกับทุก API ที่ต้องล็อกอิน                                                          |
| Auth Guard → `auth_sessions`: `Hash token และตรวจ session + user`               | Auth Guard hash token จาก Cookie แล้วค้นหา session ว่ายังมีอยู่ ไม่หมดอายุ และไม่ถูก revoke                                     |
| Auth Guard → `users`: `อ่าน role ปัจจุบัน`                                      | ระบบอ่าน role ปัจจุบันจากฐานข้อมูลทุกครั้ง ไม่เชื่อ role ที่อยู่ใน Cookie เพื่อให้การเปลี่ยนสิทธิ์หรือระงับบัญชีมีผลทันที       |
| Auth Guard → Permission Guard                                                   | เมื่อ session ถูกต้อง Auth Guard ส่งข้อมูลผู้ใช้และ role ไปให้ Permission Guard ตรวจสิทธิ์ระดับ API                             |
| Permission Guard → Feature APIs: `อนุญาต`                                       | ถ้าบทบาทมี permission ที่ต้องใช้ คำขอจึงไปถึง Device, Config, CIS หรือ Settings API ได้                                         |
| Permission Guard → Audit Writer: `ปฏิเสธ 403`                                   | ถ้าไม่มีสิทธิ์ ระบบตอบ 403 Forbidden และบันทึก `auth.permission_denied` เพื่อเป็นหลักฐานด้านความปลอดภัย                         |
| Feature APIs → Audit Writer: `เหตุการณ์สำคัญ`                                   | เมื่อผู้ใช้ทำงานสำคัญ เช่น เพิ่มอุปกรณ์ สร้าง Config หรือแก้ Settings ฟีเจอร์จะส่ง event ไปบันทึก Audit                         |
| Audit Writer → `audit_logs`: `บันทึกใช่`                                        | Audit Writer ตรวจรูปแบบ event, redact ข้อมูลเสี่ยง และบันทึกลงตารางกลาง `audit_logs`                                            |
| โน้ตด้านบน → Audit Writer                                                       | โน้ตนี้ไม่ใช่ข้อมูลที่ไหลในระบบ แต่เป็นกฎกำกับว่า Audit Log ห้ามเก็บ Client IP, password, token และ raw failed-login identifier |

### ประโยคสรุปปิดภาพ

“ภาพนี้ทำให้เห็นว่า Authentication ไม่ได้มีแค่ Login แต่ควบคุมตั้งแต่การสร้าง session อย่างปลอดภัย การตรวจสิทธิ์ทุก request จาก role ปัจจุบันในฐานข้อมูล และการบันทึกเหตุการณ์สำคัญโดยไม่เก็บข้อมูลลับลง Audit Log”