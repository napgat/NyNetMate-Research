# 📋 MyNetMate — รายการ Features & Tools ทั้งระบบ (Comprehensive)
> **โปรเจกต์:** MyNetMate — Application for Network Management and Configuration Automation  
> **รหัสโปรเจกต์:** CEPP68-33, KMITL  
> **วันที่รวบรวม:** 2026-07-22  
> **แหล่งข้อมูล:** เอกสารโปรเจกต์ 16 ไฟล์ + คลังความรู้จากหนังสือ 12 แหล่ง + Document Project / Teacher Feedback / UI Specs  

---

## 🏗️ ปรัชญาหลักของระบบ

> **"ใช้ AI เมื่อต้องการ 'ความเข้าใจ' — ไม่ใช้ AI เมื่อต้องการ 'ความถูกต้อง'"**

| หลักการ | รายละเอียด |
|---------|-----------|
| **กฎทอง (Golden Rule)** | "มีคำตอบถูกต้องเพียง 1 คำตอบหรือไม่?" → **ใช่** = ใช้ Template/Rule → **ไม่** = ใช้ AI |
| **อัตราส่วน 80/20** | 80% Template-driven (Jinja2) + 20% AI-Powered (Gemini + RAG) |
| **ขอบเขต Vendor (Phase 1)** | Cisco IOS (100% Priority) + MikroTik RouterOS v7 |
| **ขอบเขต Vendor (Phase 2)** | Huawei VRP (เลื่อนออกไป), Firewall = **ตัดทิ้ง** |

---

# 📦 ส่วนที่ 1 — รายการ Features ทั้งหมดของระบบ

---

## 1. 🔧 Hybrid Configuration Generation (Core Feature)

> **หลักการ:** ใช้ Jinja2 Templates สำหรับ Deterministic Config + AI สำหรับ Situational Logic

### 1.1 Template-Based Configuration (80% — Non-AI)

| Feature                            | รายละเอียด                                                                        | เครื่องมือ Implementation                        |
| ---------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Form-to-CLI Rendering**          | ผู้ใช้กรอกฟอร์ม (VLAN, Interface, Routing) → Render เป็น CLI syntax แบบ Real-time | Jinja2 + React State                             |
| **Multi-Vendor Templates**         | Template แยกตาม Vendor (Cisco IOS `.j2`, MikroTik `.j2`)                          | Jinja2 Template Inheritance (`extends`, `block`) |
| **VLAN Configuration**             | สร้าง/แก้ไข VLAN ID, Name, Access/Trunk Mode, Native VLAN                         | Jinja2 Loops + Conditionals                      |
| **Interface Configuration**        | ตั้งค่า IP Address, Subnet Mask, Description, Shutdown/No Shutdown                | Jinja2 + Pydantic Validation                     |
| **SVI (Switch Virtual Interface)** | สร้าง Interface VLAN สำหรับ Layer 3 Routing                                       | Jinja2 Template                                  |
| **Static Routing**                 | เพิ่ม/ลบ Static Route, Default Route                                              | Jinja2 Template                                  |
| **OSPF Configuration**             | ตั้งค่า OSPF Process ID, Network Statements, Area                                 | Jinja2 Template                                  |
| **ACL (Access Control List)**      | สร้าง Standard/Extended ACL                                                       | Jinja2 Template                                  |
| **Services (Toggle)**              | เปิด/ปิด Services: SSH, Telnet, HTTP Server, SNMP, NTP, Logging                   | Jinja2 + CIS Default Commands                    |
| **Banner Configuration**           | ตั้งค่า MOTD Banner, Login Banner                                                 | Jinja2 Template                                  |
| **Port Security**                  | Sticky MAC, Maximum MAC, Violation Mode                                           | Jinja2 Template                                  |
| **Spanning Tree**                  | STP Mode (PVST/Rapid-PVST), Root Bridge Priority                                  | Jinja2 Template                                  |
|                                    |                                                                                   |                                                  |

