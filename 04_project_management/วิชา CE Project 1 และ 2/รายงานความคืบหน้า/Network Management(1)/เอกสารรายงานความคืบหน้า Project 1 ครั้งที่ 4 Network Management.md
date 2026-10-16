**รายงานความคืบหน้า รายวิชา Project 1 ครั้งที่ 4**  
**ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์**  
**สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง**

1. หัวข้อโครงงาน (ภาษาอังกฤษ): Application for network management and configuration automation (1)
2. การดำเนินการมีความคืบหน้า: **[รอยืนยัน]** % (ประเมินจากทั้งรายวิชา Project 1 และ Project 2)
3. รายงานความคืบหน้าระหว่าง: วันที่ **[รอยืนยัน]** ถึงวันที่ **[รอยืนยัน]**

รายงานนี้ครอบคลุมเฉพาะ **MyNetMate — Network Management (1)** โดยเปรียบเทียบกับรายงานครั้งที่ 3 และตรวจหลักฐานใน Workspace เมื่อวันที่ 9 ตุลาคม 2569 วันตรวจหลักฐานไม่ใช่วันสิ้นสุดช่วงรายงานที่ตกลงแล้ว ส่วน Network Discovery และ Topology ยังคงอยู่ใน P2 ตามเอกสารขอบเขต แม้มีต้นแบบและการพัฒนาบางส่วนแล้ว

## 4. สรุปความคืบหน้า (โครงงานประเภท Software Development)

| หัวข้อ | ครั้งที่ 1 | ครั้งที่ 2 | ครั้งที่ 3 | ครั้งที่ 4 | ครั้งที่ 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| 1. ศึกษาทบทวนข้อกำหนดที่ควรมี และจำเป็นต้องมี | 50% | 65% | 65% | [รอยืนยัน] | — |
| 2. การออกแบบ UX/UI | 0% | 0% | 20% | [รอยืนยัน] | — |
| 3. การออกแบบ Use Case Diagram / Class Diagram / Sequence Diagram หรือ Diagram อื่นที่อธิบายการทำงานและโครงสร้างโปรแกรม | 30% | 40% | 40% | [รอยืนยัน] | — |
| 4. การออกแบบ Software Architecture Diagram / System Architecture Diagram | 15% | 30% | 45% | [รอยืนยัน] | — |
| 5. พัฒนาให้ทำงานตามข้อกำหนด และทดสอบ Unit Testing / Integration Testing | 15% | 20% | 35% | [รอยืนยัน] | — |
| 6. การ Deploy และ Integrate ให้เป็นระบบที่ทำงานตามข้อกำหนด | 5% | 5% | 5% | [รอยืนยัน] | — |

*ค่าครั้งที่ 1–3 เป็นข้อมูลย้อนหลังจากรายงานครั้งที่ 3 ส่วนครั้งที่ 4 ต้องให้ทีมยืนยันก่อนกรอก ไม่คำนวณเปอร์เซ็นต์จากจำนวนไฟล์หรือภาพออกแบบ*

## 5. รายละเอียดความคืบหน้า

### 5.1 ขอบเขตงานและผู้รับผิดชอบ

ความก้าวหน้าหลักจากครั้งที่ 3 คือการเชื่อม Authentication เข้ากับระบบจริงในระดับโค้ด เพิ่ม User Management และ Audit History ปรับการจัดเก็บข้อมูล Inventory/Discovery และจัดทำชิ้นงานบทที่ 3 ให้มีรายละเอียดมากขึ้น โดยแยกผลงานตามหลักฐานดังนี้

