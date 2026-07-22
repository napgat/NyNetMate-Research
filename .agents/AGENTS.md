# 🤖 Workspace Rules — MyNetMate Project (.agents/AGENTS.md)

## 📌 Project Identity
- **Project Name:** MyNetMate (Network Management System + AI Co-pilot)
- **Course:** CEPP Capstone Project (CEPP68-33), KMITL
- **Advisor:** Ajarn Prinya (อาจารย์ปริญญา)

## 🎯 Architectural Principles
1. **Core Philosophy:** "ใช้ AI เมื่อต้องการ 'ความเข้าใจ' — ไม่ใช้ AI เมื่อต้องการ 'ความถูกต้อง'"
2. **80/20 Hybrid Rule:** 80% Jinja2 Templates (Deterministic) + 20% Gemini API (Contextual)
3. **Vendor Priority:** Cisco IOS (100% Priority in Phase 1) > MikroTik RouterOS v7. Firewalls dropped.
4. **Safety Net:** Never execute SSH commands without human review (Plan → Apply workflow).
5. **Privacy Net:** 100% Local PII Masking via Presidio/Regex before any API call.

## 🛠️ Code Conventions
- **Language:** Python 3.11+ for Backend (FastAPI), TypeScript for Frontend (React 18).
- **Communication Style:** Thai for conversation/reports, English for code, variable names, and technical terms.
- **Documentation:** Markdown with GFM alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`).

## 📁 File Structure Map
Refer to [AGENTS.md](../AGENTS.md) at project root for the complete file index and folder map.