**วิธีทำงาน:**
```
User Form Input (React) 
  → FastAPI receives JSON 
  → Jinja2 renders CLI text 
  → Real-time preview in UI (ไม่ต้องรอ AI)
```

### 1.2 AI-Powered Configuration (20% — Gemini + RAG)

| Feature                                   | รายละเอียด                                                                   | เครื่องมือ Implementation          |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| **Natural Language Config Gen**           | ผู้ใช้พิมพ์ภาษาธรรมชาติ เช่น "block telnet and harden SSH" → AI สร้าง Config | Gemini API + Dynamic System Prompt |
| **Complex Multi-Vendor Policy**           | นโยบายที่ต้องตัดสินใจหลายขั้น (เช่น ACL ข้ามอุปกรณ์)                         | RAG (Vector DB + Vendor Docs)      |
| **Legacy/Unsupported Device Fallback**    | อุปกรณ์ที่ไม่มี Template สำเร็จรูป → AI สร้าง Config จากความรู้              | Gemini Pro + Context Injection     |
| **AI Config Review ("Ask AI to Review")** | ปุ่มให้ AI วิเคราะห์ Config ที่สร้างแล้ว ก่อน Deploy                         | Gemini API (On-demand, ไม่ Auto)   |
| **Automated Risk Assessment**             | AI จัดเกรดความเสี่ยง (HIGH/MEDIUM/LOW) พร้อมระบุจุดอ่อน                      | Gemini + Prompt Template           |
| **MOP Generation**                        | สร้าง Method of Procedure (ขั้นตอนปฏิบัติงาน) อัตโนมัติ                      | Gemini + Structured Output         |
| **Auto-Documentation**                    | สร้างสรุปการเปลี่ยนแปลง Config เป็นภาษามนุษย์อ่านง่าย                        | Gemini API                         |

**วิธีทำงาน:**
```
User NL Prompt (React)
  → FastAPI detects Intent
  → Presidio masks PII locally
  → FastAPI injects Device Context from PostgreSQL
  → Gemini API receives anonymized prompt + context
  → Response flagged: "⚠️ AI-generated — Review before deploy"
```

---

## 2. 📡 Device Inventory & Discovery Management

### 2.1 Manual Device Management (Non-AI)

| Feature                      | รายละเอียด                                               | เครื่องมือ Implementation         |
| ---------------------------- | -------------------------------------------------------- | --------------------------------- |
| **Manual Device Entry**      | กรอก Hostname, IP, Vendor, Model, Credentials (SSH/SNMP) | React Form + FastAPI + PostgreSQL |
| **Running-Config Upload**    | อัปโหลดไฟล์ Config เข้าระบบ                              | FastAPI File Upload + PostgreSQL  |
| **Device Status Monitoring** | แสดงสถานะ Online/Offline (ICMP Ping)                     | Python `ping` + WebSocket Push    |
| **Device CRUD**              | สร้าง/อ่าน/แก้ไข/ลบอุปกรณ์                               | FastAPI REST API + SQLAlchemy ORM |
| **Device Grouping**          | จัดกลุ่มอุปกรณ์ตาม Site, Function, Vendor                | PostgreSQL Relations              |

### 2.2 Network Discovery (Non-AI)

| Feature                         | รายละเอียด                                  | เครื่องมือ Implementation                             |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------------- |
| **IP Range Ping Sweep**         | สแกน IP range ด้วย ICMP                     | Python `ping` / `asyncio`                             |
| **SNMP sysDescr Polling**       | ดึงข้อมูล Vendor/Model จาก SNMP MIB         | Python `pysnmp`                                       |
| **LLDP/CDP Neighbor Discovery** | ค้นหาอุปกรณ์ข้างเคียงผ่าน Protocol          | Netmiko `show lldp neighbors` + TextFSM               |
| **OS Fingerprinting**           | ระบุ OS Version จาก SSH Banner/SNMP         | Netmiko + Regex                                       |
| **3-Stage Discovery Pipeline**  | Collection → Parsing → Enrichment & Storage | RESTCONF/NETCONF/Netmiko → Genie/TextFSM → SQLAlchemy |

