# 🌐 MyNetMate — Project Infographic
> **CEPP68-33** | KMITL — King Mongkut's Institute of Technology Ladkrabang  
> ระบบจัดการเครือข่ายและสร้างคอนฟิกอัตโนมัติ พร้อม AI Co-Pilot  

---

## 🧭 MyNetMate คืออะไร?

```mermaid
mindmap
  root((MyNetMate))
    🔧 Config Generator
      Jinja2 Templates 80%
      AI Gemini 20%
      Multi-Vendor
    📡 Device Management
      Manual Entry
      Auto Discovery
      SNMP / LLDP / ICMP
    🛡️ Security
      CIS 24 Rules
      PII Masking
      Impact Analysis
    📜 Version Control
      Pre/Post Snapshot
      Diff Viewer
      Auto-Rollback
    🤖 AI Co-Pilot
      RAG Architecture
      Prompt Engineering
      Intent Detection
    🚀 Deployment
      SSH via Netmiko
      Plan → Apply
      Idempotency Check
```

> [!IMPORTANT]
> **ปรัชญาหลัก:** "ใช้ AI เมื่อต้องการ **ความเข้าใจ** — ไม่ใช้ AI เมื่อต้องการ **ความถูกต้อง**"

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Frontend ["🖥️ Frontend — React 18 + TypeScript"]
        UI[React UI + Tailwind CSS]
        Router[TanStack Router]
        State[Zustand State]
        Query[TanStack Query]
    end

    subgraph Backend ["⚙️ Backend — Python FastAPI"]
        API[REST API + WebSocket]
        Jinja[Jinja2 Engine]
        Pydantic[Pydantic Validation]
        ORM[SQLAlchemy ORM]
    end

    subgraph AI ["🤖 AI Layer"]
        Gemini[Google Gemini API]
        RAG[RAG Pipeline]
        VDB[(Vector DB)]
        Presidio[Presidio PII Mask]
    end

    subgraph Network ["📡 Network Layer"]
        Netmiko[Netmiko SSH]
        TextFSM[TextFSM Parser]
        CISCOparse[ciscoconfparse]
        SNMP[SNMP / LLDP]
    end

    subgraph Data ["🗄️ Database"]
        PG[(PostgreSQL)]
    end

    UI <-->|REST/WS| API
    API --> Jinja
    API --> Pydantic
    API --> ORM
    ORM <--> PG
    API -->|Masked Prompt| Presidio
    Presidio -->|Clean Prompt| Gemini
    Gemini <--> RAG
    RAG <--> VDB
    API --> Netmiko
    Netmiko -->|SSH| Devices[🖧 Network Devices]
    API --> TextFSM
    API --> CISCOparse
    API --> SNMP

    style Frontend fill:#1e3a5f,stroke:#4a9eff,color:#fff
    style Backend fill:#1a3a2a,stroke:#4aff9e,color:#fff
    style AI fill:#3a1a3a,stroke:#ff4aff,color:#fff
    style Network fill:#3a2a1a,stroke:#ffaa4a,color:#fff
    style Data fill:#2a2a2a,stroke:#aaa,color:#fff
