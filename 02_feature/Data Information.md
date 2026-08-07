Feature List ! มาคิดเรื่อง Device Information กัน
## 📦 Device Information ควรเก็บอะไรบ้าง?
แบ่งออกเป็น **6 กลุ่ม** 

###  1. Core Identity (ข้อมูลตัวตน)
| Field           | ตัวอย่าง                          | ทำไมต้องเก็บ?                         |
| --------------- | --------------------------------- | ------------------------------------- |
| `hostname`      | `BKK-CORE-SW1`                    | ชื่อที่แสดงในทุกหน้า UI               |
| `management_ip` | `192.168.1.1`                     | Netmiko ใช้ SSH เข้าอุปกรณ์           |
| `device_type`   | `switch` / `router` / `firewall`  | แบ่งหมวดหมู่ + ไอคอนบน Topology       |
| `vendor`        | `cisco` / `mikrotik` / `huawei`   | เลือก Jinja2 Template + Prompt ให้ AI |
| `model`         | `Catalyst 9300` / `RB750Gr3`      | AI ใช้เป็น Context ตอนตอบคำถาม        |
| `os_version`    | `IOS-XE 17.9.4` / `RouterOS 7.14` | เช็คความเข้ากัน + Security patch      |
| `serial_number` | `FCW2345L0P8`                     | ใช้ยืนยันตัวตน + รายงาน Inventory     |

###  2. Connection (สำหรับ Netmiko เชื่อมต่อ)
| Field           | ตัวอย่าง                                         | หมายเหตุ                                                |
| --------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `platform`      | `cisco_ios` / `mikrotik_routeros` / `huawei_vrp` | **ค่าที่ Netmiko ต้องใช้ตรงๆ**                          |
| `ssh_port`      | `22` (default)                                   | บาง Device ใช้พอร์ตอื่น                                 |
| `protocol`      | `ssh` / `telnet`                                 | ส่วนใหญ่ SSH แต่ของเก่าอาจยัง Telnet                    |
| `credential_id` | FK → Credentials table                           | **ไม่ควรเก็บ password ตรงนี้!** แยกตารางเก็บ + เข้ารหัส |

###  3. Network Info (ข้อมูลเครือข่าย)
| Field             | ตัวอย่าง            | ทำไมต้องเก็บ?                  |
| ----------------- | ------------------- | ------------------------------ |
| `mac_address`     | `AA:BB:CC:DD:EE:FF` | ระบุตัวตนที่ไม่ซ้ำ + Discovery |
| `management_vlan` | `99`                | รู้ว่าต้อง SSH ผ่าน VLAN ไหน   |
| `gateway`         | `192.168.1.254`     | Troubleshoot connectivity      |

###  4. Location & Role (ตำแหน่งและบทบาท)
| Field             | ตัวอย่าง                           | ทำไมต้องเก็บ?                                        |
| ----------------- | ---------------------------------- | ---------------------------------------------------- |
| `site`            | `สาขาบางนา` / `HQ กรุงเทพ`         | จัดกลุ่มใน Dashboard + Filter                        |
| `location_detail` | `ชั้น 3 ห้อง Server`               | ส่งคนไปดูหน้างานถูกจุด                               |
| `role`            | `core` / `distribution` / `access` | **AI ใช้ทำ Impact Analysis** ถ้า Core พังผลกระทบเยอะ |
| `tags`            | `["production", "critical"]`       | Filter/Search แบบ Flexible                           |

###  5. Status (สถานะปัจจุบัน)
| Field       | ตัวอย่าง                             | ทำไมต้องเก็บ?                 |
| ----------- | ------------------------------------ | ----------------------------- |
| `status`    | `online` / `offline` / `maintenance` | Dashboard แสดงสถานะ real-time |
| `last_seen` | `2026-07-30 12:00:00`                | รู้ว่าข้อมูลเก่าแค่ไหน        |
| `uptime`    | `45 days, 3:22:10`                   | ดูว่า Reboot บ่อยไหม (สุขภาพ) |

###  6. Metadata (ข้อมูลบริหารจัดการ)
| Field | ตัวอย่าง | ทำไมต้องเก็บ? |
|---|---|---|
| `discovery_method` | `manual` / `lldp` / `cdp` / `snmp` | รู้ว่า Device นี้มาจากไหน |
| `notes` | `"อุปกรณ์เก่า รอเปลี่ยน Q4"` | วิศวกรเอาไว้จดบันทึก |
| `created_at` | `2026-07-30 12:00:00` | Audit Trail |
| `updated_at` | `2026-07-30 15:30:00` | Audit Trail |
| `created_by` | FK → Users table | Audit Trail — ใครเพิ่มเข้าระบบ |

---

## 🗄️ แนะนำ: แยกเป็นตารางที่เกี่ยวข้อง (ไม่ยัดลงตารางเดียว)

```
┌──────────────┐     ┌──────────────────┐
│   devices    │────→│   credentials    │
│              │     │ (username, pw    │
│  hostname    │     │  encrypted)      │
│  vendor      │     └──────────────────┘
│  model       │
│  role        │     ┌──────────────────┐
│  site        │────→│   interfaces     │
│  ...         │     │ (name, ip, vlan, │
└──────────────┘     │  status, speed)  │
       │              └──────────────────┘
       │
       ├─────────────→┌──────────────────┐
       │              │   config_history  │
       │              │ (config_text,     │
       │              │  snapshot_type,   │
       │              │  changed_by)      │
       │              └──────────────────┘
       │
       ├─────────────→┌──────────────────┐
       │              │   scan_results   │
       │              │ (rule_id, passed,│
       │              │  severity,       │
       │              │  scanned_at)     │
       │              └────────┬─────────┘
       │                       │
       │              ┌────────▼─────────┐
       │              │  cis_overrides   │
       │              │ (reason,         │
       │              │  overridden_by,  │
       │              │  overridden_at)  │
       │              └──────────────────┘
       │
       └─────────────→┌──────────────────┐
                      │    audit_logs    │
                      │ (action, target, │
                      │  user_id, at)    │
                      └──────────────────┘
```

