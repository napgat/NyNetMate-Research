# 🌐 MyNetMate — Project Knowledge Vault

MyNetMate คือ Capstone Project CEPP68-33 ของ KMITL สำหรับ **Network Management และ Configuration Automation** โดยมุ่งช่วยวิศวกรเครือข่ายจัดการอุปกรณ์ สร้างและตรวจสอบ Configuration และลดความเสี่ยงก่อนนำคำสั่งไปใช้จริง

> **แนวคิดหลัก:** ใช้ AI เมื่อต้องการ “ความเข้าใจ” และใช้ Rule/Jinja2 Template เมื่อต้องการ “ความถูกต้อง”

เอกสารนี้เป็นหน้าเริ่มต้นของ Knowledge Vault ส่วน Source Code ของทีมอยู่ใน [`mynetmate/`](mynetmate/)

## Current Status

สถานะที่ตรวจจาก Source Code เมื่อ **2026-09-03**:

| Component | Current state |
|---|---|
| Frontend | React 19.2.8 + Vite 8.2 + TypeScript 6; ปัจจุบันยังเป็น starter screen |
| Backend | FastAPI API prototype version 0.1.0 มี feature routers/services หลายหมวด แต่หลายส่วนยังเป็น sample หรือ in-memory |
| Database | ยังไม่พบ SQLAlchemy/PostgreSQL/Alembic ใน dependency ปัจจุบัน |
| Configuration generation | มี prototype แบบง่าย; Jinja2 template engine ตาม MVP ยังต้อง Implement |
| CIS validation | มี sample checks; เป้าหมายคือ 8 deterministic CIS rules |
| AI-assisted config | มี fallback/sample response; Gemini integration อยู่ใน P2 และต้องผ่าน PII/CIS guardrails |
| Documentation | Feature specs, architecture, proposal, advisor feedback และ knowledge base มีการพัฒนาต่อเนื่อง |
| Obsidian | เปิด Community plugins 12 ตัว รวม Advanced Tables; ดู [คู่มือ Extensions](OBSIDIAN_EXTENSIONS.md) |

สถานะข้างต้นแยกจากแผนสถาปัตยกรรม เพื่อไม่ให้เข้าใจว่า Feature ที่มีเอกสารหรือ API stub ถือว่าเสร็จแล้ว

## MVP Direction

### P1 — Core and Infrastructure

Demo flow หลัก:

`Login → Add Device → 6-Tab Config Builder → Jinja2 Preview → CIS Scan → Plan/Apply Modal`

- Auth & RBAC ด้วย opaque server-side session
- Dashboard และ activity feed
- Manual Device Inventory และ grouping
- Deterministic Config Generation ด้วย Jinja2
- PII masking ด้วย `yacryptopan` + Regex
- Deployment Plan/Preview โดย P1 ยังไม่ Push SSH จริง
- CIS Benchmark 8 rules
- Audit Trail
- AI guardrail infrastructure และ Offline Mode

### P2 — after P1 is stable

- Network Discovery ใน Isolated Lab
- Topology Visualization
- AI Config Generation and Review
- SSH Command Push พร้อม snapshot
- Version Control และ manual rollback workflow

### Out of Scope / CUT

- Complex Multi-vendor Policy
- Auto-rollback on error
- Full idempotency engine
- Cross-device impact simulator
- RAG Vector Database, spaCy และ Presidio
- MOP generation และ Jinja2 Template Manager UI

รายละเอียดและเหตุผลฉบับเต็มอยู่ใน [MyNetMate Weight Feature List](<02_feature/MyNetMate Weight Feature List (AI คิด).md>)

## Vendor and Safety Boundary

- **Cisco IOS** เป็น baseline หลัก
- **Huawei Router** และ **MikroTik Switch** เป็น candidate สำหรับทดสอบกับอุปกรณ์จริงหลังกลางภาค ยังไม่ใช่ Full Support
- ทดสอบ Discovery/Scan เฉพาะ **Isolated Lab** เช่น GNS3 หรือ Packet Tracer ห้าม Scan เครือข่ายมหาวิทยาลัย
- AI ห้าม Execute คำสั่งบนอุปกรณ์จริง ผู้ใช้ต้อง Review และกด Deploy เอง
- Config ทุกก้อนต้องผ่าน CIS validation ก่อน Deploy
- IP, Password, Key และข้อมูลอ่อนไหวต้องถูก Mask ก่อนส่งไปยัง AI ภายนอก