- **นภัทร:** งาน Authentication/RBAC, User Management, Audit และการเชื่อมหน้าจอส่วนนี้ รวมถึงงานเตรียม Docker ของ Backend/Frontend พบ Commit ในนาม `NaphatJa`; ชุด Sequence Diagram ระบุชัดว่าเป็นส่วนที่นภัทรรับผิดชอบ
- **สมาชิกผู้รับผิดชอบ Device Inventory/Network Discovery:** งานปรับฐานข้อมูล ตัวตนอุปกรณ์ การเก็บผลค้นหา และการปรับ Topology ที่เกี่ยวข้อง พบ Commit ในนาม `Chatnarint Boonsaeng` จึงไม่นับเป็นผลงานของนภัทรทั้งหมด
- **เอกสารและภาพรวมของกลุ่ม:** Use Case, System Architecture, Activity Diagram, ER Diagram และ UI ใช้เป็นชิ้นงานประกอบรายงานร่วม ผู้จัดทำแต่ละส่วน **[รอยืนยัน]** หากไฟล์ไม่ได้ระบุไว้ชัดเจน

หลักฐานการแบ่งงานและความเปลี่ยนแปลงหลังครั้งที่ 3 อยู่ในรายการ E02 และ E11 ท้ายรายงาน

### 5.2 Authentication & RBAC — พัฒนาแล้วในส่วนที่ตรวจพบ

ครั้งที่ 3 มีพื้นฐานโมเดลผู้ใช้/Session, Password Hashing, Token และ Rate Limiter รอบนี้เพิ่มการเชื่อม **Login, อ่านผู้ใช้ปัจจุบัน, Logout และเปลี่ยนรหัสผ่าน** เข้ากับ FastAPI และบริการที่อ่าน/เขียนฐานข้อมูล พร้อมหน้า Login และ My Account ฝั่ง Frontend จึงมีเส้นทางใช้งานต่อเนื่องจากหน้าจอถึงบริการฝั่งเซิร์ฟเวอร์ในโค้ด ไม่ใช่เพียงโมดูลพื้นฐานแยกกัน

เพิ่มการส่ง Session ผ่าน HttpOnly Cookie การตรวจ Origin/CSRF สำหรับคำขอเปลี่ยนข้อมูล และการล้างข้อมูลผู้ใช้กับข้อมูลที่เคยโหลดเมื่อ Session ใช้ไม่ได้ รวมทั้งเชื่อมการบันทึก Audit ก่อนตอบผลสำเร็จของงานที่กำหนดให้ต้องบันทึก หากบันทึกล้มเหลว โค้ดจะไม่ตอบว่างานสำเร็จ (หลักฐาน E03)

**ข้อจำกัด:** มีการบังคับสิทธิ์ฝั่ง Backend สำหรับ User Management และ Audit History แล้ว แต่ Router ของ Devices, Discovery และการอ่าน Topology ยังไม่พบการนำ Permission Guard มาใช้ครบ การซ่อนเมนูหรือบังคับ Login ที่ Frontend จึงยังไม่เพียงพอที่จะรับรอง RBAC ทั้งระบบ และผลทดสอบการใช้งานจริงรอบล่าสุดยังรอยืนยัน

![Sequence Diagram การเข้าสู่ระบบ](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/sequence-diagram/naphat/fig-3-6-login.png)

*ภาพที่ 1: Sequence Diagram แสดงการตรวจข้อมูล การบันทึก Session และ Audit ก่อนส่ง Cookie กลับ เป็นหลักฐานงานออกแบบลำดับการทำงาน ไม่ใช่ผลทดสอบ Login กับฐานข้อมูลจริง*

### 5.3 User Management — พัฒนาแล้ว

เพิ่ม API และหน้า **User Management สำหรับ Admin** เพื่อดูรายการบัญชี กรองสถานะ แบ่งหน้า สร้างบัญชี เปลี่ยนบทบาท และเปิด/ปิดบัญชี พร้อมหน้าต่างยืนยันการเปลี่ยนแปลง โดยไม่มีการลบบัญชีผ่านหน้าจอ โค้ดฝั่ง Backend ตรวจสิทธิ์ก่อนทำงาน และส่งข้อมูลผู้ใช้เฉพาะส่วนที่เปิดเผยได้กลับไปยังหน้าจอ (หลักฐาน E04)

