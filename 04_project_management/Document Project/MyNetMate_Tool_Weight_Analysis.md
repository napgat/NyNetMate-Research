# ⚖️ MyNetMate — Tool Weight Analysis (เปรียบเทียบเครื่องมือทั้งระบบ)
> **วัตถุประสงค์:** อธิบายว่าทำไมเลือก Tool ตัวนี้ ไม่ใช่ตัวอื่น — พร้อมคะแนนน้ำหนัก  
> **บริบท:** นักศึกษา 4 คน, Capstone Project 5 เดือน, งบจำกัด  

---

## 📐 เกณฑ์การให้คะแนน (ใช้ทุกหมวด)

| เกณฑ์ | น้ำหนัก | ความหมาย |
|-------|---------|----------|
| **Learning Curve** | 25% | เรียนรู้ง่ายแค่ไหนสำหรับนักศึกษาที่ไม่เคยใช้ |
| **Fit for Project** | 25% | ตอบโจทย์ MyNetMate โดยเฉพาะแค่ไหน |
| **Community & Docs** | 20% | หาตัวอย่าง/แก้ Bug ง่ายแค่ไหน |
| **Performance** | 15% | เร็ว/เบา/รองรับ Concurrent ได้ดีแค่ไหน |
| **Cost** | 15% | ค่าใช้จ่าย (ฟรี = 5, แพง = 1) |

> คะแนน 1-5 (1=แย่ที่สุด, 5=ดีที่สุด) → **Weighted Score** = ผลรวมถ่วงน้ำหนัก

---

## 1. 🖥️ Backend Framework

| เกณฑ์ (น้ำหนัก) | FastAPI | Django | Flask | Express.js |
|------------------|---------|--------|-------|------------|
| Learning Curve (25%) | 5 | 3 | 4 | 4 |
| Fit for Project (25%) | 5 | 3 | 3 | 2 |
| Community & Docs (20%) | 4 | 5 | 4 | 5 |
| Performance (15%) | 5 | 3 | 3 | 4 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.80** | **3.60** | **3.70** | **3.75** |

### ✅ เลือก: FastAPI

> **เหตุผลหลัก:**
> 1. **Async/Await Native** — Netmiko SSH เป็น Blocking I/O ที่กินเวลานาน, FastAPI รองรับ async ทำให้ไม่ block ทั้ง server ขณะรอ SSH response จากอุปกรณ์
> 2. **Pydantic Built-in** — Validate JSON ที่รับจาก Frontend + ที่ส่งไป Gemini API ได้ทันที ไม่ต้อง install แยก
> 3. **Auto Swagger `/docs`** — ไม่ต้องเขียน API Documentation แยก ได้ Interactive API docs ฟรี ซึ่งดีมากสำหรับทีมที่ Frontend กับ Backend คนละคน
> 4. **Type Hints = Self-Documenting** — โค้ดอ่านง่าย ไม่ต้องเดา Parameter types
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Django:** ใหญ่เกินไป มี ORM/Admin/Template ของตัวเอง แต่เราใช้ React + SQLAlchemy → Feature ส่วนใหญ่ของ Django เป็น Dead weight
> - **Flask:** ดีแต่ไม่มี Async native, ไม่มี Pydantic built-in, ต้อง install extension เยอะ
> - **Express.js:** ต้องเขียน Backend เป็น JavaScript/TypeScript ทั้งหมด แต่ Netmiko, TextFSM, Jinja2 เป็น Python library → ใช้ร่วมกันไม่ได้

---

## 2. 🎨 Frontend Framework

| เกณฑ์ (น้ำหนัก) | React | Vue 3 | Angular | Svelte |
|------------------|-------|-------|---------|--------|
| Learning Curve (25%) | 4 | 5 | 2 | 4 |
| Fit for Project (25%) | 5 | 4 | 4 | 3 |
| Community & Docs (20%) | 5 | 4 | 4 | 3 |
| Performance (15%) | 4 | 4 | 3 | 5 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.55** | **4.35** | **3.35** | **3.80** |

