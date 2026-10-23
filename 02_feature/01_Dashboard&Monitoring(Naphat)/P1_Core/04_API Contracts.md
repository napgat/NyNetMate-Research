# API Contracts

> **Device Contract revision: 2026-10-22** — เทียบ Source code ใน Backend branch `feature/11-audit-writer`, commit `b862c60` แล้ว ส่วนการสรุปของ D&M ด้านล่างเป็น **ข้อกำหนดที่จะพัฒนา** ยังไม่ใช่ Endpoint ที่ Implement/ทดสอบแล้ว และไม่ใช่การรับรองว่ารวมเข้า `main` แล้ว
>
> **User decision 2026-10-22:** ใช้อายุผลตรวจ 15 นาที (`900` วินาที) เป็นเกณฑ์ D&M P1 และกำหนดลิงก์กรองหน้าอุปกรณ์ตามหัวข้อ 3; ยืนยันแบบแล้ว แต่ยังต้องพัฒนา/ทดสอบการรับ URL ใน Frontend
>
> หลักฐาน: [Inventory schema](../../../mynetmate/backend/app/core/inventory_tables.py), [Device DTO](../../../mynetmate/backend/app/features/devices/schemas.py), [Inventory query](../../../mynetmate/backend/app/features/devices/services/inventory.py), [SNMP health service](../../../mynetmate/backend/app/features/devices/services/health.py) และ [Snapshot persistence](../../../mynetmate/backend/app/features/devices/services/snapshot.py)

| Endpoint                             | สิทธิ์                | Input                     | Output หลัก                                                    | Cache/Error behavior                                                              |
| ------------------------------------ | --------------------- | ------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `GET /api/dashboard/summary`         | Viewer/Operator/Admin | ไม่มีตัวกรองใน D&M P1 รอบแรก | Device counts แยก `management_state`/`reachability`, เวลาและ Freshness เกณฑ์ 900 วินาที, Security summary | รุ่นแรกอ่านฐานข้อมูลใหม่เมื่อเรียก API โดยยังไม่ Cache Summary; ห้ามคืน `0` แทน Query failure |
| `GET /api/dashboard/recent-activity` | `activity.read_summary` | `limit` (Default 10, Max 50), `cursor` (สำหรับ Pagination) | รายการกิจกรรมล่าสุด **(กฎการทำงาน: 1. อ่านข้อมูลผ่าน SQLAlchemy ORM จากตาราง `audit_logs` โดยตรง 2. Query เฉพาะ Event ใน Positive Allowlist 3. เรียงลำดับ `ORDER BY created_at DESC, id DESC` (เพื่อเป็น Tie-breaker ป้องกันข้อมูลข้าม/ซ้ำ) 4. รองรับ Pagination โดย Response ต้องส่งกลับเป็น `{ data: [...], next_cursor: "<created_at>_<id>" }` 5. Redaction: หาก actor เป็น null หรือหาไม่พบ ให้ใช้ `actor_display_name: "Unknown"` ห้ามเผย identifier ดิบ, และห้ามแสดง IP, User-Agent, Error Detail, Secret, หรือ Full Audit Description)** | ไม่จำเป็นต้อง Cache หาก Index `created_at` และ `action` เหมาะสม |
| `GET /api/system/health`             | Viewer/Operator/Admin | ไม่มี                     | Backend, Database, AI mode/status                              | Dependency ภายนอกต้องมี Timeout และ Offline Mode ต้องไม่ถูกส่งเป็น Critical error |

## 1. Device Inventory → D&M: ข้อมูลที่อ่านและความหมาย

D&M อ่านข้อมูลผ่าน Query แบบ Read-only ใน Backend ไม่เรียก SNMP/ICMP และไม่เรียกคำสั่งตรวจอุปกรณ์ทุกครั้งที่เปิด Dashboard

