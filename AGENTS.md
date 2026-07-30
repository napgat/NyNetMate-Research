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
- [Decision AI or NoAI in Project.md](01_architecture_and_specs/Decision%20AI%20or%20NoAI%20in%20Project.md) — กรอบการตัดสินใจ AI 12 ฟังก์ชัน

### 🔍 `02_feature_deep_dives/` — Deep Dives on Core Features

### ⚖️ `03_tech_evaluations/` — Technology Research & Tool Selection
- [Microsoft Presidio.md](03_tech_evaluations/Microsoft%20Presidio.md) — Local PII Masking Guide
- [Netmiko.md](03_tech_evaluations/Netmiko.md) — Netmiko Usage & TextFSM Integration
- [NAPALM.md](03_tech_evaluations/NAPALM.md) — NAPALM Framework Evaluation
- [Nornir.md](03_tech_evaluations/Nornir.md) — Nornir Automation Framework
- [Ansible.md](03_tech_evaluations/Ansible.md) — Ansible Network Automation
- [Netdisco.md](03_tech_evaluations/Netdisco.md) — Open-source NMS Reference
- [SolarWinds Hybrid Cloud Observability.md](03_tech_evaluations/SolarWinds%20Hybrid%20Cloud%20Observability.md) — Commercial NMS Comparison

### 📋 `04_project_management/` — Proposals, Reports, Estimates & Feedback
- [CEPP68-33 Proposal.md](04_project_management/Document%20Project/CEPP68-33%20Proposal.md) — เอกสารข้อเสนอโครงงาน (Proposal)
- [gantt_chart.md](04_project_management/Document%20Project/gantt_chart.md) — แผนการดำเนินงาน Gantt Chart

### 📚 `05_knowledge_base/` — Book Outlines & Summaries
- [What is Network Automationa.md](05_knowledge_base/What%20is%20Network%20Automationa.md) — Overview of Network Automation
- **NPA2e (Network Programmability and Automation 2nd Ed.):**
  - Summaries: Ch.2 (Automation), Ch.8 (Data Models), Ch.9 (Jinja2), Ch.10 (APIs & Netmiko), Ch.12 (Ansible/Nornir/Terraform), Ch.14 (NAA Architecture)
- **AI Networking Cookbook:**
  - Summaries: Ch.5 (LangChain), Ch.7 (LLM Backend), Ch.8 (Network Co-Pilot)

### 🎨 `06_ui_mockups/` — UI Design & Mockups

---

## 🔒 4. Rules for AI Agents Working on This Project

1. **Always Read Context First:** Check `AGENTS.md` and relevant deep-dive docs before modifying code.
2. **Never Break Safety Gates:** All configurations must pass CIS 24-rule checks and local PII masking.
3. **No Direct Execution:** AI generates suggestions only; human engineer approves deployment.
4. **Preserve Documentation Links:** Keep file links using `file:///` format in reports.

---
*Maintained by Antigravity AI for CEPP68-33 | Last Updated: 2026-07-22*
