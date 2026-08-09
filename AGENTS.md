# 🤖 MyNetMate — Master AI Agent Context & Navigation Map
> **Project:** MyNetMate (CEPP Capstone Project CEPP68-33, KMITL)  
> **Purpose:** Master context guide, file index, and rules of engagement for AI Coding Agents (Antigravity, Cursor, Claude Code, GitHub Copilot).  
> **Last Updated:** 2026-07-31

---

## 📌 1. Project Overview

**MyNetMate** คือ Web Application สำหรับ Network Management และ Configuration Automation สำหรับวิศวกรเครือข่าย ทำเป็น Capstone Project (CEPP) ของ KMITL โดยทีม 4 คน

### ปรัชญาหลักของระบบ
> **"ใช้ AI เมื่อต้องการ 'ความเข้าใจ' — ไม่ใช้ AI เมื่อต้องการ 'ความถูกต้อง'"**

- **Golden Rule:** "มีคำตอบถูกต้องเพียง 1 คำตอบหรือไม่?" → **ใช่** = ใช้ Rule/Jinja2 Template → **ไม่** = ใช้ Gemini AI
- **80/20 Hybrid Ratio:** 80% Deterministic Jinja2 Templates + 20% AI-Powered Gemini
- **Vendor Scope (MVP):** Cisco IOS (100% Priority), MikroTik RouterOS รอง
- **Safety First:** AI ห้าม Execute คำสั่งบนอุปกรณ์โดยตรง ต้องผ่าน Human-in-the-Loop เสมอ
- **Data Privacy:** PII (IPs, Passwords, Keys) ต้อง Mask 100% ด้วย `yacryptopan` (IP) + Regex (Password) ก่อนส่งออกหา Gemini API

---

## 🛠️ 2. Core Tech Stack

| Layer           | Technologies                                                                          |
| --------------- | ------------------------------------------------------------------------------------- |
| **Frontend**    | React 18, TypeScript, Tailwind CSS, TanStack Router/Query, Zustand                    |
| **Backend**     | Python 3.11+, FastAPI (Async), Pydantic v2, SQLAlchemy 2.0, Uvicorn                   |
| **Network**     | Netmiko (SSH Push), TextFSM / NTC Templates (CLI Parsing), ciscoconfparse (CIS Rules) |
| **AI**          | Google Gemini 1.5 Flash/Pro API, Structured Output (JSON Schema)                      |
| **PII Masking** | `yacryptopan` (IP Anonymization, Prefix-preserving) + Regex (Passwords/Keys)          |
| **Database**    | PostgreSQL 15+ (Production), SQLite (Dev/Test)                                        |
| **Infra/Test**  | Docker, Docker Compose, GNS3 / Packet Tracer (Network Simulation), Pytest, Jest       |

> ⚠️ **เลิกใช้แล้ว:** LangChain, Pinecone/ChromaDB (RAG Vector DB), Microsoft Presidio, spaCy NLP  
> เหตุผล: ซับซ้อนเกินจำเป็นสำหรับ Use-case ของโปรเจกต์ ใช้ DB Context Injection + Regex แทน

---

## ⚠️ 3. ข้อจำกัดหลักของโปรเจกต์ (Project Constraints)