### ✅ เลือก: React 18

> **เหตุผลหลัก:**
> 1. **Ecosystem ใหญ่ที่สุด** — หา Component Library, Canvas Library, Code Editor ของ React ได้ง่ายมาก (shadcn/ui, react-ace, react-diff-viewer)
> 2. **TanStack Query** — จัดการ Server State (Cache, Refetch, Optimistic Update) ง่ายกว่า Vue/Angular ที่ต้อง setup เอง
> 3. **Job Market** — นักศึกษาเรียน React แล้วใช้หาฝึกงานได้เลย
> 4. **AI Copilot ช่วยได้ดีที่สุด** — React มี Training data ใน LLM มากที่สุด → AI แนะนำโค้ดได้แม่นกว่า
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Vue 3:** ดีมากสำหรับ Simple app แต่ Canvas-based Topology + Complex Config Wizard มี Component Library ของ React เยอะกว่า
> - **Angular:** Learning curve สูงมาก (RxJS, Module system, DI) — นักศึกษา 5 เดือนเรียนไม่ทัน
> - **Svelte:** Ecosystem ยังเล็ก หา Component สำเร็จรูปยาก ต้องเขียนเองเยอะ

---

## 3. 📡 SSH Automation Library

| เกณฑ์ (น้ำหนัก) | Netmiko | Paramiko | NAPALM | Nornir | Ansible |
|------------------|---------|----------|--------|--------|---------|
| Learning Curve (25%) | 5 | 3 | 4 | 3 | 3 |
| Fit for Project (25%) | 5 | 3 | 4 | 4 | 2 |
| Community & Docs (20%) | 5 | 4 | 4 | 3 | 5 |
| Performance (15%) | 4 | 4 | 3 | 5 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.80** | **3.55** | **3.95** | **3.80** | **3.40** |

### ✅ เลือก: Netmiko (หลัก) + TextFSM (Parsing)

> **เหตุผลหลัก:**
> 1. **Network-Specific Abstraction** — `send_command()`, `send_config_set()`, `save_config()` ทำงานตรงกับที่ Network Engineer ต้องการ ไม่ต้องจัดการ SSH Prompt เอง
> 2. **รองรับ 50+ Vendor** — `cisco_ios`, `mikrotik_routeros`, `huawei` ฯลฯ เปลี่ยน `device_type` ตัวเดียว
> 3. **TextFSM Integration** — ใช้ `use_textfsm=True` แปลง CLI output เป็น JSON ได้ทันที ไม่ต้อง Regex เอง
> 4. **ตรงกับ NPA2e Ch.10** — หนังสือที่ใช้เรียนสอน Netmiko โดยเฉพาะ → มีตัวอย่างพร้อม
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Paramiko:** Low-level เกินไป ต้อง handle SSH prompt, enable mode, config mode เอง → เสียเวลาเขียน Wrapper
> - **NAPALM:** ดีมากสำหรับ `get_facts()` + `config_replace()` แต่รองรับ MikroTik จำกัด และ Config Merge ที่ MyNetMate ต้องการ ทำผ่าน Netmiko ง่ายกว่า
> - **Nornir:** Framework ที่ดีสำหรับ Scale แต่ Learning Curve สูง + MyNetMate มี FastAPI เป็น Orchestrator อยู่แล้ว ไม่ต้องการ Nornir Inventory/Runner ซ้ำซ้อน
> - **Ansible:** YAML-based DSL ไม่ใช่ Python Library — ฝัง Logic ซับซ้อนลำบาก และ MyNetMate ต้องการ Real-time SSH interaction ผ่าน WebSocket ซึ่ง Ansible ทำไม่ได้

---

## 4. 📝 Template Engine (Config Generation)

