# MyNetMate: Chapter 3.6 ER Diagram

เพิ่มเนื้อหาใน Google Docs เดิม เฉพาะ `(1) บทที่ 3` / หัวข้อ 3.6 โดยผู้ใช้อนุญาตให้แทนส่วนร่างเดิมแล้ว ไม่แก้ 3.5, 3.7 หรือ Description Use Case ของเพื่อน

## ผลงาน

- `mynetmate-er.drawio`: ภาพรวมและภาพราย Entity รวม 15 แท็บ แก้ไขได้ใน diagrams.net
- `fig-3-15-mynetmate-er.png` / `.svg`: ภาพรวมความสัมพันธ์
- รูป 3.16–3.29: ภาพ Attribute ของแต่ละ Entity; Primary Key ขีดเส้นใต้ และ Foreign Key ระบุ `(FK)`
- `chapter-3-6-er.md`: ข้อความและภาพสำรอง
- `schema.json`: รายการ 14 Entity / 140 Attribute ที่อ่านจาก AST ของโค้ด ไม่ได้เชื่อมต่อฐานข้อมูล

## แนวทางอ้างอิง

ใช้รูปแบบบท 3.6 และ 3.6.1 ของ `CE67-37_Thesis.pdf` ฉบับเต็มใน `04_project_management/วิชา CE Project 1 และ 2/ตัวอย่าง Thesis/` (หน้า PDF 69–72): บทนำ → ภาพ ER → คำอธิบายภาพ → ภาพและรายละเอียดราย Entity ใช้สัญลักษณ์แนว Chen เช่นเดียวกับเล่มตัวอย่าง แต่ภาพรวมแสดงเฉพาะความสัมพันธ์หลักเพื่อให้อ่านได้ ส่วน Attribute ทั้งหมดแยกในภาพราย Entity

ชื่อ Entity / Attribute และ Foreign Key ยึดโค้ด MyNetMate ปัจจุบัน ไม่ยกข้อมูลโครงการอาหารจากตัวอย่างมาใช้:

- `mynetmate/backend/app/core/inventory_tables.py`
- `mynetmate/backend/app/features/authentication/models.py`
- `mynetmate/backend/app/features/audit_trail/models.py`
- `mynetmate/backend/app/features/devices/models.py`
- `mynetmate/backend/app/features/network_device_discovery/models.py`

ขอบเขตเฉพาะ Network Management ไม่รวม `config_versions` หรือ Configuration Management ไม่มีการเปลี่ยน Source Code, Migration หรือฐานข้อมูล

## ข้อควรเข้าใจ

- Sequence Diagram ที่ทำไว้เป็นระดับภาพรวม Component/Service ไม่ใช่ UML Component Diagram และไม่ได้ลงถึง Class หรือ Method
- `audit_logs.user_id` เป็น Foreign Key แต่ `resource_id` ไม่ใช่ Foreign Key; ไม่วาดเส้นบังคับเชื่อม devices ผ่านช่องนี้
- `created_by` และ `initiated_by` ของ Inventory/Discovery ยังไม่ได้มี Foreign Key ไป users
- Neighbor Observation ใช้ Foreign Key แบบผสมเพื่อรักษาความตรงกันของอุปกรณ์ รอบการเก็บ และ Interface; ข้อมูล remote ไม่ได้เป็น Foreign Key
- Primary Key ของ `topology_default_routes` คือ `source_device_id` จึงมีข้อมูลได้ไม่เกินหนึ่งรายการต่ออุปกรณ์
- บทบาทใน `devices.role` เป็นบทบาทเครือข่าย ไม่ใช่ RBAC ของ `users.role`

## การตรวจสอบ

ตรวจรูปต้นฉบับและอ่านโครงสร้าง Google Docs กลับแล้ว มีรูปครบ 15 รูปและ Attribute เป็นรายการแบบ native bullets 140 รายการ โดยแท็บอื่นและข้อความนอกหัวข้อ ER คงเดิม

ยังไม่ยืนยันการตัดหน้า/การจัดวางบนหน้ากระดาษจริง: การส่งออกทั้ง PDF และ HTML ผ่าน Google Drive ถูกปฏิเสธด้วย HTTP 403 จึงต้องเปิดตรวจใน Google Docs หรือส่ง PDF ที่ผู้ใช้ดาวน์โหลดมาให้ตรวจต่อ ไม่ใช่ผลทดสอบ Runtime ของระบบ MyNetMate

ตัวช่วย trusted-read ที่มากับ Google Docs skill ไม่รองรับ absolute path แบบ Windows ในเครื่องนี้ จึงอ่านโครงสร้างผ่าน connector โดยตรง และใช้ revision guard พร้อมตรวจกลับหลังแก้
