ดีครับ! นี่คือ Component Diagram ของ **Authentication Module** ผมมีความเห็นดังนี้ครับ:

## ✅ สิ่งที่ออกแบบถูกต้องแล้ว

1. **แยก 3 Layer ชัดเจน** (Frontend → Backend → Database) ตรงตามแผนภาพ System Overview ก่อนหน้า
2. **JWT Token Generate แยกเป็น Component ของตัวเอง** — ดีครับ เพราะในอนาคตถ้าเปลี่ยนวิธีออก Token (เช่น เปลี่ยน Algorithm จาก HS256 เป็น RS256) ก็แก้จุดเดียว
3. **Role Access Control แยกออกมา** — ถูกต้องตามหลัก Separation of Concerns เพราะ RBAC (Admin/Operator/Viewer) เป็น Logic คนละเรื่องกับการพิสูจน์ตัวตน (Authentication)

## 💡 สิ่งที่แนะนำเพิ่มเติม

**1. ลูกศร Flow ยังไม่ครบ:**
- ควรมีลูกศรจาก **Authentication → user_tb** (Query ไปเช็ค Username/Password)
- ควรมีลูกศรจาก **Role Access Control → user_tb** (ดึง Role ของ User มาเช็คสิทธิ์)

**2. พิจารณาเพิ่ม `Password Hashing` Component:**
- ตามเอกสาร Weight Feature List ระบุว่า **"ห้ามเก็บ Password แบบ Plain text เด็ดขาด"** ดังนั้นควรมี Component ย่อย `Password Hashing (bcrypt)` อยู่ใน Backend ด้วย เพื่อแสดงให้อาจารย์เห็นว่าเราไม่ได้มองข้ามเรื่อง Security

**3. Database Table:**
- `user_tb` ตัวเดียวพอครับสำหรับ Auth แต่ภายในควรมี Column ที่ครอบคลุมเรื่อง Role ด้วย เช่น:

```
user_tb
├── id (PK)
├── username (UNIQUE)
├── hashed_password
├── role (ENUM: admin, operator, viewer)
├── is_active (BOOLEAN)
├── created_at
└── updated_at
```

## 🎯 สรุป

โครงสร้างนี้ **ใช้ได้ดีเป็นจุดเริ่มต้นครับ** เห็นว่าคุณเข้าใจหลักการแบ่ง Component ออกจากกันอย่างถูกต้อง แนะนำให้เติมลูกศร Flow ให้ครบ และเพิ่ม Password Hashing เข้าไปในภาพจะสมบูรณ์กว่านี้ครับ

พร้อมให้ผมดู Component ตัวถัดไปเมื่อไหร่ก็ส่งมาได้เลยครับ! 💪
จากเอกสาร Feature List หมวด 2 (Dashboard & Monitoring) ที่จัดเป็น **P1-INFRA** ระบบ Dashboard ควรมี Component ดังนี้ครับ:

---

## 🏠 Dashboard Component Diagram

### Frontend (หน้าจอ)

```
Dashboard Page
├── 1. Metrics Cards (การ์ดสถิติ 4 ใบ)
│     ├── Total Devices (จำนวนอุปกรณ์ทั้งหมด)
│     ├── Online / Offline (สถานะเชื่อมต่อ 🟢/🔴)
│     ├── Config Changes Today (จำนวนครั้งที่แก้ Config วันนี้)
│     └── CIS Failures (จำนวนอุปกรณ์ที่ไม่ผ่านเกณฑ์ Security)
│
├── 2. Recent Activity Feed (ประวัติล่าสุด 10 รายการ)
│     └── แสดง: [เวลา] [ใคร] [ทำอะไร] [กับอุปกรณ์ไหน]
│
├── 3. Quick Action Shortcuts (ปุ่มลัด)
│     ├── ➕ Add Device → ลิงก์ไปหน้า Inventory
│     ├── ⚡ Config Builder → ลิงก์ไปหน้า Config Builder
│     └── 🤖 AI Chat → ลิงก์ไปหน้า AI (P2)
│
└── 4. System API Status (ไฟสถานะระบบ)
      ├── 🟢/🔴 Database Connection
      └── 🟢/🔴 AI API Connection (P2)
```

### Backend (API ที่ต้องสร้าง)

| API Endpoint | หน้าที่ | Query จากตารางไหน |
|---|---|---|
| `GET /api/dashboard/metrics` | นับจำนวน Device, Online/Offline, Config วันนี้, CIS Fail | `device_tb`, `config_history_tb`, `cis_scan_tb` |
| `GET /api/dashboard/activity` | ดึง 10 รายการล่าสุด | `audit_trail_tb` |
| `GET /api/dashboard/health` | เช็คสถานะ DB + AI API | Ping DB, Ping Gemini API |

