# 🎯 แบบร่างสรุปฟีเจอร์และขอบเขตโปรเจกต์ (Feature Selection & Scope Strategy)
> **สำหรับเข้าพบอาจารย์ที่ปรึกษา (อาจารย์ปริญญา)** | **ระยะเวลาคุย:** 30 นาที  
> **โครงงาน:** MyNetMate (CEPP68-33) — Network Management System + AI Co-pilot  
> **ผู้จัดทำ:** [ใส่ชื่อนักศึกษา] | **วันที่:** [ใส่วันที่เข้าพบ]

---

> [!IMPORTANT]
> **ปรัชญาหลักของระบบ (Core Philosophy):**  
> *"ใช้ AI เมื่อต้องการ 'ความเข้าใจ' — ไม่ใช้ AI เมื่อต้องการ 'ความถูกต้อง'"*  
> (อัตราส่วน 80/20: 80% Jinja2 Templates + Netmiko + CIS Control / 20% Gemini API + RAG)

---

## ⏱️ 1. แผนการจัดสรรเวลาสนทนา (30-Minute Agenda)

| เวลา | ช่วงการสนทนา | เป้าหมาย |
|:---:|---|---|
| **00:00 - 05:00** | **สรุปภาพรวม & ปรัชญา 80/20** | ยืนยันกรอบความคิดหลัก และ Vendor Scope (Cisco IOS Priority 100%) |
| **05:00 - 20:00** | **นำเสนอ 4 เสาหลักฟีเจอร์ (Feature Matrix)** | เจาะลึกฟีเจอร์ที่ดึงมาจากหนังสือ NPA2e & AI Cookbook พร้อมวิธีประยุกต์ใช้จริง |
| **20:00 - 25:00** | **ข้อเสนอรายการตัดฟีเจอร์ (Cut List & Risk Strategy)** | สรุปฟีเจอร์ที่เสนอให้ตัด/ชะลอออกไป เพื่อคุมระยะเวลาตาม Gantt Chart |
| **25:00 - 30:00** | **สรุปมติอาจารย์ & Next Steps** | อาจารย์อนุมัติขอบเขตขั้นสุดท้าย และวางเป้าหมายจุดตรวจถัดไป |

---

## 🏛️ 2. สรุปความเข้าใจเชิงลึกใน 4 เสาหลักของระบบ (Core Feature Pillars)

*(ส่วนนี้นักศึกษาเติมเนื้อหาเพื่อเช็กความเข้าใจของตัวเอง ก่อนนำไปอธิบายอาจารย์)*

### 📍 Pillar 1: Deterministic Network Automation & Discovery (จากหนังสือ NPA2e Ch.2, 8, 9, 10)
> **หนังสืออ้างอิง:** *Network Programmability & Automation (Second Edition)*

- **แนวคิดที่ดึงมาใช้:** 
  - [ ] **Data Modeling & Structured Output (Ch.8):** แปลง CLI Text ดิบๆ ด้วย TextFSM / NTC-Templates ให้เป็น JSON/Pydantic Model
  - [ ] **Deterministic Templating (Ch.9):** ใช้ Jinja2 Templates สร้าง Configuration เพื่อรับประกันความถูกต้อง 100% (No Hallucination)
  - [ ] **Device Interaction (Ch.10):** ใช้ Netmiko สื่อสารผ่าน SSH พร้อม Error Handling และ Prompt Parsing
- **ความเข้าใจของฉัน (My Understanding Check):**
  > *[เขียนอธิบายด้วยภาษาตัวเอง เช่น: ทำไมเราถึงไม่ใช้ AI เจน Config ตรงๆ แต่ใช้ Jinja2 แทน? เพราะคำสั่งเน็ตเวิร์กมีคำตอบที่ถูกต้องเพียง 1 เดียว]*
- **ข้อเสนอฟีเจอร์ที่จะทำ (Proposed Features):**
  1. Automated Topology & Device Discovery (SSH + TextFSM)
  2. Jinja2 Config Builder (VLAN, Interface, OSPF, ACL for Cisco IOS)

---

### 📍 Pillar 2: Security Automation & Validation Gate (จากหนังสือ NPA2e Ch.6 + CIS Benchmarks)
> **หนังสืออ้างอิง:** *NPA2e Configuration Compliance & CIS Cisco IOS 24-Rule Benchmark*

