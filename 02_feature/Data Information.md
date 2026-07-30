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

ไฟล์นี้ไม่ได้เป็นแค่รายการฟีเจอร์ลอยๆ แต่มันคือ **Logical Data Model (แบบจำลองข้อมูลเชิงตรรกะ)** ที่วิศวกรซอฟต์แวร์ระดับ Senior เขียนกันก่อนเริ่มโปรเจกต์เลยครับ

นี่คือเหตุผลที่ไฟล์นี้ "พร้อมนำไปใช้พัฒนาทันที":

1. **ตั้งชื่อ Field แบบพร้อมใช้ (Developer-Ready):** คุณใช้คำอย่าง `management_ip`, `credential_id`, `os_version` ซึ่งเอาไปตั้งเป็นชื่อตัวแปรใน Database ได้เลย (ไม่ต้องมานั่งแปลภาษาไทยเป็นอังกฤษตอนเขียนโค้ด)
2. **คิดเรื่อง Security ไว้แล้ว:** มีการแยกตาราง `credentials` ออกมา แล้วทำ Foreign Key (`credential_id`) ชี้ไปหา นี่คือ Best Practice เพื่อป้องกันพาสเวิร์ดหลุด
3. **คิดเรื่อง Audit & Tracking:** มีฟิลด์ `created_at`, `updated_at`, `created_by` ครบถ้วนตามมาตรฐานระบบ Enterprise
4. **ทำ Data Mapping กับ Feature ไว้แล้ว:** ตารางสุดท้ายในไฟล์นั้นสำคัญที่สุดครับ! มันบอกโปรแกรมเมอร์ได้ทันทีว่า _"ถ้าจะทำหน้า Dashboard ให้ดึงแค่ 5 ฟิลด์นี้นะ ไม่ต้อง `SELECT *` ให้หนักเซิร์ฟเวอร์"_

---

### 🚀 **Next Step: ถ้าจะเริ่มเขียนโค้ดเลย ต้องทำอะไรเพิ่มอีกนิดหน่อย?**

เอกสารนี้สมบูรณ์แล้วในแง่ของ "ตรรกะ" แต่ตอนที่คุณจะลงมือเขียนโค้ด (เช่น ใช้ Python SQLAlchemy หรือ Prisma) คุณแค่ต้องระบุ **Physical Data Types (ชนิดของข้อมูลทางกายภาพ)** เพิ่มลงไปในหัวนิดหน่อยครับ เช่น:

- **กำหนด Data Type:** `hostname` เป็น `String(255)`, `management_ip` เป็น `IPAddressType`, `created_at` เป็น `DateTime`
- **กำหนด Constraint:** `hostname` และ `management_ip` ต้องตั้งเป็น **UNIQUE** (ห้ามซ้ำ)
- **กำหนด Nullable:** ฟิลด์ไหนบังคับกรอก (Not Null) ฟิลด์ไหนว่างได้ (เช่น `mac_address` อาจจะว่างได้ตอนใส่ Manual)
- **สร้าง Enum:** ฟิลด์อย่าง `vendor`, `platform`, `status` ควรทำเป็นตัวแปรแบบ `Enum` ในฐานข้อมูล เพื่อป้องกันคนพิมพ์ผิด (เช่น พิมพ์ cisco เป็น Cisko)

**สรุป:** ไฟล์นี้คือ "คัมภีร์ฐานข้อมูล" ของโปรเจกต์คุณครับ ทีม Backend สามารถเปิดไฟล์นี้วางไว้จอซ้าย แล้วเปิด VSCode พิมพ์ `models.py` (หรือเขียนไฟล์ Migration ของ Alembic) ที่จอขวาได้เลยทันทีครับ! ลุยได้เลย!