| Field จาก Inventory | ค่า/ความหมายตามโค้ดปัจจุบัน | การใช้ใน D&M |
| --- | --- | --- |
| `id` | UUID ของอุปกรณ์ | อ้างอิงอุปกรณ์เมื่อเชื่อมหน้ารายการ ไม่สร้าง Device ซ้ำ |
| `reachability` | `reachable`, `unreachable`, `unknown` | ผลการติดต่อครั้งล่าสุด ไม่ใช้ชื่อ `online`/`offline` เป็นคีย์แทน |
| `management_state` | `active`, `unmanaged`, `maintenance`, `retired` | สถานะการจัดการ แยกจากผลการติดต่อ |
| `reachability_checked_at` | เวลาที่บันทึกผลตรวจล่าสุด; อาจเป็น `null` | ใช้ประเมินอายุผลตรวจและบอกว่าเคยตรวจแล้วหรือยัง |
| `last_seen_at` | เวลาที่ติดต่อสำเร็จล่าสุด; อาจเป็น `null` | แสดงว่า “ติดต่อสำเร็จล่าสุด” ไม่ใช้แทนเวลาตรวจล่าสุด |
| `last_collected_at` | เวลาอัปเดตข้อมูล Inventory/Collection; แถว `unmanaged` ที่มาจากหลักฐานเพื่อนบ้านก็มีค่านี้ได้ | ไม่ใช้ค่านี้เพียงอย่างเดียวสรุปว่าเคยติดต่ออุปกรณ์นั้นสำเร็จหรือมี Successful Operational Snapshot ของ D&M |

### 1.1 Reachability ตามพฤติกรรมโค้ด

- `reachable` — Health service อ่านค่า SNMP `sysUpTime` ได้ หรือมี Snapshot ของ Inventory ที่เก็บจากอุปกรณ์สำเร็จ ไม่รับรองว่า SSH, WAN หรือบริการทั้งหมดปกติ
- `unreachable` — เส้นทางตรวจ SNMP ได้ผลตอบกลับที่ไม่มีค่าที่ต้องการ (`value is None`) ไม่แปลว่าเครื่องดับหรือทุก Protocol ติดต่อไม่ได้
- `unknown` — ยังไม่มีผลตรวจ หรือ Health service ไม่มี Credential ที่ใช้ได้/เกิด Exception ระหว่างตรวจ โค้ดปัจจุบันคืน `unknown` สำหรับ Exception ด้วย D&M ต้องคงค่าจาก Owner ไม่เปลี่ยนเป็น `unreachable` เอง

`unknown` ร่วมกับ `reachability_checked_at = null` แสดง “ยังไม่เคยตรวจ”; ถ้ามีเวลาตรวจแล้วให้แสดง “ยังสรุปผลการติดต่อไม่ได้” ไม่เหมารวมว่ายังไม่เคยตรวจ

### 1.2 กฎนับของ D&M P1

กฎนี้เป็น **Working Decision ฝั่ง D&M** เพื่อทำ Metric ให้ชัด โดยอิง Inventory ซึ่งรายการเริ่มต้นไม่รวม `retired` และการตรวจเป็นกลุ่มเลือกเฉพาะ `active`; ยังไม่ใช่โค้ด Aggregation ที่มีอยู่แล้ว

1. `devices.total` นับทุกแถวที่ `management_state != 'retired'` จึงรวม `active`, `unmanaged`, `maintenance`
2. `devices.management_state` แจกแจงจำนวนสามกลุ่มนั้น ผลรวมต้องเท่ากับ `devices.total`
3. `devices.reachability` นับเฉพาะ `management_state = 'active'`; `reachable + unreachable + unknown = reachability.total = management_state.active`
4. `maintenance` และ `unmanaged` แสดงแยก ไม่รวมในจำนวน “อุปกรณ์ใช้งานที่ติดต่อไม่ได้” แม้ยังมี Reachability เก่าติดอยู่ในแถว; `retired` ไม่รวมทุกตัวเลขใน Summary นี้
5. UI ต้องกำกับว่า Reachability เป็นของ “อุปกรณ์ที่อยู่ระหว่างจัดการ (Active)” ไม่ทำกราฟรวม Reachable/Unreachable/Unknown/Maintenance/Unmanaged เป็นแกนสถานะเดียว
6. ใช้ Query นับทั้งขอบเขต ไม่ใช้จำนวนแถวจากหน้ารายการที่มี `limit` เป็นจำนวนรวม; UI-02 และ UI-03 ใช้สูตรเดียวกัน

ตัวอย่าง: Inventory มี 12 แถว โดย Active 7, Unmanaged 1, Maintenance 2, Retired 2 → จำนวนรวมที่แสดงเป็น 10 และ Reachability แจกแจงเฉพาะ Active 7 ตัว

### 1.3 เวลาและ Freshness

