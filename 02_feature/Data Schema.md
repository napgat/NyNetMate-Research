# MyNetMate Data Informaton Schema
อ้างอิงจาก: MyNetMate Weight Feature List.md และ MyNetMate รายการ Features.md

---
ตารางที่ 1: `users`
**Feature:** Authentication & Authorization 

| Column          | Type         | Constraint             | ตัวอย่าง            | หมายเหตุ                        |
| --------------- | ------------ | ---------------------- | ------------------- | ------------------------------- |
| `id`            | UUID         | PK, NOT NULL           | `uuid4()`           | Primary Key                     |
| `username`      | VARCHAR(100) | UNIQUE, NOT NULL       | `admin_kmitl`       | ใช้ Login                       |
| `email`         | VARCHAR(255) | UNIQUE, NULLABLE       | `admin@kmitl.ac.th` | Optional                        |
| `password_hash` | VARCHAR(255) | NOT NULL               | `$2b$12$...`        | hash                            |
| `role`          | ENUM         | NOT NULL               | `admin`             | `admin` / `operator` / `viewer` |
| `is_active`     | BOOLEAN      | NOT NULL, DEFAULT TRUE | `true`              | ปิดบัญชี                        |

**RBAC Permissions:**

| Role       | สิทธิ์                                                   |
| ---------- | -------------------------------------------------------- |
| `admin`    | Full access จัดการ User, Settings, Deploy, Override CIS  |
| `operator` | สร้าง Config, Deploy, สแกน CIS ได้ — Override CIS ไม่ได้ |
| `viewer`   | ดูอย่างเดียว  ห้าม Create/Edit/Deploy                    |


 ตารางที่ 2: `devices`
**Feature:** Device Inventory & Management 

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

 ตารางที่ 3: `credentials`
**Feature:** Config Deployment / SSH 

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

ตารางที่ 4: `config_history`
**Feature:** Config Generation, Version Control 

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

 ตารางที่ 5: `scan_results`
**Feature:** CIS Benchmark Scanning 

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

ตารางที่ 6: `cis_overrides`
**Feature:** CIS Override Logging 

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

ตารางที่ 7: `audit_logs`
**Feature:** Audit Trail 

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


ตารางที่ 8: `deploy_logs`
**Feature:** Configuration Deployment 

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


 ตารางที่ 9: `interfaces`
**Feature:** Network Topology 

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

 ตารางที่ 10: `system_settings`
**Feature:** Settings & Administration 

| Column                     | Type        | Constraint                       | ตัวอย่าง       | หมายเหตุ                     |
| -------------------------- | ----------- | -------------------------------- | -------------- | ---------------------------- |
| `id`                       | INTEGER     | PK, NOT NULL                     | `1`            | Singleton                    |
| `gemini_api_key_encrypted` | TEXT        | NULLABLE                         | `gAAAAAB...`   | เข้ารหัสก่อนเก็บ             |
| `gemini_model`             | VARCHAR(50) | NOT NULL, DEFAULT `gemini-flash` | `gemini-flash` | เลือก Flash หรือ Pro         |
| `token_budget_monthly`     | INTEGER     | NULLABLE                         | `100000`       | จำกัด Token/เดือน            |
| `token_used_this_month`    | INTEGER     | NOT NULL, DEFAULT 0              | `12345`        | นับ Token ที่ใช้ไป           |
| `offline_mode`             | BOOLEAN     | NOT NULL, DEFAULT FALSE          | `false`        | ปิด AI → Template อย่างเดียว |
| `updated_by`               | UUID        | FK → users, NULLABLE             | -              | ใคร Update ล่าสุด            |
| `updated_at`               | TIMESTAMP   | NOT NULL, DEFAULT NOW()          | -              |                              |
 ตารางที่ 11: `cis_rule_settings`
**Feature:** CIS Rule Toggles 

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

	