## Repository Layout

```text
Project/
├── AGENTS.md                      # Canonical rules and context for AI agents
├── README.md                      # This human-facing overview
├── OBSIDIAN_EXTENSIONS.md         # Obsidian plugin inventory and usage guide
├── .obsidian/                     # Vault configuration
├── 01_architecture_and_specs/     # Architecture and UI specifications
├── 02_feature/                    # Feature research and MVP scope
├── 03_tech_evaluations/           # Technology evaluations
├── 04_project_management/         # Proposal, timeline and advisor feedback
├── 05_knowledge_base/             # Research and book notes
├── Excalidraw/                    # Excalidraw drawings
├── Img/                           # Images used by documents
└── mynetmate/                     # Central team Git repository
    ├── backend/                   # FastAPI repository
    ├── website/                   # React/Vite repository
    ├── docs/                      # Team documentation repository
    └── network-discovery/         # Teammate-owned; AI read-only
```

`mynetmate/` และ `backend/`, `website/`, `docs/` มีขอบเขต Git แยกกัน ควรตรวจ repository root ก่อน Commit หรือ Push ทุกครั้ง

## Quick Navigation

### Architecture and UI

- [System Diagram in Proposal](<01_architecture_and_specs/System Diagram in Proposal(CEPP).md>)
- [Full-page UI specification](01_architecture_and_specs/netconfig_full_page_specs.html)
- [Config Builder mockup](<mynetmate/docs/Feature Design/02_Device Inventory Management(Tee)/Mockup จากภาพพี่ออม.md>)

### Feature scope and design

- [MVP Scope — Weight Feature List](<02_feature/MyNetMate Weight Feature List (AI คิด).md>) — อ่านก่อนเริ่มงาน
- [Original Feature List](<02_feature/MyNetMate รายการ Features.md>)
- [Data Information](<02_feature/Data Information 27-06-69.md>)
- [Device Inventory notes](<02_feature/02_Device Inventory Management(Tee)/README 1.md>)
- [Configuration Driver Architecture](<02_feature/05_Configuration Management(Aom)/แนวคิด Plugin Driver Architecture.md>)
- [AI or No-AI Decision](<02_feature/05_Configuration Management(Aom)/Decision AI or NoAI in Project.md>)
- [Restore Strategy](<02_feature/10_Configuration Deployment(Aom)/แนวคิด Restore Strategy.md>)
- [Cut Features and Rationale](<02_feature/10_Configuration Deployment(Aom)/Cutting Your Own Legs.md>)

### Project and research

- [Proposal](<04_project_management/Document Project/CEPP68-33 Proposal.md>)
- [Gantt chart](<04_project_management/Document Project/gantt_chart.md>)
- [Advisor feedback](<04_project_management/Advisor Teacher/>)
- [Course requirements](<04_project_management/วิชา CE Project 1 และ 2/>)
- [Technology evaluations](03_tech_evaluations/)
- [Knowledge base](05_knowledge_base/)

### AI and Obsidian

- [AI Agent Instructions](AGENTS.md)
- [Obsidian Extensions Guide](OBSIDIAN_EXTENSIONS.md)

## Run the Current Prototype

### Backend

```powershell
cd mynetmate/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

เมื่อเริ่มสำเร็จ:

- API documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

### Frontend

```powershell
cd mynetmate/website
npm install
npm run dev
```

คำสั่งเพิ่มเติม:

```powershell
npm run build
npm run lint
```

> Frontend ปัจจุบันยังเป็น Vite starter และยังไม่ใช่ MyNetMate UI ที่สมบูรณ์

## For AI Agents

อ่าน [AGENTS.md](AGENTS.md) ก่อนทำงานทุกครั้ง โดยเฉพาะ MVP scope, PII masking, CIS gate, Vendor honesty, Git boundaries และข้อห้ามแก้ `mynetmate/network-discovery/`

---

*MyNetMate — CEPP68-33, KMITL | Last verified: 2026-09-03*