- `generated_at` คือเวลาฝั่ง Backend ที่ใช้ประเมินอายุและสร้าง Summary รอบนั้น ไม่ใช่เวลาที่ตรวจอุปกรณ์ ใช้จุดเวลาเดียวกันกับทุกแถวและคำนวณจาก Timestamp ที่มี Timezone
- Freshness ของ Reachability คำนวณจาก `reachability_checked_at` ของอุปกรณ์ `active` แต่ละตัว ไม่ใช้ `MAX(last_seen_at)` ของตัวเดียวอ้างว่าทั้งกลุ่มใหม่
- `oldest_checked_at`/`latest_checked_at` เป็นค่าน้อยสุด/มากสุดจากเวลาที่ไม่เป็น `null`; ถ้าไม่มีให้เป็น `null` ทั้งคู่
- `never_checked` นับ Active ที่ `reachability_checked_at` เป็น `null` แยกจากจำนวนที่ตรวจแล้วแต่ข้อมูลเก่า
- **เกณฑ์ที่ผู้ใช้ยืนยันคือ 15 นาที = 900 วินาที**: `age_seconds = generated_at - reachability_checked_at`; อายุ `0–900` วินาทีถือว่ายังใหม่ และอายุ `> 900` วินาทีถือว่าเก่า พอดี 15 นาทียังไม่เป็น Stale ไม่ปัดนาทีเพื่อใช้ตัดสิน
- `threshold_seconds` เป็นค่าตั้งของ Backend ใช้ค่าเริ่มต้น `900` เมื่อไม่ได้ตั้ง Override; ไม่ต้องมีหน้าตั้งค่าใน P1 และ Response ที่อ่าน Device สำเร็จต้องส่งเกณฑ์จริง ไม่ส่ง `null` แทนค่าที่ยืนยันแล้ว
- `stale_count` นับเฉพาะ Active ที่มีเวลาตรวจและอายุเกิน 900 วินาที; Unknown ที่มีเวลาตรวจก็ประเมินอายุได้ ส่วนที่ไม่เคยตรวจนับใน `never_checked` ไม่ถูกนับเป็น Stale ซ้ำ
- แถวที่มีเวลาในอนาคตหรืออ่าน Timestamp ไม่ได้ไม่ถูกจัดเป็น Fresh; ระบุว่าประเมินอายุไม่ได้และแก้ข้อมูลต้นทางก่อนรับรองผล ไม่เอาไปนับเป็น `never_checked` ซึ่งสงวนไว้สำหรับเวลา `null`
- ป้าย Freshness ไม่แก้ค่า Reachability: ติดต่อสำเร็จล่าสุดนานแล้วก็ยังเป็น Last Observed `reachable` พร้อมคำเตือนข้อมูลเก่าได้
- จำนวน Reachability ยังนับผลที่เก็บล่าสุดทั้งข้อมูลใหม่และเก่า จึงไม่ตัด Stale ออกจากการ์ดจนผลรวมผิด ให้แสดงป้ายเตือนอายุประกอบ
- หน้าเว็บระบุ “ประเมินอายุ ณ [generated_at]”; เมื่อผู้ใช้กด “โหลดสรุปใหม่” ให้เรียก Summary ใหม่เพื่อประเมินอายุตามเวลารอบใหม่ โดยไม่ตรวจอุปกรณ์เพิ่ม การปล่อยหน้าไว้เฉย ๆ ไม่ได้หมายความว่ามีการตรวจอุปกรณ์ต่อเนื่อง
- อายุ Cache ของ Frontend (เช่น Query `staleTime`) เป็นคนละค่ากับอายุผลตรวจ 900 วินาที ปุ่ม “โหลดสรุปใหม่” ต้องขอ API จริง ไม่ใช้ Cache เดิมแล้วเปลี่ยนป้ายเวลาให้ดูเหมือนข้อมูลใหม่
- จำนวนข้อมูลเก่า/ยังไม่เคยตรวจเป็นข้อมูลประกอบที่ **กดกรองไม่ได้ใน P1 รอบนี้**; Backend Inventory ยังไม่มีตัวกรอง Freshness ห้ามส่ง URL ที่แสร้งว่ากรองได้

| เวลาประเมิน | เวลาตรวจอุปกรณ์ | ผลตามเกณฑ์ |
| --- | --- | --- |
| 10:00:00 | 09:45:00 | อายุ 900 วินาที ยังใหม่ |
| 10:00:01 | 09:45:00 | อายุ 901 วินาที ข้อมูลเก่า |
| 10:00:00 | `null` | ยังไม่เคยตรวจ แยกจากข้อมูลเก่า |

