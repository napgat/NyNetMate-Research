# 🤖 MyNetMate — Master AI Agent Context & Navigation Map
> **Project:** MyNetMate (CEPP Capstone Project CEPP68-33, KMITL)  
> **Purpose:** Master context guide, file index, and rules of engagement for AI Coding Agents (Antigravity, Cursor, Claude Code, GitHub Copilot).

---

## 📌 1. Project Philosophy & Core Principles

> **"ใช้ AI เมื่อต้องการ 'ความเข้าใจ' — ไม่ใช้ AI เมื่อต้องการ 'ความถูกต้อง'"**

- **Golden Rule:** "มีคำตอบถูกต้องเพียง 1 คำตอบหรือไม่?" → **ใช่** = ใช้ Rule/Jinja2 Template → **ไม่** = ใช้ Gemini AI
- **80/20 Hybrid Ratio:** 80% Deterministic Jinja2 Templates + 20% AI-Powered Gemini + RAG
- **Vendor Scope (Phase 1):** Cisco IOS (100% Priority) & MikroTik RouterOS v7. Firewalls are dropped.
- **Safety First:** AI NEVER executes commands directly on network devices. All AI outputs require Human-in-the-Loop review and approval. CIS 24-rule security scan is a mandatory gate before any SSH push.
- **Data Privacy:** PII (IPs, Passwords, Keys) MUST be masked 100% locally via Microsoft Presidio / Regex BEFORE sending prompts to public Gemini API.

---

## 🛠️ 2. Core Tech Stack Overview

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, TanStack Router/Query, Zustand, Tabler Icons |
| **Backend** | Python 3.11+, FastAPI (Async), Pydantic, SQLAlchemy 2.0 ORM, Uvicorn |
| **Network** | Netmiko (SSH), TextFSM / NTC Templates (CLI Parsing), ciscoconfparse (CIS Rules) |
| **AI / Security** | Google Gemini 1.5 Flash/Pro API, LangChain, Pinecone/ChromaDB (RAG), Microsoft Presidio (PII) |
| **Database** | PostgreSQL 15+ (SQL:2011 System-Versioned Tables), SQLite (Dev/Test) |
| **Testing/Infra**| Docker, Docker Compose, ContainerLab (Network Simulation), Pytest, Jest |

---

## 🗺️ 3. Project Directory Map & File Index

AI Agents should use this map to quickly locate authoritative documentation:

### 🏛️ `01_architecture_and_specs/` — System Architecture & UI Specifications
- [System Diagram in Proposal.md](01_architecture_and_specs/System%20Diagram%20in%20Proposal.md) — สถาปัตยกรรมระบบ 8 ส่วนหลัก
- [netconfig_full_page_specs.html](01_architecture_and_specs/netconfig_full_page_specs.html) — ข้อกำหนด UI/UX ละเอียดทั้ง 8 หน้า (P0-P7)
- [Mockup จากภาพพี่ออม.md](01_architecture_and_specs/Mockup%20%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%AD%E0%B8%AD%E0%B8%A1.md) — UI Mockup 6 แท็บสำหรับ Config Builder
- [Decision AI or NoAI in Project.md](01_architecture_and_specs/Decision%20AI%20or%20NoAI%20in%20Project.md) — กรอบการตัดสินใจ AI 12 ฟังก์ชัน
- [Software Layer.md](01_architecture_and_specs/Software%20Layer.md) — Software Layer & Async I/O Design
- [Subscription Plan.md](01_architecture_and_specs/Subscription%20Plan.md) — Open Core Business Model (Free vs Pro)

### 🔍 `02_feature_deep_dives/` — Deep Dives on Core Features
- [อ่านเนื้อหาเชิงลึกเพิมเติม AII&CG.md](02_feature_deep_dives/%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20AII%26CG.md) — AI Integration & Config Generation (RAG architecture)
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม ND.md](02_feature_deep_dives/%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20ND.md) — Network Discovery Pipeline (Collection → Parsing → Storage)
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม SA & PV.md](02_feature_deep_dives/%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20SA%20%26%20PV.md) — Security Automation & 24 CIS Rules Validation
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม SD& MVA.md](02_feature_deep_dives/%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20SD%26%20MVA.md) — Script-Driven Multi-Vendor Automation Progression
- [ค้นคว้า YANG MODEL.md](02_feature_deep_dives/%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%84%E0%B8%A7%E0%B9%89%E0%B8%B2%20YANG%20MODEL.md) — YANG Data Modeling Standard

