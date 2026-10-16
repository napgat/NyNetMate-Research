from pathlib import Path
OUT=Path(__file__).resolve().parent.parent
p=OUT/'naphat-advisor-update-2026-10-09.md'
s=p.read_text(encoding='utf-8')
values={
 '{{FRONTEND_TEST_RESULT}}':'17 pass / 0 fail ใน 2 ไฟล์',
 '{{FRONTEND_TEST_PROVES}}':'Auth Client/Session State/Cache ด้วย Mock Fetch และ Audit Display Labels',
 '{{FRONTEND_BUILD_RESULT}}':'ไม่ผ่าน (exit 2); การสร้าง API client ตามขั้นตอนเดิมก็ไม่ผ่าน (exit 1)',
 '{{FRONTEND_BUILD_PROVES}}':'ยังไม่ยืนยันว่า Frontend ทั้งชุด Compile ได้จากสำเนาใหม่ตาม Lockfile รอบนี้',
}
for k,v in values.items(): s=s.replace(k,v)
s=s.replace('แต่ยังต้องยืนยันการรวมระบบกับ PostgreSQL และ Browser รวมถึงเชื่อมสิทธิ์', 'ผล Unit ผ่านตามขอบเขตที่เลือก แต่ Build Frontend จากสำเนาใหม่ยังไม่ผ่าน และยังต้องยืนยันการรวมระบบกับ PostgreSQL และ Browser รวมถึงเชื่อมสิทธิ์',1)
s=s.replace('แต่ยังต้องทดสอบ PostgreSQL กับการใช้งานผ่าน Browser และเชื่อม Guard', 'แต่ Build Frontend จากสำเนาใหม่ยังไม่ผ่าน และยังต้องทดสอบ PostgreSQL กับการใช้งานผ่าน Browser รวมถึงเชื่อม Guard',1)
s=s.replace('ไม่ใช่การเปิด Browser แล้วต่อ PostgreSQL จริง\n', 'ไม่ใช่การเปิด Browser แล้วต่อ PostgreSQL จริง\n')
needle='> ข้อจำกัดที่ตรวจพบตอนนี้คือ Router งาน Devices'
s=s.replace(needle, '> Frontend unit ผ่าน 17 กรณี แต่ Build จากสำเนาใหม่ยังไม่ผ่านครับ พบว่าต้องสร้าง API client ก่อนตามขั้นตอนเดิม และเมื่อทดลองสร้างด้วย Schema ภายในเครื่อง ตัวสร้างก็หยุดด้วย Error อีกจุด จึงยังไม่บอกว่า Build พร้อม Demo และต้องตรวจสาเหตุเพิ่ม โดยไม่ได้แก้โค้ดในงานเตรียมเอกสารนี้\n+\n+> ข้อจำกัดที่ตรวจพบตอนนี้คือ Router งาน Devices'.replace('\n+','\n'))
needle='ผล Build Frontend แยกในหัวข้อ 6'
s=s.replace(needle, 'ผล Build Frontend แยกในหัวข้อ 6 โดยการลองสร้าง Client ในสภาพแวดล้อมรอบนี้ยังล้มเหลว ต้องตรวจสาเหตุเพิ่ม')
s=s.replace('เตรียมแล้ว; Deploy/Browser E2E ยังไม่ทดสอบรอบนี้ | E13, E10', 'เตรียมแล้ว; Build สำเนาใหม่ไม่ผ่าน; Deploy/Browser E2E ยังไม่ทดสอบ | E13, E10')
needle='16 Skipped แบ่งเป็น'
note='**ข้อจำกัด Build ที่ตรวจพบวันนี้:** `bun run build` จากสำเนาใหม่ไม่พบ `@/client`/generated client และมี Type Error ต่อเนื่อง จึงตรวจขั้นตอนใน Dockerfile ที่กำหนดให้ Generate Client ก่อน Build เพิ่ม โดย Export OpenAPI จากโค้ด Backend ภายในเครื่องแบบ Offline ได้ แต่ `openapi:generate` หยุดด้วย `Cannot read properties of undefined (reading \'importFileExtension\')` จึงยังไม่ได้ Build หลัง Generation สำเร็จ Root Cause ของ Generator ยังไม่ยืนยัน ไม่สรุปว่าเป็นบั๊กที่นภัทรเคยพบหรือแก้แล้ว และไม่ได้แก้โค้ด/Config ในรอบเตรียมเนื้อหานี้ [Schema Export log](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/advisor-update/naphat/evidence/frontend-schema.log), [Generation log](D:/KMITL-Repo/KMITL_Knowledge/Project/outputs/advisor-update/naphat/evidence/frontend-client-generation.log)\n\n'
s=s.replace(needle,note+needle)
s=s.replace('2. **ยืนยัน Integration บน PostgreSQL แยกและ Browser** — ตรวจ Migration', '2. **ยืนยัน Build และ Integration ก่อน Demo** — ให้นภัทรกับทีมตรวจสาเหตุ API Client Generator ตาม Lockfile/Config/Environment ให้สร้าง Client และ Build จากสำเนาใหม่ได้ก่อน; อย่าใช้ผล Build เก่า จากนั้นทดสอบบน PostgreSQL แยกและ Browser: ตรวจ Migration')
s=s.replace('แต่ยังไม่รับรอง Browser/PostgreSQL หรือ Demo ทั้งระบบ P1 และ Dashboard', 'แต่ Build สำเนาใหม่ยังไม่ผ่าน และยังไม่รับรอง Browser/PostgreSQL หรือ Demo ทั้งระบบ P1 ส่วน Dashboard')
s=s.replace('กับ Dashboard ยังไม่ Implement ต้องตกลงและเชื่อมร่วมกับเพื่อน', 'กับ Dashboard ยังไม่ Implement และพบข้อจำกัด Build/Client Generator จากสำเนาใหม่วันนี้ ต้องตรวจสาเหตุและเชื่อมร่วมกับเพื่อน')
s=s.replace('และเก็บผล PostgreSQL/Browser ให้ครบครับ จากนั้นทำ Dashboard', 'แก้ข้อจำกัด Build/Client Generator และเก็บผล PostgreSQL/Browser ให้ครบครับ จากนั้นทำ Dashboard')
s=s.replace('CPU/Memory หรือ AI Root-cause', 'CPU/Memory หรือ AI Root-cause')
s=s.replace('Real-time,กราฟ', 'Real-time, กราฟ')
p.write_text(s,encoding='utf-8')
print('Findings finalized; unresolved markers:', '{{' in s)