**เหตุผลที่ต้องแยก:**
- **Credentials:** แยกเพราะหลาย Device อาจใช้ Credential ชุดเดียวกัน + ต้องเข้ารหัสแยก
- **Interfaces:** แยกเพราะ 1 Device มีหลาย Interface (1-to-many) → **Topology ต้องใช้ตารางนี้**
- **Config History:** แยกเพราะเก็บหลายเวอร์ชัน → **Version Control ต้องใช้ตารางนี้**
- **Scan Results:** แยกเพราะ 1 Device มีหลาย Rule และสแกนได้หลายครั้ง (1-to-many) → **CIS Scan ต้องใช้**
- **CIS Overrides:** แยกเพราะ 1 ผลสแกนมีได้ไม่เกิน 1 Override (1-to-1) + ต้องเก็บว่าใครอนุมัติ → **Audit Trail ของการ Override**
- **Audit Logs:** แยกเพราะทุก Action ในระบบต้องบันทึกไว้ (Action Log กลาง)

---

##  7. Scan Results (ผลการสแกน CIS)
*ตารางนี้เก็บผลสแกนของแต่ละ Rule ต่อ Device แต่ละครั้ง — Feature: CIS Benchmark Scanning (8 Rules) 🏆 P1-CORE*

| Field                | ตัวอย่าง                        | ทำไมต้องเก็บ?                |
| -------------------- | ------------------------------- | ---------------------------- |
| `id`                 | `UUID`                          | Primary Key                  |
| `device_id`          | FK → devices                    | รู้ว่าสแกน Device ไหน        |
| `rule_id`            | `CIS-01` ถึง `CIS-08`           | อ้างอิง Rule ที่สแกน         |
| `rule_name`          | `"Enable Secret Must Exist"`    | แสดงผลบนหน้า UI              |
| `severity`           | `critical` / `warning` / `info` | จัดลำดับความสำคัญ            |
| `passed`             | `true` / `false`                | ผลสแกนผ่านหรือไม่            |
| `evidence`           | `"no enable secret found"`      | ข้อความอธิบายว่าพบอะไร       |
| `scanned_at`         | `2026-08-06 14:00:00`           | Timestamp ของการสแกน         |
| `scanned_by`         | FK → users                      | ใครสั่งสแกน                  |
| `config_snapshot_id` | FK → config_history             | Config เวอร์ชันไหนที่ถูกสแกน |

---

##  8. CIS Overrides (บันทึกการ Override ผลสแกน)
*ตารางนี้เก็บการที่ Admin ยืนยันว่า "รู้แล้ว ยอมรับความเสี่ยงนี้" — Feature: CIS Override Logging 🏆 P1-CORE*

| Field            | ตัวอย่าง                     | ทำไมต้องเก็บ?                          |
| ---------------- | ---------------------------- | -------------------------------------- |
| `id`             | `UUID`                       | Primary Key                            |
| `scan_result_id` | FK → scan_results            | Override ผลสแกนข้อไหน                  |
| `reason`         | `"อุปกรณ์รุ่นเก่าไม่รองรับ"` | Admin ต้องอธิบายเหตุผล (บังคับกรอก)    |
| `overridden_by`  | FK → users                   | ใคร Override (ต้องเป็น Admin เท่านั้น) |
| `overridden_at`  | `2026-08-06 14:30:00`        | Timestamp เพื่อ Audit                  |
| `expires_at`     | `2026-12-31`                 | กำหนดวันหมดอายุ Override (Optional)    |

> **หมายเหตุสำคัญ:** ตาราง `cis_overrides` มีความสัมพันธ์แบบ 1-to-1 กับ `scan_results` เพราะ 1 ผลสแกนมีได้ไม่เกิน 1 Override เท่านั้น และต้องมีการบันทึก Reason ทุกครั้ง ห้าม Override แบบไม่มีเหตุผล

---

## 🎯 สรุป: Field ไหนใช้กับ Feature ไหน (อัปเดตครบ 8 ตาราง)

| Feature                             | ตาราง / Fields ที่ต้องพึ่งพา                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| **Authentication**                  | `users` (username, password_hash, role)                                               |
| **Dashboard**                       | `devices` (status, last_seen, uptime, site, role)                                     |
| **Device Inventory**                | `devices` (Core Identity ทั้งหมด + Location)                                          |
| **Network Discovery**               | `devices` (management_ip, mac_address, platform, discovery_method)                    |
| **Network Topology**                | `devices` (hostname, device_type, role) + `interfaces` (port connections)             |
| **Config Generate (Rule-Based)**    | `devices` (vendor, platform, model) → เลือก Jinja2 Template                           |
| **Config Generate (AI)**            | `devices` (vendor, model, role, os_version, site) → inject เป็น Context               |
| **Config Deployment**               | `devices` (management_ip, platform, credential_id) → Netmiko SSH                      |
| **CIS Benchmark Scanning**          | `scan_results` (rule_id, passed, severity, evidence) + `devices` (os_version, vendor) |
| **CIS Override Logging**            | `cis_overrides` (reason, overridden_by) + `scan_results` (scan_result_id)             |
| **Version Control (Diff/Rollback)** | `config_history` (config_text, snapshot_type, timestamp)                              |
| **Audit Trail**                     | `audit_logs` (action, target, user_id, created_at)                                    |