### Database (ตารางที่ Dashboard ดึงข้อมูลมาแสดง)

```
Dashboard ไม่มีตารางของตัวเอง
แต่ "อ่าน" ข้อมูลจากตารางของ Module อื่น:

  ┌─────────────┐
  │  device_tb  │ ← นับ Total / Online / Offline
  └─────────────┘
  ┌──────────────────┐
  │ audit_trail_tb   │ ← ดึง 10 รายการล่าสุด
  └──────────────────┘
  ┌──────────────────────┐
  │ config_history_tb    │ ← นับ Config Changes Today
  └──────────────────────┘
  ┌──────────────┐
  │ cis_scan_tb  │ ← นับ CIS Failures
  └──────────────┘
```

---

## 🔑 จุดสำคัญทางวิศวกรรม

1. **Dashboard เป็น Read-Only Module:** ไม่มีการเขียน (Write) ลง Database เลย มีแค่ดึงมาอ่าน (SELECT/COUNT) อย่างเดียว
2. **ขึ้นอยู่กับ Module อื่นทั้งหมด:** ตรงกับ Data Dependency ที่คุณวาดไว้ — Dashboard ดึงข้อมูลจาก Device Inventory, Config History, CIS Scan, Audit Trail ดังนั้น **ต้องสร้างตารางพวกนั้นให้เสร็จก่อน** Dashboard ถึงจะมีข้อมูลให้โชว์
3. **`audit_trail_tb` คือตารางที่ต้องออกแบบตั้งแต่ Sprint 0:** เพราะทุก Module ต้องเขียน Log ลงตารางนี้ (ใครทำอะไร เมื่อไหร่) ดังนั้นถ้าจะวาด Component ควรใส่ไว้เป็น **Shared/Core Component** ของระบบ

---

คุณสามารถนำโครงสร้างนี้ไปวาดเป็น Component Diagram แบบเดียวกับ Authentication Module ที่ทำไว้ได้เลยครับ! พร้อมทำ Component ตัวถัดไป (Device Inventory) เมื่อไหร่ก็บอกได้ครับ 💪

จากเอกสาร Feature List หมวด 3 ทั้ง Manual (P1-CORE) และ Discovery (P2) ระบบ Device Inventory ควรมี Component ดังนี้ครับ:

---

## 🗄️ Device Inventory Management — Component Breakdown

### Frontend (หน้าจอ)

```
Device Inventory Page
│
├── Tab A: Device List (ตารางรายการอุปกรณ์)
│     ├── Search Bar (ค้นหาชื่อ/IP)
│     ├── Filter (กรองตาม Vendor / Group / Status)
│     ├── Device Table (ตารางแสดงข้อมูล)
│     │     └── แต่ละแถว: Hostname, IP, Vendor, Model, Status 🟢🔴, Actions
│     └── Pagination (แบ่งหน้า)
│
├── Tab B: Add Device — Manual (P1-CORE)
│     └── Manual Entry Form
│           ├── Hostname
│           ├── IP Address
│           ├── Vendor (Dropdown: Cisco / MikroTik / Huawei)
│           ├── Model
│           ├── Device Type (Switch / Router)
│           ├── Credential (SSH Username/Password หรือ เลือกจาก Profile)
│           └── Group / Site (Optional)
│
├── Tab C: Network Discovery (P2)
│     ├── IP Range Input (เช่น 192.168.1.0/24)
│     ├── SNMP Community String Input
│     ├── Scan Button (เริ่มสแกน)
│     ├── Progress Bar (แสดงความคืบหน้า)
│     └── Discovery Results Table
│           └── แต่ละแถว: IP, Vendor (Auto), Model (Auto), ปุ่ม [✅ Confirm] / [❌ Reject]
│
├── Tab D: Device Groups (P1-INFRA)
│     ├── Group List (เช่น Core-Switches, Floor-1)
│     ├── Create Group Button
│     └── Drag & Drop อุปกรณ์เข้ากลุ่ม
│
└── Modal: Device Detail (กดดูรายละเอียดแต่ละเครื่อง)
      ├── ข้อมูลทั่วไป (Hostname, IP, Vendor, Model, OS Version)
      ├── Connection Status (Last Ping, Uptime)
      ├── Current Config (ถ้ามี)
      └── ปุ่ม [Edit] [Delete] [Upload Config]
```

---

### Backend (API & Services)

