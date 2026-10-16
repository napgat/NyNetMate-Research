# หมายเหตุสำหรับนำหัวข้อ 3.8 ลงรายงาน

ไฟล์เนื้อหาหลัก: [chapter-3-8-ui-design.md](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/chapter-3-8-ui-design.md)

## วิธีใช้งาน

- เนื้อหาหลักมี 3.8, 3.8.1 และ 3.8.2 พร้อมคำอธิบายและภาพรวม 14 ภาพ ได้แก่ Navigation Flow 1 ภาพ, Wireframe เดิม 12 ภาพ และ Mockup Dashboard P2 1 ภาพ
- คำบรรยายใช้ `รูป:` และอ้างถึง `จากรูป` โดยยังไม่กำหนดเลขรูป เพื่อไม่ชนเลขรูปของส่วน ER และหัวข้อ 3.7 ให้ใส่เลขรูปต่อเนื่องหลังจัดลำดับทั้งบท
- เลือกใช้เฉพาะ Dashboard พื้นฐานหรือ Dashboard P2 ได้ หากเก็บทั้งสองภาพให้คงคำอธิบายว่าเป็นพื้นฐานและแนวทางเพิ่มเติมของ P2 ไม่ใช่สองหน้าที่พัฒนาเสร็จแล้ว
- ภาพ Add Device, Create User, Edit User และ Audit Event Details เป็นภาพหน้าต่างหรือแผงที่เปิดทับหน้าเดิม ไม่ใช่ Route หลักใหม่
- รูป Topology มี Endpoint ตัวอย่างเพื่ออธิบายการจัดวางเท่านั้น ไม่ใช่การรับรองว่า Discovery ค้นหา Endpoint ทุกชนิดได้
- ภาพมี IP สำหรับเอกสารและบัญชีตัวอย่าง ไม่มีข้อมูลเครือข่ายหรือ Credential จริง
- ลิงก์ภาพใน Markdown ฉบับหลักเป็น absolute path บนเครื่องปัจจุบัน เพื่อเปิดอ่านพร้อมภาพได้ หากย้ายไปเครื่องอื่นให้ปรับเส้นทาง หรือใช้ฉบับพกพาจากไฟล์ ZIP ที่ใช้ relative image paths
- ไม่มีการแก้ Google Docs, Source Code, งานเพื่อน หรือการรัน Discovery/SNMP ในงานนี้

## ไฟล์สำหรับแก้ภาพ

- [Wireframes 12 หน้า](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/wireframes/mynetmate-ui-wireframes.drawio)
- [Dashboard P2](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/p2-operational-monitoring/dashboard-p2.drawio)
- [Navigation Flow](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/navigation-flow/navigation-flow.drawio)
- [Navigation Flow แบบ Mermaid](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/navigation-flow/navigation-flow.mmd) ใช้แก้โครงสร้างผ่านข้อความ โดยมีความหมายเดียวกับภาพ Draw.io แต่ Layout อาจต่างกันเมื่อ Render

## แหล่งอ้างอิงสำหรับจัดทำเอกสาร

- [ร่างหัวข้อ 3.7–3.8 เดิม](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/chapter-3-7-3-8-ui-design.md): โครงหัวข้อและหน้าจอที่ตรวจจาก Source Code ก่อนหน้า
- [ขอบเขต MVP D&M — P2](<D:/KMITL-Repo/KMITL_Knowledge/Project/02_feature/01_Dashboard&Monitoring(Naphat)/P2_Operational_Monitoring/MVP D&M.md>): Current Operational Snapshot, Manual Read-only Refresh, Expected State และสิ่งที่ยังไม่รวมใน MVP
- [คำอธิบายและอ้างอิงของ Dashboard P2](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/thesis/ui-design/p2-operational-monitoring/README.md): วิธีประยุกต์หลักการจาก Grafana, Zabbix และ W3C โดยไม่อ้างว่าติดตั้งผลิตภัณฑ์เหล่านี้
- [App Layout](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/shared/components/AppLayout.tsx): เมนูหลักและเมนูเฉพาะ Admin
- [Device Inventory](D:/KMITL-Repo/KMITL_Knowledge/Project/mynetmate/website/src/features/devices/DeviceInventoryPage.tsx): ทางไป Topology และการเริ่มค้นหาจาก Dialog

ภาพออกแบบไม่ใช่หลักฐาน End-to-End Test สิทธิ์ Devices/Discovery/Operational Refresh และการเชื่อมข้อมูลข้าม Feature ต้องยืนยันก่อนส่งมอบระบบจริง