### ⚖️ `03_tech_evaluations/` — Technology Research & Tool Selection
- [ค้นคว้าเครื่องมือ Netmik vs NAPALM vs Nornir vs Ansible.md](03_tech_evaluations/%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%84%E0%B8%A7%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%20Netmik%20vs%20NAPALM%20vs%20Nornir%20vs%20Ansible.md) — การเปรียบเทียบ Tool Abstraction Levels
- [Microsoft Presidio.md](03_tech_evaluations/Microsoft%20Presidio.md) — Local PII Masking Guide
- [Netmiko.md](03_tech_evaluations/Netmiko.md) — Netmiko Usage & TextFSM Integration
- [NAPALM.md](03_tech_evaluations/NAPALM.md) — NAPALM Framework Evaluation
- [Nornir.md](03_tech_evaluations/Nornir.md) — Nornir Automation Framework
- [Ansible.md](03_tech_evaluations/Ansible.md) — Ansible Network Automation
- [Netdisco.md](03_tech_evaluations/Netdisco.md) — Open-source NMS Reference
- [SolarWinds Hybrid Cloud Observability.md](03_tech_evaluations/SolarWinds%20Hybrid%20Cloud%20Observability.md) — Commercial NMS Comparison

### 📋 `04_project_management/` — Proposals, Reports, Estimates & Feedback
- [CEPP68-33 Proposal.md](04_project_management/Document%20Project/CEPP68-33%20Proposal.md) — เอกสารข้อเสนอโครงงาน (Proposal)
- [MyNetMate_Features_and_Tools_Comprehensive.md](04_project_management/Document%20Project/MyNetMate_Features_and_Tools_Comprehensive.md) — สรุปรวม Features และ Tools ทั้งหมดในระบบ
- [MyNetMate_Infographic.md](04_project_management/Document%20Project/MyNetMate_Infographic.md) — Project Infographic (Obsidian Friendly)
- [MyNetMate_Tool_Weight_Analysis.md](04_project_management/Document%20Project/MyNetMate_Tool_Weight_Analysis.md) — คะแนนน้ำหนักและการเปรียบเทียบเครื่องมือ 15 หมวด
- [gantt_chart.md](04_project_management/Document%20Project/gantt_chart.md) — แผนการดำเนินงาน Gantt Chart
- [จุดตายในการพรีเซ็นตาม silde Present.md](04_project_management/%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B8%B2%E0%B8%A1%20silde%20Present.md) — ข้อควรระวังและแนวทางตอบคำถามพรีเซนต์
- [คู่มือนักศึกษา รายละเอียดการแปลง Requirement สู่การสร้างระบบที่ย้อนกลับได้.md](04_project_management/%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%20CE%20Project%201/%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%20%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%9B%E0%B8%A5%E0%B8%87%20Requirement%20%E0%B8%AA%E0%B8%B9%E0%B9%88%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B9%84%E0%B8%94%E0%B9%89.md) — คู่มือนักศึกษา แปลง Requirement สู่ระบบย้อนกลับได้ (QFD ➔ Functional Decomposition)
- [TeacherSay/](04_project_management/TeacherSay/) — คำแนะนำและ Feedback จากอาจารย์ปริญญา
  - [สรุปสิ่งที่ได้ไปพูดคุยกับอาจารย์.md](04_project_management/TeacherSay/%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89%E0%B9%84%E0%B8%9B%E0%B8%9E%E0%B8%B9%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%A2%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%88%E0%B8%B2%E0%B8%A3%E0%B8%A2%E0%B9%8C.md) — สรุปการเข้าพบอาจารย์

### 📚 `05_knowledge_base/` — Book Outlines & Summaries
- [What is Network Automationa.md](05_knowledge_base/What%20is%20Network%20Automationa.md) — Overview of Network Automation
- **NPA2e (Network Programmability and Automation 2nd Ed.):**
  - [NPA_The Netmiko Python Library.md](05_knowledge_base/%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD/NPA_The%20Netmiko%20Python%20Library.md) — Netmiko Chapter Summary
  - [NPA2e_TableOfContents.md](05_knowledge_base/%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD/%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD/NPA2e_TableOfContents.md) — Table of Contents
  - Summaries: Ch.2 (Automation), Ch.8 (Data Models), Ch.9 (Jinja2), Ch.10 (APIs & Netmiko), Ch.12 (Ansible/Nornir/Terraform), Ch.14 (NAA Architecture)
- **AI Networking Cookbook:**
  - [AI_Networking_Cookbook_TOC.md](05_knowledge_base/%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD/%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD/AI_Networking_Cookbook_TOC.md) — Table of Contents
  - Summaries: Ch.5 (LangChain), Ch.7 (LLM Backend), Ch.8 (Network Co-Pilot)

---

## 🔒 4. Rules for AI Agents Working on This Project

1. **Always Read Context First:** Check `AGENTS.md` and relevant deep-dive docs before modifying code.
2. **Never Break Safety Gates:** All configurations must pass CIS 24-rule checks and local PII masking.
3. **No Direct Execution:** AI generates suggestions only; human engineer approves deployment.
4. **Preserve Documentation Links:** Keep file links using `file:///` format in reports.

---
*Maintained by Antigravity AI for CEPP68-33 | Last Updated: 2026-07-22*