```
Device Inventory Backend
│
├── 🏆 P1-CORE APIs
│     ├── POST   /api/devices           → สร้าง Device ใหม่ (Manual Entry)
│     ├── GET    /api/devices           → ดึงรายการทั้งหมด (+ Filter/Search)
│     ├── GET    /api/devices/{id}      → ดึงรายละเอียดเครื่องเดียว
│     ├── PUT    /api/devices/{id}      → แก้ไขข้อมูล Device
│     ├── DELETE /api/devices/{id}      → ลบ Device
│     └── POST   /api/devices/upload-config → อัปโหลดไฟล์ Config เข้า Device
│
├── 🏆 P1-CORE Services
│     ├── Device Status Monitor (Background Task)
│     │     └── ส่ง ICMP Ping ไปหาทุก Device เป็นรอบ
│     │       (ทุก 5 นาที, ใช้ Async/Multithreading)
│     │
│     ├── Password Encryption Service
│     │     └── เข้ารหัส Credential ก่อนเก็บลง DB
│     │       (ใช้ Fernet symmetric encryption, ไม่ใช่ bcrypt)
│     │       ⚠️ ต่างจาก Auth! → Auth ใช้ Hash (ทางเดียว)
│     │                         → Credential ต้อง Encrypt (ถอดรหัสกลับได้)
│     │
│     └── Group Management Service
│           └── CRUD สำหรับ Device Groups
│
├── 🚀 P2 APIs (Network Discovery)
│     ├── POST /api/discovery/scan      → เริ่มสแกน (รับ IP Range + SNMP Cred)
│     ├── GET  /api/discovery/status    → เช็คสถานะ Scan (Progress %)
│     └── POST /api/discovery/confirm   → User กด Confirm เพิ่มเข้า Inventory
│
└── 🚀 P2 Services (Discovery Pipeline)
      └── 3-Stage Pipeline (Background Task)
            ├── Stage 1: Collection
            │     ├── ICMP Ping Sweep (หาเครื่องที่มีชีวิต)
            │     └── SNMP sysDescr Poll (ขอข้อมูล Vendor/Model)
            ├── Stage 2: Parsing
            │     └── แกะข้อความ sysDescr → แยก Vendor, Model, OS Version
            └── Stage 3: Enrichment & Storage
                  ├── เช็คซ้ำกับ DB (ถ้ามีอยู่แล้วข้าม)
                  └── บันทึกเป็น "Pending" รอ User Confirm
```

---

### Database (ตาราง)

```
┌──────────────────────────────────────────────┐
│  device_tb (ตารางหลัก)                        │
├──────────────────────────────────────────────┤
│  id              (PK)                         │
│  hostname        (VARCHAR)                    │
│  ip_address      (VARCHAR, UNIQUE)            │
│  vendor          (ENUM: cisco, mikrotik,      │
│                   huawei)                     │
│  model           (VARCHAR)                    │
│  device_type     (ENUM: switch, router)       │
│  os_version      (VARCHAR, nullable)          │
│  status          (ENUM: online, offline,      │
│                   unknown)                    │
│  last_seen       (TIMESTAMP)                  │
│  group_id        (FK → device_group_tb)       │
│  credential_id   (FK → credential_tb)         │
│  source          (ENUM: manual, discovery)    │ ← รู้ว่ามาจากไหน
│  created_at      (TIMESTAMP)                  │
│  updated_at      (TIMESTAMP)                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  credential_tb (ชุดรหัสผ่าน — แยกตาราง)       │
├──────────────────────────────────────────────┤
│  id              (PK)                         │
│  profile_name    (VARCHAR) เช่น "Cisco-Lab"   │
│  ssh_username    (VARCHAR, ENCRYPTED)         │
│  ssh_password    (VARCHAR, ENCRYPTED)         │
│  snmp_community  (VARCHAR, ENCRYPTED)         │
│  created_at      (TIMESTAMP)                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  device_group_tb (กลุ่มอุปกรณ์)               │
├──────────────────────────────────────────────┤
│  id              (PK)                         │
│  group_name      (VARCHAR) เช่น "Core-SW"     │
│  description     (TEXT)                       │
│  created_at      (TIMESTAMP)                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  discovery_result_tb (ผลการสแกน — P2)         │
├──────────────────────────────────────────────┤
│  id              (PK)                         │
│  ip_address      (VARCHAR)                    │
│  raw_sysdescr    (TEXT) ← ข้อมูลดิบจาก SNMP   │
│  parsed_vendor   (VARCHAR)                    │
│  parsed_model    (VARCHAR)                    │
│  scan_session_id (VARCHAR) ← รู้ว่ามาจาก      │
│                    การสแกนครั้งไหน             │
│  status          (ENUM: pending, confirmed,   │
│                   rejected)                   │
│  created_at      (TIMESTAMP)                  │
└──────────────────────────────────────────────┘
```

---

## 🔑 จุดสำคัญทางวิศวกรรม