เพิ่มเงื่อนไขเพิกถอน Session เมื่อเปลี่ยนบทบาทหรือปิดบัญชี และป้องกันการลดสิทธิ์หรือปิดบัญชีจนไม่เหลือ Admin ที่ใช้งานได้ ทำให้การจัดการบัญชีมีเงื่อนไขควบคุมมากกว่าการเปลี่ยนค่าในแบบฟอร์ม ส่วนผลทดสอบเงื่อนไขเหล่านี้รอบล่าสุดยังรอยืนยัน

### 5.4 Audit Trail และ Audit History — พัฒนาแล้ว

จากครั้งที่ 3 ที่วางแผนพัฒนา Audit ส่วนกลาง รอบนี้มี **Audit Writer, โมเดลข้อมูล, Migration, API อ่านประวัติ และหน้า Audit History** แล้ว การทำงานของ Authentication และการจัดการบัญชีที่ต้องบันทึกประวัติเชื่อมกับ Writer ภายใน Transaction ของงานนั้น เพื่อให้ข้อมูลธุรกิจกับประวัติสำเร็จหรือย้อนกลับร่วมกันตามเงื่อนไขที่กำหนด (หลักฐาน E05)

หน้า Audit History ให้ Admin กรองเหตุการณ์ ผู้กระทำ ประเภททรัพยากร ผลลัพธ์ และช่วงเวลา โหลดรายการเพิ่มเติม และเปิดรายละเอียดได้ เพิ่มการแสดงชื่อผู้ใช้/ทรัพยากรเพื่อให้อ่านได้ง่ายขึ้น โดยชื่อเป็นค่าปัจจุบัน ไม่ใช่สำเนาชื่อ ณ เวลาที่เกิดเหตุการณ์ หน้าจอและ API นี้เป็นแบบอ่านอย่างเดียว

**ข้อจำกัด:** การเชื่อม Audit ยังไม่ครบทุกฟีเจอร์ โดยเฉพาะงานจัดการอุปกรณ์และ Discovery; โค้ดปัจจุบันตัดข้อความ Description ออกก่อนจัดเก็บเพื่อป้องกันข้อมูลลับ จึงยังไม่รองรับคำอธิบายเหตุการณ์แบบข้อความอิสระ และยังไม่รับรองการป้องกันแก้ไขประวัติจากผู้มีสิทธิ์เข้าฐานข้อมูลโดยตรง

![Wireframe หน้าประวัติเหตุการณ์](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/wireframes/wf-11-audit-history.png)

*ภาพที่ 2: Wireframe แสดงตัวกรอง ตารางประวัติ และการเปิดรายละเอียดสำหรับ Admin ข้อมูลในภาพเป็นตัวอย่าง การยืนยันว่ามีการพัฒนาใช้หลักฐานโค้ดใน E05 แยกจากภาพนี้*

### 5.5 Device Inventory และ Network Discovery — พัฒนาเพิ่มในงานของสมาชิกผู้รับผิดชอบ

จากครั้งที่ 3 ที่นำเสนอหน้าจอต้นแบบ รอบนี้ตรวจพบการเชื่อมรายการอุปกรณ์และรายละเอียดกับ API/ฐานข้อมูล พร้อมการปรับขั้นตอนเพิ่มอุปกรณ์ให้เก็บข้อมูลผ่าน SNMP ก่อนบันทึก แยกบริการรายการอุปกรณ์ การบันทึก Snapshot การตรวจสถานะ และการสร้าง Topology ออกจากกัน เพื่อให้ดูแลและตรวจสอบแต่ละส่วนได้ง่ายขึ้น

การปรับที่พบหลังครั้งที่ 3 ได้แก่ การรักษาตัวตนและ Device ID ระหว่างรวมผลค้นหา การใช้ Chassis ID ช่วยลดข้อมูลซ้ำ การรองรับเพื่อนบ้านที่ยังไม่มี Management IP เป็นอุปกรณ์ Unmanaged และการคงประวัติเมื่อย้ายอุปกรณ์ออกจากการใช้งาน การตรวจสถานะผ่าน SNMP เป็นงานคนละอย่างกับการโหลดรายการใหม่ และไม่ใช่การรวบรวมข้อมูล Operational ทุกส่วน (หลักฐาน E06)

