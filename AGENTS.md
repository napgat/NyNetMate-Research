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
- [System Diagram.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/System%20Diagram.md) — สถาปัตยกรรมระบบ 8 ส่วนหลัก
- [netconfig_full_page_specs.html](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/netconfig_full_page_specs.html) — ข้อกำหนด UI/UX ละเอียดทั้ง 8 หน้า (P0-P7)
- [จากภาพพี่ออม.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%AD%E0%B8%AD%E0%B8%A1.md) — UI Mockup 6 แท็บสำหรับ Config Builder
- [การตัดสินใจ ใช้ AI vs ไม่ใช้ AI ในโปรเจกต์.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%5F%E0%B8%95%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B9%83%E0%B8%8 me_%E0%B9%83%E0%B8%8A%E0%B9%8B_AI_vs_%E0%B9%84%E0%B8%A1%E0%B9%8B%E0%B9%83%E0%B8%8A%E0%B9%8B_AI_%E0%B9%83%E0%B8%99%E0%B9%85%E0%B8%9B%E0%B8%A3%E0%B9%86%E0%B9%80%E0%B8%88%E0%B8%81%E0%B8%5F.md) — กรอบการตัดสินใจ AI 12 ฟังก์ชัน
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม SL.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/%E0%B8%AD%E0%B9%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%B7%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%8B%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20SL.md) — Software Layer & Async I/O Design
- [Subscription.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/01_architecture_and_specs/Subscription.md) — Open Core Business Model (Free vs Pro)

### 🔍 `02_feature_deep_dives/` — Deep Dives on Core Features
- [อ่านเนื้อหาเชิงลึกเพิมเติม AII&CG.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/02_feature_deep_dives/%E0%B8%AD%E0%B9%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%B7%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20AII%26CG.md) — AI Integration & Config Generation (RAG architecture)
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม ND.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/02_feature_deep_dives/%E0%B8%AD%E0%B9%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%B7%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%8B%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20ND.md) — Network Discovery Pipeline (Collection → Parsing → Storage)
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม SA & PV.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/02_feature_deep_dives/%E0%B8%AD%E0%B9%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%B7%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%8B%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20SA%20%26%20PV.md) — Security Automation & 24 CIS Rules Validation
- [อ่านเนื้อหาเชิงลึกเพิ่มเติม SD& MVA.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/02_feature_deep_dives/%E0%B8%AD%E0%B9%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%B7%E0%B8%AB%E0%B8%B2%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%8B%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%20SD%26%20MVA.md) — Script-Driven Multi-Vendor Automation Progression

### ⚖️ `03_tech_evaluations/` — Technology Research & Tool Selection
- [เหตุผลเชิงลึกตามเครือง.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/%E0%B9%80%E0%B8%AB%E0%B8%95%E0%B8%B9%E0%B8%9C%E0%B8%A5%E0%B9%80%E0%B8%8D%E0%B8%B4%E0%B8%87%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%5F%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%87.md) — การเปรียบเทียบ Tool Abstraction Levels
- [Microsoft Presidio.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/Microsoft%20Presidio.md) — Local PII Masking Guide
- [NPA_The Netmiko Python Library.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/NPA_The%20Netmiko%20Python%20Library.md) — Netmiko Usage & TextFSM Integration
- [Netdisco.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/Netdisco.md) — Open-source NMS Reference
- [SolarWinds Hybrid Cloud Observability.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/SolarWinds%20Hybrid%20Cloud%20Observability.md) — Commercial NMS Comparison
- [YANG MODEL.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/YANG%20MODEL.md) — YANG Data Modeling Standard
- [Config C2960 VLAN.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/03_tech_evaluations/Config%20C2960%20VLAN.md) — Cisco Catalyst 2960 IOS 15.2 Reference

### 📋 `04_project_management/` — Proposals, Reports, Estimates & Feedback
- [MyNetMate_Features_and_Tools_Comprehensive.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/Document%20Project/MyNetMate_Features_and_Tools_Comprehensive.md) — สรุปรวม Features และ Tools ทั้งหมดในระบบ
- [MyNetMate_Infographic.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/Document%20Project/MyNetMate_Infographic.md) — Project Infographic (Obsidian Friendly)
- [MyNetMate_Tool_Weight_Analysis.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/Document%20Project/MyNetMate_Tool_Weight_Analysis.md) — คะแนนน้ำหนักและการเปรียบเทียบเครื่องมือ 15 หมวด
- [MyNetMate_Time_Estimate.md](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/Document%20Project/MyNetMate_Time_Estimate.md) — การประเมินเวลาและแผนการตัด Feature (Cut List)
- [TeacherSay/](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/TeacherSay) — คำแนะนำและ Feedback จากอาจารย์ปริญญา
- [Discord/](file:///E:/CEPP%20Project/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B9%E0%B8%95%E0%B8%A3/KMITL_Knowledge/Project/04_project_management/Discord%20%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AB%E0%B9%83%E0%B8%99%E0%B8%8D%E0%B9%8B%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%8A%E0%B8%95) — ข้อความหารือใน Discord ทีม

### 📚 `05_knowledge_base/` — Book Outlines & Summaries
- **NPA2e (Network Programmability and Automation 2nd Ed.):** Ch.2 (Automation), Ch.8 (Data Models), Ch.9 (Jinja2), Ch.10 (APIs & Netmiko), Ch.12 (Ansible/Nornir/Terraform), Ch.14 (NAA Architecture)
- **AI Networking Cookbook:** Ch.5 (LangChain), Ch.7 (LLM Backend), Ch.8 (Network Co-Pilot)

---

## 🔒 4. Rules for AI Agents Working on This Project

1. **Always Read Context First:** Check `AGENTS.md` and relevant deep-dive docs before modifying code.
2. **Never Break Safety Gates:** All configurations must pass CIS 24-rule checks and local PII masking.
3. **No Direct Execution:** AI generates suggestions only; human engineer approves deployment.
4. **Preserve Documentation Links:** Keep file links using `file:///` format in reports.

---
*Maintained by Antigravity AI for CEPP68-33 | Last Updated: 2026-07-22*