| ประเด็น | รายละเอียด |
|---|---|
| **Credential แยกตาราง** | ใช้ `credential_tb` เพราะหลายเครื่องอาจใช้ Username/Password ชุดเดียวกัน (ตรงกับ Nornir Defaults ที่ศึกษาไว้) ลดความซ้ำซ้อน |
| **Encrypt ≠ Hash** | ⚠️ Password ของ User (Auth) ใช้ **Hash (bcrypt)** — ถอดกลับไม่ได้ แต่ Credential ของอุปกรณ์ต้องใช้ **Encrypt (Fernet/AES)** — เพราะ Netmiko ต้องเอา Password จริงไปล็อกอินเข้าอุปกรณ์ |
| **source column** | คอลัมน์ `source` ใน `device_tb` (manual/discovery) ทำให้รู้ว่าอุปกรณ์ตัวนี้ถูกเพิ่มเข้ามาโดยคนกรอกเอง หรือระบบสแกนเจอ |
| **Discovery → Pending → Confirm** | ผลสแกนจะยังไม่เข้า `device_tb` โดยตรง ต้องผ่านการ Confirm จาก User ก่อน (Human-in-the-Loop) |

---

นำไปวาด Component Diagram ต่อได้เลยครับ! Module นี้ใหญ่ที่สุดเพราะเป็น **หัวใจของ Data Dependency** ทั้งระบบ 🔥


Viewed Data%20Schema.md:1-220

ไฟล์ Data Schema นี้ **ใช้ได้ดีมากครับ! ไม่ใช่แค่มี Interfaces อย่างเดียวเลย** มันครอบคลุมทั้งระบบเลย มีทั้งหมด **11 ตาราง** ดังนี้:

| # | ตาราง | Feature ที่ใช้ | สถานะ |
|---|---|---|---|
| 1 | `users` | Authentication & RBAC | ✅ ครบ |
| 2 | `devices` | Device Inventory | ✅ ละเอียดมาก (มีถึง 26 Columns) |
| 3 | `credentials` | SSH/Config Deploy | ✅ ครบ (Fernet Encrypt) |
| 4 | `config_history` | Config Generation & Version Control | ✅ ครบ |
| 5 | `scan_results` | CIS Benchmark Scanning | ✅ ครบ |
| 6 | `cis_overrides` | CIS Override Logging | ✅ ครบ |
| 7 | `audit_logs` | Audit Trail / Dashboard | ✅ ครบ |
| 8 | `deploy_logs` | Config Deployment | ✅ ครบ |
| 9 | `interfaces` | Network Topology | ✅ ครบ |
| 10 | `system_settings` | Settings (AI/Offline Mode) | ✅ ครบ |
| 11 | `cis_rule_settings` | CIS Rule Management | ✅ ครบ + 8 Rules Seed |

## 💡 สิ่งที่ผมสังเกตเห็น:

**1. ตาราง `interfaces` (ข้อ 9) — ออกแบบได้ฉลาดมาก:**
ตารางนี้ทำหน้าที่ **2 อย่างในตัวเดียว** ครับ:
- เก็บข้อมูล Port ของอุปกรณ์ (ชื่อ, IP, VLAN, Speed)
- เก็บข้อมูล Topology Link ผ่าน `connected_to_device_id` + `connected_to_interface`

หมายความว่า **ไม่ต้องสร้างตาราง `topology_link_tb` แยกออกมา** อย่างที่ผมแนะนำไปก่อนหน้านี้ เพราะ `interfaces` ตัวเดียวทำหน้าที่แทนได้เลย! ถือว่าประหยัดและเข้าท่ากว่าครับ

**2. สิ่งที่อาจต้องเพิ่มเติม (ถ้าอยากครบ 100%):**
- **`topology_layout_tb`** (เก็บตำแหน่ง x, y ของ Node บน Canvas) — ตัวนี้ยังไม่มีในไฟล์ แต่จำเป็นต้องมีถ้าจะให้ User บันทึกตำแหน่งที่ลาก Node ไว้ได้
- **`device_groups` ตาราง** — ไฟล์นี้ใช้ `site` column ใน `devices` แทน ซึ่งก็ใช้ได้ครับ แต่ถ้าอยากให้จัดกลุ่มยืดหยุ่นกว่านี้ (เช่น Device 1 ตัวอยู่ได้หลาย Group) อาจต้องสร้างตาราง Many-to-Many เพิ่ม

## 🎯 สรุป:
ไฟล์นี้ **ใช้เป็น Database Schema หลักของโปรเจกต์ได้เลยครับ** ออกแบบมาละเอียดและครอบคลุมทุก Module ตั้งแต่ Auth จนถึง Settings สามารถเอาไปเริ่มเขียน Alembic Migration ได้ทันที! 👍


