# 🤖 MyNetMate — Master AI Agent Context & Navigation Map

> **Project:** MyNetMate (CEPP Capstone Project CEPP68-33, KMITL)  
> **Purpose:** Canonical project context, navigation map, implementation snapshot, and rules for AI coding agents
> **Last verified:** 2026-09-03

---

## 1. Project Overview

**MyNetMate** คือ Web Application สำหรับ Network Management และ Configuration Automation สำหรับวิศวกรเครือข่าย พัฒนาเป็น Capstone Project ของทีม 4 คน

### Core philosophy

> **“ใช้ AI เมื่อต้องการความเข้าใจ — ไม่ใช้ AI เมื่อต้องการความถูกต้อง”**

- **Golden Rule:** ถ้ามีคำตอบที่ถูกต้องเพียงหนึ่งคำตอบ ให้ใช้ Rule/Jinja2 Template; ถ้าต้องตีความหรืออธิบายจึงพิจารณาใช้ AI
- **Target ratio:** 80% deterministic templates/rules + 20% AI assistance
- **Safety first:** AI ห้าม Execute คำสั่งบนอุปกรณ์จริงโดยตรง ทุกการ Deploy ต้องผ่าน Human-in-the-Loop
- **Privacy first:** IP, Password, Key และข้อมูลอ่อนไหวต้องถูก Mask ก่อนส่งไปยังบริการ AI ภายนอกทุกครั้ง
- **Validation gate:** Config ทุกก้อนต้องผ่าน CIS rule check ก่อนเข้าสู่ขั้น Deploy

### Vendor scope

- **Baseline:** Cisco IOS
- **Candidate test vendors:** Huawei Router และ MikroTik Switch ตามอุปกรณ์จริงที่อาจารย์มีให้ทดสอบหลังกลางภาค
- Huawei/MikroTik ยังไม่ถือว่า Full Support จนกว่าจะยืนยันรุ่น OS ชุดคำสั่ง และผลทดสอบใน Isolated Lab
- **Complex Multi-vendor Policy:** CUT และอยู่นอกขอบเขตปัจจุบัน

### Project constraints

| Constraint | Working implication |
|---|---|
| ทีม 4 คนและเวลา Coding ประมาณหนึ่งเทอม | รักษา P1 critical path และหลีกเลี่ยง scope expansion |
| อุปกรณ์จริงมีจำกัดและอาจใช้ OS/IOS เก่า | ใช้ conservative command set และยืนยันรุ่นก่อนรับรอง compatibility |
| Simulation ไม่เหมือน Hardware จริง | ทดสอบ GNS3/Packet Tracer ก่อน แล้วแยกผล Lab simulation ออกจากผลอุปกรณ์จริง |
| เครือข่ายมหาวิทยาลัยอยู่นอกขอบเขต Scan | Discovery, Ping Sweep และ Port Scan ทำได้เฉพาะ Isolated Lab |
| External AI มี quota และอาจล้มระหว่าง Demo | P1 ต้องทำงานแบบ deterministic/offline ได้; AI เป็นส่วนเสริม ไม่ใช่ dependency หลัก |
| ทักษะทีมต่างกันและ Advisor feedback ใช้เวลา | ทำ API contract และ decision record ให้ชัด ลดงานที่ต้องรอคนเดียวหรือรอคำตอบภายนอก |

---

## 2. Documentation and Decision Precedence

เมื่อข้อมูลขัดกัน ให้ใช้ลำดับนี้:

1. กฎความปลอดภัยและข้อห้ามใน `AGENTS.md`
2. [MyNetMate Weight Feature List](<02_feature/MyNetMate Weight Feature List (AI คิด).md>) — Single Source of Truth สำหรับ MVP scope
3. เอกสาร Feature เฉพาะเรื่องที่อัปเดตล่าสุด
4. Source code, dependency manifest และ configuration จริง — Source of Truth สำหรับสิ่งที่ Implement แล้ว
5. [MyNetMate รายการ Features](<02_feature/MyNetMate รายการ Features.md>) — Raw/original feature inventory ใช้อ้างอิงเท่านั้น