```

---

## 📊 กฎทอง: 80/20 Hybrid Architecture

> [!SUCCESS] 🟢 80% — Template-Based (Non-AI)
> | สิ่งที่ทำ | วิธีทำ |
> |----------|--------|
> | สร้าง VLAN Config | Jinja2 Loop |
> | ตั้งค่า Interface IP | Jinja2 Template |
> | Static/OSPF Routing | Jinja2 Conditional |
> | ACL Rules | Jinja2 Template |
> | Services (SSH/NTP) | CIS Default + Jinja2 |
> | Port Security | Jinja2 Template |
> | STP Configuration | Jinja2 Template |
> 
> **✅ ข้อดี:** 100% Accuracy, ไม่มี Hallucination, ไม่ต้องรอ API, ฟรี

---

> [!INFO] 🔵 20% — AI-Powered (Gemini + RAG)
> | สิ่งที่ทำ | วิธีทำ |
> |----------|--------|
> | NL Config Gen | Gemini API + Context Injection |
> | Security Audit (Holistic) | Gemini + Config Context |
> | Vendor Docs Lookup | RAG + Vector DB |
> | Impact Analysis | Gemini + Topology Context |
> | Auto-Documentation | Gemini Summarization |
> | MOP Generation | Gemini Structured Output |
> | Legacy Device Fallback | Gemini Pro + RAG |
> 
> **⚠️ หมายเหตุ:** ทุก AI Output ติด Flag `AI-generated, review required`

---

## 🧩 12 Core Features

> [!EXAMPLE] 1. 🔧 Hybrid Config Generation
> **Template Path (Non-AI):**
> ```
> User กรอก Form (React) → FastAPI รับ JSON → Jinja2 Render CLI → Real-time Preview ⚡ (ไม่ต้องรอ AI)
> ```
> **Tools:** Jinja2, React, FastAPI, Pydantic
> 
> ---
> **AI Path:**
> ```
> User พิมพ์ภาษาธรรมชาติ → Intent Detection → Presidio Mask PII 🔒 → Inject Device Context → Gemini API → Config → ⚠️ "AI-generated"
> ```
> **Tools:** Gemini API, Presidio, LangChain, PostgreSQL

---

> [!NOTE] 2. 📡 Device Inventory & Discovery
> **Manual Mode:**
> - กรอก Hostname, IP, Vendor, Model
> - อัปโหลด Running-Config
> - จัดกลุ่มตาม Site/Function
> 
> **Discovery Mode (Auto):**
> - IP Range Ping Sweep (ICMP)
> - SNMP `sysDescr` Polling
> - LLDP/CDP Neighbor Discovery
> - OS Fingerprinting
> 
> **Tools:** Netmiko, pysnmp, TextFSM, asyncio, PostgreSQL

---

> [!ABSTRACT] 3. 🗺️ Network Topology
> - Interactive Canvas (Drag & Drop)
> - Router/Switch/AP Icons
> - Manual Link + Port Labels
> - Right-Click Context Menu
> - PNG Export
> - Auto-Layout จาก Discovery Data
> 
> **Tools:** React Canvas/SVG, Tabler Icons, LLDP Data

---

> [!CHECK] 4. 🛡️ CIS Security Compliance
> **24 กฎ Deterministic (Non-AI):**
> 
> | Severity | ตัวอย่าง |
> |----------|---------|
> | 🔴 Critical | enable secret, SSH v2, block Telnet |
> | 🟡 Warning | SNMP default, HTTP server, VTY ACL |
> | 🔵 Info | Banner, Logging config |
> 
> - Critical = **บล็อก Deploy** ทันที
> - Warning = Dismiss ได้ + **ต้องกรอกเหตุผล**
> 
> **Tools:** ciscoconfparse, Python Regex

---

> [!LOCK] 5. 🔒 PII Masking (100% Local)
> ```
> Config ดิบ → Presidio + spaCy NLP (Local) + Custom Regex → [IP_ADDRESS], [MASKED_PWD], [SNMP_COMM] → ส่งไป Gemini API ✅
> ```
> **การรับประกัน:** 100% Local Processing — Zero External Leakage

---

> [!HISTORY] 6. 📜 Version Control & Rollback
> | Event | Trigger | Source Tag |
> |-------|---------|-----------|
> | ก่อน Deploy | อัตโนมัติ | `pre_deploy` |
> | หลัง Deploy | อัตโนมัติ | `post_deploy` |
> | Admin ดึงเอง | กดปุ่ม Manual | `manual` |
> 
> **Diff Viewer:** Side-by-Side + Unified  
> **Rollback:** One-Click หรือ Auto (on Error)  
> **Audit Trail:** Who / When / What ทุกการเปลี่ยนแปลง  
> **Tools:** Myers Diff, Netmiko, PostgreSQL

---

> [!LAUNCH] 7. 🚀 SSH Deployment
> ```
> Review & Approve (Human ✅) → Pre-Deploy Snapshot → Netmiko SSH Push → write memory → Post-Deploy Snapshot → ❌ Error? → Auto-Rollback
> ```
> **Safety:** Plan → Apply Workflow, Idempotency Check

---

> [!BOT] 8. 🤖 AI Co-Pilot (RAG)
> ```mermaid
> graph LR
>     Q[User Query] --> ID[Intent Detection]
>     ID --> CTX[Device Context from DB]
>     CTX --> PM[PII Masking]
>     PM --> RAG[RAG: Vector DB Search]
>     RAG --> GEM[Gemini API]
>     GEM --> VAL[Pydantic Validate]
>     VAL --> UI[Display in React]
> ```
> **Key:** AI ไม่ Execute เอง → แนะนำให้ Engineer ตัดสินใจ

---

> [!SUMMARY] 9. 📊 Dashboard
> - **Metrics Cards:** Total Devices, Online/Offline, Changes Today, CIS Failures
> - **Activity Feed:** 10 รายการล่าสุด
> - **Quick Actions:** ไปหน้า Config, Add Device, AI Chat
> - **System Status:** API / DB Health Dot

---

## ⚙️ 10–12. Settings, Auth & Business Model

> [!SETTINGS] 10. ⚙️ Settings
> | Section | รายละเอียด |
> |---------|-----------|
> | **API Config** | Gemini Key, Model (Flash/Pro), Token Budget, Offline Mode |
> | **User Mgmt** | Admin / Operator / Viewer (RBAC) |
> | **Security** | PII Regex Editor, CIS Rule Toggles |
> | **Templates** | Jinja2 Template Manager (CRUD) |

---

> [!KEY] 11. 🔐 Authentication
> - JWT Token (httpOnly Cookie, 8h Expiration)
> - 3 Roles: **Admin** (Full) / **Operator** (Deploy) / **Viewer** (Read-only)
> - Login Page with Inline Error Handling

---

> [!QUOTE] 12. 💰 Subscription Model (Open Core)
> | Feature | Standard (Free) | Professional (Paid) |
> |---|---|---|
> | Inventory | ✅ Unlimited | ✅ Unlimited |
> | Jinja2 Templates | ✅ Full | ✅ Full |
> | AI (Gemini) | ⚠️ Trial/BYOK | ✅ Full + Cloud RAG |
> | CIS Security | ⚠️ Basic | ✅ Full 24-Rule |
> | Version Control | ✅ Local | ✅ Server-side |
> | SSH Deploy | ✅ Full | ✅ Full |
> | AI Audit Reports | ❌ | ✅ |
> | Support | Community | Priority |

---

## 🛠️ Tech Stack — ทั้งระบบ

```mermaid
graph LR
    subgraph FE ["🖥️ Frontend"]
        React["React 18"]
        TS["TypeScript"]
        TW["Tailwind CSS"]
        TR["TanStack Router"]
        TQ["TanStack Query"]
        ZS["Zustand"]
    end

    subgraph BE ["⚙️ Backend"]
        PY["Python 3.11+"]
        FA["FastAPI"]
        PD["Pydantic"]
        SA["SQLAlchemy"]
        UV["Uvicorn"]
        J2["Jinja2"]
    end

    subgraph NET ["📡 Network"]
        NM["Netmiko"]
        TF["TextFSM/NTC"]
        CP["ciscoconfparse"]
        PM["Paramiko"]
        SN["pysnmp"]
    end

    subgraph AIL ["🤖 AI"]
        GM["Gemini API"]
        LC["LangChain"]
        PC["Pinecone/Chroma"]
        PR["Presidio"]
        SP["spaCy"]
    end

    subgraph INF ["🗄️ Infra"]
        PG["PostgreSQL 15+"]
        DK["Docker"]
        DC["Docker Compose"]
        CL["ContainerLab"]
        GH["GitHub Actions"]
    end

    style FE fill:#1e3a5f,stroke:#4a9eff,color:#fff
    style BE fill:#1a3a2a,stroke:#4aff9e,color:#fff
    style NET fill:#3a2a1a,stroke:#ffaa4a,color:#fff
    style AIL fill:#3a1a3a,stroke:#ff4aff,color:#fff
    style INF fill:#2a2a2a,stroke:#aaa,color:#fff
