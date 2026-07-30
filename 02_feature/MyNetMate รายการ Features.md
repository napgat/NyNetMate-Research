
# 📋 MyNetMate รายการ Features 

> **โปรเจกต์:** MyNetMate — Application for Network Management and Configuration Automation  
> **รหัสโปรเจกต์:** CEPP68-33, KMITL  
> **วันที่รวบรวม:** 2026-07-22  
> **แหล่งข้อมูล:** เอกสารโปรเจกต์ 16 ไฟล์ + คลังความรู้จากหนังสือ 12 แหล่ง + Document Project / Teacher Feedback / UI Specs  

## 🏗️ ปรัชญาหลักของระบบ

> **"ใช้ AI เมื่อต้องการ'ความเข้าใจ   ไม่ใช้ AI เมื่อต้องการ ความถูกต้อง"**

| หลักการ             | รายละเอียด                                                                             |
| ------------------- | -------------------------------------------------------------------------------------- |
| **กฎทอง **          | "มีคำตอบถูกต้องเพียง 1 คำตอบหรือไม่?" → **ใช่** = ใช้ Template/Rule → **ไม่** = ใช้ AI |
| **อัตราส่วน 80/20** | 80% Template-driven + 20% AI-Powered                                                   |
## ขอบเขตของ Vendor 
* CISCO
* Huawei
* Microtik

# รายการ Features หลักและรายละเอียดทั้งหมดของระบบก่อน Weight

##  1. Authentication & Authorization (Non-AI)

| Feature                       | รายละเอียด                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| **Login Page**                | Username/Password Authentication                           |
| **JWT Token**                 | httpOnly Cookie, 8h Expiration                             |
| **Role-Based Access Control** | Admin (Full), Operator (Deploy/Config), Viewer (Read-only) |
| **Inline Error Handling**     | แสดง Error Message ที่ Login Page                          |

##  2. Dashboard & Monitoring (Non-AI)

| Feature                    | รายละเอียด                                                        |
| -------------------------- | ----------------------------------------------------------------- |
| **Metrics Cards**          | Total Devices, Online/Offline, Config Changes Today, CIS Failures |
| **Recent Activity Feed**   | 10 รายการล่าสุด (Deploy, Edit, Discovery)                         |
| **Quick Action Shortcuts** | ปุ่มลัดไปหน้า Config Builder, Device Add, AI Chat                 |
| **System API Status**      | แสดงสถานะ API/DB Connection                                       |

##  3. Device Inventory & Discovery Management (Non-AI)

### 3.1 Manual Device Management (Non-AI)
| Feature                      | รายละเอียด                                               |
| ---------------------------- | -------------------------------------------------------- |
| **Manual Device Entry**      | กรอก Hostname, IP, Vendor, Model, Credentials (SSH/SNMP) |
| **Running-Config Upload**    | อัปโหลดไฟล์ Config เข้าระบบ                              |
| **Device Status Monitoring** | แสดงสถานะ Online/Offline (ICMP Ping)                     |
| **Device CRUD**              | สร้าง/อ่าน/แก้ไข/ลบอุปกรณ์                               |
| **Device Grouping**          | จัดกลุ่มอุปกรณ์ตาม Site, Function, Vendor                |
### 3.2 Network Discovery (Non-AI)
| Feature                         | รายละเอียด                                  |
| ------------------------------- | ------------------------------------------- |
| **IP Range Ping Sweep**         | สแกน IP range ด้วย ICMP                     |
| **SNMP sysDescr Polling**       | ดึงข้อมูล Vendor/Model จาก SNMP MIB         |
| **LLDP/CDP Neighbor Discovery** | ค้นหาอุปกรณ์ข้างเคียงผ่าน Protocol          |
| **OS Fingerprinting**           | ระบุ OS Version จาก SSH Banner/SNMP         |
| **3-Stage Discovery Pipeline**  | Collection → Parsing → Enrichment & Storage |

### 3.3 Data Device Information
* รายละเอียดข้อมูลที่ต้องเก็บ [[Data Information]]

##  4.Network Topology Visualization (Non-AI)

| Feature                        | รายละเอียด                                    |
| ------------------------------ | --------------------------------------------- |
| **Interactive Canvas**         | Drag-and-drop device nodes บน Canvas          |
| **Device Icons**               | แสดง Icon ตามประเภท (Router/Switch/AP)        |
| **Manual Link Connection**     | ลากเส้นเชื่อมอุปกรณ์ พร้อม Port Labels        |
| **Right-Click Context Menu**   | คลิกขวาเพื่อ Edit/Delete/View Details         |
| **PNG Export**(ไม่เอา)         | ส่งออก Topology เป็นรูปภาพ                    |
| **Auto-Layout from Discovery** | จัดวาง Topology จากข้อมูล Discovery อัตโนมัติ |