| ข้อจำกัด | รายละเอียด |
|---|---|
| **เวลา** | ~1 semester (CE Project 1 = Proposal/Research, CE Project 2 = Implementation) |
| **จำนวนคน** | 4 คน (นักศึกษา) |
| **Tech Complexity** | Backend + Frontend + Network Device จริงพร้อมกัน |
| **ความเสี่ยง** | Config ผิด = อุปกรณ์จริงพัง |
| **ของที่ต้องส่ง** | Thesis เล่ม + ระบบที่ทำงานได้จริง + การนำเสนอ |
| **อุปกรณ์** | ทดสอบบนคอม (GNS3/Packet Tracer), อุปกรณ์จริงต้องขอยืมอาจารย์ (ไม่แน่ใจว่ามีรุ่นที่ต้องการ) |
| **IOS Version** | คำสั่ง Cisco ต่างกันตาม IOS Version — Template ที่เขียนอาจใช้ไม่ได้กับรุ่นที่ยืมมา |
| **Simulation ≠ Real** | GNS3/Packet Tracer มีพฤติกรรมต่างจากอุปกรณ์จริง (SSH Timing, SNMP Response) |
| **Network มหาลัย** | ห้ามทำ Ping Sweep/Port Scan บนเครือข่ายมหาลัย ทดสอบได้แค่ Isolated Lab |
| **เวลา Coding จริงน้อยกว่าที่คิด** | CE Project 1 กินเวลาเขียนเอกสาร — เวลา Coding จริงอยู่ใน CE Project 2 เป็นหลัก |
| **ทักษะทีมไม่เท่ากัน** | บางคนถนัด Frontend บางคนถนัด Network — ฟีเจอร์ที่ต้องทักษะรอบด้านจะเป็น Bottleneck |
| **Gemini API Quota** | Free Tier มี Rate Limit — ตอน Demo อาจ Error ถ้ากดบ่อยเกินไป |
| **อาจารย์ที่ปรึกษา** | นัด Feedback แต่ละรอบใช้เวลาหลายวัน ทำให้ตัดสินใจบางอย่างล่าช้า |

---

## 🗺️ 4. Project Directory Map & File Index

### 🏛️ `01_architecture_and_specs/` — System Architecture & UI Specifications
- [System Diagram in Proposal.md](01_architecture_and_specs/System%20Diagram%20in%20Proposal.md) — สถาปัตยกรรมระบบ 8 ส่วนหลัก
- [netconfig_full_page_specs.html](01_architecture_and_specs/netconfig_full_page_specs.html) — ข้อกำหนด UI/UX ละเอียดทั้ง 8 หน้า (P0-P7)
- [Decision AI or NoAI in Project.md](01_architecture_and_specs/Decision%20AI%20or%20NoAI%20in%20Project.md) — กรอบการตัดสินใจ AI 12 ฟังก์ชัน

### 🔍 `02_feature/` — Feature Documentation (⚠️ โฟลเดอร์ชื่อใหม่ ไม่ใช่ 02_feature_deep_dives แล้ว)

| ไฟล์ | เนื้อหา | ความสำคัญ |
|---|---|---|
| [MyNetMate Weight Feature List.md](02_feature/MyNetMate%20Weight%20Feature%20List.md) | **ไฟล์หลักล่าสุด** — MVP Scope ฉบับ Final หลังประเมิน (P1 vs P2 vs CUT) | 🔴 อ่านก่อนเลย |
| [MyNetMate รายการ Features.md](02_feature/MyNetMate%20รายการ%20Features.md) | รายการ Feature ทั้งหมด 11 หมวดฉบับดั้งเดิม + ปรัชญาระบบ | 🟡 อ่านอ้างอิง |
| [Mockup จากภาพพี่ออม.md](Mockup%20จากภาพพี่ออม.md) | UI Mockup 6 Tab สำหรับ Config Builder — Blueprint สำหรับ Frontend | 🔴 อ่านก่อนเลย |
| [Data Information.md](02_feature/Device%20Inventory%20Management/Data%20Information.md) | Schema ข้อมูลที่ต้องเก็บใน Device Inventory (PostgreSQL) | 🟡 อ่านเมื่อทำ DB |
| [Device Inventory.md](Device%20Inventory.md) | รายละเอียดเชิงลึกของ Feature Device Discovery & Inventory | 🟡 อ่านเมื่อทำ Discovery |
| [Plugin Driver Architecture.md](แนวคิด%20Plugin%20Driver%20Architecture.md) | สถาปัตยกรรม Multi-vendor Driver Pattern | 🟡 อ่านเมื่อทำ Multi-vendor |
| [Cutting Your Own Legs.md](Cutting%20Your%20Own%20Legs.md) | Feature ที่ตัดออกแล้วพร้อมเหตุผลทางเทคนิค | 🟢 อ่านเมื่อต้องการทราบว่าทำไมถึงไม่ทำ |
| [Restore Strategy.md](แนวคิด%20Restore%20Strategy.md) | กลยุทธ์การ Rollback และ Version Control | 🟢 อ่านเมื่อทำ Version Control |
| [MyNetMate (1).drawio.html](02_feature/MyNetMate%20(1).drawio.html) | Diagram ภาพรวมโปรเจกต์ (ไฟล์ Draw.io) | 🟢 ดูเพื่อเข้าใจภาพรวม |