อย่าอ้างว่า Feature “เสร็จแล้ว” เพียงเพราะมีอยู่ในเอกสารหรือมี Router/Service stub ต้องตรวจ implementation และ test จริงก่อน

---

## 3. Current Implementation Snapshot

ตรวจจากไฟล์จริงเมื่อ 2026-09-03:

| Area | Current verified state | Target / note |
|---|---|---|
| **Frontend** | React 19.2.8, React DOM 19.2.8, Vite 8.2.0, TypeScript 6.0.2, Oxlint 1.75; ยังเป็น Vite starter screen | MyNetMate UI, routing, state management และ styling stack ยังต้อง Implement/ยืนยันก่อนใช้ |
| **Backend** | FastAPI 0.141.1, Uvicorn 0.52.4, Pydantic Settings 2.15.0; API version 0.1.0 | มี feature-oriented routers/services แต่หลายส่วนเป็น prototype, sample หรือ in-memory |
| **Network discovery integration** | Backend ใช้ `oxian_py` จาก Mynetmate/oxian | โฟลเดอร์ `mynetmate/network-discovery/` เป็นงานเพื่อนและ Read-only สำหรับ AI |
| **Database** | ยังไม่พบ SQLAlchemy/PostgreSQL/Alembic dependency ใน Backend ปัจจุบัน; device/group/version service ใช้ in-memory state | Target คือ PostgreSQL 15+, SQLAlchemy 2 และ Alembic; SQLite ใช้ Dev/Test ตามแผน |
| **Config generation** | มี API prototype ที่ประกอบข้อความ Config แบบง่าย | Target คือ deterministic Jinja2 templates และ conservative Cisco IOS command set |
| **CIS validation** | มี sample checks ใน service | Target คือ 8 กฎหลักด้วย deterministic rules/Regex |
| **AI config** | มี fallback/sample response; ยังไม่ใช่ Gemini integration ที่พร้อมใช้งาน | AI Config & Review อยู่ P2; ต้องผ่าน PII masking, context guardrails และ CIS gate |
| **Documentation** | มี Feature, Architecture, Project Management และ Knowledge Base ใน Vault และ `mynetmate/docs/` | Scope file ใน Vault เป็นตัวตัดสิน MVP เว้นแต่ผู้ใช้ประกาศเปลี่ยน |
| **Obsidian** | เปิด Community plugins 12 ตัว รวม Advanced Tables | อ่าน [OBSIDIAN_EXTENSIONS.md](OBSIDIAN_EXTENSIONS.md) ก่อนสร้าง artifact ที่พึ่ง plugin |

### Approved target technologies not yet proof of implementation

- **Backend target:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2, PostgreSQL, Alembic, Jinja2
- **Network target:** Netmiko, TextFSM/NTC Templates, ciscoconfparse
- **PII target:** `yacryptopan` สำหรับ IP + Regex สำหรับ Password/Secret
- **AI target:** Gemini API with structured output and database context injection
- **Infrastructure target:** Docker/Compose, Pytest, isolated GNS3/Packet Tracer lab
- **Frontend candidates in planning:** Tailwind CSS, TanStack Router/Query และ Zustand; ห้ามอ้างว่าติดตั้งแล้วจนกว่าจะพบใน `mynetmate/website/package.json`

### Explicitly retired or rejected

ห้ามแนะนำเป็นสถาปัตยกรรมปัจจุบัน: LangChain, Pinecone/ChromaDB หรือ Vector DB, Microsoft Presidio และ spaCy ใช้ database context injection, `yacryptopan` และ Regex ตามหน้าที่แทน

---

## 4. MVP Scope

### P1-CORE and P1-INFRA

Critical demo flow:

`Login → Add Device → 6-Tab Config Builder → Jinja2 Preview → CIS Scan → Plan/Apply Modal`

1. **Auth & RBAC:** Opaque server-side session ผ่าน HttpOnly cookie, 3 roles
2. **Dashboard:** Basic metrics, activity feed, system API status
3. **Device Inventory:** Manual enrollment, reachability/collection status, grouping
4. **Template Config Generation:** 6-tab form, Jinja2 render, frontend debounce
5. **PII Masking:** `yacryptopan` + Regex ก่อน external AI call
6. **Deployment Plan:** Preview/plan flow; P1 ยังไม่ Push SSH จริง
7. **CIS Benchmark:** 8 deterministic rules
8. **Audit Trail:** Database-backed actor/action/time records
9. **AI Guardrails Infrastructure:** Context injection and structured output foundation
10. **Settings:** User management, CIS toggles, offline mode

### P2 — start only after P1 is stable

- Network Discovery ใน Isolated Lab
- Topology Visualization ด้วย evidence จาก Discovery
- AI Config Generation and Review
- SSH Command Push พร้อม pre/post snapshot
- Config Version Control and manual rollback workflow

### CUT

- Complex Multi-vendor Policy
- Auto-rollback on error
- Full idempotency engine
- Cross-device impact simulation
- RAG Vector Database
- spaCy NLP
- MOP generation
- Jinja2 Template Manager UI

---

## 5. Repository and Vault Map

### Root knowledge Vault

- [README.md](README.md) — Human-facing project overview and quick navigation
- [OBSIDIAN_EXTENSIONS.md](OBSIDIAN_EXTENSIONS.md) — Obsidian plugins, versions, syntax, commands and safety notes
- `.obsidian/` — Local Vault configuration; plugin binaries are not application source code
- `01_architecture_and_specs/` — System architecture and UI specifications
- `02_feature/` — Feature research/specification; MVP scope lives here
- `03_tech_evaluations/` — Technology evaluations, including retired options kept as references
- `04_project_management/` — Proposal, timeline, advisor feedback and grading material
- `05_knowledge_base/` — Book notes and technical research
- `Img/` — Images used by Vault documents
- `Excalidraw/` — Excalidraw drawings

### Central team repository: `mynetmate/`

`mynetmate/` เป็น nested Git repository ภายใน workspace นี้ และมี nested repositories/submodules ของตัวเอง:

- `mynetmate/backend/` — FastAPI backend
- `mynetmate/website/` — React/Vite frontend
- `mynetmate/docs/` — Team documentation repository
- `mynetmate/network-discovery/` — Network Discovery work owned by another teammate; AI read-only

ก่อนใช้ Git ให้ตรวจว่ากำลังทำงานใน Root Vault, `mynetmate/`, `backend/`, `website/` หรือ `docs/` เพราะแต่ละขอบเขตมีประวัติ Git แยกกัน ห้าม Commit/Push ข้ามขอบเขตโดยไม่ตั้งใจ

### Key document links

- [System Diagram in Proposal](<01_architecture_and_specs/System Diagram in Proposal(CEPP).md>)
- [Full-page UI specification](01_architecture_and_specs/netconfig_full_page_specs.html)
- [MVP Scope / Weight Feature List](<02_feature/MyNetMate Weight Feature List (AI คิด).md>)
- [Original Feature List](<02_feature/MyNetMate รายการ Features.md>)
- [Data Information](<02_feature/Data Information 27-06-69.md>)
- [Device Inventory notes](<02_feature/02_Device Inventory Management(Tee)/README 1.md>)
- [Configuration Driver Architecture](<02_feature/05_Configuration Management(Aom)/แนวคิด Plugin Driver Architecture.md>)
- [AI or No-AI Decision](<02_feature/05_Configuration Management(Aom)/Decision AI or NoAI in Project.md>)
- [Restore Strategy](<02_feature/10_Configuration Deployment(Aom)/แนวคิด Restore Strategy.md>)
- [Cut Features and Rationale](<02_feature/10_Configuration Deployment(Aom)/Cutting Your Own Legs.md>)
- [Proposal](<04_project_management/Document Project/CEPP68-33 Proposal.md>)
- [Gantt chart](<04_project_management/Document Project/gantt_chart.md>)
- [Frontend Config Builder mockup](<mynetmate/docs/Feature Design/02_Device Inventory Management(Tee)/Mockup จากภาพพี่ออม.md>)