##  5.Configuration Generation
### 5.1 Template-Based Configuration
| Feature                    | รายละเอียด                                                                        |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Form-to-CLI Rendering**  | ผู้ใช้กรอกฟอร์ม (VLAN, Interface, Routing) → Render เป็น CLI syntax แบบ Real-time |
| **Multi-Vendor Templates** | Template แยกตาม Vendor (Cisco IOS `.j2`, MikroTik `.j2`)                          |
#### รายละเอียดการ Config อะไรบ้าง และ Dependencies

| หมวด                      | ชื่อ Config          | Switch | Router | หมายเหตุ                                                        | Priority |
| ------------------------- | -------------------- | ------ | ------ | --------------------------------------------------------------- | -------- |
| System ,Service           | Hostname             | ✅      | ✅      |                                                                 |          |
|                           | LLDP/CDP             | ✅      | ✅      |                                                                 |          |
|                           | SNMP                 | ✅      | ✅      |                                                                 |          |
|                           | Banner               | ✅      | ✅      |                                                                 |          |
|                           | NTP                  | ✅      | ✅      |                                                                 |          |
|                           | SSH                  |        |        |                                                                 |          |
|                           | Telnet               |        |        |                                                                 |          |
| Interface                 | description          | ✅      | ✅      |                                                                 |          |
|                           | ip + subnetmask      | ✅      | ✅      |                                                                 |          |
|                           | enable/disable       | ✅      | ✅      |                                                                 |          |
|                           | switchport mode      | ✅      | ❌      | Access / Trunk                                                  |          |
| *                         | Subinterface         | ❌      | ✅      | Router-on-a-stick (inter-VLAN ผ่าน Router) ต้องใช้              |          |
| *                         | **Loopback**         | ❌      | ✅      | OSPF ต้องการ Loopback เป็น Router-ID ที่เสถียร                  |          |
| VLAN                      | สร้าง VLAN           | ✅      | ❌      |                                                                 |          |
| (มีการกำหนดที่ Interface) | SVI                  | ✅      | ❌      | Inter-VLAN Routing L3 Switch                                    |          |
| NAT                       | Static               | ❌      | ✅      |                                                                 |          |
| (มีการกำหนดที่ Interface) | Dynamic              | ❌      | ✅      |                                                                 |          |
|                           | PAT                  | ❌      | ✅      |                                                                 |          |
| Security                  | privileged pw        | ✅      | ✅      |                                                                 |          |
|                           | console              | ✅      | ✅      |                                                                 |          |
|                           | vty                  | ✅      | ✅      |                                                                 |          |
|                           | ssh                  | ✅      | ✅      |                                                                 |          |
|                           | encryption           | ✅      | ✅      | service password-encryption                                     |          |
|                           | **Port Security**    | ✅      | ❌      |                                                                 |          |
|                           | **Logging / Syslog** | ✅      | ✅      | ส่ง Log ไปยัง Syslog Server                                     |          |
| ACL                       | standard             | ✅      | ✅      |                                                                 |          |
| (มีการกำหนดที่ Interface) | extended             | ✅      | ✅      |                                                                 |          |
| Routing                   | Static               | ✅      | ✅      | L3 Switch ทำได้                                                 |          |
|                           | default              | ✅      | ✅      |                                                                 |          |
|                           | RIP                  | ✅      | ✅      | L3 Switch ทำได้                                                 |          |
|                           | OSPF                 | ✅      | ✅      | L3 Switch ทำได้                                                 |          |
| DHCP                      | pool                 | ✅      | ✅      |                                                                 |          |
|                           | excluded IP          | ✅      | ✅      |                                                                 |          |
|                           | Default router       | ✅      | ✅      |                                                                 |          |
|                           | DNS(Optional)        | ✅      | ✅      |                                                                 |          |
| *                         | **DHCP Relay**       | ❌      | ✅      |                                                                 |          |
| Switch                    | **`ip routing`**     | ✅      | ❌      | เปิดให้ L3 Switch ทำ Routing ได้ ถ้าไม่เปิด = Routing ไม่ทำงาน! |          |


### 5.2 AI-Powered Configuration