```

---

## ⚖️ AI vs Non-AI — ตัดสินใจอย่างไร?

> [!TIP]
> **กฎทอง:** "มีคำตอบถูกต้องเพียง 1 คำตอบหรือไม่?"
> — **ใช่** → ใช้ Rule/Template (Non-AI)
> — **ไม่ใช่** → ใช้ AI

| ฟังก์ชัน | AI? | เหตุผล |
|---------|-----|--------|
| Form → CLI Config | ❌ | คำตอบเดียว (Deterministic) |
| NL → CLI Config | ✅ | ต้องตีความภาษาธรรมชาติ |
| CIS 24-Rule Check | ❌ | กฎตายตัว ต้อง 100% |
| Holistic Security Audit | ✅ | วิเคราะห์ภาพรวม ไม่มีกฎตายตัว |
| PII Masking | ❌ | ต้อง 100% Local ไม่รั่ว |
| Config Diff | ❌ | Algorithm (Myers Diff) |
| Network Discovery | ❌ | Protocol (SNMP/LLDP/ICMP) |
| SSH Deployment | ❌ | ส่ง CLI ตรงๆ |
| Vendor Docs Search | ✅ | ค้นหาจาก Knowledge Base |
| Auto-Documentation | ✅ | สรุปเป็นภาษามนุษย์ |
| Impact Analysis | ✅ | วิเคราะห์ Topology + ผลกระทบ |
| Intent Detection | ✅ | จำแนกเจตนาผู้ใช้ |

---

## 🔄 Execution Pipeline — 9 ขั้นตอน

```mermaid
graph TD
    A["1️⃣ Input: Form หรือ AI Prompt"] --> B["2️⃣ Jinja2 Render CLI"]
    B --> C{"AI Path?"}
    C -->|Yes| D["3️⃣ Presidio Mask PII"]
    C -->|No| E["5️⃣ CIS 24-Rule Scan"]
    D --> F["4️⃣ Gemini API + RAG"]
    F --> E
    E --> G{"Critical Fail?"}
    G -->|Yes ❌| BLOCK["🚫 BLOCKED — ห้าม Deploy"]
    G -->|No ✅| H["6️⃣ Preview in Split Panel"]
    H --> I["7️⃣ Pre-Deploy Snapshot via SSH"]
    I --> J["8️⃣ Netmiko Push CLI + write mem"]
    J --> K["9️⃣ Post-Deploy Snapshot"]
    K --> L{"Success?"}
    L -->|Yes ✅| DONE["✅ Deploy สำเร็จ"]
    L -->|No ❌| ROLL["🔄 Auto-Rollback to Pre-Deploy"]

    style BLOCK fill:#8b0000,stroke:#ff0000,color:#fff
    style DONE fill:#006400,stroke:#00ff00,color:#fff
    style ROLL fill:#8b4500,stroke:#ff8c00,color:#fff
