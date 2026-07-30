Feature List ดูดีมากครับ! มาคิดเรื่อง Device Information กัน

---

## 📦 Device Information ควรเก็บอะไรบ้าง?

ผมแบ่งออกเป็น **6 กลุ่ม** ตามจุดประสงค์การใช้งาน:

### 🔵 1. Core Identity (ข้อมูลตัวตน)
| Field           | ตัวอย่าง                          | ทำไมต้องเก็บ?                         |
| --------------- | --------------------------------- | ------------------------------------- |
| `hostname`      | `BKK-CORE-SW1`                    | ชื่อที่แสดงในทุกหน้า UI               |
| `management_ip` | `192.168.1.1`                     | Netmiko ใช้ SSH เข้าอุปกรณ์           |
| `device_type`   | `switch` / `router` / `firewall`  | แบ่งหมวดหมู่ + ไอคอนบน Topology       |
| `vendor`        | `cisco` / `mikrotik` / `huawei`   | เลือก Jinja2 Template + Prompt ให้ AI |
| `model`         | `Catalyst 9300` / `RB750Gr3`      | AI ใช้เป็น Context ตอนตอบคำถาม        |
| `os_version`    | `IOS-XE 17.9.4` / `RouterOS 7.14` | เช็คความเข้ากัน + Security patch      |
| `serial_number` | `FCW2345L0P8`                     | ใช้ยืนยันตัวตน + รายงาน Inventory     |

### 🟢 2. Connection (สำหรับ Netmiko เชื่อมต่อ)
| Field           | ตัวอย่าง                                         | หมายเหตุ                                                |
| --------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `platform`      | `cisco_ios` / `mikrotik_routeros` / `huawei_vrp` | **ค่าที่ Netmiko ต้องใช้ตรงๆ**                          |
| `ssh_port`      | `22` (default)                                   | บาง Device ใช้พอร์ตอื่น                                 |
| `protocol`      | `ssh` / `telnet`                                 | ส่วนใหญ่ SSH แต่ของเก่าอาจยัง Telnet                    |
| `credential_id` | FK → Credentials table                           | **ไม่ควรเก็บ password ตรงนี้!** แยกตารางเก็บ + เข้ารหัส |

### 🟡 3. Network Info (ข้อมูลเครือข่าย)
| Field             | ตัวอย่าง            | ทำไมต้องเก็บ?                  |
| ----------------- | ------------------- | ------------------------------ |
| `mac_address`     | `AA:BB:CC:DD:EE:FF` | ระบุตัวตนที่ไม่ซ้ำ + Discovery |
| `management_vlan` | `99`                | รู้ว่าต้อง SSH ผ่าน VLAN ไหน   |
| `gateway`         | `192.168.1.254`     | Troubleshoot connectivity      |

### 🔴 4. Location & Role (ตำแหน่งและบทบาท)
| Field | ตัวอย่าง | ทำไมต้องเก็บ? |
|---|---|---|
| `site` | `สาขาบางนา` / `HQ กรุงเทพ` | จัดกลุ่มใน Dashboard + Filter |
| `location_detail` | `ชั้น 3 ห้อง Server` | ส่งคนไปดูหน้างานถูกจุด |
| `role` | `core` / `distribution` / `access` | **AI ใช้ทำ Impact Analysis** ถ้า Core พังผลกระทบเยอะ |
| `tags` | `["production", "critical"]` | Filter/Search แบบ Flexible |

### 🟣 5. Status (สถานะปัจจุบัน)
| Field | ตัวอย่าง | ทำไมต้องเก็บ? |
|---|---|---|
| `status` | `online` / `offline` / `maintenance` | Dashboard แสดงสถานะ real-time |
| `last_seen` | `2026-07-30 12:00:00` | รู้ว่าข้อมูลเก่าแค่ไหน |
| `uptime` | `45 days, 3:22:10` | ดูว่า Reboot บ่อยไหม (สุขภาพ) |

### ⚪ 6. Metadata (ข้อมูลบริหารจัดการ)
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
       │              ┌──────────────────┐
       └─────────────→│   config_history │
                      │ (config_text,    │
                      │  timestamp,      │
                      │  changed_by)     │
                      └──────────────────┘
```

**เหตุผลที่ต้องแยก:**
- **Credentials:** แยกเพราะหลาย Device อาจใช้ Credential ชุดเดียวกัน + ต้องเข้ารหัสแยก
- **Interfaces:** แยกเพราะ 1 Device มีหลาย Interface (1-to-many) → **Topology ต้องใช้ตารางนี้**
- **Config History:** แยกเพราะเก็บหลายเวอร์ชัน → **Version Control ต้องใช้ตารางนี้**

---

## 🎯 สรุป: Field ไหนใช้กับ Feature ไหน

| Feature ของคุณ | Fields ที่ต้องพึ่งพา |
|---|---|
| **Dashboard** | `status`, `last_seen`, `uptime`, `site`, `role` |
| **Device Inventory** | Core Identity ทั้งหมด + Location |
| **Network Discovery** | `management_ip`, `mac_address`, `platform`, `discovery_method` |
| **Network Topology** | `hostname`, `device_type`, `role`, **Interfaces table** (port connections) |
| **Config Generate (Rule-Based)** | `vendor`, `platform`, `model` → เลือก Jinja2 Template |
| **Config Generate (AI/RAG)** | `vendor`, `model`, `role`, `os_version`, `site` → inject เป็น Context |
| **Config Deployment** | `management_ip`, `platform`, `credential_id` → Netmiko SSH |
| **Security Validation** | `os_version`, `vendor` → เช็คว่ามี known vulnerability ไหม |
| **Version Control** | **Config History table** |
| **Auto Backup** | `management_ip`, `platform`, `credential_id` + cron schedule |
| **Audit Trail** | `created_at`, `updated_at`, `created_by` |
