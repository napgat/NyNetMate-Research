# Sequence Diagram ของเพื่อน — รูปแบบเดียวกับชุดของนภัทร

จัดทำเมื่อ 16 ตุลาคม 2569 จากภาพใน Google Docs หัวข้อ **(1) บทที่ 3 → 3.5 การออกแบบ Sequence Diagram** โดยอ่านภาพต้นฉบับทั้ง 5 ภาพและถอดเป็นองค์ประกอบ Draw.io ที่แก้ไขได้

เอกสารต้นทาง: https://docs.google.com/document/d/1bgBgFPAoSGiob5yRsHnE9WyIwqhd6PmakMJAyo3S82c/edit?tab=t.jj85k4j3dkji

## เปิดไฟล์

- [Draw.io รวม 5 แท็บ](teammate-sequence-diagrams.drawio) — เปิดด้วย Draw.io Desktop หรือ diagrams.net แล้วเลือกแท็บด้านล่าง
- [ZIP รวมชุดส่งมอบ](teammate-sequence-diagrams.zip) — รวมไฟล์รวม ไฟล์แยก ภาพ PNG/SVG และข้อมูลต้นทาง

| รูปตาม Doc | ภาพ | Draw.io แยก | PNG | SVG |
|---|---|---|---|---|
| 3.8 | Device Inventory | [เปิด](fig-3-8-device-inventory.drawio) | [ภาพ](fig-3-8-device-inventory.png) | [เวกเตอร์](fig-3-8-device-inventory.svg) |
| 3.9 | View Detail | [เปิด](fig-3-9-view-detail.drawio) | [ภาพ](fig-3-9-view-detail.png) | [เวกเตอร์](fig-3-9-view-detail.svg) |
| 3.10 | Add/Edit Device | [เปิด](fig-3-10-add-edit-device.drawio) | [ภาพ](fig-3-10-add-edit-device.png) | [เวกเตอร์](fig-3-10-add-edit-device.svg) |
| 3.11 | Network Discovery | [เปิด](fig-3-11-network-discovery.drawio) | [ภาพ](fig-3-11-network-discovery.png) | [เวกเตอร์](fig-3-11-network-discovery.svg) |
| 3.12 | Update Device Status | [เปิด](fig-3-12-update-device-status.drawio) | [ภาพ](fig-3-12-update-device-status.png) | [เวกเตอร์](fig-3-12-update-device-status.svg) |

## สิ่งที่ปรับ

ใช้ตัวอักษร Tahoma พื้นหลังสีขาว เส้นสีดำ หัวข้อ ตัว Actor, Lifeline แบบเส้นประ, Activation และกรอบเงื่อนไขแบบเดียวกับชุด `../naphat/` จัดระยะและตัดบรรทัดใหม่เพื่อให้อ่านง่าย ชุดที่มีผู้ร่วมสื่อสารมากจึงมีหน้ากว้างกว่าชุดของนภัทร

ทุกกล่อง ข้อความ ลูกศร และกรอบเงื่อนไขเป็นองค์ประกอบ Draw.io แยกกัน ไม่ได้วางภาพต้นฉบับเป็นภาพพื้นหลัง

## สิ่งที่คงไว้จากเพื่อน

- ชื่อภาพและเลขรูป 3.8–3.12 ตาม Doc ออนไลน์
- บทบาทผู้ใช้และผู้ร่วมสื่อสาร รวมถึง Backend กับ Service ที่แยก Lifeline ตามต้นฉบับ
- ทิศทางและลำดับข้อความทั้งหมด 101 ลูกศร: 8, 11, 32, 28 และ 22 ลูกศรตามลำดับ
- เงื่อนไขพบ/ไม่พบอุปกรณ์, เพิ่ม/แก้ไข, IP ซ้ำ/ไม่ซ้ำ และข้อมูลอ้างอิงถูก/ผิด
- Network Discovery มี SSE, การวนเก็บ Snapshot, LLDP Observation และ Default-route Evidence ตามเดิม
- Update Device Status มีการตรวจหนึ่ง/หลายอุปกรณ์, การวนตรวจ SNMP และผล reachable/unreachable/unknown ตามเดิม

นี่เป็นการจัดรูปแบบแผนภาพเดิม จึงไม่ได้เพิ่มขั้นตอน Session/RBAC หรือเปลี่ยนตรรกะในภาพของเพื่อน และไม่ใช่การรับรองว่า Implementation ทุกขั้นตอนทำงานแล้ว ไม่ได้แก้ Google Docs หรือไฟล์ของเพื่อนใน repo ย่อย

เลข 3.12 ในเอกสารออนไลน์ยังซ้ำกับ View Topology ของนภัทร ชุดนี้คงเลขของเพื่อนตามคำขอไว้ รวมถึงชื่อ Update Device Status ซึ่งในภาพหมายถึงการตรวจ SNMP

## หลักฐานและการตรวจ

- `source-images/` เก็บภาพต้นฉบับที่อ่านจาก Doc ในรอบนี้
- `diagrams.json` เก็บข้อความ ผู้ร่วมสื่อสาร ลำดับ และเงื่อนไขที่ถอดจากภาพ
- `source-actions.json` จับคู่ข้อความกับองค์ประกอบ Draw.io
- `render-qa.json` แสดงผลตรวจการ Render จริงทั้ง 5 ภาพ: ไม่พบข้อความซ้อน ข้อความล้น หรือองค์ประกอบภาพที่แก้ไขไม่ได้ และตรวจข้อความลูกศรครบ 101 รายการ
- เปิดตรวจภาพ PNG ทั้ง 5 ภาพหลัง Render แล้ว

สร้างไฟล์ซ้ำได้ด้วย `node build-sequences.cjs` ซึ่งใช้ Playwright จาก Runtime ที่ติดตั้งในเครื่องและดาวน์โหลดเฉพาะตัว Render แบบ Static ของ diagrams.net; แผนภาพถูกประมวลผลในหน้าท้องถิ่น