- **แนวคิดที่ดึงมาใช้:**
  - [ ] **Rule-based Config Parsing:** ใช้ `ciscoconfparse` หรือ Regex ในการสแกน Configuration ล่าสุด
  - [ ] **Compliance Gate:** สแกน 24 กฎความปลอดภัย CIS ก่อนยอมรับหรือ Push คำสั่งขึ้นอุปกรณ์
- **ความเข้าใจของฉัน (My Understanding Check):**
  > *[เขียนอธิบายด้วยภาษาตัวเอง เช่น: ระบบจะไม่มีทางยิงคำสั่งอันตราย เช่น Telnet, Plaintext Password, หรือ Default Community String ลงไป]*
- **ข้อเสนอฟีเจอร์ที่จะทำ (Proposed Features):**
  1. Pre-push CIS 24-Rule Automated Security Scan
  2. Plan ➔ Review ➔ Apply Workflow (Human-in-the-loop มีปุ่มให้อนุมัติก่อนยิงคำสั่ง)

---

### 📍 Pillar 3: Local PII Masking & Data Privacy Gate (จาก Microsoft Presidio Research)
> **เทคโนโลยีอ้างอิง:** *Microsoft Presidio Local Sanitizer Engine*

- **แนวคิดที่ดึงมาใช้:**
  - [ ] **Local PII Anonymization:** ทำการ Mask ข้อมูลความลับ (IP Address, Password, Enable Secret, SNMP Community, Key-string) 100% ภายในเครื่อง Local ก่อนส่งให้ LLM
- **ความเข้าใจของฉัน (My Understanding Check):**
  > *[เขียนอธิบายด้วยภาษาตัวเอง เช่น: Gemini API จะเห็นเฉพาะ IP หลอก เช่น 10.X.X.X หรือ `<IP_ADDRESS_1>` เพื่อป้องกันข้อมูลรั่วไหล]*
- **ข้อเสนอฟีเจอร์ที่จะทำ (Proposed Features):**
  1. Real-time Presidio/Regex Sanitizer Layer ก่อนส่ง Prompt
  2. Unmasking Engine สำหรับแปลงคำตอบจาก AI กลับมาเป็น IP จริงเมื่อแสดงผลให้ Engineer

---

### 📍 Pillar 4: AI Co-pilot & RAG Architecture (จากหนังสือ AI Networking Cookbook Ch.5, 7, 8)
> **หนังสืออ้างอิง:** *AI Networking Cookbook (LangChain, LLM Backends & Network Co-Pilot)*

- **แนวคิดที่ดึงมาใช้:**
  - [ ] **Context-Aware Assistance (Ch.5 & 8):** AI ทำหน้าที่วิเคราะห์ Intent, วิเคราะห์ Logs/Syslog, และอธิบายสาเหตุของปัญหา (Troubleshooting Advisor)
  - [ ] **RAG Vector Search (Ch.7):** ใช้ ChromaDB / Pinecone เก็บ Document/Docstrings เพื่อให้ AI ตอบตามมาตรฐานขององค์กร
- **ความเข้าใจของฉัน (My Understanding Check):**
  > *[เขียนอธิบายด้วยภาษาตัวเอง เช่น: AI ไม่ได้มาแทนวิศวกร แต่เป็น Co-pilot ช่วยอ่าน Log ยาวๆ และช่วยแนะนำวิธีแก้ไขปัญหา]*
- **ข้อเสนอฟีเจอร์ที่จะทำ (Proposed Features):**
  1. AI Network Log & Health Explainer (Gemini 1.5 Flash API)
  2. Interactive Troubleshooting Chatbot พร้อม RAG อ้างอิงเอกสารคู่มือ

---

## ✂️ 3. ข้อเสนอการตัด/ชะลอ ฟีเจอร์ (Feature Cut List & Trade-offs)

> [!TIP]
> **หลักการตัด:** ตัดฟีเจอร์ที่มีน้ำหนักความซับซ้อนสูง แต่ไม่ได้อยู่ใน Core Value ของ Capstone เพื่อคุมเวลา 30 วันพัฒนา