**วิธีทำงาน:**
```
Discovery Trigger (React UI)
  → FastAPI launches async scan
  → Ping Sweep (ICMP) → SNMP Poll → LLDP/CDP Parse
  → TextFSM/Genie parses CLI output to JSON
  → SQLAlchemy stores to PostgreSQL
  → WebSocket pushes results to React UI
```

---

## 3. 🗺️ Network Topology Visualization (Non-AI)

| Feature                        | รายละเอียด                                    | เครื่องมือ Implementation              |
| ------------------------------ | --------------------------------------------- | -------------------------------------- |
| **Interactive Canvas**         | Drag-and-drop device nodes บน Canvas          | React + Canvas/SVG Library             |
| **Device Icons**               | แสดง Icon ตามประเภท (Router/Switch/AP)        | SVG Icons + Tabler Icons               |
| **Manual Link Connection**     | ลากเส้นเชื่อมอุปกรณ์ พร้อม Port Labels        | React Canvas                           |
| **Right-Click Context Menu**   | คลิกขวาเพื่อ Edit/Delete/View Details         | React Context Menu                     |
| **PNG Export**(ไม่เอา)         | ส่งออก Topology เป็นรูปภาพ                    | Canvas `toDataURL()`                   |
| **Auto-Layout from Discovery** | จัดวาง Topology จากข้อมูล Discovery อัตโนมัติ | LLDP/CDP Data → Graph Layout Algorithm |

---

## 4. 🛡️ Security Compliance & Validation (Non-AI — 100% Deterministic)

### 4.1 CIS Benchmark Scanning (24 Rules)

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

| Feature | รายละเอียด | เครื่องมือ Implementation |
|---------|-----------|--------------------------|
| **Automated 24-Rule Scan** | ตรวจ Config ทุกครั้งก่อน Deploy | `ciscoconfparse` + Python Regex |
| **Three-Tier Severity** | Critical (บล็อก Deploy), Warning (dismiss ได้ + ต้องกรอกเหตุผล), Info | Rule Engine Logic |
| **MikroTik Hardening** | Custom Checklist สำหรับ RouterOS | Custom Rule Engine |
| **Compliance Dashboard** | แสดง Pass/Fail ของแต่ละกฎ | React Split Panel |

### 4.2 Impact Analysis (AI-Assisted)

| Feature | รายละเอียด | เครื่องมือ Implementation |
|---------|-----------|--------------------------|
| **Cross-Device Impact Preview** | ประเมินผลกระทบข้ามอุปกรณ์ก่อน Deploy | Gemini + Topology Context from DB |
| **Dependency Warning** | แจ้งเตือนเมื่อ Config กระทบ Link/VLAN ข้ามอุปกรณ์ | PostgreSQL Topology Relations |

---

## 5. 🔒 PII / Sensitive Data Masking (Non-AI — 100% Local)

| Feature | รายละเอียด | เครื่องมือ Implementation |
|---------|-----------|--------------------------|
| **Pre-API PII Filtering** | Mask ข้อมูลอ่อนไหวก่อนส่งไป Gemini API | Microsoft Presidio + Custom Regex |
| **Masked Entities** | IP Addresses, Passwords, SNMP Communities, Encryption Keys, Banners | `presidio-analyzer` + `presidio-anonymizer` |
| **Local spaCy NLP Model** | ตรวจจับ PII ด้วย NLP model ที่รันในเครื่อง (ไม่ส่งข้อมูลออก) | spaCy NLP (Local) |
| **Visual Masking Status** | Tooltip แสดงจุดที่ถูก Mask ใน Preview Panel | React UI Highlighting |
| **Regex Pattern Editor** | Admin แก้ไข Regex Pattern ได้ใน Settings | React Settings Page (P7) |

**การรับประกัน:** ข้อมูลอ่อนไหว **ไม่ถูกส่งออกนอกระบบ** ทุกกรณี (100% Local Processing)

---

## 6. 📜 Version Control & Audit Trail (Non-AI)