## 2. ตัวอย่าง Response: Dashboard Summary (แบบที่จะพัฒนา)

ตัวเลขเป็นข้อมูลจำลองสำหรับ Contract; ส่วน Security ยังคงรอเจ้าของยืนยันนิยามการนับ ไม่ได้ถือว่าพร้อมใช้งานเพราะมีตัวอย่าง JSON

```json
{
  "devices": {
    "data_status": "available",
    "total": 10,
    "management_state": {
      "active": 7,
      "unmanaged": 1,
      "maintenance": 2
    },
    "reachability": {
      "scope": "active",
      "total": 7,
      "reachable": 5,
      "unreachable": 1,
      "unknown": 1
    },
    "freshness": {
      "basis": "reachability_checked_at",
      "threshold_seconds": 900,
      "never_checked": 1,
      "oldest_checked_at": "2026-10-22T09:40:00+07:00",
      "latest_checked_at": "2026-10-22T09:59:00+07:00",
      "stale_count": 1
    }
  },
  "security": {
    "critical_failures": 2
  },
  "generated_at": "2026-10-22T10:00:00+07:00"
}
```

ตัวอย่างนี้มี Active 7 ตัว: Reachable 5 ตัวตรวจเวลา 09:40, 09:45, 09:50, 09:55, 09:59; Unreachable 1 ตัวตรวจเวลา 09:58; Unknown 1 ตัวไม่มีเวลาตรวจ เมื่อประเมินเวลา 10:00 จึงมี Stale 1 และ Never Checked 1 รวมอยู่ใน Active เดิม ไม่บวกเข้า Total ซ้ำ

### 2.1 ไม่มีข้อมูลและอ่านข้อมูลไม่ได้

- Query สำเร็จแต่ไม่มีอุปกรณ์: `data_status = 'available'`, จำนวนอุปกรณ์, `never_checked`, `stale_count` เป็น `0`, `threshold_seconds = 900`, เวลาเก่าสุด/ล่าสุดเป็น `null`; UI แสดง “ยังไม่มีอุปกรณ์” ไม่สรุปว่าสถานะทุกตัวปกติเพราะจำนวนเป็นศูนย์
- Query Inventory ล้มเหลว: `devices = {"data_status":"unavailable","total":null,"management_state":null,"reachability":null,"freshness":null}`; UI แสดง `--` และ “อ่านข้อมูลอุปกรณ์ไม่ได้” ส่วนอื่นของหน้าแสดงต่อได้เมื่ออ่านสำเร็จ
- ไม่สร้าง Field `last_checked_at`/`is_stale` ค่าเดียวครอบ Device, Security และ System Health เพราะเวลาและเกณฑ์เป็นคนละเรื่อง

## 3. การกดไป Device Inventory

Backend ปัจจุบันมี `GET /api/v1/devices` และรับ `reachability`, `management_state` เป็นตัวกรองแล้ว โดยไม่กำหนด `management_state` จะไม่รวม Retired ตามค่าเริ่มต้น

### 3.1 ลิงก์จาก Dashboard ที่ยืนยันเป็นแบบแล้ว

| สิ่งที่กดบน D&M | URL หน้าเว็บที่จะพัฒนา | เงื่อนไข Query Inventory |
| --- | --- | --- |
| จำนวนรวม | `/devices` | ไม่ส่ง Management filter จึงไม่รวม `retired` ตามค่าเริ่มต้น |
| จำนวน Active | `/devices?management_state=active` | `management_state=active` |
| จำนวนติดต่อได้ | `/devices?management_state=active&reachability=reachable` | Active และ Reachable |
| จำนวนติดต่อไม่ได้ รวมปุ่มใน UI-02 | `/devices?management_state=active&reachability=unreachable` | Active และ Unreachable |
| จำนวนยังไม่ทราบ | `/devices?management_state=active&reachability=unknown` | Active และ Unknown ทั้งที่ยังไม่เคยตรวจและที่ตรวจแล้วแต่ประเมินไม่ได้ |
| จำนวนกำลังซ่อม | `/devices?management_state=maintenance` | `management_state=maintenance` โดยไม่กรอง Reachability |
| จำนวนยังไม่ได้จัดการ | `/devices?management_state=unmanaged` | `management_state=unmanaged` โดยไม่กรอง Reachability |
| ข้อมูลเก่า / ยังไม่เคยตรวจ | ไม่มีลิงก์กรอง | เป็นข้อความประกอบ; ไม่เพิ่ม Freshness filter ใน Inventory รอบนี้ |

