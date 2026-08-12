Topology Research & Decision Pack

> [!IMPORTANT]
> **มติผู้ใช้ล่าสุด ณ 2026-08-11 มีผลเหนือข้อเสนอ `Manual-first` เดิมในเอกสารนี้:** คำว่า Manual Input ของ Device Inventory หมายถึง **Manual Device Enrollment** คือผู้ใช้ระบุอุปกรณ์เป้าหมายและข้อมูลรับรองสำหรับอุปกรณ์ จากนั้นระบบต้องเชื่อมต่อแบบอ่านอย่างเดียวเพื่อเก็บข้อมูลจากอุปกรณ์ที่มีอยู่จริง ไม่ใช่การสร้าง Device หรือ Link สมมติบน Canvas ส่วน Network Discovery เป็นอีกวิธีหนึ่งในการหาอุปกรณ์เป้าหมาย แต่ก่อนนำมาเป็นข้อมูลใช้งานใน Inventory/Topology ระบบต้องเชื่อมต่อและเก็บข้อมูลจากอุปกรณ์นั้นสำเร็จเช่นกัน รายละเอียดและ MVP ฉบับแก้ไขอยู่ใน [หัวข้อ 13](#13-มติล่าสุด-manual-device-enrollment-observed-topology-และการแก้ไข-link)
>
> ข้อเสนอ `Hybrid Manual-first`, `Manual Link` และ API/Acceptance Test เดิมด้านล่างให้เก็บไว้เป็นประวัติการวิเคราะห์ แต่ **ห้ามนำไปออกแบบต่อโดยไม่อ่านหัวข้อ 13**

ประเด็นที่ต้องตัดสินใจมากที่สุดคือ Topology จะเป็น
* Manual-first,
* Discovery-first หรือ
* Hybrid
เพราะส่งผลโดยตรงต่อฐานข้อมูลและ Component Diagram

## ข้อเสนอเริ่มต้น

ผมแนะนำแนวทาง Hybrid แบบ Manual-first:

- แสดงอุปกรณ์จาก Device Inventory เป็น Node
- ผู้ใช้สร้าง Link และระบุ Port ทั้งสองฝั่งด้วยตนเองได้
- ระบบบันทึกตำแหน่ง Node จากการ Drag & Drop
- เมื่อ Network Discovery พร้อม จึงนำ LLDP/CDP Neighbor มาเสนอเป็น Link
- ผู้ใช้ต้องยืนยัน Link ที่ค้นพบก่อนบันทึกเป็นข้อมูลใช้งาน
- เป็น Physical/L2 Topology แบบ Snapshot ไม่ใช่ Real-time Topology
- Cisco เป็น Baseline ส่วน Huawei Router และ MikroTik Switch ทดสอบตามอุปกรณ์จริง

แนวทางนี้ตรงกับคำแนะนำอาจารย์เรื่อง Interactive Topology และ Manual Port Connection ใน [คำแนะนำครั้งที่ 2 (line 9)](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/04_project_management/Advisor Teacher/คำแนะนำของอาจารย์ ณ ครั้งที่ 2 ปี 3 เทอม 1.md:9) ขณะเดียวกันยังต่อยอด Auto-Layout และ Discovery ตาม [MyNetMate Weight Feature List.md (line 310)](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/MyNetMate Weight Feature List.md:310) ได้

## ข้อมูลที่ต้องเตรียม

### 1. User Decision

ต้องเขียนให้ชัดว่า Topology ช่วยผู้ใช้ตอบอะไร:

1. อุปกรณ์ใดเชื่อมต่อกับอุปกรณ์ใด
2. เชื่อมต่อกันผ่าน Interface ใดทั้งสองฝั่ง
3. อุปกรณ์หรือ Link ใดมีปัญหา
4. ข้อมูลมาจากคนกรอกหรือระบบค้นพบ
5. ข้อมูลถูกตรวจสอบล่าสุดเมื่อใด
6. ผู้ใช้ควรไปหน้า Device Detail หรือ Config Builder ของอุปกรณ์ใดต่อ
### 2. ข้อมูลอุปกรณ์จริงใน Lab
สร้าง Device Test Sheet สำหรับอุปกรณ์ทั้ง 3 ตัว:

| ข้อมูล         | ต้องเตรียม                           |
| -------------- | ------------------------------------ |
| Vendor         | Cisco, MikroTik, Huawei              |
| Device type    | Switch หรือ Router                   |
| Model          | รุ่นจริงจากป้ายอุปกรณ์               |
| OS และ Version | รุ่นระบบปฏิบัติการจริง               |
| Management IP  | IP ที่ใช้เชื่อมต่อใน Isolated Lab    |
| Interfaces     | รายชื่อ Port ที่มีอยู่จริง           |
| LLDP/CDP       | รองรับหรือไม่ และเปิดใช้งานหรือไม่   |
| SNMP           | Version และ Read-only support        |
| SSH            | รองรับหรือไม่ และใช้ Port ใด         |
| Device role    | Core, Access, Router หรือ Management |

ห้ามออกแบบ Parser หรือชุดคำสั่งของ Huawei/MikroTik ก่อนทราบรุ่นและ OS จริง
### 3. Ground-truth Physical Topology

ต้องวาดผังจริงของ Lab ด้วยมือก่อน เช่น:

| ต้นทาง        | Interface ต้นทาง | ปลายทาง         | Interface ปลายทาง | วิธีตรวจสอบ      |
| ------------- | ---------------- | --------------- | ----------------- | ---------------- |
| Huawei Router | รอระบุ           | Cisco Switch    | รอระบุ            | ตรวจสายจริง/LLDP |
| Huawei Router | รอระบุ           | MikroTik Switch | รอระบุ            | ตรวจสายจริง/LLDP |
| Cisco Switch  | รอระบุ           | MikroTik Switch | รอระบุ            | ตรวจสายจริง/LLDP |

ตารางนี้จะเป็น Expected Result สำหรับ Acceptance Test ของ Discovery

### 4. ข้อมูล Node

อย่างน้อยต้องมี:

- `device_id`
- `hostname`
- `device_type`
- `vendor`
- `model`
- `role`
- `site` หรือ `device_group`
- `status`
- `last_checked_at`

Source of Truth คือ `devices` จาก Device Inventory

### 5. ข้อมูล Interface

อย่างน้อยต้องมี:

- `interface_id`
- `device_id`
- `name`
- `description`
- `admin_status`
- `oper_status`
- `mode`
- `vlan_id`
- `ip_address`
- `last_collected_at`

Source of Truth คือ `interfaces`

ร่างเดิมมีข้อมูล Interface อยู่แล้วใน [Data Information.md (line 547)](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Data Information.md:547) แต่ต้องตรวจใหม่ก่อนนำมาใช้

### 6. ข้อมูล Link หรือ Edge

ต้องกำหนดก่อนออกแบบ Schema:

- อุปกรณ์ต้นทาง
- Interface ต้นทาง
- อุปกรณ์ปลายทาง
- Interface ปลายทาง
- วิธีได้ข้อมูล: `manual`, `lldp` หรือ `cdp`
- ผู้ยืนยันข้อมูล
- เวลาที่ค้นพบล่าสุด
- สถานะ Link
- ข้อมูลได้รับการยืนยันหรือยัง
- Link หายไปจากการ Discovery ครั้งล่าสุดหรือไม่

ผมแนะนำให้แยกตาราง `topology_links` ออกจาก `interfaces` เนื่องจากการใช้ `connected_to_device_id` ใน `interfaces` เพียงอย่างเดียวจะจัดการ Parallel Links, แหล่งที่มาของข้อมูล, การยืนยัน และข้อมูลที่หมดอายุได้ยาก

### 7. ข้อมูลตำแหน่งบน Canvas

ตำแหน่งการแสดงผลไม่ควรเก็บใน `devices` โดยตรง เพราะอุปกรณ์เดียวกันอาจปรากฏในหลาย View:

- `topology_id`
- `device_id`
- `position_x`
- `position_y`
- `is_pinned`
- `is_hidden`
- `updated_by`
- `updated_at`

### 8. กฎการรวม Manual กับ Discovery

ต้องตัดสินใจก่อนออกแบบ:

- Discovery มีสิทธิ์เขียนทับ Manual Link หรือไม่
- Link ที่ค้นพบต้องให้ผู้ใช้ยืนยันก่อนหรือไม่
- หาก LLDP/CDP ไม่พบ Link เดิม จะลบทันทีหรือเปลี่ยนเป็น Stale
- หากสองอุปกรณ์รายงานชื่อ Interface ไม่ตรงกัน จะจัดการอย่างไร
- หากมีสายหลายเส้นระหว่างอุปกรณ์คู่เดียวกัน จะเก็บอย่างไร
- หากเป็น Port-channel/LAG จะวาดเป็นเส้นเดียวหรือหลายเส้น

ข้อเสนอคือ Discovery ห้ามลบหรือเขียนทับ Manual Link อัตโนมัติ แต่ให้สร้าง Neighbor Observation เพื่อรอผู้ใช้ยืนยัน

## ขอบเขต MVP ที่ควรนำไปประเมิน

- **Must:** แสดง Node จาก Inventory, Drag & Drop, Zoom/Pan, Manual Link, Port Label, บันทึกตำแหน่ง, เปิด Device Detail
- **Should:** Auto-layout, แสดงสถานะอุปกรณ์, นำ Link จาก LLDP/CDP มาให้ยืนยัน, แสดงเวลาตรวจสอบล่าสุด
- **Could:** Filter ตาม Site/Vendor/Status, Context Menu, ซ่อน Node
- **Won’t:** Real-time Topology, PNG Export, Logical OSPF Topology, Cross-device Impact Analysis และ Network Simulation Engine

## ลำดับทำเอกสาร

1. เติม [MyNetMate NTV.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization/MyNetMate NTV.md) ด้วย Evidence, User Decision, Scope และ Open Questions
2. สรุป [MVP - Feature_NTV.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization/MVP - Feature_NTV.md)
3. ออกแบบ [Database Schema.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization/Database Schema.md)
4. ทำ [Component Diagram.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/03_Network Topology Visualization/Component Diagram.md)

---

# ส่วนเพิ่มเติม: Evidence & Decision Traceability

> **สถานะเอกสาร:** Research and Decision Draft — ยังไม่ใช่ MVP Feature Specification หรือ Database Schema ฉบับยืนยัน
> **หลักการใช้งาน:** ข้อความเดิมด้านบนถูกรักษาไว้ทั้งหมด ส่วนนี้เพิ่มประเภทของหลักฐาน ข้อขัดแย้ง และสิ่งที่ต้องยืนยันก่อนนำไปสร้างเอกสารออกแบบ
> **ลำดับความน่าเชื่อถือ:** Single Source of Truth ล่าสุด → คำแนะนำอาจารย์ล่าสุด → หลักฐานอุปกรณ์จริง → เอกสาร Proposal/Mockup เดิม

## 1. Evidence Register

| Evidence ID | ประเภท | หลักฐาน | แหล่งข้อมูลแบบ Absolute Path | ผลต่อการออกแบบ | ความเชื่อมั่น |
|---|---|---|---|---|---|
| `E-NTV-01` | Direct Evidence | Single Source of Truth จัด Network Topology Visualization ไว้ใน P2 และระบุ Interactive Canvas, Auto-Layout from Discovery, Manual Link Connection, Right-Click Context Menu และ Device Icons | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\02_feature\MyNetMate Weight Feature List.md` | Feature ต้องมีขอบเขตย่อยที่ทำได้จริง และต้องไม่ทำให้ P1 Critical Path เสียหาย | สูง |
| `E-NTV-02` | Direct Evidence | Auto-Layout มี Dependency กับ Network Discovery และข้อมูล LLDP/CDP Neighbor | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\02_feature\MyNetMate Weight Feature List.md` | Auto Topology จะทำงานไม่ได้หากยังไม่มีข้อมูล Interface-to-Interface Neighbor | สูง |
| `E-NTV-03` | Direct Evidence | อาจารย์เสนอ Interactive Topology ที่ให้ผู้ดูแล Drag & Drop Node และระบุ Port Connection ด้วยตนเอง | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\04_project_management\Advisor Teacher\คำแนะนำของอาจารย์ ณ ครั้งที่ 2 ปี 3 เทอม 1.md` | Manual Node Layout และ Manual Link เป็น Candidate MVP ที่ไม่ต้องรอ Discovery | สูง |
| `E-NTV-04` | Direct Evidence | บันทึกอาจารย์ล่าสุดกล่าวถึง Port, Link, Dependency, Network Discovery และอุปกรณ์จริง: Huawei Router, MikroTik Switch และ Cisco Switch | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\04_project_management\Advisor Teacher\คำแนะนำของอาจารย์ ณ ครั้งที่ 4 ปี 3 เทอม 1.md` | ต้องออกแบบ Test Fixture จากอุปกรณ์จริงหลังกลางภาค และต้องเก็บ Port-to-Port Link | สูงสำหรับรายการอุปกรณ์; ปานกลางสำหรับคำว่า `LLCP` ซึ่งต้องยืนยันว่าอาจหมายถึง `LLDP` หรือไม่ |
| `E-NTV-05` | Direct Evidence | Cisco เป็น Baseline; MikroTik Switch และ Huawei Router เป็น Candidate Test Vendors โดยต้องรอรุ่น OS และคำสั่งที่ทดสอบผ่าน | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\AGENTS.md` | Data Model ต้อง Vendor-neutral แต่ห้ามรับรอง Full Multi-vendor Support ก่อนมีผลทดสอบ | สูง |
| `E-NTV-06` | Direct Evidence | Device Inventory ระบุว่า Topology ใช้ข้อมูลจาก `devices` และ `interfaces`; ร่างเดิมใส่ `connected_to_device_id` และ `connected_to_interface` ใน `interfaces` | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\02_feature\02_Device Inventory Management\Data Information.md` | Schema เดิมเป็นจุดเริ่มต้น แต่ยังขาด Provenance, Confirmation, Staleness และ Parallel Link | สูงว่ามีร่างเดิม; ปานกลางว่าร่างเดิมเหมาะสม |
| `E-NTV-07` | Direct Evidence | Raw Feature List ระบุ Interactive Canvas, Device Icons, Manual Link, Context Menu และ Auto-Layout; ระบุว่า PNG Export ไม่เอา | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\02_feature\MyNetMate รายการ Features.md` | ใช้อ้างอิง Feature Candidate ได้ แต่ต้อง Weight ใหม่ก่อนยืนยัน | ปานกลาง เพราะเป็น Raw Data ไม่ใช่ SSOT |
| `E-NTV-08` | Direct Evidence | UI Specification เดิมออกแบบ Manual Link, Port Labels, Drag & Drop และ Auto-arrange แต่ยังใส่ PNG Export และระบุ Manual-only data source | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\01_architecture_and_specs\netconfig_full_page_specs.html` | ใช้เป็น UI Reference ได้ แต่ PNG Export และขอบเขต Data Source ขัดกับ SSOT ล่าสุด | ปานกลาง |
| `E-NTV-09` | Direct Evidence จากเอกสารเดิม | รายงานความคืบหน้าระบุ Pain Point เรื่องเอกสารไม่ทันสมัย การไล่สาย และความต้องการแผนผัง Network | `E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\04_project_management\ความคืบหน้า รายงานส่งอาจารย์ ตอนปี 2 เทอม 2\CEPP-Report.md` | สนับสนุนคุณค่าของ Topology ต่อ Troubleshooting และ Knowledge Transfer | ปานกลาง เนื่องจากไฟล์ที่ตรวจยังไม่เชื่อมกลับไปยัง Raw Interview Transcript รายบุคคล |

## 2. Evidence Classification Summary

### Direct Evidence

- อาจารย์ระบุให้มี Interactive Topology, Drag & Drop และ Manual Port Connection
- ระบบมีอุปกรณ์จริง 3 กลุ่มสำหรับทดสอบหลังกลางภาค: Huawei Router, MikroTik Switch และ Cisco Switch
- SSOT ระบุทั้ง Manual Link และ Auto-Layout from Discovery
- ข้อมูลที่ใช้วาด Topology ต้องเชื่อมกับ Device Inventory และ Interface
- การทดสอบต้องอยู่ใน Isolated Lab และห้าม Scan เครือข่ายมหาวิทยาลัย

### Inference

- เพราะ LLDP/CDP ให้ข้อมูล Neighbor ระดับ Interface เป็นหลัก ขอบเขตเริ่มต้นที่เหมาะสมจึงมีแนวโน้มเป็น Physical/L2 Topology
- เพราะอุปกรณ์อาจปิด LLDP/CDP หรือ Parser ยังไม่รองรับทุก Vendor ระบบ Manual Link จึงยังจำเป็น
- เพราะอุปกรณ์เดียวกันอาจถูกจัดวางต่างกันในแต่ละ Site/View ตำแหน่ง Canvas ไม่ควรเป็น Attribute ของ `devices` โดยตรง
- เพราะ Neighbor Data อาจเปลี่ยนหรือหายจากการเก็บข้อมูลชั่วคราว Link ที่ไม่พบครั้งล่าสุดไม่ควรถูกลบถาวรทันที

### Recommendation

- ใช้แนวทาง **Hybrid Manual-first**: Manual Link ใช้งานได้โดยไม่รอ Discovery และ Discovery ทำหน้าที่เสนอ Link ให้ผู้ใช้ตรวจสอบ
- จำกัด Topology MVP เป็น Physical/L2 Snapshot ไม่ทำ Real-time Topology หรือ Logical Routing Topology
- แยก Link Entity ออกจาก Interface Entity เพื่อรองรับ Provenance, Parallel Link, Confirmation และ Stale State
- แยก Topology View/Layout ออกจาก Device Inventory เพื่อไม่ให้การขยับ Node เปลี่ยนข้อมูลอุปกรณ์
- Discovery ห้ามเขียนทับหรือลบ Manual Link อัตโนมัติ

### Open Question

- ยังไม่ยืนยันว่าคำว่า `LLCP` ในบันทึกอาจารย์หมายถึง `LLDP` หรือเป็นประเด็นอื่น
- ยังไม่ทราบรุ่นและ OS Version ของ Huawei Router, MikroTik Switch และ Cisco Switch
- ยังไม่ยืนยันว่า Topology MVP จะเป็น Manual-first, Discovery-first หรือ Hybrid
- ยังไม่ยืนยันว่าจะทำเฉพาะ L2 Physical Topology หรือรวม Logical/L3 Topology
- ยังไม่มี Target Scale ที่ยืนยัน เช่น จำนวน Node/Link สูงสุดที่ต้องแสดง

## 3. User Decisions Supported

| Decision ID | ผู้ใช้ต้องตัดสินใจอะไร | Topology ช่วยอย่างไร | ข้อมูลที่ต้องใช้ | Action ถัดไปของผู้ใช้ |
|---|---|---|---|---|
| `UD-NTV-01` | อุปกรณ์ใดเชื่อมต่อกับอุปกรณ์ใด | แสดง Node และ Link ระหว่าง Device | Device identity และ Link endpoints | เปิดรายละเอียด Device หรือ Link |
| `UD-NTV-02` | การเชื่อมต่อผ่าน Port ใดทั้งสองฝั่ง | แสดง Source/Target Interface Label บน Link | Interface ของ Device ทั้งสองด้าน | ตรวจสาย, VLAN, Trunk หรือ Interface Config |
| `UD-NTV-03` | ข้อมูล Link เชื่อถือได้หรือไม่ | แสดงแหล่งที่มา `manual`/`lldp`/`cdp`, เวลาตรวจล่าสุด และสถานะยืนยัน | Provenance, `last_observed_at`, `confirmed_at` | ยืนยัน แก้ไข หรือปฏิเสธ Link |
| `UD-NTV-04` | อุปกรณ์หรือ Link ใดควรตรวจสอบก่อน | แสดง Device Status, Link Status และ Stale Indicator | Current state และ data freshness | ไป Device Detail, Interface Detail หรือ Dashboard |
| `UD-NTV-05` | Link ที่ Discovery พบตรงกับสภาพจริงหรือไม่ | เปรียบเทียบ Discovered Observation กับ Manual/Ground-truth Link | Neighbor observation และ confirmed link | Accept, Reject หรือ Merge |
| `UD-NTV-06` | ต้องดำเนินการกับอุปกรณ์ใดต่อ | Context Action เชื่อมไปยัง Inventory, Config Builder และ Version History | `device_id` และสิทธิ์ผู้ใช้ | เปิดหน้าที่เกี่ยวข้องโดยคง Device Context |

## 4. Candidate MVP Scope

> **สถานะ:** Recommendation — ต้องให้ทีมและอาจารย์ยืนยันก่อนย้ายไป `MVP - Feature_NTV.md`

### Must

1. แสดง Device Node จาก Device Inventory โดยไม่สร้าง Device ซ้ำใน Topology
2. แสดง Hostname, Device Type, Vendor และ Current Status ขั้นต่ำบน Node
3. รองรับ Drag & Drop, Zoom และ Pan บน Canvas
4. รองรับการเพิ่ม Device จาก Inventory เข้า Topology View
5. รองรับ Manual Link แบบ Interface-to-Interface พร้อม Port Label ทั้งสองฝั่ง
6. บันทึกตำแหน่ง Node และเรียกคืนตำแหน่งเดิมเมื่อเปิดหน้าใหม่
7. เปิด Device Detail จาก Node ได้
8. ลบ Node ออกจาก Topology View ได้โดยไม่ลบ Device จาก Inventory
9. บันทึก Audit Log สำหรับการเพิ่ม/แก้ไข/ลบ Manual Link และการเปลี่ยน Layout ที่สำคัญ
10. แสดง Source และ Freshness ของ Link เพื่อไม่ให้ผู้ใช้เข้าใจว่า Manual Data เป็นข้อมูลจาก Discovery

### Should

1. Auto-layout จาก Node และ Confirmed Link ที่มีอยู่
2. รับ LLDP/CDP Neighbor Observation จาก Discovery มาแสดงเป็น Pending Link
3. ให้ Operator ยืนยันหรือปฏิเสธ Pending Link ก่อนนำไปใช้เป็น Confirmed Link
4. แสดง Stale Indicator เมื่อ Link ไม่ถูกพบในการเก็บข้อมูลล่าสุด
5. Filter ตาม Site, Device Group, Vendor, Device Type และ Status

### Could

1. Right-click Context Menu
2. Pin/Hide Node
3. แสดง Interface Status บน Link
4. แสดง Parallel Link หรือ Port-channel แบบรวมกลุ่ม
5. หลาย Topology View สำหรับ Site หรือ Device Group เดียวกัน

### Won't / Out of Scope

1. Real-time Topology ที่ใช้ WebSocket หรือ Continuous Polling
2. PNG/PDF Export ในขอบเขตปัจจุบัน
3. Logical Routing/OSPF/BGP Topology ใน MVP
4. Cross-Device Impact Analysis
5. Network Simulation Engine ภายใน MyNetMate
6. Auto-delete Confirmed Link เมื่อ Discovery ไม่พบเพียงครั้งเดียว
7. Scan เครือข่ายมหาวิทยาลัย
8. AI สร้าง ตัดสิน หรือแก้ไข Topology Link โดยอัตโนมัติ

## 5. Conceptual Source of Truth

| ข้อมูล | Source of Truth | หมายเหตุสถานะ |
|---|---|---|
| Device identity | `devices` | มีอยู่ใน Device Inventory |
| Interface identity/current state | `interfaces` | มีร่างเดิม แต่ Fields ต้องปรับให้สอดคล้อง Dashboard/Monitoring |
| Confirmed physical link | `topology_links` | Recommendation — ยังไม่มี Schema ยืนยัน |
| Raw LLDP/CDP observation | `neighbor_observations` | Recommendation — แยกจาก Confirmed Link เพื่อเก็บหลักฐานและ Staleness |
| Topology view | `topology_views` | Recommendation — รองรับ Site/Group/View ในอนาคต |
| Node position and visibility | `topology_node_positions` | Recommendation — ห้ามเก็บ `x/y` ใน `devices` |
| Discovery execution result | `discovery_runs` | Dependency จาก Network Discovery |
| User actions | `audit_logs` | ใช้ตาราง Audit Trail กลาง |

### เหตุผลที่ยังไม่ควรใช้ `interfaces.connected_to_*` เป็น Link Source of Truth เพียงอย่างเดียว

1. อาจเกิดหลายสายระหว่างอุปกรณ์คู่เดียวกัน
2. Neighbor แต่ละฝั่งอาจรายงานข้อมูลไม่ตรงกัน
3. ต้องแยก Manual Link ออกจาก LLDP/CDP Observation
4. ต้องเก็บผู้ยืนยันและเวลาที่ยืนยัน
5. ต้องแสดง Stale โดยไม่ลบข้อมูลเดิมทันที
6. ต้องรองรับ Port-channel/LAG ในอนาคต

## 6. Candidate Components and Dependencies

| Component/Dependency | หน้าที่ | สถานะ |
|---|---|---|
| Device Inventory | Source ของ Device Node | Required |
| Interface Repository | Source ของ Interface Endpoint และสถานะ | Required |
| Topology API/Service | รวม Node, Link, Layout และสิทธิ์การแก้ไข | Recommendation |
| Topology Canvas UI | แสดง Graph และรับ Drag/Link Action | Required |
| Manual Link Manager | ตรวจสอบ Interface Endpoint และสร้าง Confirmed Link | Required สำหรับ Manual-first |
| Discovery Service | เก็บ LLDP/CDP/SNMP/SSH Read-only Data | Required เฉพาะ Auto-discovery |
| Vendor Collector/Parser | แปลงข้อมูล Cisco/MikroTik/Huawei เป็น Common Neighbor Model | Pending รุ่น/OS จริง |
| Link Reconciliation | เปรียบเทียบ Observation กับ Confirmed Link | Should |
| Auto-layout Engine | คำนวณตำแหน่งเริ่มต้น | Should |
| Audit Trail | บันทึกผู้แก้ไข Link/Layout | Required |
| Auth/RBAC | คุม Viewer/Operator/Admin Actions | Required |

## 7. Candidate API Needs

> **สถานะ:** Recommendation เพื่อใช้ตรวจ Component Boundary เท่านั้น ชื่อ Endpoint ยังไม่ยืนยัน

| API | วัตถุประสงค์ |
|---|---|
| `GET /topologies/{topology_id}` | โหลด Node, Confirmed Link, Layout และ Freshness |
| `POST /topologies` | สร้าง Topology View ตาม Site/Group |
| `POST /topologies/{topology_id}/nodes` | เพิ่ม Device จาก Inventory เข้า View |
| `PATCH /topologies/{topology_id}/nodes/{device_id}/position` | บันทึกตำแหน่ง Node |
| `DELETE /topologies/{topology_id}/nodes/{device_id}` | นำ Node ออกจาก Viewโดยไม่ลบ Device |
| `POST /topologies/{topology_id}/links` | สร้าง Manual Link |
| `PATCH /topologies/{topology_id}/links/{link_id}` | แก้ Endpoint/Status/Confirmation |
| `DELETE /topologies/{topology_id}/links/{link_id}` | ลบหรือ Soft-delete Manual Link |
| `GET /topologies/{topology_id}/link-suggestions` | โหลด Pending Neighbor Observations |
| `POST /topologies/{topology_id}/link-suggestions/{observation_id}/accept` | ยืนยัน Discovered Link |
| `POST /topologies/{topology_id}/link-suggestions/{observation_id}/reject` | ปฏิเสธ Discovered Link พร้อมเหตุผล |

## 8. Candidate Acceptance Tests

| Test ID | Acceptance Test | Priority |
|---|---|---|
| `AT-NTV-01` | เมื่อ Inventory มี Device 3 ตัว หน้า Topology แสดง Node ตรงกับ `device_id` ทั้ง 3 โดยไม่สร้าง Device Record ซ้ำ | Must |
| `AT-NTV-02` | Operator สร้าง Link โดยเลือก Interface ทั้งสองฝั่ง แล้วเปิดหน้าใหม่ยังเห็น Link และ Port Label เดิม | Must |
| `AT-NTV-03` | การลาก Node แล้ว Reload ต้องได้ตำแหน่งเดิม | Must |
| `AT-NTV-04` | การ Remove Node from Topology ต้องไม่ลบ Device จาก Inventory | Must |
| `AT-NTV-05` | Viewer ดู Topology ได้แต่สร้าง/แก้/ลบ Link ไม่ได้ | Must |
| `AT-NTV-06` | Manual Link ต้องแสดง Source=`manual`, ผู้สร้าง และเวลาแก้ไขล่าสุด | Must |
| `AT-NTV-07` | LLDP/CDP Observation ใหม่ต้องอยู่สถานะ Pending และยังไม่เขียนทับ Manual Link ก่อนผู้ใช้ยืนยัน | Should |
| `AT-NTV-08` | การเก็บข้อมูลครั้งหนึ่งไม่พบ Link เดิม ระบบเปลี่ยนเป็น Stale Candidate แทนการลบทันที | Should |
| `AT-NTV-09` | ระบบรองรับ Parallel Links ระหว่าง Device คู่เดียวกันเมื่อใช้คนละ Interface โดยไม่รวมเป็น Record เดียวผิดพลาด | Should |
| `AT-NTV-10` | Auto-layout เปลี่ยนเฉพาะตำแหน่งบน View ไม่แก้ Device/Interface/Link Identity | Should |
| `AT-NTV-11` | Discovery ถูกจำกัดใน Allowlist ของ Isolated Lab และไม่สามารถเริ่ม Scan เครือข่ายมหาวิทยาลัยได้ | Must |
| `AT-NTV-12` | เมื่อได้อุปกรณ์จริง ผล Link ที่ระบบแสดงต้องตรงกับ Ground-truth Port Map ของ Huawei Router, MikroTik Switch และ Cisco Switch | Must ก่อนสรุป Vendor Support |

## 9. Dependencies and Risks

| Dependency/Risk | ผลกระทบ | แนวทางลดความเสี่ยง |
|---|---|---|
| ไม่ทราบรุ่นและ OS ของอุปกรณ์จริง | เลือกคำสั่งและ Parser ไม่ได้ | เก็บ Device Test Sheet หลังได้รับอุปกรณ์ |
| LLDP/CDP ถูกปิด | Discovery มองไม่เห็น Link | รองรับ Manual Link และแสดง Collection Result |
| Vendor ใช้ Interface Naming ต่างกัน | Match Endpoint ผิด | เก็บ Canonical ID แยกจาก Display Name และทดสอบ Parser ต่อรุ่น |
| Observation สองฝั่งไม่ตรงกัน | เกิด Duplicate/Conflict | ใช้ Reconciliation State และ Human Confirmation |
| Discovery ล้มเหลวชั่วคราว | Link ถูกมองว่าหาย | ใช้ Stale State และไม่ Auto-delete |
| React Canvas/Layout ซับซ้อน | Frontend ใช้เวลามาก | เริ่ม Must Scope ก่อน Auto-layout/Context Menu |
| ขยายเป็น Real-time Monitoring | Scope และ Infrastructure โตมาก | ใช้ Snapshot/On-demand Collection |
| เก็บ Link ใน `interfaces` อย่างเดียว | รองรับ Provenance/Parallel Link ไม่ครบ | ประเมิน `topology_links` แยกก่อนทำ Schema |
| Scan ผิดเครือข่าย | ผิดข้อจำกัดมหาวิทยาลัย | Allowlist, Isolated Lab และ Audit Discovery Run |

## 10. Open Questions Before Design Freeze

| Question ID | คำถาม | ตัวเลือก/ข้อเสนอเริ่มต้น | ผู้ยืนยัน |
|---|---|---|---|
| `Q-NTV-01` | Topology MVP เป็น Manual-first, Discovery-first หรือ Hybrid? | **Recommendation:** Hybrid Manual-first | ทีม + อาจารย์ |
| `Q-NTV-02` | ขอบเขตเป็น Physical/L2 เท่านั้นหรือรวม Logical/L3? | **Recommendation:** Physical/L2 เท่านั้น | ทีม + อาจารย์ |
| `Q-NTV-03` | มี Topology เดียวทั้งระบบหรือแยกตาม Site/Device Group? | **Recommendation:** แยก View ตาม Site/Group แต่ Device ใช้ Inventory กลาง | ทีม |
| `Q-NTV-04` | รุ่นและ OS ของอุปกรณ์จริงคืออะไร? | รอรับอุปกรณ์หลังกลางภาค | อาจารย์/ทีม Lab |
| `Q-NTV-05` | Huawei/MikroTik/Cisco เปิด LLDP/CDP/SNMP/SSH Read-only ได้หรือไม่? | ทดสอบตามคู่มือและรุ่นจริง | ทีม Network |
| `Q-NTV-06` | `LLCP` ในบันทึกอาจารย์หมายถึง `LLDP` หรือไม่? | ห้ามแก้ความหมายเอง | อาจารย์ |
| `Q-NTV-07` | Discovery เขียนทับ Manual Link ได้หรือไม่? | **Recommendation:** ไม่ได้; สร้าง Suggestion เท่านั้น | ทีม + อาจารย์ |
| `Q-NTV-08` | Link ที่ไม่พบกี่รอบจึงถือว่า Stale/Removed? | ยังไม่มี Evidence กำหนดจำนวนรอบ | ทีม Network |
| `Q-NTV-09` | จะแสดง Port-channel/LAG อย่างไร? | เริ่มจาก Physical Member Links หรือเลื่อนไป Could | ทีม Network |
| `Q-NTV-10` | จะแสดง End Device/AP/Server หรือเฉพาะ Managed Router/Switch? | **Recommendation:** Managed Router/Switch ก่อน | ทีม + ผู้ใช้เป้าหมาย |
| `Q-NTV-11` | Role ใดสร้าง/แก้/ลบ Link ได้? | **Recommendation:** Admin/Operator แก้ได้, Viewer อ่านอย่างเดียว | ทีม Security |
| `Q-NTV-12` | Target Scale สำหรับ Canvas คือกี่ Node/Link? | ต้องกำหนดจาก Lab และเป้าหมาย Demo ก่อนตั้ง Performance Metric | ทีม |
| `Q-NTV-13` | ต้องเก็บ Raw LLDP/CDP Output หรือเฉพาะ Parsed Observation? | ยังต้องประเมินพื้นที่, Debugging และ Audit Need | Backend/Network |
| `Q-NTV-14` | Node/Link Status มาจาก Ping, Interface State หรือ Discovery Result? | ต้องแยก Reachability, Interface State และ Collection Health | Dashboard/Inventory/Topology Owners |

## 11. Information Required Before Writing the Next Three Documents

### ก่อนเขียน `MVP - Feature_NTV.md`

- ยืนยัน `Q-NTV-01` ถึง `Q-NTV-03`
- ยืนยัน User Decisions ที่ต้องรองรับ
- Weight Must/Should/Could/Won't กับทีม
- ระบุ Acceptance Tests ที่จะใช้วัด MVP จริง

### ก่อนเขียน `Database Schema.md`

- ยืนยัน Link Source of Truth และ Manual/Discovery precedence
- ยืนยันว่าต้องมีหลาย Topology View หรือไม่
- ยืนยัน Parallel Link, Port-channel และ Stale Policy
- ตรวจ Field ของ `devices`, `interfaces`, `audit_logs` กับเจ้าของ Feature อื่น

### ก่อนเขียน `Component Diagram.md`

- ยืนยันว่า Discovery อยู่ใน Diagram เดียวกับ Topology หรือเป็น External Dependency
- ยืนยันขอบเขต Topology Service, Link Reconciliation และ Layout Engine
- ยืนยัน API Ownership ระหว่าง Inventory, Discovery และ Topology
- ยืนยันว่า Vendor Collector/Parser เป็น Component กลางหรืออยู่ใต้ Discovery

## 12. Next Evidence Collection Checklist

- [ ] ขอรุ่นและ OS Version ของ Huawei Router
- [ ] ขอรุ่นและ OS Version ของ MikroTik Switch
- [ ] ขอรุ่นและ IOS Version ของ Cisco Switch
- [ ] ทำ Ground-truth Device/Port/Link Map จากสายจริง
- [ ] ตรวจว่าแต่ละอุปกรณ์รองรับและเปิด LLDP/CDP หรือไม่
- [ ] เก็บผลคำสั่ง Read-only แบบ Raw Output สำหรับ Parser Test
- [ ] ตรวจ SNMP Version และ Read-only Credential ที่อนุญาตให้ใช้
- [ ] กำหนด Isolated Lab CIDR/Allowlist
- [ ] ยืนยันคำว่า `LLCP` กับอาจารย์
- [ ] ยืนยัน Manual-first/Hybrid กับทีมและอาจารย์
- [ ] ขอหลักฐาน User Feedback ที่เชื่อมกลับไปยัง Raw Interview/Respondent ได้
- [ ] กำหนด Target Node/Link Count สำหรับ Demo และ Performance Test

---

# 13. มติล่าสุด: Manual Device Enrollment, Observed Topology และการแก้ไข Link

> **สถานะ:** User Decision — ใช้เป็นข้อกำหนดตั้งต้นสำหรับ `MVP - Feature_NTV.md`, `Database Schema.md` และ `Component Diagram.md`
> **วันที่ยืนยัน:** 2026-08-11
> **ผลต่อข้อความเดิม:** หัวข้อนี้มีผลเหนือข้อเสนอ `Hybrid Manual-first` และ `Manual Link` เดิมทุกจุดที่ขัดกัน

## 13.1 คำจำกัดความที่แก้ไขแล้ว

### Manual Device Enrollment

Manual Input ใน Device Inventory **ไม่ได้หมายถึงการสร้างอุปกรณ์สมมติด้วยการกรอกข้อมูลทั้งหมดเอง** แต่หมายถึง:

1. ผู้ใช้ระบุอุปกรณ์เป้าหมายที่ทราบอยู่แล้ว เช่น Management IP Address
2. ผู้ใช้เลือก `Device Credential Profile` ที่ได้รับอนุญาตสำหรับอุปกรณ์นั้น
3. ระบบตรวจสอบการเข้าถึงและ Authentication
4. ระบบเชื่อมต่ออุปกรณ์แบบ Read-only โดยใช้ SSH เป็นวิธีหลักใน MVP และอาจใช้ SNMP ตามความสามารถของอุปกรณ์
5. ระบบดึงและ Parse ข้อมูลจริง เช่น Hostname, Vendor, Model, OS Version, Interface และ LLDP/CDP Neighbor
6. ระบบบันทึก Device, Interface และ Neighbor Observation ลงฐานข้อมูลพร้อมเวลาและผลการเก็บข้อมูล

`Device Credential Profile` หมายถึงข้อมูลรับรองสำหรับเข้าอุปกรณ์เครือข่ายที่ผู้ใช้มีสิทธิ์ใช้งาน **ไม่ใช่รหัสผ่านของบัญชีผู้ใช้ Web Application** และระบบต้องไม่ส่งข้อมูลรับรองนี้ไปยัง Frontend, Audit Log หรือ Gemini API

### Network Discovery

Network Discovery หมายถึงระบบค้นหา Candidate Device ภายใน CIDR/Allowlist ของ Isolated Lab แล้วจึงผูก Candidate กับ Credential Profile ที่ได้รับอนุญาตเพื่อเก็บข้อมูลแบบ Read-only จากอุปกรณ์นั้น การตอบ Ping เพียงอย่างเดียวยังไม่เพียงพอให้ Candidate กลายเป็น Managed Device หรือ Topology Node ที่เชื่อถือได้

### หลักร่วมของทั้งสองวิธี

- Manual Enrollment และ Discovery ต่างกันเฉพาะ **วิธีได้มาซึ่งอุปกรณ์เป้าหมาย**
- ทั้งสองเส้นทางต้องผ่าน Collector/Parser ชุดเดียวกันและต้องมี `collection_status`
- Device ที่ยังเชื่อมต่อหรือเก็บข้อมูลไม่สำเร็จอาจแสดงเป็น Enrollment/Discovery Candidate ได้ แต่ห้ามแสดงเป็น Verified Topology Node
- Topology ต้องอ้างอิง Device, Interface และ Neighbor ที่ระบบเก็บจากอุปกรณ์เป้าหมายใน Isolated Lab จริง ไม่สร้าง Node หรือ Port สมมติเพื่อให้ผังดูครบ
- การทดสอบรับรอง Vendor ต้องใช้อุปกรณ์จริงและรุ่น/OS จริง ส่วนการใช้ GNS3 หรือ Packet Tracer ระหว่างพัฒนายังต้องแยกสถานะออกจากผลรับรองอุปกรณ์จริง

## 13.2 Evidence และ User Decision เพิ่มเติม

| Decision ID | ประเภท | มติ/หลักฐาน | ผลต่อการออกแบบ |
|---|---|---|---|
| `D-NTV-15` | Direct User Decision | Manual Input คือการระบุ IP/อุปกรณ์และ Credential แล้วให้ระบบเชื่อมต่อเพื่อดึงข้อมูลจากอุปกรณ์จริง | ยกเลิกความหมายเดิมที่ Manual Input คือการสร้าง Device Record หรือ Node สมมติด้วยมือ |
| `D-NTV-16` | Direct User Decision | ทั้ง Manual Enrollment และ Discovery ต้องเชื่อมต่ออุปกรณ์เป้าหมายจริงก่อนนำข้อมูลไปใช้ | Topology Node ต้องมีหลักฐาน Collection; Ping-only Candidate ยังไม่ใช่ Verified Node |
| `D-NTV-17` | Derived Design Decision | NTV เป็น **Observation-first Topology** ไม่ใช่ Freehand Network Diagram | Link หลักมาจาก LLDP/CDP Observation; การแก้ไขต้องรักษาหลักฐานเดิมและ Audit ได้ |
| `D-NTV-18` | Safety Decision | การแก้ข้อมูลใน NTV ไม่สามารถเปลี่ยนสายหรือ Port บนอุปกรณ์จริงได้ | ต้องแยกการแก้ Layout, การ Review Observation และ Manual Override ออกจากกัน |

### Known Documentation Conflicts

- [Device Inventory.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/02_Device Inventory Management/Device Inventory.md) ยังอธิบาย Manual Input ว่าผู้ใช้กรอกข้อมูลอุปกรณ์ทุก Field หรือ Import CSV ซึ่งขัดกับ `D-NTV-15`; เอกสาร Inventory ต้องปรับภายหลังให้ใช้คำว่า Manual Device Enrollment และยืนยัน Field ที่อนุญาตให้ผู้ใช้กรอกเอง
- [MyNetMate Weight Feature List.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/Project/02_feature/MyNetMate Weight Feature List.md) ยังมีคำว่า `Manual Link Connection`; สำหรับ NTV ให้ตีความเป็น Reviewed Manual Override ตามหัวข้อ 13.4 ไม่ใช่การลากเส้นสมมติอย่างอิสระ และควรปรับคำใน SSOT เมื่อทีมยืนยันมตินี้

## 13.3 Data Flow ที่ถูกต้อง

### เส้นทาง Manual Enrollment

`Known IP + Device Credential Profile` → `Read-only SSH/SNMP Collection` → `Identity/Interface/Neighbor Parsing` → `Device Inventory` → `Neighbor Observation` → `Topology Reconciliation` → `NTV`

### เส้นทาง Network Discovery

`Isolated Lab Allowlist` → `Ping/SNMP Candidate Discovery` → `Credential Association` → `Read-only SSH/SNMP Collection` → `Identity/Interface/Neighbor Parsing` → `Device Inventory` → `Neighbor Observation` → `Topology Reconciliation` → `NTV`

ทั้งสองเส้นทางต้องมาบรรจบกันก่อน NTV เพื่อไม่ให้หน้าผังมีความหมายของ Device และ Link สองมาตรฐาน

## 13.4 NTV สามารถแก้ไข Link ได้หรือไม่

**คำตอบสั้น:** แก้ไขการนำเสนอและสถานะการตรวจสอบได้ แต่ห้ามแก้ Discovered Link โดยตรงจนดูเหมือนว่าเครือข่ายจริงเปลี่ยนตามฐานข้อมูล

| สิ่งที่ผู้ใช้ทำ | อนุญาตหรือไม่ | ความหมายและวิธีทำ |
|---|---|---|
| ลาก Node เปลี่ยนตำแหน่ง | อนุญาต | แก้เฉพาะ Layout ของ Topology View ไม่เปลี่ยน Device หรือสายจริง |
| Zoom, Pan, Pin, Hide, Filter | อนุญาต | เปลี่ยนเฉพาะการแสดงผลของผู้ใช้/View |
| ยืนยัน Link ที่ระบบพบ | อนุญาต | เปลี่ยน `verification_status` เป็น Confirmed โดยไม่แก้ Raw Observation |
| ปฏิเสธ Link ที่ระบบพบ | อนุญาตพร้อมเหตุผล | เก็บ Observation เดิมไว้ แล้วบันทึก Review ว่า False Positive/Parser Error/Stale |
| เปลี่ยน Source/Destination Interface ของ Raw LLDP/CDP Observation | ไม่อนุญาต | Raw Observation เป็นหลักฐานจากอุปกรณ์และต้องเป็น Immutable |
| ลากเส้นใหม่อย่างอิสระระหว่าง Node | ไม่อนุญาต | จะทำให้ผู้ใช้เข้าใจว่าเป็นการเชื่อมต่อจริงโดยไม่มีหลักฐาน |
| บันทึก Link ที่ตรวจสายจริงแล้วแต่ LLDP/CDP ใช้ไม่ได้ | อนุญาตแบบ `Manual Override` | ต้องเลือก Device และ Interface ที่เก็บมาจากอุปกรณ์จริง ระบุเหตุผล/หลักฐาน ผู้บันทึก เวลา และสถานะ Pending/Verified |
| เปลี่ยนการเชื่อมต่อจริง | ทำใน NTV ไม่ได้ | ผู้ดูแลต้องต่อสาย/เปลี่ยน Port ที่อุปกรณ์จริง แล้วสั่ง Re-collect เพื่อให้ NTV สะท้อนสภาพใหม่ |

ดังนั้นคำว่า **Edit Link** ใน UI ควรแยกเป็นคำสั่งที่ชัดเจน เช่น `Confirm Observation`, `Reject Observation`, `Create Verified Override` และ `Re-collect` ไม่ควรมีคำสั่งทั่วไปชื่อ `Edit Link` ที่แก้ Endpoint ได้โดยไม่มีบริบท

### กฎของ Manual Override

Manual Override มีไว้แก้ปัญหาเมื่อ LLDP/CDP ถูกปิด อุปกรณ์ไม่รองรับ หรือ Parser ยังไม่รองรับรุ่นนั้น ไม่ใช่ช่องทางสร้างผังตามสมมติฐาน โดยต้องมีเงื่อนไขขั้นต่ำดังนี้:

1. เลือกได้เฉพาะ Device ที่ Collection สำเร็จและ Interface ที่มีอยู่ใน Inventory
2. ต้องระบุ `reason` และ `evidence_note` เช่น ตรวจสายจริงที่ Rack/Lab
3. เก็บ `source=manual_override`, `created_by`, `created_at`, `verification_status`
4. ถ้าเป็น Verified ต้องมี `verified_by` และ `verified_at`; ผู้สร้างไม่ควรยืนยันรายการของตนเองหากทีมต้องการหลัก Four-eyes
5. ห้ามแก้หรือลบ Raw LLDP/CDP Observation เพื่อให้ตรงกับ Override
6. หาก Collection รอบใหม่ขัดกับ Override ให้แสดง Conflict เพื่อให้ผู้ใช้ Reconcile ไม่เขียนทับอัตโนมัติ

## 13.5 Source of Truth ที่ปรับใหม่

1. `devices` — ตัวตนอุปกรณ์ที่เก็บข้อมูลจากอุปกรณ์เป้าหมายสำเร็จ
2. `interfaces` — Interface ที่ Collector ดึงและ Parse จากอุปกรณ์
3. `neighbor_observations` — Raw LLDP/CDP Result แบบ Append-only พร้อม Source, Collection Run และเวลา
4. `topology_links` — Link ปัจจุบันที่ผ่าน Reconciliation โดยอ้างกลับไปยัง Observation หรือ Manual Override
5. `topology_link_reviews` — ประวัติ Confirm/Reject/Conflict Resolution
6. `topology_views` และ `topology_node_positions` — Layout/Filter/ตำแหน่งการแสดงผล ซึ่งไม่ใช่หลักฐานสภาพเครือข่าย

ห้ามเก็บเฉพาะ `connected_to_*` แล้วเขียนทับค่าเดิมใน `interfaces` เพราะจะสูญเสียที่มา ประวัติ ความขัดแย้ง และกรณีที่ Link หายชั่วคราว

## 13.6 MVP ของ NTV ที่แนะนำ

> **ปัญหาที่ MVP ต้องแก้:** ผู้ใช้ต้องตอบได้ว่า “อุปกรณ์ที่ระบบเข้าถึงได้จริงตัวใดต่อกับตัวใด ผ่าน Port อะไร ข้อมูลมาจากไหน และตรวจล่าสุดเมื่อใด” โดยไม่ทำให้ Diagram ที่ผู้ใช้วาดเองถูกเข้าใจผิดว่าเป็นสภาพเครือข่ายจริง

### Must Have

1. รับเฉพาะ Managed Device จาก Inventory ที่มี Collection สำเร็จเป็น Topology Node
2. แสดง Hostname, Vendor, Device Type, Reachability และ `last_collected_at` บน Node หรือ Detail Panel
3. แสดง Physical/L2 Link จาก LLDP/CDP Neighbor Observation พร้อม Port ทั้งสองฝั่งเมื่อทราบ
4. แสดง `source`, `last_observed_at`, `verification_status` และ Collection Health ของทุก Link
5. รองรับ Drag & Drop, Zoom, Pan และบันทึกตำแหน่ง Node โดยระบุชัดว่าเป็นการแก้ Layout เท่านั้น
6. มี Link Review Flow: Confirm, Reject พร้อมเหตุผล และดู Raw Evidence/Collection Run ที่เกี่ยวข้อง
7. มี Manual Override สำหรับกรณีไม่มี LLDP/CDP โดยเลือกได้เฉพาะ Device/Interface จริงและต้องมีเหตุผล/Audit Trail
8. มีคำสั่ง Re-collect แบบ Read-only เพื่อดึงข้อมูลล่าสุดจากอุปกรณ์ ไม่แก้ Configuration และไม่ให้ AI ส่งคำสั่ง
9. เปิด Device Detail และ Interface Detail จาก Node/Link ได้
10. เมื่อ Link ไม่ถูกพบหนึ่งรอบให้แสดง Stale/Needs Review แทนการลบทันที
11. จำกัด Collection และ Discovery ด้วย Isolated Lab Allowlist พร้อม Audit Log

### Should Have

1. Auto-layout จาก Link ที่ Confirmed/Observed แล้ว
2. แสดง Conflict ระหว่าง Observation ใหม่กับ Manual Override หรือ Observation เดิม
3. แสดง One-sided Observation และ Two-sided Corroboration แยกกัน
4. Filter ตาม Vendor, Device Type, Status, Collection Health และ Verification Status
5. รองรับ Parallel Physical Links โดยใช้คู่ `local_interface_id` และ `remote_interface_id` เป็นเอกลักษณ์ของ Endpoint

### Won't Have ใน MVP

1. Freehand Device/Port Creation บน Canvas
2. Arbitrary Link Endpoint Editing ที่แก้ Raw Observation
3. การเปลี่ยนสาย, VLAN หรือ Configuration ของอุปกรณ์จากหน้า NTV
4. Real-time Topology/Continuous Polling ระดับ Enterprise
5. Logical OSPF/BGP Topology, Cross-device Impact Analysis หรือ Network Simulation
6. Auto-delete Link หลัง Collection พลาดเพียงครั้งเดียว
7. AI สร้าง ยืนยัน หรือแก้ Link โดยอัตโนมัติ

## 13.7 Candidate API ที่สอดคล้องกับมติใหม่

| API | หน้าที่ |
|---|---|
| `GET /topologies/{topology_id}` | โหลด Managed Node, Reconciled Link, Layout และ Freshness |
| `POST /devices/enroll` | ระบุ Known Device และ Credential Profile เพื่อเริ่ม Read-only Collection; อยู่ในขอบเขต Inventory |
| `POST /devices/{device_id}/collections` | สั่ง Re-collect แบบ Read-only |
| `PATCH /topologies/{topology_id}/nodes/{device_id}/position` | แก้เฉพาะตำแหน่ง Node บน View |
| `POST /topology-link-observations/{observation_id}/confirm` | ยืนยัน Observation โดยไม่แก้ Raw Data |
| `POST /topology-link-observations/{observation_id}/reject` | ปฏิเสธ Observation พร้อมเหตุผล |
| `POST /topology-link-overrides` | สร้าง Manual Override จาก Device/Interface ที่เก็บจากอุปกรณ์จริง |
| `POST /topology-link-overrides/{override_id}/verify` | ให้ผู้มีสิทธิ์ยืนยัน Override |
| `POST /topology-link-conflicts/{conflict_id}/resolve` | บันทึกผล Reconciliation ระหว่าง Observation และ Override |

API เดิมประเภท `POST /topologies/{id}/links`, `PATCH .../links/{link_id}` และ `DELETE .../links/{link_id}` ต้องไม่ถูกนำไปใช้เป็น CRUD ทั่วไปสำหรับ Raw Link หากจะคงไว้ต้องจำกัดให้เป็น Override/Review และตั้งชื่อให้สื่อความหมาย

## 13.8 Acceptance Tests ที่แก้ไขแล้ว

| Test ID | Acceptance Test | Priority |
|---|---|---|
| `AT-NTV-R01` | การกรอก IP อย่างเดียวโดยยังเชื่อมต่อหรือเก็บข้อมูลไม่สำเร็จต้องไม่สร้าง Verified Topology Node | Must |
| `AT-NTV-R02` | เมื่อ Manual Enrollment เชื่อมต่ออุปกรณ์สำเร็จ Node ต้องอ้าง `device_id` และข้อมูลที่ Collector เก็บจริง | Must |
| `AT-NTV-R03` | Discovery Candidate ที่ตอบ Ping แต่ Authentication/Collection ล้มเหลวต้องแสดงเป็น Candidate/Error ไม่ใช่ Managed Topology Node | Must |
| `AT-NTV-R04` | Link จาก LLDP/CDP ต้องแสดง Source, Port, Collection Run และเวลาตรวจล่าสุด | Must |
| `AT-NTV-R05` | การลาก Node แล้ว Reload ต้องคงตำแหน่งเดิมและต้องไม่เปลี่ยน Device/Interface/Link Record | Must |
| `AT-NTV-R06` | ผู้ใช้ไม่สามารถแก้ Endpoint ของ Raw Observation ได้ และการ Reject ต้องเก็บ Raw Observation เดิม | Must |
| `AT-NTV-R07` | Manual Override เลือก Interface ที่ไม่มีใน Inventory หรือ Device ที่ Collection ไม่สำเร็จไม่ได้ | Must |
| `AT-NTV-R08` | Manual Override ต้องมีเหตุผล ผู้สร้าง เวลา สถานะยืนยัน และ Audit Log | Must |
| `AT-NTV-R09` | เมื่อ Observation ใหม่ขัดกับ Verified Override ระบบต้องแสดง Conflict และไม่เขียนทับทั้งสองฝ่ายอัตโนมัติ | Should |
| `AT-NTV-R10` | การเปลี่ยนสายจริงและ Re-collect ต้องทำให้ Link ใหม่ปรากฏ และ Link เดิมเป็น Stale/Needs Review โดยยังตรวจย้อนหลังได้ | Must |
| `AT-NTV-R11` | Viewer แก้ Layout ส่วนตัวได้ตามนโยบาย แต่ Confirm/Reject/Override ไม่ได้; Operator/Admin ทำได้ตาม RBAC | Must |
| `AT-NTV-R12` | Collection/Discovery นอก Allowlist ของ Isolated Lab ต้องถูกปฏิเสธและบันทึก Audit | Must |

## 13.9 Open Questions ที่ยังต้องยืนยัน

| Question ID | คำถาม | ข้อเสนอเริ่มต้น |
|---|---|---|
| `Q-NTV-R01` | Manual Enrollment ต้องบังคับ SSH เท่านั้น หรือยอมให้ SNMP Read-only เป็น Collection Method หลักสำหรับบางรุ่น? | ใช้ SSH เป็น Baseline และเปิด SNMP เป็น Vendor Capability หลังทดสอบรุ่นจริง |
| `Q-NTV-R02` | ระบบเก็บ Device Credential แบบใดและใครสร้าง Credential Profile ได้? | Admin สร้าง/ผูก Profile; เก็บแบบเข้ารหัส; Frontend อ่าน Secret คืนไม่ได้ |
| `Q-NTV-R03` | ต้องให้คนละคน Verify Manual Override หรือไม่? | ใช้ Four-eyes สำหรับอุปกรณ์จริงถ้าจำนวนผู้ใช้และเวลาโครงงานรองรับ |
| `Q-NTV-R04` | Link ต้องถูกพบกี่ Collection Run จึง Confirm อัตโนมัติ หรือจะให้ผู้ใช้ Confirm ทุกครั้ง? | MVP ไม่ Auto-confirm; แสดง Corroboration Count ให้ผู้ใช้ตัดสินใจ |
| `Q-NTV-R05` | Link ที่ไม่พบกี่รอบจึงเปลี่ยนจาก Stale เป็น Removed? | ห้าม Hard-delete; กำหนด Threshold หลังทดสอบกับอุปกรณ์จริง |
| `Q-NTV-R06` | GNS3/Packet Tracer นับเป็นแหล่งข้อมูลจริงใน Development Test หรือไม่? | แยก `test_environment=emulated/physical`; Vendor Acceptance ใช้ Physical Lab |
| `Q-NTV-R07` | Huawei Router, MikroTik Switch และ Cisco Switch รุ่นจริงรองรับ LLDP/CDP และคำสั่ง Read-only ใดบ้าง? | รอ Device Test Sheet และ Raw Command Output หลังกลางภาค |
| `Q-NTV-R08` | Viewer แก้ Layout ส่วนตัวได้หรือทุก Layout เป็น Shared View? | เริ่ม Shared Layout ที่ Operator/Admin จัด; Viewer อ่านอย่างเดียวเพื่อให้ RBAC ง่าย |

## 13.10 ข้อความเดิมที่ถูกแทนที่

| ข้อความ/แนวคิดเดิม | สถานะใหม่ |
|---|---|
| `Hybrid Manual-first` ที่ให้สร้าง Link ได้ก่อนมีข้อมูลจากอุปกรณ์ | แทนที่ด้วย `Observation-first` |
| Manual Input คือการกรอก Device Record ด้วยมือ | แทนที่ด้วย Manual Device Enrollment + Read-only Collection |
| Manual Link เป็น Must และลากเส้นได้อิสระ | แทนที่ด้วย Reviewed Manual Override ที่อ้าง Device/Interface จริง |
| Discovery เขียนทับ Manual Link ไม่ได้ | ปรับเป็น Observation และ Override ต่างเป็นหลักฐานที่แก้ทับกันไม่ได้; Conflict ต้อง Reconcile |
| `PATCH topology link` แก้ Endpoint ได้ | ยกเลิกสำหรับ Raw Observation; ใช้ Review/Override/Conflict Resolution |
| คำถามว่าจะใช้ Manual-first/Discovery-first/Hybrid | ปิดคำถาม: ใช้ Observation-first โดย Manual Enrollment และ Discovery เป็นช่องทางนำอุปกรณ์เข้าสู่ Collection |

## 13.11 Definition of Done สำหรับ NTV MVP

NTV MVP ถือว่าแก้ปัญหาได้เมื่อทีมสาธิตใน Isolated Lab แล้วผู้ใช้สามารถ:

1. นำอุปกรณ์เข้าสู่ระบบผ่าน Manual Enrollment หรือ Discovery
2. เห็นชัดว่าอุปกรณ์ใด Collection สำเร็จ/ล้มเหลว
3. เห็นแผนผังจากข้อมูล Neighbor ที่เก็บจากอุปกรณ์ พร้อม Port, Source และ Freshness
4. แยกได้ว่า Link ใดเป็น Observation, Confirmed Link, Manual Override, Conflict หรือ Stale
5. ตรวจสอบ/ยืนยัน/ปฏิเสธข้อมูลได้โดยไม่ทำลาย Raw Evidence
6. เปลี่ยน Layout ได้โดยไม่ทำให้ผู้ใช้เข้าใจว่าได้เปลี่ยนเครือข่ายจริง
7. ต่อสายใหม่บนอุปกรณ์จริง สั่ง Re-collect และเห็นการเปลี่ยนแปลงพร้อมประวัติย้อนหลัง