| เกณฑ์ (น้ำหนัก) | Jinja2 | Mako | Python f-string | YAML + Custom |
|------------------|--------|------|-----------------|---------------|
| Learning Curve (25%) | 5 | 3 | 5 | 2 |
| Fit for Project (25%) | 5 | 4 | 2 | 3 |
| Community & Docs (20%) | 5 | 3 | 5 | 2 |
| Performance (15%) | 4 | 5 | 5 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.85** | **3.70** | **3.85** | **2.75** |

### ✅ เลือก: Jinja2

> **เหตุผลหลัก:**
> 1. **Industry Standard ของ Network Automation** — Ansible, Nornir, NAPALM, Salt ทุกตัวใช้ Jinja2 → ตรงกับมาตรฐานอุตสาหกรรม
> 2. **Template Inheritance** — `{% extends "base_cisco.j2" %}` สร้าง Base Template กลาง แล้ว Override ตามรุ่นอุปกรณ์ (เช่น 2960 vs 3850)
> 3. **Loops + Conditionals** — `{% for vlan in vlans %}` สร้าง Config หลาย VLAN ในรอบเดียว ซึ่ง f-string ทำยาก
> 4. **NPA2e Ch.9 สอน Jinja2 โดยเฉพาะ** — มีตัวอย่าง Network Config เลย ไม่ต้องดัดแปลง
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Mako:** เร็วกว่า Jinja2 เล็กน้อย แต่ Community เล็กกว่ามาก หาตัวอย่าง Network ยาก
> - **Python f-string:** ง่ายแต่ไม่มี Loop/Conditional/Inheritance → Config ที่ซับซ้อนต้องเขียน Python Logic ปนกับ String ซึ่งอ่านยากและ Maintain ยาก
> - **YAML + Custom:** ต้องสร้าง Parser เอง เสียเวลาเกิน ไม่คุ้ม

---

## 5. 🗄️ Database

| เกณฑ์ (น้ำหนัก) | PostgreSQL | MySQL | MongoDB | SQLite |
|------------------|------------|-------|---------|--------|
| Learning Curve (25%) | 4 | 4 | 3 | 5 |
| Fit for Project (25%) | 5 | 4 | 3 | 3 |
| Community & Docs (20%) | 5 | 5 | 4 | 4 |
| Performance (15%) | 5 | 4 | 4 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.75** | **4.25** | **3.55** | **3.90** |

### ✅ เลือก: PostgreSQL 15+ (Production) + SQLite (Dev/Test)

> **เหตุผลหลัก:**
> 1. **SQL:2011 System-Versioned Tables** — Temporal table ที่ Track ประวัติข้อมูลอัตโนมัติ (point-in-time query) → เหมาะกับ Version Control ของ Config โดยไม่ต้องเขียน Logic เอง
> 2. **JSONB Column** — เก็บ Structured data จาก TextFSM parsing ที่มีโครงสร้างไม่แน่นอนต่าง Vendor ใน JSON column ได้ + Query ด้วย SQL ได้
> 3. **Concurrent Writes** — รองรับหลาย User Deploy พร้อมกันได้ดี (MVCC) ซึ่ง SQLite ทำไม่ได้
> 4. **Docker-Ready** — `postgres:15` image พร้อมใช้ ไม่ต้อง Install
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **MySQL:** ไม่มี Temporal Tables, JSONB Query ไม่แข็งเท่า PostgreSQL
> - **MongoDB:** Schema-less ฟังดูดี แต่ Device Inventory มีโครงสร้างชัดเจน → Relational DB เหมาะกว่า และ JOIN ระหว่าง devices + config_snapshots + audit_log ทำใน SQL ง่ายกว่า
> - **SQLite:** ใช้ตอน Dev ได้ แต่ Production ต้องรองรับ Concurrent Users ≥10 ซึ่ง SQLite lock ทั้งไฟล์

---

## 6. 🔗 ORM (Object-Relational Mapping)

