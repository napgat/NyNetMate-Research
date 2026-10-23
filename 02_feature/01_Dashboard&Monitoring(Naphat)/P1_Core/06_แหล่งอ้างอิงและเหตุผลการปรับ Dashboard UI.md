# แหล่งอ้างอิงและเหตุผลการปรับ Dashboard UI (P1)

> **สถานะ:** Design rationale สำหรับหารือและปรับภาพร่าง UI; ยังไม่ใช่ผลทดสอบกับผู้ใช้หรือข้อยืนยันว่า API ทุกส่วนพร้อมใช้งาน  
> **ตรวจแหล่งอ้างอิงภายนอก:** 2026-09-24  
> **ขอบเขต:** Dashboard สรุปข้อมูล P1; รายละเอียด Monitoring เชิงลึกอยู่ใน [P2 Operational Monitoring](../P2_Operational_Monitoring/MVP%20D%26M.md)

ผังหน้าและ Flow เมื่อกดแต่ละส่วนอยู่ใน [UI Design — Dashboard & Monitoring P1](07_UI%20Design%20Dashboard%20P1.md)

## 1. ไฟล์นี้ใช้อ้างอิงเรื่องใด

แยกแหล่งอ้างอิงสองประเภท เพราะตอบคนละคำถาม:

1. **ตัวอย่างและหลักการออกแบบจากภายนอก** ช่วยอธิบายว่าควรเรียงข้อมูลและแสดงสถานะบน Dashboard อย่างไร ไม่ได้กำหนดว่าระบบ MyNetMate มีข้อมูลหรือความสามารถนั้นแล้ว
2. **เอกสารและข้อมูลของ MyNetMate** กำหนดว่าฟีเจอร์ใดอยู่ใน P1, ใครเป็นเจ้าของข้อมูล และ Dashboard มีสิทธิ์แสดงอะไร ข้อมูลจริงต้องตรวจจาก Contract และโค้ดของฟีเจอร์เจ้าของอีกครั้งก่อน Implement

## 2. แหล่งอ้างอิงภายนอกที่ใช้กับการออกแบบ