---

## 📋 สรุปตารางทั้งหมด 8 ตาราง

| # | ตาราง | ใช้กับ Feature | Priority |
|---|---|---|---|
| 1 | `devices` | ทุก Feature (ศูนย์กลาง) | 🏆 P1-CORE |
| 2 | `credentials` | Config Deployment, SSH | 🏆 P1-CORE |
| 3 | `users` | Authentication, RBAC, Audit | 🏗️ P1-INFRA |
| 4 | `config_history` | Version Control, Snapshot | 🏆 P1-CORE |
| 5 | `scan_results` | CIS Benchmark Scanning | 🏆 P1-CORE |
| 6 | `cis_overrides` | CIS Override Logging | 🏆 P1-CORE |
| 7 | `audit_logs` | Audit Trail ทุก Action | 🏗️ P1-INFRA |
| 8 | `interfaces` | Network Topology (P2) | 🚀 P2 |

> **หมายเหตุ:** ตาราง `interfaces` ควรสร้าง Schema ไว้ตั้งแต่ Sprint 0 แม้จะยังไม่ใส่ข้อมูลใน P1 เพื่อป้องกัน Migration ที่ซับซ้อนใน P2

---

### 🚀 Next Step: เมื่อจะเริ่มเขียนโค้ด

เอกสารนี้สมบูรณ์แล้วในแง่ของ "ตรรกะ" ขั้นตอนต่อไปคือระบุ **Physical Data Types** เพิ่มลงไปก่อนเขียนโค้ด:

- **กำหนด Data Type:** `hostname` → `String(255)`, `management_ip` → `String(45)`, `created_at` → `DateTime`
- **กำหนด Constraint:** `hostname` และ `management_ip` ต้องเป็น **UNIQUE** + **NOT NULL**
- **กำหนด Nullable:** `mac_address`, `serial_number`, `notes` สามารถเป็น NULL ได้ตอน Manual Entry
- **สร้าง Enum:** `vendor`, `platform`, `status`, `severity`, `role` ทำเป็น Enum เพื่อป้องกันพิมพ์ผิด

**สรุป:** ไฟล์นี้คือ "คัมภีร์ฐานข้อมูล" ของโปรเจกต์ครับ ทีม Backend เปิดไฟล์นี้วางไว้จอซ้าย เปิด `models.py` ที่จอขวา แล้วเขียน Alembic Migration ได้เลยทันที!


เก็บในตาราง **`interfaces`** ครับ ซึ่งตอนนี้มีอยู่ใน Diagram แล้ว แต่ยังไม่ได้เขียน Fields ให้ละเอียด เพราะมันเป็น **P2** ครับ

แต่เพื่อให้รู้ว่าต้องเก็บอะไรบ้าง:

---

## ตาราง `interfaces` ควรเก็บอะไร?

ความสัมพันธ์: **1 Device มีหลาย Interface** (One-to-Many)

| Field                    | ตัวอย่าง             | ทำไมต้องเก็บ?                                |
| ------------------------ | -------------------- | -------------------------------------------- |
| `id`                     | `UUID`               | Primary Key                                  |
| `device_id`              | FK → devices         | Interface นี้เป็นของ Device ไหน              |
| `name`                   | `GigabitEthernet0/1` | ชื่อ Port จริงๆ บนอุปกรณ์                    |
| `ip_address`             | `10.0.0.1`           | IP ที่ตั้งบน Interface นั้น                  |
| `subnet_mask`            | `255.255.255.0`      | Subnet                                       |
| `vlan_id`                | `10`                 | VLAN ที่ Interface นั้นสังกัด                |
| `status`                 | `up` / `down`        | สถานะ Port                                   |
| `speed`                  | `1Gbps`              | ความเร็ว Port                                |
| `description`            | `"Uplink to Core"`   | คำอธิบายที่คนตั้งไว้                         |
| `connected_to_device_id` | FK → devices         | **ต่อไปยัง Device ไหน** (สำหรับวาด Topology) |
| `connected_to_interface` | `GigabitEthernet0/0` | **ต่อไปยัง Port ไหน** ของ Device ปลายทาง     |
|                          |                      |                                              |

---

## 💡 Field ที่สำคัญที่สุดสำหรับ Topology คือ 2 อันนี้:

```
connected_to_device_id  → บอกว่า Port นี้ต่อไปหา Device ไหน
connected_to_interface  → บอกว่าต่อเข้า Port อะไรของ Device นั้น
```

เพราะ Topology Diagram ต้องรู้ว่า **"Device A Port X → Device B Port Y"** ถึงจะวาดเส้นเชื่อมได้ถูกครับ

---

## ⚠️ ข้อควรจำ

แม้ข้อมูล Interface จะใช้ใน **P2** แต่ต้องสร้าง **Schema ไว้ตั้งแต่ Sprint 0** ครับ เพราะถ้ามาเพิ่ม Column ทีหลัง Alembic Migration จะซับซ้อนมากและอาจทำ Data เดิมพัง