| Feature                    | รายละเอียด                                                | เครื่องมือ Implementation                     |
| -------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| **Pre-Deploy Snapshot**    | SSH ดึง `show running-config` ก่อน Push Config            | Netmiko → PostgreSQL (`source='pre_deploy'`)  |
| **Post-Deploy Snapshot**   | SSH ดึง Config หลัง Push สำเร็จ                           | Netmiko → PostgreSQL (`source='post_deploy'`) |
| **Manual SSH Pull**        | Admin กดดึง Config เมื่อต้องการ (จับ Out-of-Band changes) | Netmiko → PostgreSQL (`source='manual'`)      |
| **Side-by-Side Diff**      | เปรียบเทียบ Config 2 เวอร์ชันแบบ Split Panel              | Myers Diff Algorithm + React                  |
| **Unified Diff**           | Diff แบบรวมบรรทัด (+/-)                                   | Myers Diff Algorithm                          |
| **One-Click Rollback**     | กดปุ่มคืนค่า Config กลับไปเวอร์ชันก่อนหน้า                | Netmiko Push `pre_deploy` snapshot            |
| **Auto-Rollback on Error** | Deploy ล้มเหลว → Rollback อัตโนมัติ                       | FastAPI Error Handler + Netmiko               |
| **Audit Trail**            | บันทึก Who/When/What ทุกการเปลี่ยนแปลง                    | PostgreSQL Audit Log                          |
| **CIS Override Logging**   | บันทึกเหตุผลเมื่อ Dismiss Warning                         | PostgreSQL + React Form                       |

**Database Schema:**
```sql
CREATE TABLE config_snapshots (
    id              SERIAL PRIMARY KEY,
    device_id       INTEGER REFERENCES devices(id),
    config_text     TEXT NOT NULL,
    version_number  INTEGER NOT NULL,
    source          VARCHAR(20) NOT NULL,  -- 'pre_deploy' | 'post_deploy' | 'manual'
    created_by      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW(),
    note            TEXT
);
```

---

## 7. 🚀 Configuration Deployment & Execution (Non-AI)

| Feature                       | รายละเอียด                                             | เครื่องมือ Implementation        |
| ----------------------------- | ------------------------------------------------------ | -------------------------------- |
| **SSH Command Push**          | ส่ง CLI commands ไปยังอุปกรณ์ผ่าน SSH                  | Netmiko `send_config_set()`      |
| **Write Memory**              | บันทึก Config ลง Startup-config หลัง Deploy            | Netmiko `save_config()`          |
| **Idempotency Check**         | ตรวจสอบก่อน Push — ถ้า Config ตรงอยู่แล้ว ไม่ Push ซ้ำ | Diff Compare (Current vs Target) |
| **Plan → Apply Workflow**     | แสดง Preview/Diff ก่อน Deploy → ให้ Engineer กดยืนยัน  | React Review Page (P5)           |
| **Multi-Device Batch Deploy** | Deploy ไปหลายอุปกรณ์พร้อมกัน                           | Python `asyncio` / Thread Pool   |
| **Real-time Deploy Logs**     | แสดง Log การ Deploy แบบ Real-time                      | WebSocket + React Terminal       |

**Execution Pipeline (9 ขั้นตอน):**
```
1. Input     → User fills Form or AI Prompt
2. Render    → Jinja2 generates CLI text
3. PII Mask  → Presidio masks sensitive data (if AI path)
4. AI Gen    → Gemini API (if applicable)
5. Security  → CIS 24-Rule Scan — Critical fail = BLOCK
6. Preview   → User reviews in Split Panel (P5)
7. Pre-Snap  → SSH → show running-config → Save DB
8. Deploy    → Netmiko pushes CLI → write memory
9. Post-Snap → SSH → Save DB — On Error: Auto-Rollback
```

---

## 8. 🤖 AI Co-Pilot Architecture

### 8.1 RAG (Retrieval-Augmented Generation)