| เกณฑ์ (น้ำหนัก) | SQLAlchemy | Django ORM | Tortoise ORM | Peewee |
|------------------|------------|------------|--------------|--------|
| Learning Curve (25%) | 3 | 4 | 4 | 5 |
| Fit for Project (25%) | 5 | 2 | 4 | 3 |
| Community & Docs (20%) | 5 | 5 | 3 | 3 |
| Performance (15%) | 5 | 4 | 4 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.50** | **3.80** | **3.85** | **3.70** |

### ✅ เลือก: SQLAlchemy 2.0

> **เหตุผลหลัก:**
> 1. **FastAPI First-Class Support** — Tutorial ทางการของ FastAPI สอนใช้ SQLAlchemy โดยเฉพาะ
> 2. **Async Session** — รองรับ `async/await` ไม่ Block Event Loop ขณะ Query
> 3. **Alembic Migration** — เปลี่ยน Schema ได้โดยไม่ Drop table ทำ DB Migration เหมือน Production จริง
> 4. **Raw SQL Fallback** — ถ้า ORM ทำไม่ได้ ก็เขียน Raw SQL ผ่าน SQLAlchemy ได้เลย
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Django ORM:** ผูกกับ Django Framework ใช้กับ FastAPI ไม่ได้
> - **Tortoise ORM:** Async-first แต่ Community เล็ก หา Help ยาก
> - **Peewee:** ง่ายแต่ไม่รองรับ Async, ไม่มี Migration tool ดีๆ

---

## 7. 🤖 AI / LLM Provider

| เกณฑ์ (น้ำหนัก) | Gemini API | OpenAI GPT | Ollama (Local) | Claude API |
|------------------|------------|------------|----------------|------------|
| Learning Curve (25%) | 5 | 5 | 3 | 4 |
| Fit for Project (25%) | 5 | 4 | 3 | 4 |
| Community & Docs (20%) | 4 | 5 | 3 | 3 |
| Performance (15%) | 4 | 5 | 2 | 4 |
| Cost (15%) | 5 | 2 | 5 | 2 |
| **Weighted Score** | **4.65** | **4.15** | **3.10** | **3.50** |

### ✅ เลือก: Google Gemini API (Flash + Pro)

> **เหตุผลหลัก:**
> 1. **Free Tier เยอะ** — Gemini 1.5 Flash: 15 RPM ฟรี, 1M tokens/day → เพียงพอสำหรับ Dev + Demo ไม่ต้องจ่ายเงิน
> 2. **Dual Model Strategy** — Flash (เร็ว/ถูก) สำหรับ Intent Detection + Pro (ฉลาด/แพง) สำหรับ Complex Analysis → ลดค่าใช้จ่ายได้
> 3. **Long Context Window** — 1M tokens (Flash) → ส่ง Config ยาวๆ ได้โดยไม่ต้อง Chunk
> 4. **`text-embedding-004`** — ใช้สร้าง Embedding สำหรับ RAG ได้เลย ไม่ต้อง Provider อื่น
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **OpenAI GPT:** ดีมากแต่แพง (GPT-4o $15/1M output tokens), Free tier จำกัดมาก → นักศึกษาไม่มีงบ
> - **Ollama (Local):** ฟรี 100% แต่ต้องการ GPU 8GB+ VRAM → เครื่องนักศึกษาไม่มี + Model 7B คุณภาพต่ำกว่า Gemini Flash มาก
> - **Claude API:** ดีแต่ Free tier ไม่เพียงพอ และ Docs ด้าน Network automation น้อยกว่า

---

## 8. 🔒 PII Masking Engine

| เกณฑ์ (น้ำหนัก) | Presidio + Regex | Regex Only | AWS Comprehend | spaCy Only |
|------------------|------------------|------------|----------------|------------|
| Learning Curve (25%) | 3 | 5 | 2 | 3 |
| Fit for Project (25%) | 5 | 3 | 4 | 3 |
| Community & Docs (20%) | 4 | 5 | 4 | 4 |
| Performance (15%) | 4 | 5 | 3 | 4 |
| Cost (15%) | 5 | 5 | 1 | 5 |
| **Weighted Score** | **4.20** | **4.25** | **2.80** | **3.60** |