ให้ผมนั่งวิเคราะห์อย่างละเอียดก่อนครับ

---

## 🔍 ผลการ Review อย่างตรงไปตรงมา

### ✅ สิ่งที่ถูกต้องและครบแน่ๆ

- โครงสร้างหลัก 11 ตารางสอดคล้องกับทุก Feature หมวด ✅
- Security design (Encryption, Soft Delete, UUID PK) ✅
- PII Masking ไม่มีตาราง — เป็น Middleware Logic ✅
- Sprint Planning ลำดับถูกต้อง ✅

---

### 🔴 สิ่งที่ **ผิด** หรือ **ขาด** จริงๆ

#### 1. `interfaces` ขาด Unique Constraint
ตาราง `interfaces` ต้องมี **UNIQUE(device_id, name)** เพราะ 1 Device ไม่มีทางมี Port ชื่อเดียวกัน 2 อัน แต่ปัจจุบันไม่ได้ระบุไว้

#### 2. `cis_rule_settings.vendor` เป็น ENUM ตัวเดียว — ผิดหลักการ
ตอนนี้แต่ละ Rule ผูกกับ Vendor ได้แค่ 1 ยี่ห้อ แต่ในความเป็นจริง:
- Rule "SSH Version 2" ใช้กับทั้ง Cisco, MikroTik, Huawei
- Rule "Enable Secret" ใช้กับ Cisco อย่างเดียว

**วิธีที่ถูก:** เปลี่ยนจากคอลัมน์ `vendor` ตัวเดียว เป็น JSON array:
```
vendor_support: JSON  →  ["cisco", "mikrotik"]
```
หรือแตกเป็นตาราง `cis_rule_vendor` (Many-to-Many) ถ้าต้องการ Filter แบบจริงจัง

#### 3. `token_used_this_month` ใน `system_settings` — เปราะบาง
ถ้าอัปเดต Counter ตรงๆ ใน `system_settings` ทุกครั้งที่ยิง AI จะเกิดปัญหา **Race Condition** (2 Request ยิงพร้อมกัน อ่าน Counter ค่าเดิม แล้วเขียนทับกัน)

**วิธีที่ถูก:** ต้องมีตาราง `ai_usage_logs` เพิ่ม:
```
ai_usage_logs:
  - id, user_id, tokens_used, model_used, feature_context, created_at
```
แล้วใช้ `SUM(tokens_used)` เพื่อคำนวณยอดรวม แทนการเก็บ Counter

#### 4. `deploy_logs` รองรับ Batch Deploy ไม่ได้
ตอนนี้มี `device_id` เดียวต่อ 1 Row — ถ้า Deploy พร้อมกัน 10 เครื่อง (P2 Feature: Multi-Device Batch Deploy) จะไม่มีที่เก็บว่า "การ Deploy รอบนี้" ครอบคลุมกี่ Device

**วิธีที่ถูก:** เพิ่มตาราง `deploy_sessions`:
```
deploy_sessions (ตัวแทนการ Deploy ครั้งหนึ่ง):
  - id, status, initiated_by, started_at, finished_at

deploy_logs (แต่ละ Device ในการ Deploy ครั้งนั้น):
  - id, session_id → deploy_sessions, device_id → devices, status, output_log
```

#### 5. `audit_logs` ขาด `before_value` / `after_value`
ตอนนี้มีแค่ `description` TEXT ซึ่งบังคับให้เขียนอธิบายเองว่าเปลี่ยนอะไร ถ้าอยากทำ Diff ที่ดีในหน้า Audit Trail ควรเพิ่ม:
```
before_value: JSON  →  {"hostname": "OLD-SW1"}
after_value:  JSON  →  {"hostname": "NEW-SW1"}
```

#### 6. ไม่มีระบบ JWT Revoke (Logout จริงๆ)
ตอนนี้ถ้า User กด Logout JWT ยังใช้ได้อยู่จนหมดอายุ 8 ชั่วโมง เพราะไม่มีที่เก็บ Blacklist

**วิธีที่ถูก (เลือก 1 อย่าง):**
- เพิ่ม `token_version: INTEGER` ใน `users` — เมื่อ Logout ให้ increment ทีนี้ Token เก่าจะ Invalid ทันที (วิธีนี้เหมาะกับโปรเจกต์นี้ที่สุด ไม่ต้องมีตารางใหม่)
- หรือใช้ Redis เก็บ Blacklist (ซับซ้อนกว่า)

---

### 🟡 สิ่งที่ **ต้องพิจารณา** เพิ่ม

| ประเด็น | ความเห็น |
|---|---|
| `config_history.version_number` "Auto Increment ต่อ Device" | ต้องทำใน Application Logic ไม่ใช่ DB-level ควรระบุชัดว่าต้องเขียน Code จัดการเอง |
| `system_settings` Singleton Row | ต้องมี Seed Script ตั้งแต่ Sprint 0 เพื่อ Insert Row แรก ไม่งั้น Query จะพัง |
| `scan_results` ไม่มี Index บน `device_id` + `scanned_at` | ถ้า Device มีประวัติ Scan เยอะ Query "ผลสแกนล่าสุด" จะช้า ควรเพิ่ม Index |

---

## 📊 สรุป: ครบแค่ไหน?

