# Workspace Rules — MyNetMate

> **Canonical instructions:** อ่าน [../AGENTS.md](../AGENTS.md) ฉบับเต็มก่อนทำงาน
> **Last verified:** 2026-09-03

ไฟล์นี้เป็น Bootstrap summary เท่านั้น หากข้อมูลขัดกันให้ยึด `../AGENTS.md`

## Non-negotiable summary

1. อ่าน [MVP Scope](<../02_feature/MyNetMate Weight Feature List (AI คิด).md>) ก่อนเริ่มงาน
2. ใช้ AI เมื่อต้องตีความ; ใช้ deterministic rules/Jinja2 เมื่อต้องการ Config ที่ถูกต้องแน่นอน
3. Cisco IOS เป็น baseline; Huawei Router และ MikroTik Switch เป็น candidate test vendors ไม่ใช่ Full Support
4. ห้าม AI Execute คำสั่งบนอุปกรณ์จริง ทุก Deploy ต้องผ่าน Human-in-the-Loop
5. Mask IP ด้วย `yacryptopan` และ Mask Password/Secret ด้วย Regex ก่อน external AI call
6. Config ทุกก้อนต้องผ่าน CIS validation ก่อน Deploy
7. ห้ามใช้ LangChain, Presidio, spaCy หรือ Vector DB เป็น current architecture
8. ทดสอบ Network Discovery เฉพาะ Isolated Lab ห้าม Scan เครือข่ายมหาวิทยาลัย
9. `mynetmate/network-discovery/` เป็นงานเพื่อนและ Read-only สำหรับ AI เว้นแต่ผู้ใช้อนุญาตเป็นลายลักษณ์อักษร
10. ก่อนทำ artifact สำหรับ Obsidian ให้อ่าน [../OBSIDIAN_EXTENSIONS.md](../OBSIDIAN_EXTENSIONS.md)
11. เมื่อผู้ใช้ขออัปเดต Project context ให้อัปเดต `../AGENTS.md` และ `../README.md` จากไฟล์จริง พร้อมตรวจลิงก์

## Current code reality

- Frontend ปัจจุบัน: React 19 + Vite 8 + TypeScript 6 starter
- Backend ปัจจุบัน: FastAPI prototype; หลาย service ยังเป็น sample/in-memory
- Planned dependency ไม่เท่ากับ installed dependency ให้ตรวจ `package.json` หรือ `requirements.txt` ก่อนอ้างอิง
- Workspace มี nested Git repositories ให้ตรวจขอบเขต repository ก่อนแก้หรือ Commit

## Communication

- สนทนาและรายงานเป็นภาษาไทย
- Code, identifiers และ technical terms ใช้ภาษาอังกฤษ
- แยก Planned, Prototype, Implemented และ Tested ให้ชัดเจน