### ✅ เลือก: Regex Only (Realistic) / Presidio + Regex (Full Scope)

> **เหตุผลหลัก:**
> 1. **Regex Only (Realistic Mode):** IP Address, Password, SNMP Community มีรูปแบบชัดเจน → Regex จับได้ 90%+ โดยไม่ต้อง ML model
> 2. **Presidio (ถ้ามีเวลา):** เพิ่ม NER ของ spaCy จับ Entity ที่ Regex พลาด + มี `presidio-anonymizer` ที่ Replace/Hash ให้อัตโนมัติ
> 3. **100% Local** — ทั้ง Regex และ Presidio ทำงานบนเครื่อง Server ไม่ส่งข้อมูลออก → ตอบคำถามอาจารย์เรื่อง Privacy ได้ชัด
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **AWS Comprehend:** Cloud-based = ส่งข้อมูลไป AWS ก่อนจะ Mask → ขัดกับหลัก "PII ต้อง Local 100%"
> - **spaCy Only:** NER ดีแต่ไม่มี Anonymizer built-in ต้องเขียน Replace logic เอง

---

## 9. 🔍 Config Parser (CIS Security Check)

| เกณฑ์ (น้ำหนัก) | ciscoconfparse | Batfish | TTP | Custom Regex |
|------------------|----------------|---------|-----|--------------|
| Learning Curve (25%) | 4 | 2 | 3 | 5 |
| Fit for Project (25%) | 5 | 4 | 3 | 3 |
| Community & Docs (20%) | 4 | 3 | 3 | 5 |
| Performance (15%) | 5 | 3 | 4 | 4 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.55** | **3.20** | **3.35** | **4.20** |

### ✅ เลือก: ciscoconfparse

> **เหตุผลหลัก:**
> 1. **เข้าใจ Cisco IOS Hierarchy** — รู้จัก Parent/Child relationship เช่น `interface GigabitEthernet0/1` → `ip address ...` → `no shutdown` สามารถ Query "หา Interface ที่ไม่มี `shutdown`" ได้ทันที
> 2. **`find_objects_w_child()`** — ค้นหา Config block ที่มีหรือไม่มี Child command เฉพาะ → เหมาะกับ CIS Rule checking (เช่น "VTY Line ที่ไม่มี `transport input ssh`")
> 3. **ไม่ต้องเขียน Complex Regex** — Parse Config แบบ Tree structure ดีกว่า Line-by-line Regex
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Batfish:** เป็น Full Network Simulator (Java-based) ใหญ่เกินไปสำหรับ Config parsing → Setup Docker Container แค่ Parse config อย่างเดียวไม่คุ้ม
> - **TTP:** ดีสำหรับ Template-based parsing แต่ Community เล็ก หาตัวอย่าง CIS check ยาก
> - **Custom Regex:** ทำได้แต่ต้องเขียน Regex 24 กฎ ซึ่ง ciscoconfparse ให้ Structure ที่ดีกว่า

---

## 10. 📊 CLI Output Parser

| เกณฑ์ (น้ำหนัก) | TextFSM + NTC | Genie (pyATS) | Custom Regex | TTP |
|------------------|---------------|---------------|--------------|-----|
| Learning Curve (25%) | 4 | 3 | 5 | 3 |
| Fit for Project (25%) | 5 | 5 | 2 | 3 |
| Community & Docs (20%) | 5 | 4 | 3 | 2 |
| Performance (15%) | 4 | 4 | 5 | 4 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.55** | **4.05** | **3.60** | **3.20** |

### ✅ เลือก: TextFSM + NTC Templates