| Feature                                   | รายละเอียด                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| **Natural Language Config Gen**           | ผู้ใช้พิมพ์ภาษาธรรมชาติ เช่น "block telnet and harden SSH" → AI สร้าง Config |
| Chat AI                                   |                                                                              |
| **Complex Multi-Vendor Policy**           | นโยบายที่ต้องตัดสินใจหลายขั้น (เช่น ACL ข้ามอุปกรณ์)                         |
| **Legacy/Unsupported Device Fallback**    | อุปกรณ์ที่ไม่มี Template สำเร็จรูป → AI สร้าง Config จากความรู้              |
| **AI Config Review ("Ask AI to Review")** | ปุ่มให้ AI วิเคราะห์ Config ที่สร้างแล้ว ก่อน Deploy                         |
| **Automated Risk Assessment**             | AI จัดเกรดความเสี่ยง (HIGH/MEDIUM/LOW) พร้อมระบุจุดอ่อน                      |
| **MOP Generation**                        | สร้าง Method of Procedure (ขั้นตอนปฏิบัติงาน) อัตโนมัติ                      |
| **Auto-Documentation**                    | สร้างสรุปการเปลี่ยนแปลง Config เป็นภาษามนุษย์อ่านง่าย                        |
##  6. PII Sensitive Data Masking (Non-AI)
การรับประกัน:** ข้อมูลอ่อนไหว **ไม่ถูกส่งออกนอกระบบ** ทุกกรณี (100% Local Processing)

| Feature                   | รายละเอียด                                                          |
| ------------------------- | ------------------------------------------------------------------- |
| **Pre-API PII Filtering** | Mask ข้อมูลอ่อนไหวก่อนส่งไป Gemini API                              |
| **Masked Entities**       | IP Addresses, Passwords, SNMP Communities, Encryption Keys, Banners |
| **Local spaCy NLP Model** | ตรวจจับ PII ด้วย NLP model ที่รันในเครื่อง (ไม่ส่งข้อมูลออก)        |
| **Visual Masking Status** | Tooltip แสดงจุดที่ถูก Mask ใน Preview Panel                         |
| **Regex Pattern Editor**  | Admin แก้ไข Regex Pattern ได้ใน Settings                            |

##  7.Configuration Deployment  (Non-AI)
| Feature                       | รายละเอียด                                             |
| ----------------------------- | ------------------------------------------------------ |
| **SSH Command Push**          | ส่ง CLI commands ไปยังอุปกรณ์ผ่าน SSH                  |
| **Write Memory**              | บันทึก Config ลง Startup-config หลัง Deploy            |
| **Idempotency Check**         | ตรวจสอบก่อน Push — ถ้า Config ตรงอยู่แล้ว ไม่ Push ซ้ำ |
| **Plan → Apply Workflow**     | แสดง Preview/Diff ก่อน Deploy → ให้ Engineer กดยืนยัน  |
| **Multi-Device Batch Deploy** | Deploy ไปหลายอุปกรณ์พร้อมกัน                           |
| **Real-time Deploy Logs**     | แสดง Log การ Deploy แบบ Real-time                      |
##  8.Security Compliance & Validation (Non-AI — 100% Deterministic)

### 8.1 CIS Benchmark Scanning (24 Rules)

| #   | กฎตัวอย่าง                               | Severity |
| --- | ---------------------------------------- | -------- |
| 1   | `enable secret` ต้องตั้งค่า              | Critical |
| 2   | `service password-encryption` ต้องเปิด   | Critical |
| 3   | `ip ssh version 2` ต้องบังคับ            | Critical |
| 4   | Telnet ต้องปิด (`transport input ssh`)   | Critical |
| 5   | `ip http server` ต้องปิด                 | Warning  |
| 6   | SNMP Community String ห้ามใช้ค่า Default | Warning  |
| 7   | VTY Line ต้องมี `access-class`           | Warning  |
| 8   | STP ต้องเปิดใช้งาน                       | Warning  |
| ... | (รวม 24 กฎ)                              | —        |

| Feature                    | รายละเอียด                                                            |
| -------------------------- | --------------------------------------------------------------------- |
| **Automated 24-Rule Scan** | ตรวจ Config ทุกครั้งก่อน Deploy                                       |
| **Three-Tier Severity**    | Critical (บล็อก Deploy), Warning (dismiss ได้ + ต้องกรอกเหตุผล), Info |
| **MikroTik Hardening**     | Custom Checklist สำหรับ RouterOS                                      |
| **Compliance Dashboard**   | แสดง Pass/Fail ของแต่ละกฎ                                             |



### 8.2 Impact Analysis (24 Rules)

| Feature                         | รายละเอียด                                        |
| ------------------------------- | ------------------------------------------------- |
| **Cross-Device Impact Preview** | ประเมินผลกระทบข้ามอุปกรณ์ก่อน Deploy              |
| **Dependency Warning**          | แจ้งเตือนเมื่อ Config กระทบ Link/VLAN ข้ามอุปกรณ์ |


