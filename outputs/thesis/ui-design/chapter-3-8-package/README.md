# หัวข้อ 3.8 ผลการออกแบบส่วนติดต่อผู้ใช้งาน — MyNetMate

เปิด `chapter-3-8-ui-design.md` ด้วยโปรแกรมอ่าน Markdown ที่แสดงภาพได้ แล้วนำข้อความและรูปไปจัดในรายงานเอง โดยเก็บโฟลเดอร์ `images` ไว้ข้างไฟล์ Markdown หากย้ายไฟล์ไปเครื่องอื่น

## สิ่งที่อยู่ในชุดนี้

- เนื้อหา 3.8, 3.8.1 Navigation Flow และ 3.8.2 การออกแบบหน้าจอ พร้อมคำอธิบายใต้ภาพ
- รูป PNG 15 ภาพ: Navigation Flow 1 ภาพ, Wireframe 13 ภาพ และ Mockup Dashboard P2 1 ภาพ
- ต้นฉบับ Draw.io สำหรับแก้ไข Wireframe ทั้ง 13 หน้า, Dashboard P2 และ Navigation Flow ในโฟลเดอร์ `editable`
- Navigation Flow แบบ Mermaid สำหรับปรับโครงสร้างผ่านข้อความ
- `image-check.json` แสดงผลตรวจความครบถ้วนและความละเอียดของรูป ไม่ใช่ผลทดสอบระบบ MyNetMate

## ก่อนนำลงรายงาน

- ใส่เลขรูปต่อจากหัวข้อก่อนหน้า โดยเปลี่ยน `รูป:` และ `จากรูป` ให้ตรงกันทั้งบท
- ภาพเป็นแบบออกแบบที่ใช้ข้อมูลตัวอย่าง ไม่ใช่ภาพผลการทดสอบหรือหลักฐานว่าระบบพัฒนาเสร็จแล้ว
- Dashboard พื้นฐานเป็น Wireframe ส่วน Dashboard P2 เป็น Mockup สำหรับความสามารถที่วางแผนเพิ่มเติม เลือกใช้ภาพให้ตรงขอบเขตรายงาน หากใช้ทั้งสองภาพให้คงคำอธิบายความแตกต่างไว้
- หน้าต่าง Add Device, Edit Device, Create User, Edit User และ Audit Event Details เป็น Dialog; Device Details เป็น Drawer ไม่ใช่หน้าหลักแยกทุกภาพ
- Inventory เพิ่ม Edit ใน Actions สำหรับ Admin/Operator โดย Edit Device ให้แก้ข้อมูลประกอบและ Management State ส่วน Reachability เป็นข้อมูลอ่านอย่างเดียว
- ตัวอย่าง Topology ไม่ใช่การรับรองว่า Discovery ค้นหา Endpoint ทุกชนิดได้
- หากแก้ไฟล์ Draw.io ให้ส่งออก PNG ใหม่ก่อนนำไปแทรกในรายงาน

## แหล่งอ้างอิงประกอบการออกแบบ Dashboard P2

- [Grafana — Dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/)
- [Zabbix — Monitoring hosts](https://www.zabbix.com/documentation/current/en/manual/web_interface/frontend_sections/monitoring/hosts)
- [W3C — Understanding Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

ใช้เป็นแนวทางการออกแบบเท่านั้น ไม่ได้หมายความว่าระบบ MyNetMate ติดตั้ง Grafana หรือ Zabbix และไม่ได้รับรองการผ่าน WCAG