| หัวข้อ | สถานะ |
|---|---|
| ครอบคลุมทุก Feature | ✅ ครบ |
| โครงสร้างตารางหลัก | ✅ ถูกต้อง |
| `interfaces` Unique Constraint | ❌ ขาด |
| `cis_rule_settings` Multi-vendor | ❌ ผิด Logic |
| Token Counter (Race Condition) | ❌ เปราะบาง |
| Batch Deploy Support | ❌ ขาด (P2) |
| JWT Revoke | 🟡 ต้องเพิ่ม `token_version` |
| Audit Log Before/After | 🟡 Nice-to-have |

อยากให้ผมแก้ไขจุดที่ผิด (❌) ลงในไฟล์ Schema เลยไหมครับ?****


# 🗄️ MyNetMate — Complete Database Schema
> อ้างอิงจาก: `MyNetMate Weight Feature List.md` และ `MyNetMate รายการ Features.md`  
> **11 ตาราง** ครอบคลุมทุก Feature ใน 11 หมวด

---

## 📐 ER Diagram (ภาพรวมความสัมพันธ์)

```
[users] ────────────────────────────────────────────────────────────┐
   │                                                                │
   │ created_by                                            (FK ทุกตาราง → users)
   ▼                                                                │
[devices] ──→ [credentials]                                         │
   │                                                                │
   ├──→ [interfaces]          (P2)                                 │
   │                                                                │
   ├──→ [config_history] ──→ [scan_results] ──→ [cis_overrides] ───┘
   │                                  
   ├──→ [deploy_logs]   (P2)           
   │                                  
   ├──→ [audit_logs]                   
   │
[system_settings]   (Singleton — ไม่ผูกกับ devices)
[cis_rule_settings] (Standalone — กำหนด Rule ที่ใช้)
```

---

## 📋 สรุปตาราง 11 ตาราง

| # | ตาราง | Feature ที่ใช้ | Priority | Sprint |
|---|---|---|---|---|
| 1 | `users` | Auth, RBAC, Audit | 🏗️ P1-INFRA | Sprint 0 |
| 2 | `devices` | Device Inventory, ทุก Feature | 🏆 P1-CORE | Sprint 0 |
| 3 | `credentials` | SSH Deploy, Netmiko | 🏆 P1-CORE | Sprint 0 |
| 4 | `config_history` | Config Gen, Version Control, Snapshot | 🏆 P1-CORE | Sprint 1 |
| 5 | `scan_results` | CIS Benchmark Scanning | 🏆 P1-CORE | Sprint 1 |
| 6 | `cis_overrides` | CIS Override Logging | 🏆 P1-CORE | Sprint 1 |
| 7 | `audit_logs` | Audit Trail ทุก Action | 🏗️ P1-INFRA | Sprint 0 |
| 8 | `deploy_logs` | Plan→Apply, Real-time Logs | 🚀 P2 | Sprint 2 |
| 9 | `interfaces` | Network Topology, Discovery | 🚀 P2 | Sprint 0 (Schema only) |
| 10 | `system_settings` | Settings & Admin, Offline Mode | 🏗️ P1-INFRA | Sprint 0 |
| 11 | `cis_rule_settings` | CIS Rule Toggles | 🏆 P1-CORE | Sprint 1 |

---

## 🔵 ตารางที่ 1: `users`
**Feature:** Authentication & Authorization (หมวด 1) 🏗️ P1-INFRA

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | Primary Key |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | `admin_kmitl` | ใช้ Login |
| `email` | VARCHAR(255) | UNIQUE, NULLABLE | `admin@kmitl.ac.th` | Optional |
| `password_hash` | VARCHAR(255) | NOT NULL | `$2b$12$...` | bcrypt hash ห้ามเก็บ plain |
| `role` | ENUM | NOT NULL | `admin` | `admin` / `operator` / `viewer` |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | `true` | ปิดบัญชีแทนการลบ |
| `last_login_at` | TIMESTAMP | NULLABLE | `2026-08-06 09:00:00` | ตรวจสอบ Activity |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | Audit |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | Audit |

**RBAC Permissions:**

| Role | สิทธิ์ |
|---|---|
| `admin` | Full access — จัดการ User, Settings, Deploy, Override CIS |
| `operator` | สร้าง Config, Deploy, สแกน CIS ได้ — Override CIS ไม่ได้ |
| `viewer` | ดูอย่างเดียว — ห้าม Create/Edit/Deploy |

---