ฝั่ง Discovery มีบริการเรียก `oxian_py` จัดเก็บงานค้นหา รอบการรวบรวมข้อมูล และหลักฐานเพื่อนบ้าน พร้อมส่งเหตุการณ์ความคืบหน้าให้ Frontend และเก็บผลที่สำเร็จไว้เมื่อบางส่วนล้มเหลว ความก้าวหน้าที่รายงานคือการเชื่อมและจัดเก็บผลใน Backend/Frontend; ไม่ใช่การยืนยันการรองรับทุก Vendor หรือผลค้นหาบนอุปกรณ์จริงรอบล่าสุด (หลักฐาน E07)

### 5.6 Network Topology — พัฒนาเพิ่มจากต้นแบบเดิม

ไม่นับการวาดแบบ Isometric, Dagre หรือการย่อ/ขยายเป็นงานใหม่ เพราะรายงานครั้งที่ 3 กล่าวไว้แล้ว รอบนี้พบการปรับ **อ่านแผนผังจากข้อมูลที่บันทึกในฐานข้อมูล และโหลดข้อมูล Inventory/Topology ใหม่หลัง Discovery** ช่วยให้แผนผังอ้างอิงทะเบียนอุปกรณ์ที่จัดเก็บไว้ แทนการใช้เพียงผลค้นหาชั่วคราวในหน้าจอ

เพิ่มการจับคู่ Default Route กับอุปกรณ์เดิมจาก Management IP หรือ IP ของ Interface หากไม่พบอุปกรณ์ปลายทางจึงแสดง Gateway ภายนอก แยกเส้น Default Route จากความสัมพันธ์ LLDP และลดการสร้างโหนดอุปกรณ์ซ้ำ เส้นทาง Default Route เป็นหลักฐานด้าน Routing ไม่ใช่การยืนยันสายเชื่อมทางกายภาพ (หลักฐาน E08)

**ข้อจำกัด:** ยังต้องทดสอบความถูกต้องของแผนผังใน Isolated Lab รวมทั้งตรวจการแสดงอายุข้อมูล หลักฐานไม่ครบ และการบังคับสิทธิ์ก่อนใช้งาน ไม่อ้างว่าต้นแบบนี้ผ่านการทดสอบเครือข่ายจริงครบแล้ว

### 5.7 Dashboard — ออกแบบเพิ่ม; ส่วนข้อมูลสรุปยังวางแผนทำต่อ

เพิ่ม Wireframe ของ Dashboard พื้นฐานที่ระบุตำแหน่งการ์ดจำนวนอุปกรณ์ กิจกรรมล่าสุด และทางลัด รวมถึง **Mockup Dashboard P2 Operational Monitoring** ที่แยกสถานะการติดต่อ ผลการเก็บข้อมูล และความใหม่ของข้อมูล พร้อมแนวทางแสดงประเด็นของ Switch/Router จากข้อมูลและ Expected State ที่กำหนดไว้ (หลักฐาน E09)

เมื่อเทียบกับ `HomePage.tsx` ปัจจุบัน หน้า Dashboard ยังแสดง **Dashboard is Empty** และทางลัดไป Devices/Topology จึงยังไม่พบการพัฒนาการ์ดสรุป Activity Feed หรือ Operational Monitoring ตามภาพออกแบบ การมีข้อมูล Reachability หรือ Interface ใน Backend ไม่ได้ยืนยันว่า Dashboard P2 ทำงานแล้ว

![Mockup Dashboard P2 Operational Monitoring](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/p2-operational-monitoring/dashboard-p2.png)

*ภาพที่ 3: Mockup Dashboard P2 ใช้ข้อมูลสมมติ แสดงแนวทางแยก Unreachable, Collection Failed, Stale และปัญหา Operational ตัวเลขในภาพไม่ใช่ผลทดสอบ ระบบ Refresh, Freshness และกฎสรุปปัญหายังต้องยืนยันสัญญาข้อมูลและพัฒนาหลัง P1 เสถียร*

