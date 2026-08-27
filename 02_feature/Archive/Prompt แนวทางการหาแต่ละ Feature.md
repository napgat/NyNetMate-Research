## 1. กำหนดขอบเขตของคุณก่อน

ตาม Scope ปัจจุบัน:

- Authentication — P1-INFRA
- Dashboard — P1-INFRA
- Security & Validation — P1-CORE
- Network Topology — P2 เพราะต้องพึ่ง Device Inventory และ Network Discovery

ดังนั้นคุณสามารถออกแบบ Component และ Schema ของ Topology ล่วงหน้าได้ แต่ไม่ควรเขียนว่าเป็น P1 Implementation เว้นแต่ทีมจะเปลี่ยน Scope อย่างเป็นทางการ

## 2 . เก็บหลักฐานจากวิศวกรจริง

สัมภาษณ์ประมาณ 3–5 คน เช่น Network Engineer, IT Administrator, ผู้ดูแล Lab หรือศิษย์เก่าที่ทำงาน Network โดยใช้คำถามจากเหตุการณ์จริง ไม่ถามนำว่า “อยากได้ Dashboard ไหม”

คำถามที่ควรใช้ เช่น:

- เล่าเหตุการณ์ล่าสุดที่ Network มีปัญหา คุณตรวจอะไรเป็นอันดับแรก?
- ตอนจะเปลี่ยน Config คุณตรวจสอบความถูกต้องอย่างไร?
- เคยเกิด Config ผิดหรือไม่ ผลกระทบและเวลาแก้ไขเท่าไร?
- ปัจจุบันดูว่าอุปกรณ์ใด Online/Offline จากที่ไหน?
- ถ้าต้องตามหา Switch หรือ Uplink หนึ่งเส้น คุณใช้ข้อมูลอะไร?
- ใครบ้างที่ควรดู แก้ Config หรืออนุมัติการข้ามกฎ Security?
- มีข้อมูลอะไรที่ต้องเปิดหลายโปรแกรมหรือจดใน Spreadsheet?
- ขอให้แสดงเอกสารหรือหน้าจอที่ใช้จริงแบบปกปิดข้อมูลสำคัญได้หรือไม่?

ทุกคำตอบควรเก็บเป็นตาราง:

| Evidence ID | ผู้ให้ข้อมูล | งานที่ทำ | ปัญหา | ความถี่ | ข้อมูลที่ใช้ | ผลกระทบ | วิธีปัจจุบัน |
| ----------- | ------------ | -------- | ----- | ------- | ------------ | ------- | ------------ |
|             |              |          |       |         |              |         |              |

ห้ามเก็บ IP, Password หรือ Running Config จริงโดยไม่ Mask

ข้อควรระวังสำคัญ: ใน [Problem Definition & VoC](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/04_project_management/Document Project/split/04_problem-definition-and-voc.md) มีข้อความที่ระบุว่า “จากการสัมภาษณ์เชิงลึก” อยู่แล้ว หากยังไม่มีรายชื่อผู้ให้ข้อมูล บันทึกการสัมภาษณ์ หรือ Transcript จริง 
* ต้องถือข้อความเหล่านั้นเป็นสมมติฐานจาก Research ก่อน ไม่ใช่ผลสัมภาษณ์ที่ยืนยันแล้ว
#### Desk Research หรือ Secondary Research แต่ต้องเปลี่ยนวิธีเขียนข้อสรุปให้ถูกต้อง:

- ห้ามเขียนว่า “จากการสัมภาษณ์วิศวกรเครือข่ายพบว่า…”
- ให้เขียนว่า “จากการทบทวนมาตรฐาน เอกสารผู้ผลิต งานวิจัย และวิเคราะห์ Workflow ของระบบบริหารเครือข่าย พบว่า…”
- Feature ที่ได้จะเป็น Evidence-based requirement ไม่ใช่ความต้องการที่ยืนยันโดยผู้ใช้ขององค์กรเป้าหมายโดยตรง