| Component | รายละเอียด | เครื่องมือ Implementation |
|-----------|-----------|--------------------------|
| **Vector Database** | เก็บ Vendor Documentation ในรูป Embedding | Pinecone / ChromaDB / FAISS |
| **Embedding Model** | แปลงข้อความเป็น Vector | Google `text-embedding-004` |
| **Document Sources** | Cisco IOS Command Reference, MikroTik Wiki, CIS Benchmarks | PDF → Chunking → Embedding |
| **Context Retrieval** | ค้นหา Document ที่เกี่ยวข้องกับ Prompt ของ User | LangChain / LlamaIndex |
| **Evaluation Metric** | RAG ใช้ **F2 Score** (เน้น Recall), AI ใช้ **F1/F0.5 Score** | Custom Evaluation Pipeline |

### 8.2 Dynamic System Prompt Engineering

| Component | รายละเอียด | เครื่องมือ Implementation |
|-----------|-----------|--------------------------|
| **Device Context Injection** | ดึง Vendor/Model/OS จาก DB → ฉีดเข้า System Prompt | FastAPI + SQLAlchemy |
| **Persona Setting** | กำหนด Role: "คุณคือ MyNetMate AI Network Co-Pilot..." | System Prompt Template |
| **Structured Output** | บังคับ AI ตอบเป็น JSON Schema → `json.loads()` | Gemini API + Pydantic Validation |
| **Token Optimization** | ส่งเฉพาะ Delta/Relevant context ไม่ส่ง Full 500-line config | Prompt Engineering |

### 8.3 Intent Detection & Task Routing

| Step | การทำงาน | เครื่องมือ Implementation |
|------|---------|--------------------------|
| **Step 1** | Detect Intent & Extract Target Device | Keyword Scanning / Gemini Classification |
| **Step 2** | Fetch Device Context & Topology from DB | SQLAlchemy Query |
| **Step 3** | Inject Context into Prompt & Query LLM | Dynamic Prompt Builder |
| **Step 4** | Validate, Save Response & Render UI | Pydantic + PostgreSQL + React |

### 8.4 Safety Guardrails

| กฎ                     | รายละเอียด                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Human-in-the-Loop**  | AI แนะนำ Action เท่านั้น ห้าม Execute Config โดยตรง                      |
| **AI Config Flagging** | ทุก Config จาก AI ติด Label: `⚠️ AI-generated, review required`          |
| **PII Pre-Filter**     | Mask ข้อมูลอ่อนไหว 100% ก่อนส่ง API                                      |
| **Security Gate**      | Config ต้องผ่าน CIS 24-Rule ก่อน Deploy (ไม่ว่าจะมาจาก AI หรือ Template) |

---

## 9. 📊 Dashboard & Monitoring (Non-AI)

| Feature | รายละเอียด | เครื่องมือ Implementation |
|---------|-----------|--------------------------|
| **Metrics Cards** | Total Devices, Online/Offline, Config Changes Today, CIS Failures | React Cards + FastAPI Stats API |
| **Recent Activity Feed** | 10 รายการล่าสุด (Deploy, Edit, Discovery) | PostgreSQL Audit Log + React |
| **Quick Action Shortcuts** | ปุ่มลัดไปหน้า Config Builder, Device Add, AI Chat | React Navigation |
| **System API Status** | แสดงสถานะ API/DB Connection | FastAPI Health Check Endpoint |

---

## 10. ⚙️ Settings & Administration (Non-AI)

| Feature                     | รายละเอียด                                   | เครื่องมือ Implementation       |
| --------------------------- | -------------------------------------------- | ------------------------------- |
| **Gemini API Key Config**   | ตั้งค่า API Key, Model Selection (Flash/Pro) | React Settings Form             |
| **Token Budget**            | กำหนดงบ Token ต่อเดือน                       | Backend Counter                 |
| **Offline Mode**            | ปิด AI → ใช้ 100% Template Fallback          | Feature Flag                    |
| **User Management**         | 3 Roles: Admin / Operator / Viewer           | JWT Authentication + PostgreSQL |
| **CIS Rule Toggles**        | เปิด/ปิดกฎ CIS แต่ละข้อ                      | React Toggles + DB              |
| **Jinja2 Template Manager** | เพิ่ม/แก้ไข/ลบ Template                      | File Manager + DB               |
| **PII Regex Editor**        | แก้ไข Regex Pattern สำหรับ Masking           | React Code Editor               |