### 5.8 เอกสารบทที่ 3 — ออกแบบแล้วตามชิ้นงานที่ตรวจพบ

เพิ่มชิ้นงานที่อธิบายหน้าที่ ขั้นตอน ข้อมูล และหน้าจอของ Network Management จากเดิมที่รายงานครั้งที่ 3 เน้นโมดูลพื้นฐานและภาพหน้าจอต้นแบบ ดังนี้

| ชิ้นงาน | สิ่งที่เพิ่มและผลที่ได้ | หลักฐาน / สถานะ |
|---|---|---|
| System Architecture | มีไฟล์ฉบับล่าสุดแสดง Network Admin, Browser, Ingress, Website/Backend/Database แบบ Container, อุปกรณ์เครือข่าย และ Docker Compose ช่วยให้เห็นขอบเขตองค์ประกอบและการเชื่อมต่อ REST | E10.1 — ออกแบบแล้ว; ภาพไม่ใช่หลักฐาน Deploy สำเร็จ |
| Activity Diagram | มี 3 เรื่อง: Login, เพิ่มอุปกรณ์ และ Discovery/แสดง Topology แยกขั้นตอน User–Frontend–Backend พร้อมทางเลือกเมื่อสำเร็จ ได้ข้อมูลบางส่วน หรือล้มเหลว | E10.2 — ออกแบบแล้ว |
| Use Case Diagram และ Use Case Description | มีภาพ Use Case ฉบับล่าสุดและคำอธิบาย 11 กรณี ระบุ Actor, Main Flow, Exception Flow และความต้องการที่เกี่ยวข้อง ครอบคลุมการใช้งานของ Admin, Operator และ Viewer | E10.3 — ออกแบบแล้ว; ยังต้องตรวจชื่อและการแยกกิจกรรมในภาพให้ตรงกับ Description |
| Sequence Diagram | มี 5 เรื่องในส่วนที่นภัทรรับผิดชอบ: Login, View Dashboard, View Topology, User Management และ Audit History ช่วยอธิบายลำดับ Frontend–Backend–Database | E10.4 — ออกแบบแล้ว; Dashboard และสิทธิ์ Topology บางขั้นยังเป็นเป้าหมายตามแบบ |
| ER Diagram | มีภาพรวมและภาพราย Entity รวม 15 ภาพ ครอบคลุม 14 Entity / 140 Attribute ที่อ้างอิงโมเดลปัจจุบัน พร้อมคำอธิบายข้อมูลและความสัมพันธ์ | E10.5 — ออกแบบแล้ว; การอ่าน Schema ไม่ใช่ผลทดสอบฐานข้อมูลจริง |
| UI และ Navigation Flow | มี Wireframe 12 หน้าจอ/หน้าต่าง แผนภาพการเชื่อมโยงหน้าจอ และ Mockup Dashboard P2 แยกกัน พร้อมคำอธิบายในหัวข้อ 3.8 | E09 — ออกแบบแล้ว; ภาพทั้งหมดใช้ข้อมูลตัวอย่าง |

ใช้ไฟล์ Draw.io ฉบับล่าสุดเป็นหลักฐานของ System Architecture และ Use Case ส่วนภาพ PNG ของ Use Case ที่มีอยู่ยังต้องตรวจว่าตรงกับไฟล์ล่าสุดก่อนนำไปแทรกในเล่ม

![ER Diagram ภาพรวม Network Management](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/fig-3-15-mynetmate-er.png)

*ภาพที่ 4: ER Diagram แยกข้อมูลผู้ใช้/Session/Audit ออกจาก Inventory และหลักฐาน Discovery แสดงความสัมพันธ์หลักตามโมเดลที่ตรวจพบ ส่วน Attribute อยู่ในภาพราย Entity ไม่รวมข้อมูล Configuration Automation (2)*

![Navigation Flow ของ MyNetMate](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/navigation-flow/navigation-flow.png)