### Workflow แบบไม่สัมภาษณ์

### 1. ตั้งคำถามวิจัยแยกตาม Feature

อย่าค้นว่า “Dashboard ควรมีอะไรบ้าง” อย่างเดียว แต่ให้ค้นจากงานที่ต้องทำ เช่น:

- Authentication: ใครบ้างควรดู แก้ไข Deploy หรือ Override Security?
- Topology: ต้องเก็บข้อมูลใดจึงจะระบุ Device–Port–Neighbor ได้?
- Security: ต้องตรวจ Config อะไรก่อน Deploy และต้องเก็บหลักฐานอะไร?

### 2. ใช้ลำดับความน่าเชื่อถือของแหล่งข้อมูล

1. มาตรฐานและ Security Benchmark  
    เช่น CIS, NIST, OWASP
    
2. เอกสารผู้ผลิตอุปกรณ์  
    เช่น Cisco IOS/IOS XE, Catalyst Center, LLDP/CDP documentation
    
3. งานวิจัยและหนังสือวิชาการ  
    ใช้สนับสนุนหลักการ Network Automation, Human Error และ Configuration Validation
    
4. ระบบที่มีการใช้งานจริง  
    วิเคราะห์ Feature ของ Cisco Catalyst Center, SolarWinds, NetBox หรือ LibreNMS เพื่อดู Industry pattern แต่ไม่จำเป็นต้องลอกทุก Feature
    
5. บทความ ชุมชน และ Forum  
    ใช้ค้นหา Pain point หรือกรณีศึกษา แต่ไม่ควรใช้เป็นหลักฐานหลักเพียงแหล่งเดียว
    

### 3. ทำ Evidence Extraction Matrix

ทุกครั้งที่พบข้อมูล ให้บันทึกแบบนี้:

| Evidence ID | แหล่งข้อมูล           | Workflow/ปัญหา                      | ข้อมูลที่ต้องใช้                   | Feature ที่รองรับ | ความน่าเชื่อถือ |
| ----------- | --------------------- | ----------------------------------- | ---------------------------------- | ----------------- | --------------- |
| E-AUTH-01   | NIST RBAC             | จำกัดสิทธิ์ตามหน้าที่               | User, Role, Permission             | RBAC              | สูง             |
| E-DASH-01   | Cisco Catalyst Center | ตรวจ Device health และ reachability | Status, site, last update          | Dashboard         | สูง             |
| E-TOPO-01   | Cisco CDP             | หาอุปกรณ์และพอร์ตที่เชื่อมต่อ       | Local port, Device ID, Remote port | Topology          | สูง             |
| E-SEC-01    | CIS Cisco Benchmark   | ตรวจ Secure Configuration           | Rule, evidence, result             | Validation        | สูง             |

วิธีนี้จะทำให้ตอบได้ว่าแต่ละ Column ในฐานข้อมูลมาจาก Requirement ใด ไม่ใช่คิดขึ้นมาเพราะ “น่าจะใช้”

## ตัวอย่างการไล่เหตุผล

### Network Topology

```
Cisco CDP/LLDP แสดง Local Interface + Neighbor Device + Remote Port
→ ระบบต้องเก็บความสัมพันธ์ระหว่าง Interface
→ ต้องมี devices และ interfaces
→ เส้นเชื่อมต้องมี 2 Endpoint
→ จึงต้องมี topology_links
→ ต้องเก็บ source และ last_seen เพื่อรู้ว่าข้อมูลมาจากไหนและเก่าแค่ไหน
```

Cisco ระบุว่า CDP และ LLDP ให้ข้อมูลเกี่ยวกับ Neighbor Device, Local Interface, Port ID และ Hold Time จึงเป็นหลักฐานโดยตรงสำหรับ Schema ของ Topology [Cisco CDP](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/cdp/configuration/xe-2/cdp-xe-2-book/nm-cdp-discover-xe.html), [Cisco LLDP](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/application-services/b-application-services/m_ce-lldp-multivend.html)