### 3.2 พฤติกรรมของหน้าปลายทางที่ต้องเชื่อมต่อ

1. `/devices` รับ `management_state` และ `reachability` จาก URL แล้วตั้งค่าตัวกรองที่มองเห็นได้ก่อนขอรายการ ใช้ชื่อ Enum เดียวกับ Backend และให้ URL เป็นแหล่งค่าของสองตัวกรองนี้
2. เมื่อกดมาจาก Dashboard เริ่ม Query ใหม่ที่ `skip=0`; ไม่พกคำค้น Vendor, Role, Site, Group หรือตัวกรองเก่าที่ไม่เกี่ยวข้องมาซ้อนกับกลุ่มที่กด
3. แสดงป้าย เช่น “อุปกรณ์ Active · ติดต่อไม่ได้” และตัวเลือกที่ถูกเลือก ผู้ใช้เปลี่ยนตัวกรองได้โดยอัปเดต URL; ปุ่ม “ล้างตัวกรอง” กลับ `/devices` และล้างตัวกรองอื่นของหน้ารายการด้วย
4. เปิดลิงก์โดยตรง, Reload และ Back/Forward ต้องคืนตัวกรองตาม URL ไม่กลับค่าเริ่มต้นจนรายการเปลี่ยนกลุ่มเอง
5. ค่า Enum ใน URL ที่ไม่ถูกต้องต้องไม่ถูกนำไป Query โดยตรง ให้ล้างค่าที่ผิดและแจ้งผู้ใช้ว่าตัวกรองนั้นไม่ถูกต้อง; ไม่แสดงชื่อป้ายกรองที่ไม่ได้ใช้จริง
6. ใช้เงื่อนไขนับเดียวกับ Dashboard แต่ไม่อ้างว่าจำนวนคงเดิมตลอดเวลา เพราะข้อมูลอาจเปลี่ยนระหว่างเปิดสองหน้า; จำนวนแถวที่โหลดหน้าแรกไม่ใช่จำนวนทั้งหมด ต้องมีการแบ่งหน้า/โหลดต่อเมื่อต้องการดูครบ
7. ลิงก์ทั้งหมดเป็นการเปิดข้อมูลที่มีอยู่ ไม่เรียก Check Status, Collection หรือเปลี่ยน Management State; ผู้ใช้ต้องกดคำสั่งของ Inventory ตามสิทธิ์เมื่อต้องการตรวจใหม่

**ขอบเขตความรับผิดชอบ:** D&M สร้างลิงก์และส่งบริบท ส่วนหน้า Device Inventory รับ URL และแสดงรายการตามข้อตกลงนี้ ไม่ต้องออกแบบฟอร์มหรือรายละเอียดอุปกรณ์ใหม่; `site_id`/`group_id` ยังไม่เป็นตัวกรอง Dashboard P1

**สถานะ:** Backend รับตัวกรองแล้ว ส่วน Frontend `/devices` ยังต้อง Implement/ทดสอบการรับ URL ก่อนเปิดใช้ Drill-down จริง การยืนยัน URL ในเอกสารนี้ไม่ใช่หลักฐานว่าโค้ดเชื่อมแล้ว

## 4. ขอบเขตที่ยืนยันแล้วและที่ยังรอ

- **ตรวจจากโค้ดแล้ว:** ชื่อ Field, Enum ทั้งสองแกน, พฤติกรรม SNMP Health, เวลาแต่ละชนิด และตัวกรอง Backend ของ Inventory
- **ยืนยันแบบ D&M แล้ว:** เกณฑ์ Freshness 900 วินาที, สูตรนับ/DTO และ URL จาก Dashboard ไป Inventory; ยังต้อง Implement/ทดสอบก่อนกล่าวว่าพร้อมใช้งาน
- **งานเชื่อมต่อที่ยังไม่ Implement:** การรับ/คืนค่าตัวกรองจาก URL ใน Frontend และการโหลดรายการให้ครบขอบเขต
- **ยังรอเจ้าของข้อมูล:** นิยาม Config/Critical และแหล่งค่า Offline Mode
- **คง Contract เดิมของ Audit:** Positive Allowlist, Read-only, Cursor และ Redaction; การปรับ Device Contract นี้ไม่เปลี่ยนสิทธิ์หรือข้อมูลที่ Recent Activity ส่งออกได้