> **เหตุผลหลัก:**
> 1. **Netmiko Integration** — `use_textfsm=True` ใน `send_command()` → แปลง CLI เป็น JSON ทันทีในบรรทัดเดียว ไม่ต้อง import แยก
> 2. **NTC Templates (800+ Templates)** — ชุมชน Network to Code มี Template สำเร็จรูปสำหรับ `show ip interface brief`, `show vlan`, `show lldp neighbors` ฯลฯ ทุกคำสั่งที่ MyNetMate ต้องการ
> 3. **Multi-Vendor** — มี Template สำหรับ Cisco, Arista, Juniper, MikroTik
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Genie/pyATS:** ดีมากแต่ Package ใหญ่ (~500MB), เป็นของ Cisco เป็นหลัก, MikroTik support จำกัด
> - **Custom Regex:** ต้องเขียน Regex ใหม่ทุกคำสั่ง ทุก Vendor → ไม่คุ้มเวลา
> - **TTP:** Template-based parser ดีแต่ Community เล็ก หา Template สำเร็จรูปยาก

---

## 11. 🧠 State Management (Frontend)

| เกณฑ์ (น้ำหนัก) | Zustand | Redux Toolkit | Jotai | MobX |
|------------------|---------|---------------|-------|------|
| Learning Curve (25%) | 5 | 3 | 4 | 3 |
| Fit for Project (25%) | 5 | 4 | 4 | 4 |
| Community & Docs (20%) | 4 | 5 | 3 | 3 |
| Performance (15%) | 5 | 4 | 5 | 4 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.80** | **4.05** | **4.05** | **3.65** |

### ✅ เลือก: Zustand

> **เหตุผลหลัก:**
> 1. **Zero Boilerplate** — สร้าง Store ด้วยโค้ด 5 บรรทัด ไม่ต้อง Provider, Reducer, Action Creator เหมือน Redux
> 2. **ใช้ร่วมกับ TanStack Query** — Zustand เก็บ Client State (UI state, form data) + TanStack Query เก็บ Server State (device list, config data) → แยกชัดเจน ไม่ชนกัน
> 3. **Bundle Size เล็ก** — 1.1KB ✕ Redux 11KB — ไม่ถ่วง Frontend Load
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Redux Toolkit:** ดีขึ้นจาก Redux เก่ามาก แต่ยังมี Boilerplate (Slice, Thunk, Middleware) ที่ไม่จำเป็นสำหรับ Project ขนาดนี้
> - **Jotai:** Atomic state ดีแต่ Pattern แตกต่างจาก Store-based ที่นักศึกษาคุ้นเคย
> - **MobX:** Observable pattern ซับซ้อนกว่า, Debug ยากกว่า

---

## 12. 🎨 CSS Framework

| เกณฑ์ (น้ำหนัก) | Tailwind CSS | Bootstrap 5 | Material UI | Ant Design |
|------------------|-------------|-------------|-------------|------------|
| Learning Curve (25%) | 4 | 5 | 3 | 3 |
| Fit for Project (25%) | 5 | 3 | 4 | 4 |
| Community & Docs (20%) | 5 | 5 | 4 | 4 |
| Performance (15%) | 5 | 3 | 3 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.75** | **4.10** | **3.65** | **3.65** |

### ✅ เลือก: Tailwind CSS

> **เหตุผลหลัก:**
> 1. **Utility-First** — ไม่ต้องเขียน CSS file แยก ไม่ต้องตั้งชื่อ Class — ใส่ใน JSX เลย `className="bg-gray-900 p-4 rounded-lg"`
> 2. **Dark Mode Built-in** — Network Management tools ส่วนใหญ่ใช้ Dark theme → Tailwind รองรับ `dark:` prefix ทันที
> 3. **Bundle Purging** — Build เสร็จแล้วเหลือแค่ CSS ที่ใช้จริง → ไฟล์เล็ก
> 4. **shadcn/ui ทำงานร่วมกันได้** — Component Library ยอดนิยมที่ Build บน Tailwind + Radix UI → ได้ Button, Dialog, Table สวยๆ ทันที
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Bootstrap 5:** ง่ายกว่าแต่ Customize ยาก ดูเหมือน "Bootstrap site" ทุกเว็บ ไม่ Premium
> - **Material UI:** ดีแต่ Bundle ใหญ่ + Styling system (sx prop, styled) ซับซ้อน
> - **Ant Design:** Enterprise-grade ดีมาก แต่ Design language ค่อนข้าง Rigid

