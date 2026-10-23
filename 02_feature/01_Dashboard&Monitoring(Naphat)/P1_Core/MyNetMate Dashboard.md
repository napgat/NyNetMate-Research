## 1. ตั้งคำถามวิจัย
> **ปรับ Device Contract 2026-10-22:** สถานะอุปกรณ์และเวลายึดโค้ด Inventory ที่ตรวจแล้วตาม [API Contracts](04_API%20Contracts.md) ส่วน Metric ของ D&M เป็นแบบที่จะพัฒนา ยังไม่ใช่ผลทดสอบ Full-stack
>
> **มติผู้ใช้เพิ่มเติม:** เกณฑ์อายุข้อมูล P1 คือ 15 นาที (900 วินาที); URL จาก Dashboard ไปหน้ารายการยึด Contract หัวข้อ 3 และ [Wireframe ฉบับล่าสุด](07_UI%20Design%20Dashboard%20P1.md#21-wireframe-ฉบับขยายส่วนอุปกรณ์และตัวกรอง)

Dashboard: วิศวกรต้องใช้ข้อมูลอะไรเพื่อระบุปัญหาเบื้องต้น?
แนะนำให้ใช้ Prompt แบบ “พิสูจน์ความจำเป็น” ไม่ใช่ถามว่า Dashboard ควรมีอะไร เพราะ AI มักรวบรวม Feature เยอะเกิน MVP โดยไม่วิเคราะห์ว่าวิศวกรใช้ตัดสินใจอะไรจริง

https://share.gemini.google/t93BC0QmepHL

# 1.สรุป

Dashboard มีหน้าที่ตอบคำถามเชิงปฏิบัติการอย่างรวดเร็วว่า:

1. มีอุปกรณ์ใดขาดการเชื่อมต่อหรือไม่?
2. มีผลตรวจสอบความปลอดภัยระดับวิกฤตที่ต้องจัดการหรือไม่?
3. ใครเพิ่งดำเนินการอะไรในระบบ?
4. Backend, Database และบริการที่เกี่ยวข้องพร้อมใช้งานหรือไม่?
5. ข้อมูลที่กำลังแสดงได้รับการตรวจสอบครั้งล่าสุดเมื่อใด?

# 2.หลักการและหลักฐานที่ใช้

ทฤษฎี Situation Awareness ของ Mica Endsley แบ่งการรับรู้เป็น 3 ระดับ  [7][8]::
1. **Perception:** รับรู้ข้อมูลดิบ
2. **Comprehension:** เข้าใจความหมายและผลกระทบ
3. **Projection:** คาดการณ์สิ่งที่จะเกิดขึ้น

Dashboard P1 มุ่งสนับสนุนระดับ 1–2 โดยแปลงข้อมูลดิบเป็นสรุปที่ช่วยตัดสินใจ เช่น 
	จำนวนอุปกรณ์ Active ที่ผลตรวจล่าสุดเป็น Unreachable และ
	จำนวน Critical Validation Failures 

## การเทียบเคียงระบบอุตสาหกรรม
ระบบอย่าง [[../Archive_Research/Cisco Catalyst Center]] ใช้ Health Score, Streaming Telemetry, Latency, Packet Loss และข้อมูลเชิงลึกของแอปพลิเคชัน [9][11][12] ความสามารถเหล่านี้มีประโยชน์ในระดับองค์กร แต่เกินความจำเป็นสำหรับ P1 ของ MyNetMate

P1 จึงอ่านผล Reachability ที่ Device Inventory บันทึกไว้แล้ว (ปัจจุบันมาจาก SNMP Health หรือ Snapshot ของ Inventory) ร่วมกับข้อมูลจาก Security Validation และ Audit Trail โดย D&M ไม่สร้าง Periodic ICMP Check หรือสั่งตรวจอุปกรณ์เอง
	โดยต้องแสดงเวลาตรวจสอบล่าสุดอย่างชัดเจน และไม่เรียกข้อมูลดังกล่าวว่า Real-time

### Evidence Matrix

| Evidence ID | แหล่งข้อมูล                                                         | ประเภทหลักฐาน                     | ข้อสรุปสำหรับ MyNetMate P1                                                                         |
| ----------- | ------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **EV-01**   | Cisco Catalyst Center — Critical Issues และ Network Health [11][12] | Direct evidence                   | ระบบระดับองค์กรจัดลำดับปัญหารุนแรงก่อนข้อมูลทั่วไป จึงประยุกต์เป็น Critical Validation Failures    |
| **EV-02**   | โค้ด Device Inventory: Health service และ Snapshot persistence; ดูหลักฐานใน API Contracts | Implementation evidence สำหรับแหล่งข้อมูล | อ่าน Reachability ที่ Owner บันทึกจาก SNMP; แนวคิด ICMP เดิมไม่ใช่พฤติกรรมปัจจุบันของระบบ |
| **EV-03**   | Zabbix Dashboard widgets [13][14]                                   | Recommendation                    | UI ต้องแสดง Data freshness และเวลาตรวจสอบล่าสุด เพื่อป้องกันการตีความ Stale Data ว่าเป็น Real-time |
| **EV-04**   | MyNetMate Problem Definition [4]                                    | Internal project hypothesis       | ปัญหาด้านการตรวจสอบย้อนหลังสนับสนุน Recent Activity Feed แต่ยังไม่ใช่หลักฐานสัมภาษณ์ที่ยืนยันแล้ว  |
| **EV-05**   | MyNetMate Weight Feature List [1]                                   | Working scope evidence            | D&M P1 เป็น Aggregated Summary; ไม่พัฒนา Discovery, Topology หรือ SNMP Polling เอง การอ่านผล SNMP จาก Inventory ไม่ได้ขยาย D&M ไปเป็น Monitoring เชิงลึก |
| **EV-06**   | Offline Mode และ System API Status ใน Scope ปัจจุบัน [1]            | Internal architecture requirement | สถานะ AI แบบ Offline Mode ต้องแสดงเป็นข้อมูล ไม่ใช่ข้อผิดพลาด                                      |

## Jobs to Be Done
| Job                                   | Trigger                             | ข้อมูลที่ต้องรู้                                           | การตัดสินใจ/การกระทำ                           | ผลลัพธ์ที่คาดหวัง                            |
| ------------------------------------- | ----------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| **JTBD-01: ตรวจ Availability**        | เปิด Dashboard หรือพบอุปกรณ์ผิดปกติ | Reachable/Unreachable/Unknown ของ Active; จำนวน Active/Unmanaged/Maintenance แยกแกน และเวลาตรวจ | เปิดรายการ Active ที่เป็น Unreachable เมื่อเชื่อมตัวกรองแล้ว | เข้าสู่การ Troubleshoot ได้โดยไม่ค้นหลายหน้า |
| **JTBD-02: ตรวจ Security Compliance** | สแกน Config เสร็จหรือมี Config ใหม่ | จำนวน Critical Failures และอุปกรณ์ต้นเหตุ                  | Remediate หรือดำเนินการ Override ตามสิทธิ์     | เข้าถึงปัญหารุนแรงที่สุดก่อน                 |
| **JTBD-03: ตรวจ Activity**            | พบความผิดปกติหรือต้อง Audit         | ผู้กระทำ การกระทำ เป้าหมาย และเวลา                         | เปิดรายละเอียดกิจกรรมที่เกี่ยวข้อง             | เข้าใจบริบทการเปลี่ยนแปลงล่าสุด              |
| **JTBD-04: ตรวจ System Health**       | ก่อนใช้ Workflow สำคัญ              | Backend, Database และ AI mode/status                       | ใช้งานต่อ เปลี่ยน Offline Mode หรือแจ้งผู้ดูแล | ไม่ตีความความไม่พร้อมของระบบผิด              |


## 4. การจัดลำดับ Feature

### 4.1 Must-have

- จำนวนอุปกรณ์ที่ไม่ใช่ Retired แยก Active/Unmanaged/Maintenance; แสดง Reachable/Unreachable/Unknown เฉพาะ Active
- Critical Validation Failures
- Recent Activity Feed
- Backend/Database/System API Status
- อายุผลตรวจอุปกรณ์จาก `reachability_checked_at`; แยก `last_seen_at` (ติดต่อสำเร็จล่าสุด) และ `generated_at` (เวลาสร้าง Summary)
- Quick Actions ไปยัง Device Inventory, Config Builder และ Security Validation

### 4.2 Should-have

- Device Status by Site เป็นแนวคิดเสริม; ยังไม่รับเป็นตัวกรอง D&M P1 รอบแรก แม้ Inventory มี Field/API รองรับ

### 4.3 Could-have

- Export Report เฉพาะกรณี P1 หลักเสร็จสมบูรณ์แล้ว

### 4.4 Won't-have ใน P1

- Historical Availability Graph
- Interface/Bandwidth Utilization
- Topology Preview
- SNMP, LLDP และ CDP Monitoring
- Time-series analytics
- Alert Pop-up และ Email notification
## 5. ข้อกำหนด Dashboard P1

### 5.1 Widget Specification

| Widget                           | จุดประสงค์                                             | Source of Truth                                   | Refresh                                    | สิทธิ์                              | Empty/Error/Stale State                                                                        |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Device Availability**          | แสดงจำนวนตาม Management State และ Reachability ของ Active | `devices.management_state`, `devices.reachability`, `devices.reachability_checked_at`, `devices.last_seen_at` | อ่าน Summary เมื่อเปิดหน้า/กดลองใหม่; ไม่สั่งตรวจอุปกรณ์ | Viewer ขึ้นไป | แยกไม่มีอุปกรณ์/ยังไม่เคยตรวจ/อ่านไม่ได้; แสดงอายุผลตรวจ และ Stale เมื่อกำหนด Threshold แล้ว |
| **Critical Validation Failures** | แสดงผลสแกน Critical ที่ยังไม่ได้รับการยอมรับความเสี่ยง | `scan_results` และ `cis_overrides`                | หลัง Scan เสร็จหรือ Refresh Summary        | Viewer ดูได้; การ Override ตาม RBAC | หากไม่มี Failure ให้ระบุว่า “ไม่พบ Critical Failure ในผลสแกนล่าสุด” ไม่ใช้คำว่า “ปลอดภัย 100%” |
| **Recent Activity Feed**         | แสดง 10 กิจกรรมล่าสุด                                  | `audit_logs`                                      | Manual หรือ Periodic Refresh               | ตามนโยบาย RBAC                      | แสดง Empty state เมื่อยังไม่มีกิจกรรม                                                          |
| **System Health**                | แสดงสถานะ Backend, Database และ AI mode                | Health Checker และ `system_settings.offline_mode` | On load และ Periodic Refresh               | Viewer ขึ้นไป                       | Offline Mode แสดงสีเทา/Informational ไม่ใช่ Critical                                           |
| **Quick Actions**                | ลดจำนวนขั้นตอนเข้าสู่ Workflow หลัก                    | Static route configuration                        | ไม่ต้อง Refresh                            | แสดงตาม RBAC                        | ซ่อนหรือ Disable Action ที่ผู้ใช้ไม่มีสิทธิ์                                                   |
## นิยามสถานะ

| สถานะ                 | ความหมาย                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Reachable**         | Inventory บันทึกว่าติดต่อผ่านวิธีตรวจที่รองรับได้; ปัจจุบัน SNMP Health หรือ Snapshot ที่เก็บสำเร็จ ไม่รับรองว่าบริการทั้งหมดปกติ |
| **Unreachable**       | Inventory บันทึกผลว่าติดต่อไม่ได้ตามวิธีตรวจนั้น; D&M ไม่ตีความต่อว่าเครื่องดับหรือ SSH ใช้ไม่ได้ |
| **Unknown**           | ยังไม่มีผลสรุป; ไม่มีเวลาตรวจ = ยังไม่เคยตรวจ, มีเวลาตรวจ = ตรวจแล้วแต่ประเมินไม่ได้ เช่น Health service เกิด Exception |
| **Active**            | สถานะการจัดการ `active`; เป็นขอบเขตสำหรับจำนวน Reachability บน D&M |
| **Unmanaged**         | สถานะการจัดการ `unmanaged`; อาจเป็นอุปกรณ์จากหลักฐานเพื่อนบ้านที่ยังจัดการโดยตรงไม่ได้ ไม่ใช่ Unreachable |
| **Maintenance**       | สถานะการจัดการ `maintenance`; ไม่บวกเข้า Unreachable ของ Active และไม่รับรองว่าข้อมูล Reachability เก่าถูกล้าง |
| **Retired**           | สถานะการจัดการ `retired`; ไม่รวมใน Summary เริ่มต้น สอดคล้องกับรายการเริ่มต้นของ Inventory |
| **Stale**             | ผลตรวจของ Active มีอายุเกิน 15 นาที (900 วินาที) ณ `generated_at` โดยอ้าง `reachability_checked_at`; อายุเท่ากับ 900 ยังใหม่ ส่วนเวลา `null` เป็นยังไม่เคยตรวจ |
| **Healthy**           | Component ภายในตอบสนองตามเกณฑ์                                                                             |
| **Degraded**          | Component ยังทำงานได้ แต่บาง Dependency มีปัญหา                                                            |
| **Unavailable/Error** | Component ไม่พร้อมให้บริการ                                                                                |
| **Offline Mode**      | AI ถูกปิดโดยตั้งใจ ไม่ถือเป็น System Error                                                                 |

สูตรนับและตัวอย่าง Response ฉบับใช้ออกแบบอยู่ใน [API Contracts](04_API%20Contracts.md): `total = active + unmanaged + maintenance` และ `active = reachable + unreachable + unknown` ห้ามบวกทุกป้ายจากสองแกนรวมกัน


# สรุป

Dashboard P1 ของ MyNetMate ควรเป็น **Aggregated Operational Summary** ไม่ใช่ Enterprise Monitoring Dashboard โดยต้อง:

- แสดงสถานะอุปกรณ์ล่าสุดอย่างชัดเจน
- ชี้ Critical Validation Failures
- แสดง Recent Activity
- บอก System Health และ Offline Mode
- นำผู้ใช้เข้าสู่ Workflow ที่เกี่ยวข้องได้รวดเร็ว
- แสดง Data freshness ทุกครั้ง
- Query จาก PostgreSQL ต้นทางโดยไม่สร้างตาราง Dashboard