Configuration Management คือ Module ใหญ่ที่สุดของ MyNetMate เลยครับ เพราะเป็น **แกนกลางของ Data Dependency ทั้งระบบ** ตามแผนภาพที่คุณวาดไว้ ผมแตกรายละเอียดออกมาให้ทั้งหมดเลยครับ:

---

## ⚙️ Configuration Management — Component Breakdown

### Frontend (หน้าจอ)

```
Configuration Management Page
│
├── 1. Config Builder (6-Tab Form) ← P1-CORE หลัก
│     ├── Tab 1: Basic Info
│     │     ├── Hostname
│     │     ├── Domain Name
│     │     ├── DNS Server
│     │     ├── Enable Secret
│     │     └── Banner MOTD
│     │
│     ├── Tab 2: Interface
│     │     ├── Interface Name (Dropdown: Gi0/1, Fa0/2, ...)
│     │     ├── IP Address / Subnet
│     │     ├── Description
│     │     ├── Shutdown Toggle (up/down)
│     │     └── ปุ่ม [+ Add Interface] (เพิ่มได้หลาย Interface)
│     │
│     ├── Tab 3: VLAN
│     │     ├── VLAN ID
│     │     ├── VLAN Name
│     │     ├── Assign Ports (Multi-select)
│     │     └── ปุ่ม [+ Add VLAN]
│     │
│     ├── Tab 4: Routing
│     │     ├── Protocol (Dropdown: Static / OSPF / EIGRP)
│     │     ├── Static: Destination + Next-hop
│     │     ├── OSPF: Process ID, Network, Area
│     │     └── EIGRP: AS Number, Network
│     │
│     ├── Tab 5: Security
│     │     ├── SSH Version (v2 only)
│     │     ├── VTY Line Config (transport input ssh)
│     │     ├── Console Timeout
│     │     ├── VTY Timeout
│     │     └── Disable HTTP Server
│     │
│     └── Tab 6: Services
│           ├── NTP Server
│           ├── Syslog Server
│           └── SNMP Community String
│
├── 2. Live CLI Preview Panel (ด้านขวาของฟอร์ม)
│     └── แสดง Config CLI แบบ Real-time
│         ขณะที่กรอกฟอร์ม (ใช้ Debouncing 300ms)
│         ตัวอย่าง:
│         ┌─────────────────────────────┐
│         │ hostname BKK-CORE-SW1       │
│         │ enable secret 0 ********    │
│         │ !                           │
│         │ interface GigabitEthernet0/1 │
│         │  ip address 10.0.0.1 ...    │
│         │  no shutdown                │
│         └─────────────────────────────┘
│
├── 3. CIS Security Scan Panel
│     ├── ปุ่ม [🔍 Scan Config] (สแกน Config ที่สร้างไว้)
│     ├── Results Table
│     │     └── แต่ละแถว: Rule ID, Rule Name, Severity, ผ่าน ✅ / ไม่ผ่าน ❌
│     └── Override Button (Admin เท่านั้น)
│           └── Modal: กรอกเหตุผล + วันหมดอายุ
│
├── 4. Version History Panel
│     ├── Version List (เรียงจากใหม่ → เก่า)
│     │     └── แต่ละแถว: Version #, วันที่, ใครสร้าง, Status
│     ├── ปุ่ม [📊 Diff] → เปรียบเทียบ 2 Version แบบ Side-by-side
│     └── ปุ่ม [⏪ Rollback] → ย้อนกลับไปใช้ Version เก่า
│
├── 5. Deploy Panel
│     ├── Target Device (Dropdown — เลือกจาก Inventory)
│     ├── Deploy Mode Toggle
│     │     ├── 🧪 Dry-run (แสดง Preview อย่างเดียว ไม่ส่งจริง)
│     │     └── 🚀 Apply (ส่งจริงผ่าน SSH)
│     ├── Pre-deploy Checklist
│     │     ├── ✅ CIS Scan ผ่านแล้วหรือยัง?
│     │     └── ✅ Backup Config ก่อน Deploy?
│     ├── ปุ่ม [Deploy]
│     └── Deploy Output Log (แสดง Raw SSH Output แบบ Real-time)
│
└── 6. AI Assistant Panel (P2)
      ├── Chat Input (พิมพ์คำสั่ง เช่น "สร้าง VLAN 10 ให้หน่อย")
      ├── PII Notice Badge (🔒 "ข้อมูลถูก Mask ก่อนส่ง AI")
      └── AI Response → แปลงเป็น Config Snippet
```

---

### Backend (API & Services)