##  9.Version Control & Audit Trail (Non-AI)

| Feature                    | รายละเอียด                                                |
| -------------------------- | --------------------------------------------------------- |
| **Pre-Deploy Snapshot**    | SSH ดึง `show running-config` ก่อน Push Config            |
| **Post-Deploy Snapshot**   | SSH ดึง Config หลัง Push สำเร็จ                           |
| **Manual SSH Pull**        | Admin กดดึง Config เมื่อต้องการ (จับ Out-of-Band changes) |
| **Side-by-Side Diff**      | เปรียบเทียบ Config 2 เวอร์ชันแบบ Split Panel              |
| **Unified Diff**           | Diff แบบรวมบรรทัด (+/-)                                   |
| **One-Click Rollback**     | กดปุ่มคืนค่า Config กลับไปเวอร์ชันก่อนหน้า                |
| **Auto-Rollback on Error** | Deploy ล้มเหลว → Rollback อัตโนมัติ                       |
| **Audit Trail**            | บันทึก Who/When/What ทุกการเปลี่ยนแปลง                    |
| **CIS Override Logging**   | บันทึกเหตุผลเมื่อ Dismiss Warning                         |

## 10. AI Architecture
### 10.1 RAG (Retrieval-Augmented Generation)

| Component             | รายละเอียด                                                   |
| --------------------- | ------------------------------------------------------------ |
| **Vector Database**   | เก็บ Vendor Documentation ในรูป Embedding                    |
| **Embedding Model**   | แปลงข้อความเป็น Vector                                       |
| **Document Sources**  | Cisco IOS Command Reference, MikroTik Wiki, CIS Benchmarks   |
| **Context Retrieval** | ค้นหา Document ที่เกี่ยวข้องกับ Prompt ของ User              |
| **Evaluation Metric** | RAG ใช้ **F2 Score** (เน้น Recall), AI ใช้ **F1/F0.5 Score** |

### 10.2 Dynamic System Prompt Engineering

| Component                    | รายละเอียด                                                  |
| ---------------------------- | ----------------------------------------------------------- |
| **Device Context Injection** | ดึง Vendor/Model/OS จาก DB → ฉีดเข้า System Prompt          |
| **Persona Setting**          | กำหนด Role: "คุณคือ MyNetMate AI Network Co-Pilot..."       |
| **Structured Output**        | บังคับ AI ตอบเป็น JSON Schema → `json.loads()`              |
| **Token Optimization**       | ส่งเฉพาะ Delta/Relevant context ไม่ส่ง Full 500-line config |

### 10.3 Intent Detection & Task Routing

| Step | การทำงาน | เครื่องมือ Implementation |
|------|---------|--------------------------|
| **Step 1** | Detect Intent & Extract Target Device | Keyword Scanning / Gemini Classification |
| **Step 2** | Fetch Device Context & Topology from DB | SQLAlchemy Query |
| **Step 3** | Inject Context into Prompt & Query LLM | Dynamic Prompt Builder |
| **Step 4** | Validate, Save Response & Render UI | Pydantic + PostgreSQL + React |

### 10.4 Safety Guardrails

| กฎ                     | รายละเอียด                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Human-in-the-Loop**  | AI แนะนำ Action เท่านั้น ห้าม Execute Config โดยตรง                      |
| **AI Config Flagging** | ทุก Config จาก AI ติด Label: `⚠️ AI-generated, review required`          |
| **PII Pre-Filter**     | Mask ข้อมูลอ่อนไหว 100% ก่อนส่ง API                                      |
| **Security Gate**      | Config ต้องผ่าน CIS 24-Rule ก่อน Deploy (ไม่ว่าจะมาจาก AI หรือ Template) |

## 11.Settings & Administration (Non-AI)

| Feature                     | รายละเอียด                                   |
| --------------------------- | -------------------------------------------- |
| **Gemini API Key Config**   | ตั้งค่า API Key, Model Selection (Flash/Pro) |
| **Token Budget**            | กำหนดงบ Token ต่อเดือน                       |
| **Offline Mode**            | ปิด AI → ใช้ 100% Template Fallback          |
| **User Management**         | 3 Roles: Admin / Operator / Viewer           |
| **CIS Rule Toggles**        | เปิด/ปิดกฎ CIS แต่ละข้อ                      |
| **Jinja2 Template Manager** | เพิ่ม/แก้ไข/ลบ Template                      |
| **PII Regex Editor**        | แก้ไข Regex Pattern สำหรับ Masking           |