| ฟีเจอร์ / เครื่องมือ | สถานะข้อเสนอ | เหตุผลและผลกระทบ (Rationale) | ทางออกทดแทน (Alternative) |
|---|:---:|---|---|
| **Multi-Vendor Firewall (Palo Alto / Fortinet)** | ❌ **ตัดออก (Cut)** | โครงสร้าง OS ซับซ้อนเกินไปและอุปกรณ์ใน Lab มีจำกัด | มุ่งเน้น Cisco IOS (100%) และ MikroTik RouterOS v7 |
| **Full SNMP Polling Engine & Real-time Graphing** | ❌ **ตัดออก (Cut)** | ทับซ้อนกับระบบ NMS สำเร็จรูป (เช่น Zabbix/Netdisco) | ใช้ Netmiko CLI Parsing ดึง State เฉพาะเมื่อต้องการ |
| **Fully Automated Self-Healing (No Human)** | ❌ **ตัดออก (Cut)** | เสี่ยงทำอุปกรณ์พังโดยไม่มีคนคุม | ใช้ Human-in-the-loop (มีปุ่ม Approve เสมอ) |
| **YANG/NETCONF Model Full Multi-Vendor** | ⚠️ **ชะลอ (Phase 2)** | อุปกรณ์ Cisco IOS รุ่นเก่าใน Lab ไม่รองรับ NETCONF | ใช้ Netmiko + TextFSM เป็นเกาะหลักแทน |
| **Multi-LLM Dynamic Switching** | ⚠️ **ชะลอ (Phase 2)** | เพิ่มความซับซ้อนในการจัดการ Prompt | ใช้ Gemini 1.5 Flash API เป็น LLM หลักตัวเดียว |

---

## ⚖️ 4. ตารางเปรียบเทียบคุณค่า (Value vs Weight Matrix for Decision)

```mermaid
quadrantChart
    title Feature Priority Matrix (คัดเลือกเพื่อเสนออาจารย์)
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Must Do (เน้นย้ำในโปรเจกต์)
    quadrant-2 Quick Wins (ทำทันที)
    quadrant-3 Cut / Drop (ตัดทิ้ง)
    quadrant-4 Phase 2 (ไว้ทำอนาคต)
    "Jinja2 Config Builder": [0.3, 0.9]
    "Netmiko CLI Discovery": [0.35, 0.85]
    "CIS 24-Rule Scan": [0.4, 0.88]
    "Local PII Masking": [0.25, 0.8]
    "AI Log Explainer": [0.45, 0.75]
    "Full Firewall Automation": [0.9, 0.3]
    "SNMP Telemetry Graph": [0.85, 0.25]
    "NETCONF YANG Engine": [0.8, 0.4]
```

---

## 📝 5. ประเด็นที่ต้องการมติจากอาจารย์ปริญญา (Key Decision Points)

- [ ] **ประเด็นที่ 1:** อาจารย์เห็นด้วยกับการตัด Firewall ออกเพื่อเน้น Cisco IOS (100%) + MikroTik v7 หรือไม่?
- [ ] **ประเด็นที่ 2:** สัดส่วนความยืดหยุ่น 80% Deterministic (Jinja2+Netmiko) vs 20% AI (Gemini Co-Pilot) เหมาะสมสำหรับ Senior Project หรือยัง?
- [ ] **ประเด็นที่ 3:** การวัดผล (Evaluation Metric) ที่จะใช้ในการสอบจบ ควรเน้นที่ ความถูกต้องของ Config (%) และเวลาที่ลดลงในการทำงาน ใช่หรือไม่?

---

## 📌 6. สรุปมติและคำแนะนำจากอาจารย์ (Advisor Feedback Notes)

*(กรอกข้อมูลระหว่างหรือหลังคุย 30 นาที)*

- **ฟีเจอร์ที่อาจารย์ให้เน้นเป็นพิเศษ:**  
  1. `__________________________________________________`  
  2. `__________________________________________________`  
- **ฟีเจอร์ที่อาจารย์เห็นชอบให้ตัดทิ้ง:**  
  1. `__________________________________________________`  
  2. `__________________________________________________`  
- **ข้อแนะนำเพิ่มเติมจากอาจารย์:**  
  > `__________________________________________________`  
  > `__________________________________________________`

---
*บันทึกโดย [นักศึกษา] | โครงงาน CEPP68-33 MyNetMate*