---

## 11. 🔐 Authentication & Authorization (Non-AI)

| Feature | รายละเอียด | เครื่องมือ Implementation |
|---------|-----------|--------------------------|
| **Login Page** | Username/Password Authentication | React Form + FastAPI |
| **JWT Token** | httpOnly Cookie, 8h Expiration | Python `python-jose` / `PyJWT` |
| **Role-Based Access Control** | Admin (Full), Operator (Deploy/Config), Viewer (Read-only) | FastAPI Dependency Injection |
| **Inline Error Handling** | แสดง Error Message ที่ Login Page | React State |

---

## 12. 💰 Subscription Model (Open Core)

| Edition | Features |
|---------|----------|
| **Standard (Free/Open Source)** | Unlimited Local Inventory, Jinja2 Template Gen, Trial AI (Limited), Basic Syntax Validation, Local Version Control, SSH Deployment, BYOK (Bring Your Own Key) |
| **Professional (Paid Annual)** | Cloud RAG (Vendor Docs), Server-side Version Control, Full CIS Benchmark, AI Audit Reports, Priority Support |

---

# 🛠️ ส่วนที่ 2 — เครื่องมือและ Technology Stack ทั้งระบบ

---

## Frontend Stack

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **React 18** | UI Framework | Component-Based, CSR |
| **TypeScript** | Type Safety | ลดบัก, Auto-complete |
| **Tailwind CSS** | Styling | Utility-first CSS |
| **TanStack Router** | Client-Side Routing | Type-safe Routing |
| **TanStack Query** | Server State Management | Cache, Refetch, Optimistic Updates |
| **Zustand** | Client State Management | Lightweight, ไม่ Boilerplate |
| **Tabler Icons** | Icon Library | Network Device Icons |

## Backend Stack

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **Python 3.11+** | Core Language | `async/await` for I/O |
| **FastAPI** | Web Framework | REST API + WebSocket + Swagger `/docs` |
| **Pydantic** | Data Validation | Request/Response Schema |
| **SQLAlchemy** | ORM | PostgreSQL Integration |
| **Uvicorn** | ASGI Server | Runs FastAPI |
| **Jinja2** | Template Engine | Config Generation |

## Network Automation Libraries

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **Netmiko** | SSH Automation | `send_command()`, `send_config_set()`, Multi-vendor |
| **TextFSM / NTC Templates** | CLI Parsing | Unstructured → Structured JSON (`use_textfsm=True`) |
| **ciscoconfparse** | Config Parsing | CIS Benchmark Rule Checking |
| **Paramiko** | SSH (Low-level) | Netmiko ใช้ภายใน |
| **PyYAML** | YAML Parsing | Config/Data Files |
| **Requests** | HTTP Client | REST API Calls, Gemini API |

## AI & Security Stack

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **Google Gemini API** | LLM Provider | Flash (เร็ว/ถูก) + Pro (ฉลาด/แพง) |
| **LangChain** | AI Orchestration | PromptTemplate, Chains, Agents |
| **Pinecone / ChromaDB / FAISS** | Vector Database | RAG Document Storage |
| **Google `text-embedding-004`** | Embedding Model | Text → Vector |
| **Microsoft Presidio** | PII Masking | 100% Local, Pre-API Filter |
| **spaCy** | NLP Model (Local) | Named Entity Recognition |

## Database & Infrastructure

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **PostgreSQL 15+** | Production Database | SQL:2011 System-Versioned Tables |
| **SQLite** | Dev/Test Database | Lightweight |
| **Docker** | Containerization | Dev + Production |
| **Docker Compose** | Multi-Container Orchestration | Backend + DB + Frontend |
| **ContainerLab** | Network Simulation | Cisco IOS + MikroTik Topology Testing |
| **GitHub Actions** | CI/CD | Automated Testing + Deployment |
| **Git** | Version Control | Source Code Management |