## 🟢 ตารางที่ 2: `devices`
**Feature:** Device Inventory & Management (หมวด 3) 🏆 P1-CORE ← **ศูนย์กลางของทุกอย่าง**

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `hostname` | VARCHAR(100) | UNIQUE, NOT NULL | `BKK-CORE-SW1` | แสดงทุกหน้า UI |
| `management_ip` | VARCHAR(45) | UNIQUE, NOT NULL | `192.168.1.1` | IPv4/IPv6 — Netmiko SSH |
| `device_type` | ENUM | NOT NULL | `switch` | `switch` / `router` / `firewall` |
| `vendor` | ENUM | NOT NULL | `cisco` | `cisco` / `mikrotik` / `huawei` |
| `model` | VARCHAR(100) | NOT NULL | `Catalyst 9300` | เลือก Jinja2 Template |
| `os_version` | VARCHAR(50) | NULLABLE | `IOS-XE 17.9.4` | CIS Scan เช็ค Compatibility |
| `serial_number` | VARCHAR(100) | NULLABLE | `FCW2345L0P8` | Inventory Report |
| `platform` | ENUM | NOT NULL | `cisco_ios` | ค่าที่ Netmiko ใช้ตรงๆ |
| `ssh_port` | INTEGER | NOT NULL, DEFAULT 22 | `22` | Port SSH |
| `protocol` | ENUM | NOT NULL, DEFAULT `ssh` | `ssh` | `ssh` / `telnet` |
| `credential_id` | UUID | FK → credentials, NULLABLE | - | NULL = ยังไม่ได้ตั้ง |
| `mac_address` | VARCHAR(17) | NULLABLE | `AA:BB:CC:DD:EE:FF` | Discovery ใช้ |
| `management_vlan` | INTEGER | NULLABLE | `99` | SSH ผ่าน VLAN ไหน |
| `gateway` | VARCHAR(45) | NULLABLE | `192.168.1.254` | Troubleshoot |
| `site` | VARCHAR(100) | NULLABLE | `HQ กรุงเทพ` | จัดกลุ่ม Dashboard |
| `location_detail` | VARCHAR(255) | NULLABLE | `ชั้น 3 ห้อง Server` | ตำแหน่งจริง |
| `role` | ENUM | NULLABLE | `core` | `core` / `distribution` / `access` |
| `tags` | JSON | NULLABLE | `["production"]` | Filter/Search |
| `status` | ENUM | NOT NULL, DEFAULT `unknown` | `online` | `online` / `offline` / `maintenance` / `unknown` |
| `last_seen` | TIMESTAMP | NULLABLE | `2026-08-06 12:00:00` | อัปเดตตอน Ping |
| `uptime` | VARCHAR(50) | NULLABLE | `45 days, 3:22:10` | ดึงจาก SSH |
| `discovery_method` | ENUM | NOT NULL, DEFAULT `manual` | `manual` | `manual` / `lldp` / `cdp` / `snmp` |
| `notes` | TEXT | NULLABLE | `"อุปกรณ์เก่า รอเปลี่ยน Q4"` | บันทึกของวิศวกร |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | `true` | Soft Delete |
| `created_by` | UUID | FK → users, NOT NULL | - | ใครเพิ่มเข้าระบบ |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

---

## 🔐 ตารางที่ 3: `credentials`
**Feature:** Config Deployment / SSH (หมวด 7) 🏆 P1-CORE

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `name` | VARCHAR(100) | NOT NULL | `"Cisco Lab Default"` | ชื่อชุด Credential |
| `username` | VARCHAR(100) | NOT NULL | `admin` | SSH Username |
| `password_encrypted` | TEXT | NOT NULL | `gAAAAAB...` | เข้ารหัสด้วย Fernet/AES |
| `enable_password_encrypted` | TEXT | NULLABLE | `gAAAAAB...` | Cisco `enable` password |
| `created_by` | UUID | FK → users, NOT NULL | - | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

> ⚠️ **Security Rule:** ห้ามเก็บ Password เป็น plain text เด็ดขาด ต้องเข้ารหัสก่อนทุกครั้ง

---

## 📄 ตารางที่ 4: `config_history`
**Feature:** Config Generation (หมวด 5), Version Control (หมวด 9) 🏆 P1-CORE

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `device_id` | UUID | FK → devices, NOT NULL | - | Config ของ Device ไหน |
| `config_text` | TEXT | NOT NULL | `hostname BKK-SW1\n...` | เนื้อหา Config ทั้งหมด |
| `snapshot_type` | ENUM | NOT NULL | `generated` | `generated` / `pre_deploy` / `post_deploy` / `manual_pull` / `uploaded` |
| `version_number` | INTEGER | NOT NULL | `3` | ลำดับเวอร์ชัน Auto Increment ต่อ Device |
| `vendor` | ENUM | NOT NULL | `cisco` | บันทึก Vendor ตอนสร้าง |
| `template_used` | VARCHAR(100) | NULLABLE | `cisco_basic_vlan.j2` | Template ที่ใช้ Render |
| `form_data_snapshot` | JSON | NULLABLE | `{"vlan_id": 10, ...}` | ข้อมูลฟอร์มที่กรอก (เพื่อ Diff) |
| `is_deployed` | BOOLEAN | NOT NULL, DEFAULT FALSE | `false` | เคย Deploy แล้วหรือยัง |
| `deployed_at` | TIMESTAMP | NULLABLE | - | เวลาที่ Deploy สำเร็จ |
| `created_by` | UUID | FK → users, NOT NULL | - | ใครสร้าง/ดึง Config |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

---

## 🔴 ตารางที่ 5: `scan_results`
**Feature:** CIS Benchmark Scanning (หมวด 8) 🏆 P1-CORE

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `device_id` | UUID | FK → devices, NOT NULL | - | สแกน Device ไหน |
| `config_snapshot_id` | UUID | FK → config_history, NULLABLE | - | Config เวอร์ชันที่ถูกสแกน |
| `rule_id` | VARCHAR(20) | NOT NULL | `CIS-01` | รหัส Rule (CIS-01 ถึง CIS-08) |
| `rule_name` | VARCHAR(200) | NOT NULL | `"Enable Secret Must Exist"` | ชื่อ Rule แสดงบน UI |
| `severity` | ENUM | NOT NULL | `critical` | `critical` / `warning` / `info` |
| `passed` | BOOLEAN | NOT NULL | `false` | ผ่านหรือไม่ |
| `evidence` | TEXT | NULLABLE | `"no enable secret found"` | หลักฐานที่ Regex พบ |
| `remediation` | TEXT | NULLABLE | `"Add: enable secret <pw>"` | วิธีแก้ไข |
| `is_overridden` | BOOLEAN | NOT NULL, DEFAULT FALSE | `false` | ถูก Override หรือยัง |
| `scanned_by` | UUID | FK → users, NOT NULL | - | ใครสั่งสแกน |
| `scanned_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

---

## 🟡 ตารางที่ 6: `cis_overrides`
**Feature:** CIS Override Logging (หมวด 9) 🏆 P1-CORE

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `scan_result_id` | UUID | FK → scan_results, UNIQUE, NOT NULL | - | 1-to-1 กับ scan_results |
| `reason` | TEXT | NOT NULL | `"อุปกรณ์รุ่นเก่าไม่รองรับ"` | บังคับกรอก ห้ามว่าง |
| `overridden_by` | UUID | FK → users, NOT NULL | - | ต้องเป็น Admin เท่านั้น |
| `overridden_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |
| `expires_at` | TIMESTAMP | NULLABLE | `2026-12-31` | วันหมดอายุ Override |
| `revoked_at` | TIMESTAMP | NULLABLE | - | ถ้ายกเลิกก่อนหมดอายุ |
| `revoked_by` | UUID | FK → users, NULLABLE | - | ใคร Revoke |