### Dashboard

```
ระบบบริหารเครือข่ายแสดง Device Health และ Reachability
→ ผู้ดูแลต้องเห็นสถานะรวมเพื่อคัดแยกปัญหา
→ Dashboard ต้องมี Online/Offline/Unknown และ Critical findings
→ ข้อมูลมาจาก devices, validation_findings และ audit_logs
→ ไม่จำเป็นต้องมีตาราง dashboard
```

Cisco Catalyst Center ใช้ Dashboard สำหรับมุมมองรวมของ Device health, connectivity และ reachability ซึ่งใช้เป็น Industry reference ได้ [Cisco Dashboard](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/catalyst-center-global-manager/1-4-1/deployment-guide/cisco-catalyst-center-global-manager-1-4-1-deployment-guide/g-getting-started/c_situational-dashboard.html)

### Authentication

```
การ Deploy และ Override มีระดับความเสี่ยงต่างจากการดูข้อมูล
→ ผู้ใช้ต้องมีสิทธิ์ต่างกัน
→ ใช้ Admin / Operator / Viewer
→ ต้องมี users, role, sessions และ audit logs
```

NIST RBAC รองรับการผูกสิทธิ์กับหน้าที่ของผู้ปฏิบัติงาน และ NIST Session Management กำหนดแนวคิดเรื่อง Session expiration และการยกเลิก Session เมื่อ Logout [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control), [NIST Sessions](https://pages.nist.gov/800-63-4/sp800-63b/session/)

### Security & Validation

```
CIS มีข้อแนะนำแยกตาม Cisco IOS/IOS XE Version
→ Rule ต้องระบุ Benchmark และ Version
→ การสแกนต้องผูกกับ Config Snapshot
→ หนึ่งรอบสแกนมีหลายผลลัพธ์
→ จึงต้องมี validation_rules, validation_runs และ validation_findings
```

ต้องเลือก Benchmark รุ่นให้ตรงกับอุปกรณ์เป้าหมายก่อน Final รายชื่อกฎ [CIS Cisco Benchmarks](https://www.cisecurity.org/benchmark/cisco)

## 3. เกณฑ์ตัดสินว่า Feature “ต้องมี”

ให้ Feature ผ่านเป็น Must-have เมื่อเข้าเงื่อนไขต่อไปนี้:

- แก้ปัญหาที่พบจากวิศวกรอย่างน้อย 2 คน หรือเป็นปัญหาความปลอดภัยที่ผลกระทบสูง
- ช่วยให้ผู้ใช้ตัดสินใจหรือทำงานบางอย่างได้ชัดเจน
- เป็น Dependency ของ Demo Flow หรือ Safety Gate
- มีผลลัพธ์ที่วัดได้
- ทำได้ภายในเวลาและ Dependency ที่ทีมมี
- มี Acceptance Test ที่ทดสอบได้จริง

มาตรฐานและเอกสารผลิตภัณฑ์ช่วยยืนยันว่า Workflow มีอยู่จริงในอุตสาหกรรม แต่ไม่สามารถทดแทนการสัมภาษณ์ผู้ใช้เป้าหมายของ MyNetMate ได้

## 4 . Working hypothesis สำหรับ Feature ของคุณ

| Feature               | งานจริงที่รองรับ                                      | MVP ที่ควรเหลือ                                                                                                             | ตัววัด                                                  |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Authentication        | ป้องกันคนไม่มีสิทธิ์แก้ Config หรือ Override Security | Login, Logout, Session expiry, Admin/Operator/Viewer, ตรวจสิทธิ์ทุก API, Audit login                                        | การกระทำที่ไม่มีสิทธิ์ถูกปฏิเสธ 100%                    |
| Dashboard             | ตอบว่า “ตอนนี้ต้องสนใจอะไร?”                          | Device Online/Offline/Unknown, Critical CIS failures, Recent activity, System status, เวลาอัปเดตล่าสุด, กดไปดูรายละเอียดได้ | ผู้ใช้ระบุอุปกรณ์ที่มีปัญหาได้ภายในเวลาที่กำหนด         |
| Topology              | ตอบว่า “อุปกรณ์นี้ต่อกับอะไร ผ่านพอร์ตไหน?”           | Layer-2 nodes/links, Site filter, Device/link details, Data freshness; ใช้ Inventory + LLDP/CDP                             | เส้นเชื่อมตรงกับ Lab truth และหาตำแหน่งปัญหาได้เร็วขึ้น |
| Security & Validation | ป้องกัน Config ที่เสี่ยงก่อน Deploy                   | สแกน Cisco Config Snapshot ด้วยกฎ 8 ข้อ, Evidence, Remediation, Critical gate, Admin override พร้อมเหตุผล, Audit            | Critical false negative = 0 ในชุดทดสอบที่กำหนด          |

Cisco Catalyst Center ใช้ Dashboard เพื่อสรุป device health, reachability และ performance และ Topology เพื่อแสดงข้อมูลอุปกรณ์กับเส้นเชื่อม ซึ่งสนับสนุนว่า Dashboard และ Topology เป็น Workflow ที่ใช้จริงในระบบบริหารเครือข่ายระดับอุตสาหกรรม [Cisco Dashboard](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/catalyst-center-global-manager/1-4-1/deployment-guide/cisco-catalyst-center-global-manager-1-4-1-deployment-guide/g-getting-started/c_situational-dashboard.html), [Cisco Topology](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/3-2-x/user-guide/cisco-catalyst-center-user-guide-3-2-x/b_cisco_catalyst_center_ug_3_1_x_chapter_0101.html)

Authentication และ RBAC มีเหตุผลด้านความปลอดภัยมากกว่าการมีหน้า Login สวย ๆ โดย NIST อธิบายการผูกผู้ใช้กับ Role และ Permission ส่วน Session ต้องหมดอายุและยกเลิกได้เมื่อ Logout [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control), [NIST Session Management](https://pages.nist.gov/800-63-4/sp800-63b/session/)

Security Rules ต้องระบุ Benchmark และ Version ที่อ้างอิง เพราะ CIS มี Benchmark แยกตาม Cisco IOS/IOS XE หลายรุ่น [CIS Cisco Benchmarks](https://www.cisecurity.org/benchmark/cisco)

## 5. ออกแบบ Database จาก Use Case ไม่ใช่จากหน้าจอ

สำหรับ MVP นี้ควรใช้ PostgreSQL แบบ Relational เป็นหลัก ไม่ต้องใช้ NoSQL หรือ Graph Database แยกต่างหาก เพราะข้อมูลมีความสัมพันธ์และต้องการ Transaction/Audit ชัดเจน ส่วน JSONB ใช้เฉพาะข้อมูล Evidence หรือ Snapshot ที่โครงสร้างยืดหยุ่น

โครงสร้างเริ่มต้นที่แนะนำ:
### Authentication

- `users`
- `auth_sessions`
- `audit_logs`

ถ้ามี Role คงที่เพียง Admin/Operator/Viewer ใช้ Enum ใน `users` ได้ใน MVP ยังไม่จำเป็นต้องแตก `roles`, `permissions`, `user_roles` หลายตาราง

`auth_sessions` ควรมี token hash, expiry และ `revoked_at` เพื่อ Logout ราย Session ได้จริง แทนการพึ่ง JWT อย่างเดียว

### Dashboard

ไม่ควรมีตารางชื่อ `dashboard` เพราะ Dashboard เป็นผลรวมจากข้อมูลอื่น:

- `devices`
- `device_status_checks` เฉพาะกรณีต้องการประวัติสถานะ
- `validation_runs` และ `validation_findings`
- `audit_logs`

MVP ที่แสดงเฉพาะสถานะล่าสุดสามารถ Query จาก `devices.status` และ `last_seen` ได้ก่อน หากต้องแสดงกราฟย้อนหลังจึงเพิ่มตารางประวัติ

### Network Topology

- `devices`
- `interfaces`
- `topology_links`
- `discovery_runs` หรือ `topology_observations`

ไม่ควรเก็บ `connected_to_device_id` และชื่อพอร์ตปลายทางเป็น String อยู่ใน `interfaces` อย่างเดียว เพราะเส้นเชื่อมมีสองปลาย มีแหล่งที่มา มีเวลาตรวจพบ และเปลี่ยนแปลงได้

ตัวอย่าง `topology_links`:

```
id
local_interface_id
remote_interface_id
source              // lldp, cdp, manual
first_seen_at
last_seen_at
status
discovery_run_id
```
CDP/LLDP ให้ข้อมูล Local Interface, Neighbor Device และ Remote Port โดยตรง จึงรองรับ Data Model แบบ Interface-to-Interface [Cisco CDP](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/cdp/configuration/xe-2/cdp-xe-2-book/nm-cdp-discover-xe.html), [Cisco LLDP](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/application-services/b-application-services/m_ce-lldp-multivend.html)

### Security & Validation

- `validation_rules`
- `validation_runs`
- `validation_findings`
- `risk_acceptances`
- `config_snapshots`
- `audit_logs`

ควรมี `validation_runs` เป็นหัวของการสแกนหนึ่งครั้ง แล้วมีหลาย Findings อยู่ข้างใต้ เพื่อระบุได้ว่าใครสแกน Config เวอร์ชันใด ด้วย Ruleset เวอร์ชันใด

Regex จริงควรอยู่ใน Source Code ไม่ควรเปิดให้แก้ผ่าน Database/UI ส่วนตาราง `validation_rules` เก็บ Metadata เช่น Rule ID, Benchmark version, Severity, Enabled และ Implementation key

## 6. วาด Component Diagram หลังได้ Use Case

Component ของคุณควรประมาณนี้:

- Auth UI → Auth API → Session Service/RBAC Guard → Users/Sessions
- Dashboard UI → Dashboard API → Aggregation Service → Devices/Findings/Audit
- Topology UI → Topology API → Topology Builder → Inventory/Discovery/Links
- Security UI → Validation API → Rule Engine → Cisco Rule Pack
- Rule Engine → Deployment Gate
- Override Service → Risk Acceptances/Audit Logs
- Shared PostgreSQL Database

ให้เขียนชื่อบนลูกศรว่าส่งข้อมูลอะไร เช่น `device status`, `topology nodes/links`, `config snapshot`, `validation result` ไม่ใช้แค่ลูกศร Feature ชี้หากัน

## 7. เอกสารสุดท้ายที่ควรส่งต่อ Feature

แต่ละ Feature ควรมี:

1. Problem และหลักฐานจากผู้ใช้จริง
2. เหตุผลที่ต้องมี Feature
3. MVP / Non-goals
4. User stories และ Acceptance criteria
5. Dependencies
6. Component Diagram
7. ER Diagram และ Data Dictionary
8. Traceability Matrix

ตัว Traceability Matrix คือสิ่งที่จะใช้ตอบอาจารย์ได้ดีที่สุด:

|Evidence|User Need|Requirement|MVP Use Case|Component|Tables|Test|
|---|---|---|---|---|---|---|

ก่อนออกแบบต่อควรแก้ Conflict ใน Research สองจุดด้วย: Proposal เดิมระบุ CIS 24 กฎ แต่ Scope ล่าสุดเหลือ 8 กฎ และรายชื่อกฎ 8 ข้อใน [Data Information.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Data Information.md) ยังไม่ตรงกับ Weight Feature List ทั้งหมด จึงต้องเลือก Benchmark version และทำ Rule Mapping ให้ Final ก่อนวาด Schema ครับ