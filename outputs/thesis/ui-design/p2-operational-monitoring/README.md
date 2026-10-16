# MyNetMate — P2 Operational Dashboard

สถานะ: **UI Design Proposal / ข้อมูลสมมติ** ไม่ใช่ภาพจากระบบที่พัฒนาและเชื่อมต่ออุปกรณ์แล้ว

ออกแบบเฉพาะหน้า Dashboard ตาม `P2_Operational_Monitoring` เพื่อให้ตอบว่าอุปกรณ์ใดติดต่อไม่ได้ การเก็บข้อมูลสำเร็จไหม Switch/Router มีประเด็นใด และข้อมูลที่เห็นเก่าแล้วหรือยัง ไม่แก้ไข Google Docs หรือโปรแกรมจริง

## ไฟล์และวิธีแก้ไข

- [dashboard-p2.png](dashboard-p2.png) — ภาพสำหรับดูและใส่เอกสาร
- [dashboard-p2.drawio](dashboard-p2.drawio) — เปิดด้วย Draw.io / diagrams.net แล้วแก้ข้อความ สี ขนาด หรือตำแหน่งได้เป็นรายส่วน ไม่ใช่รูปภาพแบนที่ฝังไว้
- [dashboard-p2.svg](dashboard-p2.svg) — ภาพเวกเตอร์สำหรับย่อหรือขยาย

เปิดไฟล์ `.drawio` ด้วย Draw.io Desktop หรือ File → Open From → Device ในเว็บ diagrams.net แล้ว Save As เป็นสำเนาของตัวเอง ภาพใช้ native cells ทั้งหมด และ PNG/SVG แสดงผลจากข้อมูลชุดเดียวกัน

`build-dashboard-p2.cjs` ใช้สร้างไฟล์ต้นฉบับและภาพใหม่ หากแก้ Draw.io ด้วยมือแล้วไม่ควรรันซ้ำทับไฟล์ที่แก้ ให้สำรองหรือเปลี่ยนชื่อไฟล์ก่อน

## หลักการจัดหน้า

1. ด้านบน: ขอบเขต Site เวลา Collection Attempt ล่าสุด และปุ่ม Refresh เฉพาะอุปกรณ์ที่ผู้ใช้เลือก
2. ภาพรวม: Unreachable, Collection Failed, Stale และ Critical Operational Problems
3. ประเด็นที่ควรตรวจ: แยก Switch Operations กับ Router Operations และกดต่อไปยังหลักฐานใน Device Detail
4. ความน่าเชื่อถือของข้อมูล: แยก Reachability, Latest Collection Attempt, Last Successful Collection และ Data Freshness
5. ส่วนประกอบเสริม: Security Summary, System Health, Recent Activity และทางลัดตามสิทธิ์

ใช้สีหลัก `#0284c7` และพื้นหลัง `#f8fafc` ตาม theme ของ Frontend ปัจจุบัน ภาพตัวอย่างใช้บัญชี Admin จึงมี Users/Audit History; เมื่อพัฒนาจริงต้องซ่อนเมนูและบังคับสิทธิ์จาก Backend ตามบทบาทด้วย

## ความหมายของตัวอย่างในภาพ

- มี 4 อุปกรณ์: Reachable 2, Unreachable 1 และ Unknown 1
- CORE-SW มี Critical Uplink Down กับ Critical Err-disabled Port รวม 2 ประเด็น
- EDGE-R1 มี Critical WAN Down กับ Expected Default Route Missing รวม 2 ประเด็น
- Critical Problems จึงเป็น **4 ประเด็น ไม่ใช่ 4 อุปกรณ์** และไม่นับ Security Findings ปน
- ทั้งสองอุปกรณ์ข้างต้นมี Snapshot 10:04 และ Expected State/Criticality กำหนดแล้ว จึงใช้สรุปประเด็น Operational ได้ ตัวอย่าง Err-disabled Port สมมติให้ Interface นั้นเป็น Critical โดยการจัดระดับจริงต้องตกลง Rule Contract ก่อน
- FLOOR2-SW เก็บข้อมูลล่าสุดไม่สำเร็จเวลา 10:06 และมีข้อมูลเก่าที่เก็บสำเร็จเวลา 09:12 แสดง Stale / Last Known State โดยไม่อ้างเป็นสถานะ Operational ปัจจุบัน
- LAB-SW3 ยังไม่เคยเก็บข้อมูล จึงเป็น Unknown / Never Collected ไม่ใช่ Unreachable หรือ Stale
- จำนวน Unreachable, Failed และ Stale ทับซ้อนกันได้ เพราะเป็นคนละมิติ ไม่ใช่หมวดที่นำมาบวกเป็นจำนวนอุปกรณ์ทั้งหมด
- เวลาในภาพเป็นเหตุการณ์สมมติภายในวันเดียวกัน ส่วนเกณฑ์ว่า Snapshot เก่าเมื่อใดต้องกำหนดใน Freshness Policy ก่อน Implement
- ปุ่ม Refresh เลือก CORE-SW, EDGE-R1 และ FLOOR2-SW รวม 3 อุปกรณ์เป็นตัวอย่างเป้าหมายสำหรับรอบถัดไป ไม่ได้เก็บข้อมูลทันทีที่เปิดหน้า
- Security Summary เป็นข้อมูลอ่านจากเจ้าของ Security & Validation ไม่ใช่ Dashboard ตรวจ CIS เอง ไม่มี Workflow เปลี่ยน Configuration ในภาพนี้
- Recent Activity เป็นตัวอย่างข้อมูลที่อนุญาตให้แสดงได้ ไม่แสดง Credential, Token หรือ Raw Output การ Refresh เป็น Event ที่เสนอสำหรับ P2 และยังต้องยืนยัน Audit Event Contract ก่อนพัฒนา ไม่ใช่การอ้างว่าลงทะเบียน Event นี้ในระบบแล้ว
- Offline Mode ที่ตั้งใจเปิดไม่แสดงเป็น Critical Error; System Health ไม่ใช้ตัดสินว่าตัว Switch/Router เสีย