### ⚖️ `03_tech_evaluations/` — Technology Research & Tool Selection
- [ค้นคว้าเครื่องมือ Netmiko vs NAPALM vs Nornir vs Ansible.md](03_tech_evaluations/) — Tool Comparison Matrix
- [Microsoft Presidio.md](03_tech_evaluations/Microsoft%20Presidio.md) — **(เลิกใช้แล้ว)** เก็บไว้เป็น Reference
- [Netmiko.md](03_tech_evaluations/Netmiko.md) — Netmiko SSH Library (ใช้อยู่)
- [NAPALM.md](03_tech_evaluations/NAPALM.md) — NAPALM Framework Evaluation
- [Nornir.md](03_tech_evaluations/Nornir.md) — Nornir Framework Evaluation
- [Ansible.md](03_tech_evaluations/Ansible.md) — Ansible Evaluation
- [Netdisco.md](03_tech_evaluations/Netdisco.md) — Open-source NMS Reference
- [SolarWinds Hybrid Cloud Observability.md](03_tech_evaluations/SolarWinds%20Hybrid%20Cloud%20Observability.md) — Commercial NMS Comparison

### 📋 `04_project_management/` — Proposals, Reports & Feedback
- [Document Project/](04_project_management/Document%20Project/) — เอกสาร Proposal และ Gantt Chart
- [Advisor Teacher/](04_project_management/Advisor%20Teacher/) — Feedback จากอาจารย์ที่ปรึกษา (อาจารย์ปริญญา)
- [วิชา CE Project 1 และ 2/](04_project_management/วิชา%20CE%20Project%201%20และ%202/) — เกณฑ์การให้คะแนนและ Grading Policy

### 📚 `05_knowledge_base/` — Book Summaries & Research Notes
- [What is Network Automationa.md](05_knowledge_base/What%20is%20Network%20Automationa.md) — Overview of Network Automation
- **NPA2e (Network Programmability and Automation 2nd Ed.):**
  - Ch.2 (Automation), Ch.8 (Data Models), Ch.9 (Jinja2 Templates), Ch.10 (APIs & Netmiko), Ch.12 (Ansible/Nornir), Ch.14 (NAA Architecture)
- **AI Networking Cookbook:**
  - Ch.5 (LangChain for Networking), Ch.7 (LLM Backend), Ch.8 (Network Co-Pilot & RAG)

---

## 🎯 5. Feature Priority Summary (MVP Scope)

อ้างอิงตามการประเมินล่าสุดในไฟล์ `02_feature/MyNetMate Weight Feature List.md` ฟีเจอร์ถูกแบ่งออกเป็น 3 ระยะ:

### 🏆 P1-CORE & P1-INFRA (CE Project 1 - The "Real" MVP)
1. **Auth & RBAC [Infra]** — Login, JWT, แบ่ง 3 Roles
2. **Dashboard [Infra]** — Metrics พื้นฐาน, Activity Feed, System API Status
3. **Device Inventory [Core]** — เพิ่มอุปกรณ์แบบ Manual, Ping Status, Device Grouping
4. **Config Gen (Template) [Core]** — 6-Tab Form, Jinja2 Render, Debouncing
5. **PII Masking [Infra]** — ซ่อน IP/Password ด้วย `yacryptopan` และ Regex ก่อนส่งออก API
6. **Deployment (Plan) [Core]** — UI Flow โชว์การจำลองก่อน Push จริง (ยังไม่ส่ง SSH)
7. **CIS Benchmark [Core]** — สแกน 8 กฎหลักด้วย Regex
8. **Audit Trail [Infra]** — เก็บ Log ใครทำอะไร เมื่อไหร่ลง Database
9. **AI Guardrails [Infra]** — Context Injection ฉีดข้อมูลเข้า Prompt
10. **Settings [Infra]** — จัดการ User, เปิด/ปิดกฎ CIS, โหมด Offline