*ภาพที่ 5: Navigation Flow แสดงการเปลี่ยนหน้าและเปิด Dialog/Drawer โดยแยก User Management กับ Audit History สำหรับ Admin เป็นภาพออกแบบการนำทาง ไม่ใช่ผลยืนยันสิทธิ์ของทุก API*

### 5.9 การทดสอบและการรวมระบบ — แยกหลักฐานออกจากผลที่ยังรอยืนยัน

- **พัฒนาแล้ว:** มีชุดทดสอบเพิ่มเติมสำหรับ Auth HTTP, User Management, Audit Writer/Reader, Session, การรักษาตัวตนอุปกรณ์ และการสร้าง Topology รวมถึงชุดทดสอบ Frontend สำหรับ Session/Cache และชื่อที่แสดงใน Audit มีทั้งกรณีใช้ข้อมูลจำลองและกรณีที่ต้องใช้ PostgreSQL ทดสอบแยก (หลักฐาน E12)
- **ตรวจชิ้นงานออกแบบแล้ว:** ไฟล์ QA ที่ตรวจพบระบุภาพและคำบรรยาย UI 14 รายการ และไม่รายงานข้อผิดพลาดในชุด Wireframe, Sequence และข้อความล้นของ ER การตรวจนี้เป็นผลด้านชิ้นงานเอกสาร ไม่ใช่การทดสอบการทำงานของระบบ (หลักฐาน E13)
- **ผลการทดสอบระบบรอบล่าสุด: [รอยืนยัน]** ในหลักฐานที่ตรวจรอบนี้ยังไม่พบผลรันที่ยืนยันจำนวนผ่าน/ไม่ผ่านและเวอร์ชันตรงกับโค้ดปัจจุบัน จึงไม่ใช้จำนวนทดสอบหรือผล Build จากครั้งที่ 3 เป็นผลของครั้งที่ 4 ยังต้องแนบผล Unit/Integration และการทดสอบผ่านหน้าจอทั้งระบบเพิ่มเติม
- **พัฒนาแล้วในส่วนเตรียมสภาพแวดล้อม:** เพิ่ม Docker/Compose สำหรับ Backend กับ PostgreSQL และ Frontend กับ Nginx พร้อมไฟล์ Migration รองรับโครงสร้างข้อมูล ช่วยกำหนดวิธีเริ่มระบบร่วมกัน แต่ยังไม่ยืนยันว่า Deploy และเชื่อมทุกส่วนสำเร็จจากไฟล์ตั้งค่าเพียงอย่างเดียว (หลักฐาน E11)

## 6. สิ่งที่จะดำเนินการต่อไป (เป้าหมายในการส่งความคืบหน้าครั้งถัดไป)

1. **ทำ P1 ให้ครบและตรวจสิทธิ์:** เชื่อม Permission Guard และ Audit กับงาน Devices/Credential/Discovery/Topology ตามขอบเขตที่ตกลง ทดสอบว่า Viewer เรียก API เปลี่ยนข้อมูลไม่ได้ และ Operator/Admin ทำได้เฉพาะงานที่อนุญาต
2. **พัฒนา Dashboard พื้นฐานก่อน P2:** เชื่อมจำนวนอุปกรณ์ กิจกรรมล่าสุดที่อนุญาต และสถานะระบบกับแหล่งข้อมูลจริง โดยไม่ใช้ค่าจาก Wireframe/Mockup เป็นข้อมูลระบบ
3. **ยืนยันผลทดสอบและการรวมระบบ:** รันทดสอบ Auth/User Management/Audit กับฐานข้อมูลทดสอบแยก และตรวจผ่าน Browser ตั้งแต่ Login จนถึงเปลี่ยนบทบาท เพิกถอน Session และอ่านประวัติ บันทึกเวอร์ชัน วันทดสอบ และผลผ่าน/ไม่ผ่านสำหรับรายงานรอบถัดไป
4. **ตรวจ Inventory/Discovery/Topology ใน Isolated Lab:** ให้สมาชิกผู้รับผิดชอบตรวจกรณีอุปกรณ์ซ้ำ เพื่อนบ้านไม่มี Management IP ผลค้นหาบางส่วน และ Default Route พร้อมเก็บหลักฐานความถูกต้องของโหนด/เส้นเชื่อม แยกผลระบบจำลองออกจากอุปกรณ์จริง
5. **ตรวจความสอดคล้องของบทที่ 3:** ปรับชื่อ Use Case, หมายเลขรูป, สิทธิ์ และเงื่อนไขผิดพลาดให้ตรงกันระหว่าง Architecture, Activity, Description, Sequence, ER, UI และโค้ด พร้อมแยกขั้นตอนที่ออกแบบไว้จากขั้นตอนที่พัฒนาแล้ว
6. **เตรียม P2 หลัง P1 เสถียร:** ยืนยัน API Contract, Expected State/Criticality และ Freshness Policy ของ Operational Monitoring ก่อนพัฒนาตาม Mockup ใช้การอ่านข้อมูลโดยผู้ใช้สั่งจากอุปกรณ์ที่ลงทะเบียนใน Isolated Lab เท่านั้น