---

## 📝 ตารางที่ 7: `audit_logs`
**Feature:** Audit Trail (หมวด 9) 🏗️ P1-INFRA

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `user_id` | UUID | FK → users, NULLABLE | - | NULL ถ้าเป็น System Action |
| `action` | VARCHAR(100) | NOT NULL | `device.create` | รูปแบบ `resource.action` |
| `resource_type` | VARCHAR(50) | NOT NULL | `device` | `device` / `config` / `scan` / `user` / `settings` |
| `resource_id` | UUID | NULLABLE | - | ID ของ Record ที่ถูกกระทำ |
| `description` | TEXT | NULLABLE | `"Added device BKK-SW1"` | รายละเอียดเพิ่มเติม |
| `ip_address` | VARCHAR(45) | NULLABLE | `10.0.0.5` | IP ของ Client |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

**ตัวอย่าง action values:** `device.create`, `device.update`, `device.delete`, `config.generate`, `config.deploy`, `scan.run`, `scan.override`, `user.login`, `user.logout`, `settings.update`

---

## 🚀 ตารางที่ 8: `deploy_logs`
**Feature:** Configuration Deployment (หมวด 7) 🚀 P2

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `device_id` | UUID | FK → devices, NOT NULL | - | Deploy ไปที่ Device ไหน |
| `config_snapshot_id` | UUID | FK → config_history, NOT NULL | - | Config เวอร์ชันที่ Deploy |
| `status` | ENUM | NOT NULL | `success` | `pending` / `running` / `success` / `failed` / `rolled_back` |
| `output_log` | TEXT | NULLABLE | `"Building config...\n..."` | Raw SSH Output จาก Netmiko |
| `error_message` | TEXT | NULLABLE | `"Timeout after 30s"` | Error ถ้า Deploy ล้มเหลว |
| `deployed_by` | UUID | FK → users, NOT NULL | - | |
| `started_at` | TIMESTAMP | NOT NULL | - | |
| `finished_at` | TIMESTAMP | NULLABLE | - | NULL ถ้ายังรันอยู่ |

---

## 🔗 ตารางที่ 9: `interfaces`
**Feature:** Network Topology (หมวด 4) 🚀 P2 — สร้าง Schema Sprint 0 แต่ยังไม่ใส่ข้อมูล

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `device_id` | UUID | FK → devices, NOT NULL | - | Interface เป็นของ Device ไหน |
| `name` | VARCHAR(100) | NOT NULL | `GigabitEthernet0/1` | ชื่อ Port จริงบนอุปกรณ์ |
| `ip_address` | VARCHAR(45) | NULLABLE | `10.0.0.1` | IP บน Interface |
| `subnet_mask` | VARCHAR(45) | NULLABLE | `255.255.255.0` | Subnet |
| `vlan_id` | INTEGER | NULLABLE | `10` | VLAN ที่ Port สังกัด |
| `status` | ENUM | NULLABLE | `up` | `up` / `down` / `admin_down` |
| `speed` | VARCHAR(20) | NULLABLE | `1Gbps` | ความเร็ว Port |
| `description` | VARCHAR(255) | NULLABLE | `"Uplink to Core"` | คำอธิบาย |
| `connected_to_device_id` | UUID | FK → devices, NULLABLE | - | ต่อไปยัง Device ไหน (Topology) |
| `connected_to_interface` | VARCHAR(100) | NULLABLE | `GigabitEthernet0/0` | ต่อเข้า Port อะไรของ Device ปลายทาง |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

---

## ⚙️ ตารางที่ 10: `system_settings`
**Feature:** Settings & Administration (หมวด 11) 🏗️ P1-INFRA — Singleton (มีแค่ 1 Row)

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | INTEGER | PK, NOT NULL | `1` | Singleton |
| `gemini_api_key_encrypted` | TEXT | NULLABLE | `gAAAAAB...` | เข้ารหัสก่อนเก็บ |
| `gemini_model` | VARCHAR(50) | NOT NULL, DEFAULT `gemini-flash` | `gemini-flash` | เลือก Flash หรือ Pro |
| `token_budget_monthly` | INTEGER | NULLABLE | `100000` | จำกัด Token/เดือน |
| `token_used_this_month` | INTEGER | NOT NULL, DEFAULT 0 | `12345` | นับ Token ที่ใช้ไป |
| `offline_mode` | BOOLEAN | NOT NULL, DEFAULT FALSE | `false` | ปิด AI → Template อย่างเดียว |
| `updated_by` | UUID | FK → users, NULLABLE | - | ใคร Update ล่าสุด |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