## Testing Stack

| เครื่องมือ | หน้าที่ | หมายเหตุ |
|-----------|--------|----------|
| **Jest** | Frontend Unit Tests | React Component Testing |
| **Pytest** | Backend Unit Tests | FastAPI Route + Logic Testing |
| **ContainerLab** | Integration Tests | Real Network Topology Simulation |

---

# 📐 ส่วนที่ 3 — AI vs Non-AI Decision Matrix

| ฟังก์ชัน | ใช้ AI? | เหตุผล | เครื่องมือ |
|---------|---------|--------|-----------|
| Form-to-CLI Config Generation | ❌ Non-AI | มีคำตอบถูกต้องเพียง 1 (Deterministic) | Jinja2 Templates |
| Natural Language Config Gen | ✅ AI | ไม่มีคำตอบเดียว, ต้องตีความ | Gemini API + RAG |
| CIS Security Validation (24 Rules) | ❌ Non-AI | กฎตายตัว, ต้องการ 100% Precision | `ciscoconfparse` + Regex |
| Holistic Security Audit | ✅ AI | ต้องวิเคราะห์ภาพรวม, ไม่มีกฎตายตัว | Gemini API + Config Context |
| PII / Sensitive Data Masking | ❌ Non-AI | ต้องรับประกัน 100% Local, ไม่รั่ว | Microsoft Presidio (Local) |
| Config Diff | ❌ Non-AI | Algorithm แน่นอน | Myers Diff Algorithm |
| Network Discovery | ❌ Non-AI | ใช้ Protocol (SNMP, LLDP, ICMP) | Netmiko + pysnmp |
| SSH Deployment | ❌ Non-AI | ส่ง CLI ตรงๆ ผ่าน SSH | Netmiko |
| Vendor Docs RAG Lookup | ✅ AI | ค้นหาข้อมูลจาก Knowledge Base | LangChain + Vector DB |
| Auto-Documentation | ✅ AI | ต้องสรุปเป็นภาษามนุษย์ | Gemini API |
| NL-to-SQL History Queries | ✅ AI | แปลภาษาธรรมชาติเป็น SQL | Gemini API |
| Impact Analysis (Cross-Device) | ✅ AI | ต้องวิเคราะห์ Topology + ผลกระทบ | Gemini + Topology Context |
| Intent Detection | ✅ AI | จำแนกเจตนาผู้ใช้ | Keyword Scan / Gemini |
| Topology Visualization | ❌ Non-AI | แสดงผลข้อมูลที่มี | React Canvas + LLDP Data |
| Version Control / Rollback | ❌ Non-AI | Logic ตรงไปตรงมา | PostgreSQL + Netmiko |

---

# 📏 ส่วนที่ 4 — เป้าหมายคุณภาพ (QR Metrics)

| รหัส | เป้าหมาย | ค่าเป้า |
|------|---------|--------|
| **QR-1** | API Response Time (ไม่รวม LLM) | < 500ms |
| **QR-1b** | LLM Generation Time | < 30s |
| **QR-1c** | DB Query Time | < 100ms |
| **QR-1d** | Frontend Load Time | < 2s |
| **QR-2a** | Template Config Accuracy | ≥ 98% |
| **QR-2b** | AI Config Accuracy (w/ RAG) | ≥ 85% (90-95% w/ RAG) |
| **QR-3** | PII Detection Rate | ≥ 95% |
| **QR-4** | CIS Rule-Based Accuracy | 100% (Deterministic) |
| **QR-5** | Concurrent Users Supported | ≥ 10 |

---

# 🖥️ ส่วนที่ 5 — UI Pages Overview