---

## 6. Non-negotiable Rules for AI Agents

1. **อ่าน MVP Scope ก่อนเริ่มงานทุกครั้ง:** [MyNetMate Weight Feature List](<02_feature/MyNetMate Weight Feature List (AI คิด).md>)
2. **Frontend UI:** อ่าน [Config Builder mockup](<mynetmate/docs/Feature Design/02_Device Inventory Management(Tee)/Mockup จากภาพพี่ออม.md>) และ source code ปัจจุบันก่อนเสนอหรือแก้ UI
3. **Do not revive retired stack:** ห้ามแนะนำ LangChain, Presidio, spaCy หรือ Vector DB เป็นทางเลือกหลัก
4. **No autonomous device execution:** AI สร้าง/วิเคราะห์ Config ได้ แต่ห้ามรันคำสั่งบนอุปกรณ์จริง
5. **Mask before external AI:** PII และ secret ต้อง Mask ก่อน external API call ทุกกรณี
6. **CIS gate:** Config ทุกแหล่งต้องผ่าน CIS rule check ก่อน Deploy
7. **Vendor honesty:** Cisco เป็น baseline; Huawei/MikroTik เป็น candidate เท่านั้นจนกว่าจะมี test evidence
8. **Isolated Lab only:** ห้าม Ping Sweep, Port Scan หรือ Discovery บนเครือข่ายมหาวิทยาลัยจริง
9. **Protected teammate folder:** ห้ามแก้ สร้าง ลบ ย้าย เปลี่ยนชื่อ หรือรันคำสั่งที่เปลี่ยนไฟล์ใน `mynetmate/network-discovery/`; ห้าม Commit, Push หรือเปิด PR สำหรับโฟลเดอร์นี้ เว้นแต่ผู้ใช้อนุญาตเป็นลายลักษณ์อักษรในคำขอนั้น
10. **Obsidian-aware work:** ก่อนสร้าง/แก้ Table, Diagram, Template, Dashboard, Kanban, Flashcard หรือ Periodic Note ให้อ่าน [OBSIDIAN_EXTENSIONS.md](OBSIDIAN_EXTENSIONS.md)
11. **Respect Git boundaries:** ตรวจ repository root และ working tree ก่อนแก้; รักษาการเปลี่ยนแปลงเดิมของผู้ใช้และ nested repos
12. **Implementation claims require evidence:** แยก Planned, Prototype, Implemented และ Tested ให้ชัด

## 7. Keeping Context Documents Current

เมื่อผู้ใช้ขออัปเดต Context หรือมีการเปลี่ยนแปลงที่ยืนยันได้ ให้ตรวจและอัปเดต `AGENTS.md` กับ `README.md` คู่กันในหัวข้อที่เกี่ยวข้อง:

- MVP scope หรือ feature priority
- Installed dependencies และ implementation status
- Vendor/device evidence และ safety boundary
- Repository/folder structure หรือ Git boundary
- Obsidian plugin inventory โดยรายละเอียด plugin ให้อัปเดตใน `OBSIDIAN_EXTENSIONS.md`

ห้ามอัปเดต version/status จากความจำ ให้ตรวจ manifest, source code หรือเอกสารตัดสินใจจริงก่อน และเปลี่ยน `Last verified` เฉพาะเมื่อได้ตรวจข้อมูลในรอบนั้น

---

*Maintained for CEPP68-33 | Last verified: 2026-09-03*