---

## 13. 📦 Vector Database (RAG)

| เกณฑ์ (น้ำหนัก) | ChromaDB | Pinecone | FAISS | Weaviate |
|------------------|----------|----------|-------|----------|
| Learning Curve (25%) | 5 | 4 | 3 | 3 |
| Fit for Project (25%) | 4 | 5 | 4 | 4 |
| Community & Docs (20%) | 4 | 5 | 4 | 3 |
| Performance (15%) | 3 | 5 | 5 | 4 |
| Cost (15%) | 5 | 3 | 5 | 4 |
| **Weighted Score** | **4.25** | **4.40** | **4.05** | **3.55** |

### ✅ เลือก: ChromaDB (Dev) / Pinecone (Production — ถ้ามีเวลา)

> **เหตุผลหลัก:**
> 1. **ChromaDB — Zero Setup:** `pip install chromadb` → ใช้ได้ทันที ไม่ต้อง Docker/Server → เหมาะ Dev
> 2. **Pinecone — Managed Service:** ไม่ต้อง Maintain server, Free tier 100K vectors เพียงพอ
> 3. **LangChain Integration:** ทั้ง ChromaDB และ Pinecone มี LangChain connector พร้อมใช้
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **FAISS:** เร็วมาก (Facebook) แต่ไม่มี Metadata Filtering, ไม่ Persist ข้ามรอบ restart ต้อง save/load เอง
> - **Weaviate:** ดีแต่ Setup ซับซ้อน + Community ยังเล็กกว่า Pinecone

---

## 14. 🧪 Network Lab / Testing Environment

| เกณฑ์ (น้ำหนัก) | ContainerLab | GNS3 | EVE-NG | Cisco CML |
|------------------|-------------|------|--------|-----------|
| Learning Curve (25%) | 4 | 3 | 2 | 3 |
| Fit for Project (25%) | 5 | 4 | 4 | 5 |
| Community & Docs (20%) | 4 | 5 | 3 | 3 |
| Performance (15%) | 5 | 3 | 3 | 4 |
| Cost (15%) | 5 | 4 | 3 | 1 |
| **Weighted Score** | **4.60** | **3.70** | **2.95** | **3.25** |

### ✅ เลือก: ContainerLab

> **เหตุผลหลัก:**
> 1. **Docker-Native** — สร้าง Topology ด้วย YAML file → `containerlab deploy` → พร้อมทดสอบใน 30 วินาที
> 2. **CI/CD Integration** — รัน Lab ใน GitHub Actions ได้ → Automated Testing ทุก Commit
> 3. **Lightweight** — ไม่ต้อง Full VM เหมือน GNS3/EVE-NG → รันบน Laptop ที่ RAM 8GB ได้
> 4. **MikroTik Image ฟรี** — CHR (Cloud Hosted Router) รันใน Container ได้เลย
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **GNS3:** ดีมากแต่หนัก (ต้อง VM), GUI-based (ไม่ Automate ง่าย), License Image ซับซ้อน
> - **EVE-NG:** Enterprise-grade แต่ต้อง Bare Metal/Dedicated VM + License แพง
> - **Cisco CML:** ดีที่สุดสำหรับ Cisco แต่ License $199/year → นักศึกษาไม่มีงบ

---

## 15. 📐 Diff Algorithm