| Page | ชื่อหน้า | ฟีเจอร์หลัก |
|------|---------|------------|
| **P0** | Login | JWT Auth, httpOnly Cookie (8h) |
| **P1** | Dashboard | Metrics Cards, Activity Feed, Quick Actions |
| **P2** | Device Management | Tab A: Device List + Tab B: Add Device / Discovery Scanner |
| **P3** | Network Topology | Interactive Canvas, Drag-Drop, Links, PNG Export |
| **P4** | Configuration Builder | 4-Step Wizard: Select Devices → Template → Form/AI → Preview |
| **P5** | Review & Pre-Deploy | Split Panel: CLI Preview + CIS Checklist + Deploy Button |
| **P6** | Version Control | History List, Diff Viewer, Rollback, Audit Trail |
| **P7** | Settings | API Key, User Mgmt, PII Editor, CIS Toggles, Template Mgr |

---

# 📚 ส่วนที่ 6 — แหล่งอ้างอิงที่ใช้ในการรวบรวม

## เอกสารโปรเจกต์ (16 ไฟล์)

| # | ไฟล์ | เนื้อหาหลัก |
|---|------|------------|
| 1 | System Diagram.md | สถาปัตยกรรม 8 ส่วน |
| 2 | การตัดสินใจ ใช้ AI vs ไม่ใช้ AI.md | Decision Framework 12 ฟังก์ชัน |
| 3 | CEPP68-33 Proposal.md | ข้อเสนอโปรเจกต์ ข้อกำหนดเชิงปริมาณ |
| 4 | จากภาพพี่ออม.md | Mockup UI 6 แท็บ |
| 5 | อ่านเนื้อหาเชิงลึก AII&CG.md | AI Integration & Config Gen |
| 6 | อ่านเนื้อหาเชิงลึก ND.md | Network Discovery Pipeline |
| 7 | อ่านเนื้อหาเชิงลึก SA&PV.md | Security Automation 24 Rules |
| 8 | อ่านเนื้อหาเชิงลึก SD&MVA.md | Script-Driven Multi-Vendor |
| 9 | อ่านเนื้อหาเชิงลึก SL.md | Software Layer Architecture |
| 10 | เหตุผลเชิงลึกตามเครือง.md | Tool Selection Matrix |
| 11 | NPA_Netmiko.md | Netmiko SSH Library Guide |
| 12 | Netdisco.md | Open-source NMS Reference |
| 13 | SolarWinds.md | Commercial NMS Comparison |
| 14 | Microsoft Presidio.md | PII Masking Library |
| 15 | Config C2960 VLAN.md | Cisco VLAN Reference |
| 16 | YANG MODEL.md | Data Modeling Standard |

## คลังความรู้จากหนังสือ (12 แหล่ง)

| # | แหล่ง | เนื้อหาหลัก | การนำไปใช้ |
|---|-------|------------|-----------|
| 1 | NPA2e Ch.2 | Network Automation Fundamentals | หลักการ Pre/Post Validation |
| 2 | NPA2e Ch.8 | Data Formats & Models | Pydantic Validation, JSON/YAML |
| 3 | NPA2e Ch.9 | Jinja2 Templates | Core Config Gen Engine |
| 4 | NPA2e Ch.10 | Network APIs + Netmiko + TextFSM | Data Collection Pipeline |
| 5 | NPA2e Ch.12 | Automation Tools (Ansible/Nornir/Terraform) | Idempotency, Multithreading |
| 6 | NPA2e Ch.14 | NAA Architecture | System Architecture Blueprint |
| 7 | AI Cookbook Ch.5 | LangChain for Networking | Prompt Templates, Agents |
| 8 | AI Cookbook Ch.7 | Building AI LLM Backend | FastAPI + Pydantic Blueprint |
| 9 | AI Cookbook Ch.8 | Building Network Co-Pilot | RAG Architecture, Impact Analysis |
| 10 | AI_Networking_Cookbook_TOC | ภาพรวม AI Recipes ทั้งหมด | AI Development Roadmap |
| 11 | หัวข้อที่อ่าน.md | Priority Reading Roadmap | ลำดับความสำคัญ |
| 12 | prompt อ่านหนังสือ.md | Project Philosophy & Context | ปรัชญาโปรเจกต์ |

---

*เอกสารนี้รวบรวมจากเอกสาร 28+ แหล่งข้อมูลโดย Antigravity AI | วันที่: 2026-07-22*