### 🚀 P2 (CE Project 2 - Advanced & AI Features)
1. **Network Discovery** — สแกนหาอุปกรณ์อัตโนมัติ (Ping Sweep, SNMP, LLDP)
2. **Topology Visualization** — วาดแผนผัง Network อัตโนมัติด้วย React Flow
3. **AI Config & Review** — แชท AI ช่วยเขียนคำสั่ง และช่วยตรวจ Config (Natural Language)
4. **SSH Command Push** — สั่ง Deploy ลงอุปกรณ์จริง (Netmiko) + Pre/Post Snapshot
5. **Version Control** — ระบบกด Rollback กลับไปใช้ Config เดิม

### ✂️ CUT (ตัดออกถาวร)
| Feature | เหตุผลที่ตัด |
|---|---|
| **Complex Multi-vendor Policy** | AI Hallucination Risk สูง + ต้องการ Abstraction Layer ซับซ้อน |
| **Auto-Rollback on Error** | Cisco IOS ไม่รองรับ Atomic Transaction เสี่ยงพังกว่าเดิม |
| **Idempotency Check** | ต้องการ Full Config Parser ทุก Command ทุก Vendor |
| **Cross-Device Impact Analysis** | ต้องทำ Network Simulator Engine ซึ่งเกินสโคป ป.ตรี |
| **RAG Vector Database** | ใช้ DB Context Injection แทน — เบากว่าและไม่มี Overhead |
| **spaCy NLP** | ใช้ Regex ทำ PII Masking แทน — เบาและเร็วกว่ามาก |
| **MOP Generation** | เพิ่มภาระโดยไม่จำเป็น ไม่ใช่ Core Value ของโปรเจกต์ |
| **Jinja2 Template Manager UI** | ห้ามทำหน้าแก้โค้ดบนเว็บ ให้ Dev แก้ไฟล์โดยตรง |

---

## 🔒 6. Rules for AI Agents Working on This Project

1. **อ่าน `02_feature/MyNetMate Weight Feature List.md` ก่อนเสมอ** — นี่คือ Single Source of Truth ฉบับ Final สำหรับ Scope ของ MVP ส่วน `02_feature/MyNetMate รายการ Features.md` เป็นเพียง Raw Data ต้นฉบับ
2. **อ้างอิง `02_feature/Mockup จากภาพพี่ออม.md`** เมื่อทำงานที่เกี่ยวกับ Frontend UI
3. **ห้ามแนะนำ LangChain, Presidio, spaCy, Vector DB** — ตัดออกจากโปรเจกต์แล้ว ใช้ของแทนที่ที่บอกไว้ใน Tech Stack
4. **ห้าม AI Execute Command บนอุปกรณ์จริง** — Generate เท่านั้น Human กด Deploy เอง
5. **PII ต้อง Mask ก่อนส่ง Gemini API ทุกกรณี**
6. **Config ทุกก้อนต้องผ่าน CIS Rule Check** ก่อน Deploy ไม่ว่าจะมาจาก Template หรือ AI
7. **เน้น Cisco เป็น Priority 1** — MikroTik รอง — Huawei ตัดออก
8. **Scope ของการทดสอบคือ Isolated Lab Environment เท่านั้น** — ห้าม Scan เครือข่ายมหาลัยจริง

---

*Maintained by Antigravity AI for CEPP68-33 | Last Updated: 2026-07-30*