---

## 🛡️ ตารางที่ 11: `cis_rule_settings`
**Feature:** CIS Rule Toggles (หมวด 11) 🏆 P1-CORE — Seed 8 Rules ตั้งแต่ Sprint 1

| Column | Type | Constraint | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|---|
| `id` | UUID | PK, NOT NULL | `uuid4()` | |
| `rule_id` | VARCHAR(20) | UNIQUE, NOT NULL | `CIS-01` | รหัส Rule |
| `rule_name` | VARCHAR(200) | NOT NULL | `"Enable Secret Must Exist"` | ชื่อแสดงบน UI |
| `description` | TEXT | NULLABLE | `"Checks if enable secret..."` | อธิบาย Rule |
| `severity` | ENUM | NOT NULL | `critical` | `critical` / `warning` / `info` |
| `is_enabled` | BOOLEAN | NOT NULL, DEFAULT TRUE | `true` | Admin เปิด/ปิด Rule ได้ |
| `regex_pattern` | TEXT | NOT NULL | `r"enable secret \S+"` | Regex ที่ใช้สแกน Config |
| `vendor` | ENUM | NOT NULL | `cisco` | Rule นี้ใช้กับยี่ห้อไหน |
| `remediation_guide` | TEXT | NULLABLE | `"Add: enable secret <pw>"` | วิธีแก้ |
| `updated_by` | UUID | FK → users, NULLABLE | - | |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | - | |

**8 CIS Rules ที่ต้อง Seed ตั้งแต่แรก:**

| Rule ID | Rule Name | Severity |
|---|---|---|
| `CIS-01` | Enable Secret Must Exist | critical |
| `CIS-02` | Service Password-Encryption Enabled | critical |
| `CIS-03` | SSH Version 2 Only | critical |
| `CIS-04` | No Telnet on VTY Lines | warning |
| `CIS-05` | Banner MOTD Must Exist | info |
| `CIS-06` | Console Exec-Timeout Set | warning |
| `CIS-07` | VTY Exec-Timeout Set | warning |
| `CIS-08` | HTTP Server Disabled | warning |

---

## 📊 Feature → Table Mapping (Quick Reference)

| Feature (หมวด) | ตารางที่ใช้ |
|---|---|
| **1. Auth & RBAC** | `users` |
| **2. Dashboard** | `devices` (status, last_seen), `audit_logs` (recent activity) |
| **3. Device Inventory** | `devices`, `credentials`, `interfaces` (P2) |
| **4. Network Topology** | `devices`, `interfaces` (P2) |
| **5. Config Generation** | `devices` (vendor, platform), `config_history` |
| **6. PII Masking** | ไม่มีตารางแยก — เป็น Middleware Logic ใน Backend |
| **7. Config Deployment** | `config_history`, `credentials`, `deploy_logs` (P2) |
| **8. CIS Scanning** | `scan_results`, `cis_rule_settings`, `config_history` |
| **9. Version Control** | `config_history` (Diff/Rollback), `cis_overrides`, `audit_logs` |
| **10. AI Architecture** | `config_history` (Context Injection), `system_settings` (API Key) |
| **11. Settings & Admin** | `system_settings`, `cis_rule_settings`, `users` |

---

## 🚀 Sprint Planning — ลำดับการสร้างตาราง

```
Sprint 0 — Foundation (ก่อนเขียน Feature ใดๆ):
  ✅ users              ← Login ต้องใช้ก่อน
  ✅ devices            ← ทุก Feature ผูกอยู่กับนี้
  ✅ credentials        ← ใส่ตั้งแต่ต้นก่อน Device ใช้
  ✅ audit_logs         ← Log ทุก Action ตั้งแต่วันแรก
  ✅ system_settings    ← Seed ค่า Default ก่อน Run App
  ✅ interfaces         ← สร้าง Schema เก็บไว้ แต่ยังไม่ใส่ข้อมูล (P2)

Sprint 1 — P1-CORE Features:
  ✅ config_history     ← ต้องมีก่อน Config Gen ทำงานได้
  ✅ cis_rule_settings  ← Seed 8 Rules พร้อมกับสร้างตาราง
  ✅ scan_results       ← CIS Scan ต้องการ
  ✅ cis_overrides      ← Override Logging

Sprint 2 / P2:
  🚀 deploy_logs        ← SSH Deploy จริงๆ
```

---

## 📌 Developer Notes

1. **ใช้ UUID เป็น PK** — ป้องกัน Enumeration Attack (ห้ามเดา ID)
2. **Soft Delete** — ห้ามลบ `devices` และ `users` จริงๆ ให้ใช้ `is_active = false` แทน
3. **Encryption** — `credentials.password_encrypted` และ `system_settings.gemini_api_key_encrypted` ต้องเข้ารหัสด้วย Fernet ก่อนบันทึกเสมอ
4. **Alembic** — ทุกการเปลี่ยน Schema ต้องสร้าง Migration File ห้าม `ALTER TABLE` ตรงๆ
5. **Enum** — กำหนดค่า Enum ใน Python (SQLAlchemy) และ Database ให้ตรงกัน
6. **Singleton Settings** — `system_settings` มีแค่ 1 Row เสมอ ใช้ `upsert` ไม่ใช่ `insert`
