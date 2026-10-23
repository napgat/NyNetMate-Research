### Acceptance Tests

> **Device Contract revision 2026-10-22:** เกณฑ์ตรวจรับสำหรับ implementation ที่จะทำตาม [API Contracts](04_API%20Contracts.md) ไม่ใช่รายงานผลทดสอบที่ผ่านแล้ว
>
> **มติผู้ใช้:** Freshness = 15 นาที (900 วินาที); เกณฑ์อายุประเมิน ณ `generated_at` และตัวกรองหน้ารายการใช้ URL ตาม Contract หัวข้อ 3

| Test ID | Scenario | Expected Result |
|---|---|---|
| **AT-01** | Inventory 12 แถว: Active 7 (Reachable 5, Unreachable 1, Unknown 1), Unmanaged 1, Maintenance 2, Retired 2 | Summary คืน Total 10, Management State 7/1/2 และ Reachability Scope Active รวม 7 แจกแจง 5/1/1; ไม่รวม Retired และไม่รวม Maintenance/Unmanaged ใน Unreachable |
| **AT-02** | ผู้ใช้คลิก Critical Validation Failure | ระบบไปหน้า Security Validation พร้อม Pre-filter อุปกรณ์หรือผลสแกนที่เกี่ยวข้อง |
| **AT-03** | เปิด Offline Mode | AI indicator แสดงสถานะ Informational/สีเทา ไม่แสดง Critical error |
| **AT-04** | ใช้ชุดข้อมูลตัวอย่างใน Contract: ประเมินเวลา 10:00, Active 7 ตัว มีผลเวลา 09:40, 09:45, 09:50, 09:55, 09:59, 09:58 และ `null` | `threshold_seconds=900`, `stale_count=1`, `never_checked=1`; UI แสดง “ข้อมูลเก่า 1” และ “ยังไม่เคยตรวจ 1” แยกกัน โดยไม่เพิ่ม Total |
| **AT-05** | Viewer เปิด Dashboard | Viewer อ่านข้อมูลได้ แต่ Action ที่แก้ไขหรือ Override ถูกซ่อน/ปฏิเสธ |
| **AT-06** | Maintenance ยังมี Reachability เก่าเป็น Unreachable | รวมใน Total และกลุ่ม Maintenance; ตัวเลข Reachability ของ Active ไม่เพิ่ม |
| **AT-07** | Active สองตัวมี Reachability Unknown: ตัวหนึ่งไม่มีเวลาตรวจ อีกตัวมีเวลาตรวจจากการประเมินที่ไม่สำเร็จ | นับ Unknown ทั้งคู่ แต่ `never_checked` เป็น 1; UI ไม่เรียกตัวที่มีเวลาตรวจว่า “ยังไม่เคยตรวจ” |
| **AT-08** | ตรวจไม่สำเร็จล่าสุดเวลา 10:00 แต่ `last_seen_at` ยังเป็น 09:00 | เวลา “ตรวจล่าสุด” ใช้ `reachability_checked_at = 10:00`; “ติดต่อสำเร็จล่าสุด” คง 09:00; D&M ไม่เปลี่ยนค่าที่ Owner บันทึก |
| **AT-09** | Inventory Query สำเร็จแต่ไม่มีอุปกรณ์ เทียบกับ Query ล้มเหลว | กรณีแรก `data_status=available` และจำนวน 0; กรณีหลัง `data_status=unavailable`, จำนวนเป็น `null` และ UI แสดง `--`; ไม่แสดง Failure เป็นอุปกรณ์ศูนย์ตัว |
| **AT-10** | มีอุปกรณ์มากกว่า Limit ของรายการ Inventory | Summary นับทั้งขอบเขตด้วย Aggregate Query ไม่ใช้ขนาดหน้ารายการเป็นจำนวนรวม |
| **AT-11** | กดจำนวน Unreachable บน Dashboard | เมื่อเปิดใช้ลิงก์กรองจริง ปลายทางต้องใช้ทั้ง `management_state=active` และ `reachability=unreachable`; ไม่พา Maintenance ที่มีผลเก่ามาปน |
| **AT-12** | เปิด Dashboard/โหลด Summary ซ้ำ | มีเพียงการอ่านข้อมูล; ไม่เรียก SNMP, ICMP หรือ Endpoint ตรวจ/เก็บข้อมูลอุปกรณ์ และไม่เปลี่ยนเวลาใน Inventory |
| **AT-13** | ไม่ระบุค่าตั้ง Freshness เพิ่มเติม | Backend ใช้ค่าเริ่มต้น 900 วินาที และ Response ที่อ่าน Device สำเร็จส่ง `threshold_seconds=900`; ไม่มีหน้าตั้งค่าเพิ่มใน P1 |
| **AT-14** | Unmanaged มี `last_collected_at` จากหลักฐานเพื่อนบ้าน แต่ไม่มี `last_seen_at`/`reachability_checked_at` | ไม่สรุปว่าเคยติดต่ออุปกรณ์นั้นสำเร็จ และไม่ใช้เวลา Collection แทนเวลาตรวจ Reachability |
| **AT-15** | ตรวจอายุ 899, 900 และ 901 วินาที | 899/900 ยังใหม่; 901 เป็น Stale; ใช้วินาทีจริง ไม่ปัดนาทีตัดสิน |
| **AT-16** | อุปกรณ์ Reachable มีอายุผลตรวจ 20 นาที | ยังคง Reachable ในผลที่เก็บล่าสุด พร้อมป้าย “ข้อมูลเก่า”; ไม่เปลี่ยนเป็น Unreachable หรือเอาออกจากผลรวม Active |
| **AT-17** | กด Total, Active, Reachable, Unreachable, Unknown, Maintenance และ Unmanaged ทีละรายการ | URL, ตัวเลือกที่เห็น และ API Query ตรงทุกแถวใน Contract หัวข้อ 3.1; Total ไม่รวม Retired และ Unknown ไม่ใช่ตัวกรองเฉพาะ Never Checked |
| **AT-18** | หน้าอุปกรณ์เดิมมีคำค้น Vendor/Site/Role และอยู่หน้าถัดไป แล้วกดลิงก์จาก Dashboard | ไม่พกตัวกรองเก่าที่ไม่เกี่ยวข้อง; เริ่ม `skip=0` และใช้เฉพาะเงื่อนไขจากลิงก์ใหม่ |
| **AT-19** | เปิด URL ที่กรองไว้โดยตรง, Reload และ Back/Forward | รายการและตัวเลือกที่เห็นคืนค่าตาม URL; ไม่หลุดกลับ All Devices เอง |
| **AT-20** | เปลี่ยนตัวกรองแล้วกด “ล้างตัวกรอง” | URL และตัวเลือกเปลี่ยนสอดคล้องกัน; ล้างแล้วกลับ `/devices`, เริ่มหน้าแรก และไม่รวม Retired ตามค่าเริ่มต้น |
| **AT-21** | URL มีค่า Enum ไม่ถูกต้อง | ล้างค่าที่ผิดและแจ้งผู้ใช้; ไม่ส่งค่าผิดไป Query และไม่ติดป้ายว่าใช้ตัวกรองที่ไม่ได้ใช้จริง |
| **AT-22** | ดูจำนวนข้อมูลเก่า/ยังไม่เคยตรวจ หรือกดโหลด Summary ใหม่ | จำนวน Freshness ไม่มีลิงก์กรองที่ Backend ยังไม่รองรับ; โหลด Summary ใหม่ประเมินเวลาใหม่แต่ไม่สั่ง Check Status และไม่เปลี่ยนเวลาตรวจใน Inventory |
| **AT-23** | Query สำเร็จแต่ไม่มีอุปกรณ์ | จำนวนอุปกรณ์, `stale_count`, `never_checked` เป็น 0, Threshold เป็น 900 และช่วงเวลาตรวจเป็น `null`; แสดง Empty state ต่างจาก Query failure |
| **AT-24** | ข้อมูล Inventory เปลี่ยนหลัง Dashboard สร้าง Summary แต่ก่อนเปิดรายการ | หน้ารายการใช้ข้อมูลล่าสุดภายใต้เงื่อนไขเดียวกัน ไม่บังคับตัวเลขเก่าให้ตรงด้วยการซ่อนรายการ และไม่อ้างว่าจำนวนแถวหน้าแรกคือจำนวนทั้งหมด |

### Success Metrics

- `GET /api/dashboard/summary` กับข้อมูลจำลอง 1,000 อุปกรณ์ ควรตอบภายใน 1.0 วินาทีตามเป้าหมายเบื้องต้นของรายงาน
- Dashboard API ต้องไม่เรียก Gemini เพื่อคำนวณ Metric
- ค่าบน Dashboard ต้องตรงกับ Source of Truth
- Error และ Stale data ต้องไม่ถูกแสดงเป็นข้อมูลปัจจุบันโดยไม่มีคำเตือน

> ตัวเลข Performance เป็นเป้าหมายสำหรับทดสอบ ไม่ใช่ข้อเท็จจริงที่ยืนยันแล้ว ต้องวัดบนสภาพแวดล้อมของโครงการ