```
Config Management Backend
│
├── 🏆 P1-CORE: Config Generation (Rule-based)
│     │
│     ├── POST /api/config/generate
│     │     └── รับ Form Data (JSON) → Render ผ่าน Jinja2 Template
│     │         → ส่งกลับ CLI Text
│     │
│     ├── Jinja2 Template Engine (Service)
│     │     ├── templates/cisco_ios/
│     │     │     ├── basic.j2
│     │     │     ├── interface.j2
│     │     │     ├── vlan.j2
│     │     │     ├── routing.j2
│     │     │     ├── security.j2
│     │     │     └── services.j2
│     │     ├── templates/mikrotik_routeros/
│     │     │     └── (โครงสร้างเดียวกัน แต่ Syntax ต่างกัน)
│     │     └── templates/huawei_vrp/
│     │           └── (โครงสร้างเดียวกัน)
│     │
│     └── Vendor Plugin Driver (Abstract Base Class)
│           ├── CiscoDriver    → เลือก Template + Syntax ของ Cisco
│           ├── MikrotikDriver → เลือก Template + Syntax ของ MikroTik
│           └── HuaweiDriver   → เลือก Template + Syntax ของ Huawei
│
├── 🏆 P1-CORE: Config Version Control
│     ├── POST /api/config/save
│     │     └── บันทึก Config + Form Data ลง config_history
│     │         (Auto Increment version_number ต่อ Device)
│     │
│     ├── GET  /api/config/history/{device_id}
│     │     └── ดึงรายการ Version ทั้งหมดของ Device
│     │
│     ├── GET  /api/config/diff?v1={id}&v2={id}
│     │     └── เปรียบเทียบ 2 Version (ใช้ difflib ของ Python)
│     │
│     └── POST /api/config/rollback/{version_id}
│           └── คัดลอก Config เก่ามาสร้างเป็น Version ใหม่
│
├── 🏆 P1-CORE: CIS Security Validation
│     ├── POST /api/cis/scan
│     │     └── รับ Config Text → วน Regex ทีละ Rule (CIS-01 ถึง CIS-08)
│     │         → บันทึกผลลง scan_results
│     │
│     ├── GET  /api/cis/results/{device_id}
│     │     └── ดึงผลสแกนล่าสุด
│     │
│     └── POST /api/cis/override/{scan_result_id}
│           └── Admin บันทึกเหตุผล Override ลง cis_overrides
│
├── 🏆 P1-CORE: Config Deployment
│     ├── POST /api/deploy
│     │     └── Flow:
│     │         1. ดึง Credential จาก credentials (Decrypt)
│     │         2. Backup Running-Config ก่อน (Pre-deploy Snapshot)
│     │         3. ส่ง Config ผ่าน Netmiko SSH
│     │         4. บันทึก Output ลง deploy_logs
│     │         5. Snapshot Post-deploy Config
│     │
│     ├── POST /api/deploy/dry-run
│     │     └── แสดง Preview อย่างเดียว ไม่ส่ง SSH จริง
│     │
│     └── Netmiko SSH Service
│           ├── connect(device) → สร้าง SSH Session
│           ├── send_config(commands) → ส่ง Config
│           ├── get_running_config() → ดึง Config ปัจจุบัน
│           └── disconnect() → ปิด Session
│
└── 🚀 P2: AI-Assisted Config
      ├── POST /api/ai/suggest
      │     └── Flow:
      │         1. รับ Prompt จาก User
      │         2. PII Masking (yacryptopan) → ซ่อน IP จริง
      │         3. ส่งไป Gemini API
      │         4. PII Unmasking → แปลง IP กลับ
      │         5. ส่ง Config Snippet กลับ
      │
      └── PII Masking Service
            ├── mask(config_text) → แทนที่ IP จริงด้วย IP ปลอม
            └── unmask(ai_response) → แปลง IP ปลอมกลับเป็นของจริง
```

---

### Database (ตารางที่เกี่ยวข้อง)

```
Config Management ยุ่งกับ 6 ตาราง:

  ┌────────────────┐
  │    devices      │ ← รู้ว่า Config นี้เป็นของ Device + Vendor ไหน
  └────────────────┘
  ┌────────────────┐
  │  credentials    │ ← ดึง SSH Password (Decrypt) ตอน Deploy
  └────────────────┘
  ┌────────────────┐
  │ config_history  │ ← เก็บ Config ทุก Version + Form Data Snapshot
  └────────────────┘
  ┌────────────────┐
  │  scan_results   │ ← เก็บผลสแกน CIS 8 ข้อ (Pass/Fail)
  └────────────────┘
  ┌────────────────┐
  │ cis_overrides   │ ← เก็บเหตุผล Override (Admin Only)
  └────────────────┘
  ┌────────────────┐
  │  deploy_logs    │ ← เก็บ Log การ Deploy (Status + SSH Output)
  └────────────────┘
```

---