# 📚  แหล่งอ้างอิงที่ใช้ในการรวบรวม

## เอกสารโปรเจกต์ (16 ไฟล์)

| #   | ไฟล์                               | เนื้อหาหลัก                        |
| --- | ---------------------------------- | ---------------------------------- |
| 1   | System Diagram.md                  | สถาปัตยกรรม 8 ส่วน                 |
| 2   | การตัดสินใจ ใช้ AI vs ไม่ใช้ AI.md | Decision Framework 12 ฟังก์ชัน     |
| 3   | CEPP68-33 Proposal.md              | ข้อเสนอโปรเจกต์ ข้อกำหนดเชิงปริมาณ |
| 4   | จากภาพพี่ออม.md                    | Mockup UI 6 แท็บ                   |
| 5   | อ่านเนื้อหาเชิงลึก AII&CG.md       | AI Integration & Config Gen        |
| 6   | อ่านเนื้อหาเชิงลึก ND.md           | Network Discovery Pipeline         |
| 7   | อ่านเนื้อหาเชิงลึก SA&PV.md        | Security Automation 24 Rules       |
| 8   | อ่านเนื้อหาเชิงลึก SD&MVA.md       | Script-Driven Multi-Vendor         |
| 9   | อ่านเนื้อหาเชิงลึก SL.md           | Software Layer Architecture        |
| 10  | เหตุผลเชิงลึกตามเครือง.md          | Tool Selection Matrix              |
| 11  | NPA_Netmiko.md                     | Netmiko SSH Library Guide          |
| 12  | Netdisco.md                        | Open-source NMS Reference          |
| 13  | SolarWinds.md                      | Commercial NMS Comparison          |
| 14  | Microsoft Presidio.md              | PII Masking Library                |
| 15  | Config C2960 VLAN.md               | Cisco VLAN Reference               |
| 16  | YANG MODEL.md                      | Data Modeling Standard             |

## คลังความรู้จากหนังสือ (12 แหล่ง)

| #   | แหล่ง                      | เนื้อหาหลัก                                 | การนำไปใช้                        |
| --- | -------------------------- | ------------------------------------------- | --------------------------------- |
| 1   | NPA2e Ch.2                 | Network Automation Fundamentals             | หลักการ Pre/Post Validation       |
| 2   | NPA2e Ch.8                 | Data Formats & Models                       | Pydantic Validation, JSON/YAML    |
| 3   | NPA2e Ch.9                 | Jinja2 Templates                            | Core Config Gen Engine            |
| 4   | NPA2e Ch.10                | Network APIs + Netmiko + TextFSM            | Data Collection Pipeline          |
| 5   | NPA2e Ch.12                | Automation Tools (Ansible/Nornir/Terraform) | Idempotency, Multithreading       |
| 6   | NPA2e Ch.14                | NAA Architecture                            | System Architecture Blueprint     |
| 7   | AI Cookbook Ch.5           | LangChain for Networking                    | Prompt Templates, Agents          |
| 8   | AI Cookbook Ch.7           | Building AI LLM Backend                     | FastAPI + Pydantic Blueprint      |
| 9   | AI Cookbook Ch.8           | Building Network Co-Pilot                   | RAG Architecture, Impact Analysis |
| 10  | AI_Networking_Cookbook_TOC | ภาพรวม AI Recipes ทั้งหมด                   | AI Development Roadmap            |
| 11  | หัวข้อที่อ่าน.md           | Priority Reading Roadmap                    | ลำดับความสำคัญ                    |
| 12  | prompt อ่านหนังสือ.md      | Project Philosophy & Context                | ปรัชญาโปรเจกต์                    |

---

*เอกสารนี้รวบรวมจากเอกสาร 28+ แหล่งข้อมูลโดย Antigravity AI | วันที่: 2026-07-22*



# ประเมิน Feature List ตามความเป็นจริงของ CE Project

### ปัจจัยที่ใช้ในการ Weight

ก่อนไปดู Feature ต้องเข้าใจ **3 ข้อจำกัดหลัก** ของโปรเจกต์ CEPP ก่อน:

| ข้อจำกัด            | รายละเอียด                                 |
| ------------------- | ------------------------------------------ |
| **เวลา**            | ~1 semester                                |
| **Tech Complexity** | Backend  + Frontend  + Network Device จริง |
| **ความเสี่ยง**      | Config ผิด = อุปกรณ์จริงพัง                |
| จำนวนคน (นักศึกษา)  | 4 คน                                       |
| ของที่ต้องส่ง       | Thesis                                     |
|                     |                                            |