```

---

## 🖥️ UI Pages — 8 หน้าจอ

| Page | ชื่อ | ฟีเจอร์หลัก |
|------|------|------------|
| **P0** | 🔐 Login | JWT Auth, httpOnly Cookie 8h |
| **P1** | 📊 Dashboard | Metrics, Activity Feed, Quick Actions |
| **P2** | 📡 Device Mgmt | Device List + Add/Discovery Scanner |
| **P3** | 🗺️ Topology | Canvas, Drag-Drop, Links, Export PNG |
| **P4** | 🔧 Config Builder | 4-Step Wizard: Select → Template → Form/AI → Preview |
| **P5** | ✅ Review & Deploy | Split Panel: CLI Preview + CIS Checklist + Deploy |
| **P6** | 📜 Version Control | History, Diff Viewer, Rollback, Audit Trail |
| **P7** | ⚙️ Settings | API Key, Users, PII, CIS, Templates |

### Config Builder (P4) — 4-Step Wizard:

```mermaid
graph LR
    S1["Step 1<br/>เลือกอุปกรณ์"] --> S2["Step 2<br/>เลือก Template<br/>(VLAN/OSPF/ACL...)"]
    S2 --> S3["Step 3<br/>กรอก Form<br/>หรือพิมพ์ AI Prompt"]
    S3 --> S4["Step 4<br/>Preview CLI<br/>+ Ask AI to Review"]

    style S1 fill:#1e3a5f,stroke:#4a9eff,color:#fff
    style S2 fill:#1a3a2a,stroke:#4aff9e,color:#fff
    style S3 fill:#3a1a3a,stroke:#ff4aff,color:#fff
    style S4 fill:#3a2a1a,stroke:#ffaa4a,color:#fff