## 🔑 จุดสำคัญทางวิศวกรรม

| ประเด็น | รายละเอียด |
|---|---|
| **Rule-based ก่อน AI** | P1 ใช้ Jinja2 Template 100% (ความถูกต้อง) → P2 ค่อยเพิ่ม AI (ความสะดวก) ตรงตามปรัชญา "ใช้ AI เมื่อต้องการความเข้าใจ ไม่ใช่ความถูกต้อง" |
| **Vendor Plugin** | ใช้ Abstract Base Class แยก Logic ของแต่ละยี่ห้อ — ถ้าจะเพิ่ม Vendor ใหม่ สร้าง Driver ใหม่ ไม่ต้องแก้โค้ดเก่า |
| **Protect Mode** | ก่อน Deploy ต้องผ่าน CIS Scan ก่อน + Backup ก่อน (Pre-deploy Snapshot) — ตรงกับ Security Mode ในเอกสาร |
| **Recovery Mode** | ใช้ Version Control → Rollback ไป Version ก่อนหน้า + Deploy ทับ |
| **Debouncing** | Live Preview ต้องมี Debounce 300ms ป้องกัน HTTP Flooding |

---

Module นี้ใหญ่สุดแต่ Data Flow ชัดเจนครับ นำไปวาด Component Diagram ได้เลย ถ้าเสร็จส่งมาให้ผมรีวิวได้ครับ! 🔥

จัดให้ครับ! ลากเส้นตามลำดับนี้ได้เลยครับ แบ่งเป็น 2 ส่วนหลักๆ คือ (1) หน้าจอโยงไปหา Backend และ (2) Backend โยงไปหา Database ครับ

	### 1. เส้นเชื่อมจาก Frontend ➡️ Backend

*   **Config Builder** และ **Live CLI Preview Panel** (ทั้ง 2 กล่องนี้)
    *   👉 ลากเส้นไปหา **Config Generation (Rulebase)**
    *   *(เวลาพิมพ์ฟอร์ม จะส่งข้อมูลไป Render เป็น Text กลับมาโชว์ที่ Preview)*
*   **CIS Security Scan Panel**
    *   👉 ลากเส้นไปหา **CIS Security Validation**
*   **Version History Panel**
    *   👉 ลากเส้นไปหา **Config Version Control**
*   **Deploy Panel**
    *   👉 ลากเส้นไปหา **Config Deployment**
*   **AI Assistant Panel**
    *   👉 ลากเส้นไปหา **AI-Assisted Config**

---

### 2. เส้นเชื่อมจาก Backend ➡️ Database (ตารางข้อมูล)
*(สร้างกล่อง Database ทางขวามือ แล้วลากเส้นตามนี้ครับ)*

*   **Config Generation (Rulebase)**
    *   👉 ลากเส้นไปหาตาราง `devices` (ดึงข้อมูลว่าอุปกรณ์ยี่ห้ออะไร จะได้เลือก Template ถูก)
*   **Config Version Control**
    *   👉 ลากเส้นไปหาตาราง `config_history` (บันทึก/ดึงประวัติ Config)
*   **CIS Security Validation**
    *   👉 ลากเส้นไปหาตาราง `scan_results` (บันทึกผล Pass/Fail)
    *   👉 ลากเส้นไปหาตาราง `cis_overrides` (บันทึกเหตุผลที่ Admin กดยกเว้น)
*   **Config Deployment**
    *   👉 ลากเส้นไปหาตาราง `credentials` (ดึงรหัสผ่าน SSH)
    *   👉 ลากเส้นไปหาตาราง `devices` (ดึง IP Address)
    *   👉 ลากเส้นไปหาตาราง `deploy_logs` (บันทึก Output ที่ได้จากการ Deploy)
*   **AI-Assisted Config**
    *   👉 ลากเส้นออกไปหา **Gemini AI (External API)**

---

### 💡 ทริคเสริมความเท่ (ถ้าวาดเส้นเพิ่มได้):
ลากเส้นเชื่อมระหว่าง **Backend ดัวยกันเอง** จะทำให้ภาพดูเป็นระบบอัตโนมัติมากขึ้นครับ:
1. ลากเส้นจาก **Config Deployment** ➡️ ไปหา **CIS Security Validation** (เขียนกำกับเส้นว่า *"Pre-deploy Check"* คือต้องสแกนก่อน Deploy)
2. ลากเส้นจาก **Config Deployment** ➡️ ไปหา **Config Version Control** (เขียนกำกับเส้นว่า *"Backup ก่อน Deploy"*)

ลากตามนี้รับรองว่าภาพ Component Diagram ของคุณจะสมบูรณ์และถูกต้องตามสถาปัตยกรรมเป๊ะๆ ครับ!