## ขอบเขตที่ต้องรักษาเมื่อพัฒนา

Refresh ต้องเกิดจากผู้ใช้ เป็น **Read-only**, อุปกรณ์ลงทะเบียนและอยู่ใน Allowlist ภายใน Isolated Lab เท่านั้น ไม่ Scan เพิ่ม ไม่ Restart Interface ไม่เปลี่ยน Configuration และไม่ใช้ AI ตัดสินสถานะ

หากยังไม่มี Expected State ให้แสดง Actual State เท่านั้น ห้ามสรุปว่า Down หรือไม่มี Default Route คือปัญหาเสมอ ทุกประเด็นต้องเปิดดูเวลาและหลักฐานต้นทางได้

ภาพนี้ไม่มี Auto-refresh, Real-time Monitoring, กราฟย้อนหลัง, Bandwidth, CPU/Memory, การแจ้งเตือนอัตโนมัติ หรือ AI Root-cause Analysis เพราะอยู่นอก MVP ที่ใช้ร่างครั้งนี้

API Contract, Refresh Permission, Criticality/Expected State Rule, Freshness Policy และ Integration กับ Security/Audit/System Health ยังต้องยืนยันก่อน Implement ภาพออกแบบไม่ใช่หลักฐานว่าฟังก์ชันเหล่านี้เสร็จแล้ว

## แหล่งอ้างอิงภายในโครงการ

- [MVP D&M — P2](../../../../02_feature/01_Dashboard%26Monitoring(Naphat)/P2_Operational_Monitoring/MVP%20D%26M.md): F-01 ถึง F-14, Read-only Manual Refresh, Operational State Separation, Expected State และรายการที่ตัดออกจาก MVP
- [Display in MVP](../../../../02_feature/01_Dashboard%26Monitoring(Naphat)/P2_Operational_Monitoring/Display%20in%20MVP.md): จัดหน้า Overview → Problems → Switch/Router → Security/System → Activity/Actions
- [Frontend Theme](../../../../mynetmate/website/src/shared/theme.ts): สีหลักและพื้นหลังที่ใช้เป็นพื้นฐานของภาพ

## แหล่งอ้างอิงภายนอกและส่วนที่นำมาประยุกต์

ตรวจสอบหน้าเอกสารทางการวันที่ **8 ตุลาคม 2569 (2026-10-08)** การเชื่อมโยงแนวทางกับหน้าจอด้านล่างเป็นการประยุกต์ออกแบบ MyNetMate ไม่ใช่ข้ออ้างว่าบริการเหล่านี้ถูกติดตั้งในระบบ

1. **Grafana Labs. “Grafana dashboard best practices.”** [เอกสารทางการ](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/)
   - แนวทาง: Dashboard ควรตอบคำถาม มีลำดับข้อมูลจากภาพรวมสู่รายละเอียด ลดภาระการตีความ และเชื่อมไปดูรายละเอียดได้
   - นำมาใช้: วางจำนวนปัญหาด้านบน ตามด้วยประเด็น Switch/Router และทางไป Device Detail ไม่แสดงทุก Interface/Route บนหน้าหลัก ไม่ได้นำตัวอย่าง CPU/Memory หรือกราฟเวลาของ Grafana มาเพิ่ม Scope

2. **Zabbix. “2 Hosts.”** [เอกสารทางการ](https://www.zabbix.com/documentation/current/en/manual/web_interface/frontend_sections/monitoring/hosts)
   - แนวทาง: หน้ารายการ Host แสดง Availability, Problems และลิงก์ไปข้อมูลของ Host แยกกัน โดย Unknown ไม่เท่ากับการเชื่อมต่อไม่สำเร็จ
   - นำมาใช้: แสดงชื่ออุปกรณ์ สถานะการติดต่อ ผลเก็บข้อมูล ความใหม่ และ Details แยกช่องกัน ส่วนการแยก Collection/Freshness เพิ่มเติมเป็นข้อกำหนดของเอกสาร P2 ของเรา ไม่ได้อ้างว่าเป็นข้อบังคับจาก Zabbix และไม่ได้นำระบบ Polling ต่อเนื่องมาใช้

3. **W3C Web Accessibility Initiative. “Understanding SC 1.4.1: Use of Color.”** [เอกสารทางการ](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
   - แนวทาง: ห้ามใช้สีเป็นวิธีเดียวในการสื่อข้อมูล สถานะ หรือการกระทำ
   - นำมาใช้: สีของปัญหาและ Badge มีข้อความ เช่น Unreachable, Failed, Stale, Unknown หรือ Critical ประกอบ ผู้อ่านไม่จำเป็นต้องแยกสีได้จึงจะเข้าใจสถานะ
   - ข้อจำกัด: เป็นหลักการที่ใช้ในการร่างเท่านั้น ยังไม่ได้รับรองว่าทั้งระบบผ่าน WCAG; ต้องทดสอบ Contrast, Keyboard, Screen Reader และองค์ประกอบอื่นเมื่อ Implement จริง

## ผลตรวจภาพ

ภาพ PNG/SVG สร้างจาก Draw.io XML เดียวกัน ดูผลตรวจขอบเขตวัตถุ ข้อความล้น และข้อความทับกันได้ใน [render-qa.json](render-qa.json) การตรวจนี้เป็นการตรวจ Artifact Layout ไม่ใช่การทดสอบการทำงานของระบบ P2