## 7. รายการไฟล์หลักฐานสำหรับตรวจย้อนกลับ

ลิงก์ด้านล่างอ้างอิงไฟล์จริงใน Workspace; รหัส E ใช้จับคู่กับข้อความในรายงาน สถานะ “พัฒนาแล้ว” หมายถึงตรวจพบโค้ดของพฤติกรรมนั้น ไม่ได้หมายความว่าผ่านการทดสอบหรือพร้อมใช้งานจริงทั้งหมด

- **E01 — ฐานเปรียบเทียบและขอบเขต:** [รายงานครั้งที่ 3](<D:/KMITL-Repo/KMITL_Knowledge/Project/04_project_management/วิชา CE Project 1 และ 2/รายงานความคืบหน้า/Network Management(1)/เอกสารรายงานความคืบหน้า Project 1 ครั้งที่ 3 Network Management.md>), [AGENTS.md](D:/KMITL-Repo/KMITL_Knowledge/Project/AGENTS.md), [MVP Scope](<D:/KMITL-Repo/KMITL_Knowledge/Project/02_feature/MyNetMate Weight Feature List (AI คิด).md>)
- **E02 — ประวัติผลงานหลังครั้งที่ 3:** Repository [Backend](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend) และ [Frontend](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website): `NaphatJa` — Backend `3f7ac59`, `b862c60` และ Frontend `8c662c2`, `7522d2a` วันที่ 1 ตุลาคม 2569; `Chatnarint Boonsaeng` — Backend `49034f5`, `d206c64`, `2aa070d`, `b2387b6` และ Frontend `167eb88`, `afc336b` วันที่ 30 กันยายน 2569 ใช้แยกงานเขียนโค้ด ไม่ยืนยันผู้จัดทำภาพทั้งหมด
- **E03 — Authentication/RBAC และการเชื่อม Frontend:** [main.py](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/main.py), [Auth Router](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/router.py), [Auth Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/service.py), [Permission Catalog](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/permissions.py), [Auth Client](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/authentication/client.ts), [App Layout](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/shared/components/AppLayout.tsx)
- **E04 — User Management:** [Admin Router](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/authentication/admin_router.py), Auth Service ใน E03 และ [UsersPage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/users/UsersPage.tsx)
- **E05 — Audit Trail/History:** [Writer](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/audit_trail/writer.py), [Redaction](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/audit_trail/redaction.py), [Read Router](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/audit_trail/router.py), [Reader](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/audit_trail/reader.py), [Audit Migration](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/alembic/versions/20261001_02_audit_logs.py), [AuditPage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/audit/AuditPage.tsx)
- **E06 — Device Inventory:** [Devices Router](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/router.py), [Device Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/service.py), [Snapshot Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/services/snapshot.py), [Health Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/services/health.py), [DeviceInventoryPage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/devices/DeviceInventoryPage.tsx)
- **E07 — การเชื่อม Discovery ใน Backend:** [Discovery Router](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/network_device_discovery/router.py), [Collection Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/network_device_discovery/service.py), [Discovery Models](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/network_device_discovery/models.py) อ้างอิงชั้นเชื่อมต่อใน Backend ไม่ใช่การแก้หรือทดสอบ Library ของสมาชิกใน `mynetmate/network-discovery/`
- **E08 — Topology:** [Topology Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/app/features/devices/services/topology.py), [TopologyPage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/topology/TopologyPage.tsx), [useNetworkScan.ts](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/topology/hooks/useNetworkScan.ts)
- **E09 — Dashboard/UI:** [HomePage.tsx](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/home/HomePage.tsx), [หัวข้อ 3.8 ฉบับล่าสุด](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/chapter-3-8-ui-design.md), [Wireframe README](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/wireframes/README.md), [Wireframe 12 หน้าจอ](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/wireframes/mynetmate-ui-wireframes.drawio), [Navigation Flow](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/navigation-flow/navigation-flow.drawio), [P2 Mockup README](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/p2-operational-monitoring/README.md)
- **E10.1 — System Architecture ฉบับล่าสุด:** [System Diagram.drawio](<D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/System Architecture/System Diagram.drawio>) ตรวจองค์ประกอบและเส้นเชื่อมในไฟล์จริง
- **E10.2 — Activity Diagram:** [Login](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/activity-diagram/activity-login/activity-login.drawio), [Add Device](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/activity-diagram/activity-add-device/activity-add-device.drawio), [Network Discovery](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/activity-diagram/activity-network-discovery/activity-network-discovery.drawio)
- **E10.3 — Use Case:** [Use Case Diagram ฉบับล่าสุด](<D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/use-case-diagram/Use Case Diagram.drawio>), [Use Case Description](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/use-case-description.md)
- **E10.4 — Sequence Diagram ส่วนของนภัทร:** [README และคำอธิบาย 5 เรื่อง](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/sequence-diagram/naphat/README.md), [Draw.io รวม](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/sequence-diagram/naphat/naphat-sequence-diagrams.drawio)
- **E10.5 — ER Diagram:** [หัวข้อ 3.6](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/chapter-3-6-er.md), [README](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/README.md), [Schema ที่สกัดจากโค้ด](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/schema.json), [Draw.io รวม](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/mynetmate-er.drawio)
- **E11 — สภาพแวดล้อมและการรวมระบบ:** [Backend Compose](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/docker-compose.yml), [Frontend Compose](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/docker-compose.yml), [Frontend Dockerfile](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/Dockerfile), [คู่มือ Migration](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/README-migrations.md); Commit ของ `NaphatJa`: Backend `b50fb92`, Frontend `b073e6e`, `c487bd1` วันที่ 24 กันยายน 2569
- **E12 — ชุดทดสอบที่มีอยู่ ไม่ใช่ผลผ่านรอบล่าสุด:** [Auth HTTP](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_http_application.py), [Admin Service](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_admin_service.py), [Auth PostgreSQL](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_authentication_http_postgres.py), [Audit Reader](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_audit_reader.py), [Audit HTTP](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_audit_http.py), [Discovery/Topology](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_network_discovery.py), [Discovery Identity](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_discovery_inventory.py), [Snapshot Lifecycle](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/backend/tests/test_snapshot_lifecycle.py), [Frontend Authentication](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/tests/authentication.test.ts), [Audit Display](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/tests/audit-display.test.ts)
- **E13 — ผลตรวจชิ้นงานเอกสาร:** [UI 3.8 QA](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/chapter-3-8-qa.json), [Wireframe QA](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/wireframes/render-qa.json), [Sequence QA](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/sequence-diagram/naphat/render-qa.json), [ER QA](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/er-diagram/render-qa.json)

*รายละเอียดครั้งที่ผ่านมาให้อ้างอิงไฟล์รายงานครั้งที่ 3 ใน E01 ซึ่งมีเอกสารแนบของครั้งที่ 1–2 อยู่แล้ว แยกจากผลงานเพิ่มของครั้งที่ 4*