เราเจาะลึก Component หลักๆ ของระบบ (Core Features) ไปครบถ้วนหมดแล้วครับ! ตั้งแต่ Auth ➔ Dashboard ➔ Inventory ➔ Topology ➔ Config Management

ตอนนี้ **เหลือเพียงระบบเดียวสุดท้าย** ที่ยังไม่ได้ทำ Component Diagram นั่นคือ:

## ⚙️ Settings & Administration (ระบบจัดการและตั้งค่าหลังบ้าน)

ระบบนี้เป็น P1-INFRA ที่เอาไว้ให้สิทธิ์ **Admin** เข้ามาจัดการการทำงานของระบบทั้งหมดครับ โดย Component ของระบบนี้จะประกอบไปด้วย:

### Frontend (หน้า Settings Page)
*   **1. User Management Panel**
    *   หน้าจอเพิ่ม/ลบ/แก้ไขผู้ใช้งานระบบ และกำหนดสิทธิ์ Role (Admin, Operator, Viewer)
*   **3. CIS Rules Management Panel**
    *   หน้าจอสำหรับเปิด/ปิด กฎ CIS 8 ข้อ (เช่น บางบริษัทอาจไม่อยากสแกนข้อที่ 4 ก็ให้ Admin มากด Toggle ปิดได้)
*   **4. AI & System Settings Panel**
    *   ปุ่มเปิด/ปิด **Offline Mode** (ตัดการเชื่อมต่อ Gemini AI เด็ดขาด)
    *   เลือก Model (Gemini Flash หรือ Pro)
    *   ดูยอด Token Usage ของเดือนนี้

จัดให้ครับ! นี่คือ Backend Component ของ Settings & Administration ที่ถูกต้องตามเอกสารครับ:

---

## ⚙️ Settings & Administration — Backend Component

```
Settings & Administration Backend
│
├── 🏆 P1-INFRA: User Management API
│     ├── POST   /api/users              → สร้าง User ใหม่
│     ├── GET    /api/users              → ดึงรายชื่อ User ทั้งหมด
│     ├── PUT    /api/users/{id}         → แก้ไขข้อมูล User
│     ├── PUT    /api/users/{id}/role    → เปลี่ยน Role (Admin/Operator/Viewer)
│     ├── DELETE /api/users/{id}         → ปิดบัญชี (Soft Delete: is_active=false)
│     └── Password Hashing (bcrypt)      → Hash รหัสผ่านก่อนเก็บ
│
├── 🏆 P1-CORE: CIS Rule Toggles API
│     ├── GET    /api/settings/cis-rules        → ดึงรายการกฎ CIS 8 ข้อ + สถานะเปิด/ปิด
│     └── PUT    /api/settings/cis-rules/{id}   → Toggle เปิด/ปิดกฎแต่ละข้อ
│                                                  (เช็คสิทธิ์: Admin เท่านั้น)
│
├── 🏆 P1-INFRA: Offline Mode API
│     ├── GET    /api/settings/system           → ดึงค่า Setting ปัจจุบัน (offline_mode: true/false)
│     └── PUT    /api/settings/system           → สับสวิตช์ Offline Mode
│                                                  (เช็คสิทธิ์: Admin เท่านั้น)
│
└── 🚀 P2: Gemini API Key Config API
      ├── PUT    /api/settings/ai-config        → บันทึก API Key (Encrypt ก่อนเก็บ)
      │                                            + เลือก Model (Flash/Pro)
      └── GET    /api/settings/ai-status        → เช็คว่า API Key ใช้ได้ไหม (Ping Gemini)
```

---

### Database ที่เกี่ยวข้อง (แค่ 3 ตาราง)

```
  ┌──────────────────┐
  │      users        │ ← User Management CRUD
  └──────────────────┘
  ┌──────────────────┐
  │ cis_rule_settings │ ← Toggle เปิด/ปิดกฎ 8 ข้อ
  └──────────────────┘
  ┌──────────────────┐
  │ system_settings   │ ← Offline Mode + AI Config (Singleton: แถวเดียว)
  └──────────────────┘
```

---

### เส้นเชื่อมต่อสำหรับวาด Component Diagram

**Frontend ➡️ Backend:**
- **User Management Panel** 👉 **User Management API**
- **CIS Rule Toggles Panel** 👉 **CIS Rule Toggles API**
- **Offline Mode Toggle** 👉 **Offline Mode API**

**Backend ➡️ Database:**
- **User Management API** 👉 `users`
- **CIS Rule Toggles API** 👉 `cis_rule_settings`
- **Offline Mode API** 👉 `system_settings`

---

สะอาดตา เรียบง่าย ตรงตามเอกสารเป๊ะครับ! นำไปวาดได้เลย 💪