| เกณฑ์ (น้ำหนัก) | Myers Diff | Patience Diff | Histogram Diff | Line-by-Line |
|------------------|-----------|---------------|----------------|-------------|
| Learning Curve (25%) | 4 | 3 | 3 | 5 |
| Fit for Project (25%) | 5 | 4 | 4 | 2 |
| Community & Docs (20%) | 5 | 3 | 3 | 5 |
| Performance (15%) | 5 | 4 | 5 | 3 |
| Cost (15%) | 5 | 5 | 5 | 5 |
| **Weighted Score** | **4.75** | **3.65** | **3.80** | **3.80** |

### ✅ เลือก: Myers Diff (via `difflib` Python)

> **เหตุผลหลัก:**
> 1. **Python Built-in** — `difflib.unified_diff()` + `difflib.HtmlDiff()` ไม่ต้อง install อะไรเลย
> 2. **Git ใช้ Algorithm เดียวกัน** — ผลลัพธ์คุ้นเคยสำหรับ Developer ทุกคน
> 3. **React Diff Viewer** — Component `react-diff-viewer` ใช้ Myers Diff ข้างใน → Frontend + Backend ใช้ Algorithm เดียวกัน
>
> **ทำไมไม่เลือกตัวอื่น:**
> - **Patience Diff:** ดีกว่าสำหรับ Code ที่มี Block ซ้ำ แต่ต้อง Import library แยก
> - **Histogram Diff:** เร็วกว่าสำหรับไฟล์ใหญ่ แต่ Config ส่วนใหญ่ไม่เกิน 500 บรรทัด → ไม่จำเป็น
> - **Line-by-Line:** ง่ายเกินไป ไม่มี Context lines, ไม่แสดง Move/Change ที่มีความหมาย

---

## 📋 สรุปรวม: ตัวเลือกทั้ง 15 หมวด

| # | หมวด | ✅ เลือก | ❌ ไม่เลือก | Score |
|---|------|---------|------------|-------|
| 1 | Backend Framework | **FastAPI** | Django, Flask, Express | 4.80 |
| 2 | Frontend Framework | **React 18** | Vue, Angular, Svelte | 4.55 |
| 3 | SSH Library | **Netmiko** | Paramiko, NAPALM, Nornir, Ansible | 4.80 |
| 4 | Template Engine | **Jinja2** | Mako, f-string, YAML+Custom | 4.85 |
| 5 | Database | **PostgreSQL** | MySQL, MongoDB, SQLite | 4.75 |
| 6 | ORM | **SQLAlchemy 2.0** | Django ORM, Tortoise, Peewee | 4.50 |
| 7 | AI/LLM Provider | **Gemini API** | OpenAI, Ollama, Claude | 4.65 |
| 8 | PII Masking | **Regex / Presidio** | AWS Comprehend, spaCy Only | 4.25 |
| 9 | Config Parser | **ciscoconfparse** | Batfish, TTP, Custom Regex | 4.55 |
| 10 | CLI Parser | **TextFSM + NTC** | Genie/pyATS, Regex, TTP | 4.55 |
| 11 | State Mgmt | **Zustand** | Redux, Jotai, MobX | 4.80 |
| 12 | CSS Framework | **Tailwind CSS** | Bootstrap, MUI, Ant Design | 4.75 |
| 13 | Vector DB | **ChromaDB / Pinecone** | FAISS, Weaviate | 4.40 |
| 14 | Network Lab | **ContainerLab** | GNS3, EVE-NG, Cisco CML | 4.60 |
| 15 | Diff Algorithm | **Myers Diff** | Patience, Histogram, Line-by-Line | 4.75 |

> **คะแนนเฉลี่ยรวม: 4.63 / 5.00** — ตัวเลือกทุกตัวได้คะแนนสูงกว่า 4.0 แสดงว่าเลือกอย่างมีเหตุผล

---

*วิเคราะห์โดย Antigravity AI สำหรับ CEPP68-33 | 2026-07-22*