| แหล่งอ้างอิง | สิ่งที่แหล่งข้อมูลรองรับ | ข้อสรุปที่นำมาใช้กับ MyNetMate P1 | ข้อจำกัดในการนำมาใช้ |
| --- | --- | --- | --- |
| [Grafana — Dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/) | Dashboard ควรตอบคำถามที่ชัดเจน เรียงข้อมูลจากภาพรวมไปสู่รายละเอียด และลดภาระการตีความ | จัดหน้าให้ผู้ใช้เห็นสิ่งที่ต้องตรวจเป็นลำดับแรก แล้วจึงอ่านจำนวนรวมและข้อมูลประกอบ | เป็นหลักการออกแบบ ไม่ได้พิสูจน์ว่าลำดับนี้เหมาะกับผู้ใช้ MyNetMate ทุกคน |
| [Zabbix — Host availability widget](https://www.zabbix.com/documentation/8.0/en/manual/web_interface/frontend_sections/dashboards/widgets/host_availability) | แสดงจำนวนอุปกรณ์ตามความพร้อมใช้งาน โดยมี `Unknown` และมีตัวเลือกเกี่ยวกับอุปกรณ์ระหว่าง Maintenance | แสดงสถานะที่ยังสรุปไม่ได้อย่างชัดเจน และกำหนดวิธีนับ Maintenance ก่อนทำตัวเลขรวม | นิยาม Available ของ Zabbix เป็นของ Zabbix; ห้ามคัดลอกมาเป็นนิยามสถานะของ MyNetMate |
| [Zabbix — Problems widget](https://www.zabbix.com/documentation/7.0/en/manual/web_interface/frontend_sections/dashboards/widgets/problems) | แสดงปัญหาปัจจุบันและเปิดดูรายละเอียดของปัญหาต่อได้ | จำนวนปัญหาที่ต้องดูควรเชื่อมไปยังหน้าของฟีเจอร์เจ้าของข้อมูล | Dashboard P1 ยังไม่สร้างระบบ Problem/Alert หรือประวัติการแจ้งเตือนเอง |
| [PRTG — Dashboards and maps](https://www.paessler.com/prtg/features/dashboards) | ใช้ภาพรวมสถานะและสีช่วยให้สังเกตปัญหาได้รวดเร็ว | ใช้สีประกอบข้อความและจำนวนเพื่อชี้จุดที่ต้องตรวจ โดยยังอ่านได้แม้ไม่เห็นสี | PRTG มี Live Monitoring, Map และ Widget มากกว่า Scope P1; ไม่คัดลอกความสามารถเหล่านั้น |
| [Grafana — No Data and Error states](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/) | แยกกรณีไม่มีข้อมูลออกจากกรณีประเมินข้อมูลผิดพลาด | ออกแบบข้อความ “ยังไม่มีผลตรวจ” และ “ดึงข้อมูลไม่ได้” ให้ต่างจากผลตรวจที่ได้ศูนย์ปัญหา | เอกสารนี้กล่าวถึง Alerting ของ Grafana; MyNetMate นำมาใช้เป็นเหตุผลการสื่อสารสถานะ UI เท่านั้น ไม่เพิ่ม Alert Engine |

ตัวอย่างเหล่านี้สนับสนุน **หลักการจัดลำดับและการสื่อสารข้อมูล** ไม่ใช่หลักฐานว่าต้องมีแผนผังเครือข่าย กราฟย้อนหลัง หรือการแจ้งเตือนใน P1

## 3. แหล่งข้อมูลจริงของ Dashboard P1 ใน MyNetMate

ขอบเขตที่ยึดก่อนคือ [MyNetMate Weight Feature List](../../MyNetMate%20Weight%20Feature%20List%20%28AI%20คิด%29.md) หมวด Dashboard & Monitoring: Metrics Cards, Recent Activity Feed, Quick Actions และ System API Status ส่วน [MyNetMate Dashboard](MyNetMate%20Dashboard.md), [API Contracts](04_API%20Contracts.md) และ [Acceptance Tests](05_Acceptance%20Tests%20และ%20Success%20Metrics.md) เป็นเอกสารออกแบบ D&M ที่ต้องปรับให้สอดคล้องกันเมื่อ Contract ของทีมยืนยันแล้ว

| สิ่งที่แสดงบนหน้า | แหล่งข้อมูล/เจ้าของที่ควรอ้างอิง | สถานะของข้อตกลง |
| --- | --- | --- |
| จำนวนอุปกรณ์และสถานะล่าสุด | Device Inventory; ใช้ [Device/API Contract ที่เทียบโค้ด 2026-10-22](04_API%20Contracts.md) พร้อม Source code ที่ลิงก์ไว้ | ตรวจ Field/Enum/เวลาแล้ว; ผู้ใช้ยืนยันเกณฑ์อายุ 900 วินาทีและแบบ URL ตัวกรองแล้ว ส่วน Aggregation/การรับ URL หน้าเว็บยังต้องพัฒนาและทดสอบ |
| จำนวน Config ที่บันทึก | ฟีเจอร์ Configuration Management/Version Control ตาม Owner ที่ทีมกำหนด | **รอยืนยัน** ว่านับ Config ชนิดใดและจากข้อมูลชุดใด; ห้ามแสดงตัวเลขที่ไม่มีนิยาม |
| จำนวนผลตรวจ Critical | Security & Validation; ดู [MVP ของ Security](../../09_Security%20%26%20Validation%28King%29/01_MVP%20Feature.md) | **รอยืนยัน** ว่านับ Finding หรืออุปกรณ์ ใช้ผลตรวจล่าสุดอย่างไร และจัดการ Override อย่างไร |
| กิจกรรมล่าสุด | Audit Trail; ดู [Integration Contract Matrix](../../11_Audit%20Trail%28Naphat%29/06_Integration%20Contract%20Matrix.md) และ Auth Permission Catalog | มีข้อตกลงเรื่อง Positive Allowlist, สิทธิ์ และ Redaction แล้ว; Dashboard อ่านอย่างเดียว |
| Backend/Database/Offline Mode | Health Checker และเจ้าของ Settings/System | แหล่งจริงของ `offline_mode` และรูปแบบ Health Response **ยังรอยืนยัน** |
| ทางลัด | เส้นทางหน้าเว็บและสิทธิ์จาก Authentication/RBAC | ไม่ต้องมีตาราง Dashboard; แสดงเฉพาะทางลัดที่ผู้ใช้มีสิทธิ์ใช้ |

Dashboard ทำหน้าที่ **อ่านและสรุปข้อมูลจากเจ้าของข้อมูล**; ไม่สร้าง Device Status, CIS Finding หรือ Audit Event ซ้ำ

## 4. ทำไมต้องปรับภาพร่าง UI เดิม

| จุดที่ปรับ | เหตุผล | หลักฐาน/ขอบเขตที่เกี่ยวข้อง |
| --- | --- | --- |
| ย้าย “สิ่งที่ต้องตรวจสอบ” ขึ้นไว้เหนือการ์ดตัวเลขทั่วไป | ภาพร่างเดิมให้น้ำหนักอุปกรณ์, Security, System Health และทางลัดใกล้กัน ผู้ใช้ต้องกวาดดูเองว่ามีอะไรเร่งด่วน | Grafana best practices; Zabbix Problems; PRTG status overview |
| ให้จำนวนรวมของอุปกรณ์อยู่คู่กับสถานะและเวลาที่ตรวจล่าสุด | ตัวเลขโดยไม่มีเวลาอาจถูกอ่านว่าเป็นสถานะปัจจุบันทันที ทั้งที่ข้อมูลมาจากผลตรวจครั้งก่อน | เอกสาร D&M P1; แนวคิดเรื่องความใหม่ของข้อมูลใน Glossary |
| แสดง “ยังไม่ทราบ/ยังไม่มีข้อมูล/ดึงข้อมูลไม่ได้” ต่างจาก “ตรวจแล้วไม่พบปัญหา” | ค่า `0` ไม่ได้แปลว่าผ่านการตรวจเสมอไป และ Unknown ไม่ควรถูกนับเป็นอุปกรณ์เสีย | Zabbix Host availability; Grafana No Data and Error states |
| เพิ่มจำนวน Config กลับเข้าสู่ภาพร่าง | ภาพร่างแรกตกหล่น Metric ที่ Scope P1 ระบุไว้ | MyNetMate Weight Feature List หมวด 4.6; นิยามการนับยังรอ Owner |
| ลดพื้นที่ของทางลัดและสถานะระบบ | ทั้งสองส่วนยังอยู่ใน P1 แต่ไม่ได้ตอบคำถามหลักว่า “ตอนนี้ควรตรวจอะไร” จึงใช้พื้นที่รองลงมา | MyNetMate Weight Feature List; Grafana best practices |
| ใช้สีพร้อมชื่อสถานะและจำนวน | สีช่วยสแกนภาพรวม แต่ข้อความต้องยังบอกความหมายได้ด้วยตัวเอง | PRTG status overview; ข้อสรุปด้านการเข้าถึงเป็นการตัดสินใจออกแบบของทีม |

ข้อความและตัวเลขในภาพร่างเป็น **ข้อมูลตัวอย่างสำหรับจัดวาง** ไม่ใช่ผลจากระบบจริง และแถบ “สิ่งที่ต้องตรวจสอบ” เป็นการสรุป/ลิงก์ไปข้อมูล P1 ที่มีเจ้าของอยู่แล้ว ไม่ได้หมายถึงการสร้าง Alerting Feature ใหม่

## 5. สิ่งที่ยังต้องยืนยันก่อนล็อก UI และ API

1. Device Inventory: Field/Enum/เวลาตรวจเทียบโค้ดแล้ว และเกณฑ์ 15 นาทีพร้อมแบบ URL ยืนยันโดยผู้ใช้แล้ว; งานต่อคือพัฒนาและทดสอบการเชื่อมตาม Contract ไม่ต้องถามค่าเกณฑ์ซ้ำ
2. Configuration: “จำนวน Config” หมายถึงจำนวนเอกสาร, เวอร์ชัน, งานที่สร้าง หรืออย่างอื่น
3. Security: จำนวน Critical มาจากผลตรวจล่าสุดชุดใด และ Override มีผลต่อจำนวนที่แสดงหรือไม่
4. Settings/System: แหล่งจริงของ Offline Mode และเกณฑ์แสดง Backend/Database ว่าพร้อมใช้งาน
5. UI: ทดสอบภาพร่างกับผู้ใช้หรืออาจารย์ว่ามองเห็น “สิ่งที่ต้องตรวจ” และเข้าใจเวลา/กรณีไม่มีข้อมูลได้จริง

อัปเดต [API Contracts](04_API%20Contracts.md) และ [Acceptance Tests](05_Acceptance%20Tests%20และ%20Success%20Metrics.md) ส่วน Device แล้วเมื่อ 2026-10-22; ใช้ `reachability` และ `management_state` แทนคีย์ `online/offline` เก่า ส่วนตัวกรอง Site/Group ยังไม่อยู่ใน D&M P1 รอบแรก แม้ Inventory มี Field/API รองรับ

**ที่มาของค่า 15 นาที:** เป็นมติการออกแบบของผู้ใช้เมื่อ 2026-10-22 สำหรับ MyNetMate P1 ไม่ใช่ค่าที่อ้างว่าบังคับตาม Zabbix/Grafana หรือมาตรฐานเครือข่าย และไม่ทำให้เกิดการตั้งรอบตรวจอุปกรณ์อัตโนมัติ