```

---

## 📏 เป้าหมายคุณภาพ (QR Metrics)

| Metric | Target | หมายเหตุ |
|--------|--------|----------|
| ⚡ API Response | **< 500ms** | ไม่รวม LLM |
| 🤖 LLM Generation | **< 30s** | Gemini API |
| 🗄️ DB Query | **< 100ms** | PostgreSQL |
| 🖥️ Frontend Load | **< 2s** | React CSR |
| 🎯 Template Accuracy | **≥ 98%** | Jinja2 |
| 🤖 AI Accuracy (w/ RAG) | **≥ 85-95%** | Gemini + RAG |
| 🔒 PII Detection | **≥ 95%** | Presidio |
| 🛡️ CIS Rule Accuracy | **100%** | Deterministic |
| 👥 Concurrent Users | **≥ 10** | Uvicorn Workers |

---

## 🎯 Vendor Scope & Phase Plan

```mermaid
timeline
    title MyNetMate Development Phases
    Phase 1 - MVP : Cisco IOS (100% Priority)
                  : MikroTik RouterOS v7
                  : Core Features Complete
    Phase 2 - Expand : Huawei VRP
                     : Advanced RAG
                     : Cloud Integration
    Dropped ❌ : Firewall Config
              : Juniper
              : ARP-only Discovery
```

> [!WARNING]
> **คำเตือนจากอาจารย์ปริญญา:** เขียน Parser สำหรับ 4 Vendor ใน 5 เดือน กับ 4 คน เป็นไปไม่ได้ → **Focus Cisco ก่อน แล้วค่อย MikroTik**

---

## 🔑 Key Takeaways สำหรับทีม

> [!CAUTION]
> **สิ่งที่ห้ามทำ:**
> - ❌ ห้ามให้ AI Execute Config โดยตรง (ต้อง Human-in-the-Loop)
> - ❌ ห้ามส่งข้อมูลอ่อนไหวไป Gemini API โดยไม่ผ่าน Presidio
> - ❌ ห้ามใช้ AI สำหรับงานที่ต้องการ 100% Accuracy (ใช้ Jinja2 แทน)
> - ❌ ห้ามพยายาม Support ทุก Vendor พร้อมกัน

> [!TIP]
> **สิ่งที่ควรจำ:**
> - ✅ **80/20 Rule** — Template ทำงานหลัก, AI ช่วยเสริม
> - ✅ **Inventory มาก่อน AI** — ไม่มี Device DB = AI ทำงานไม่ได้
> - ✅ **CIS Security Gate** — ทุก Config ต้องผ่านก่อน Deploy ไม่ว่ามาจากไหน
> - ✅ **Pre/Post Snapshot** — ทุกครั้งที่ Deploy ต้องถ่ายรูปก่อน-หลังเสมอ
> - ✅ **Offline Mode** — ปิด AI ได้ทุกเมื่อ ระบบยังทำงาน 100% ด้วย Template

---

*สร้างโดย Antigravity AI สำหรับทีม CEPP68-33 | 2026-07-22*  
*รองรับ Obsidian Native Callouts 100%*
