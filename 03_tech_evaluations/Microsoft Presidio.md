## presidio.dataprivacystack.org คืออะไร?

**คือ Documentation site ของ Microsoft Presidio** ที่ย้าย domain ใหม่มาอยู่ที่ `data-privacy-stack` organization บน GitHub แต่เป็น **project เดียวกัน** กับที่ King แชร์ใน Discord channel (`microsoft.github.io/presidio/installation/#using-pip`)

---

## Presidio คืออะไร และเกี่ยวกับโปรเจกต์เราอย่างไร?

### 📌 ตัวมันเองคืออะไร

Microsoft Presidio

= Open-source Library ของ Microsoft

= ทำ PII Anonymization / Detection

= รันบนเครื่องตัวเองทั้งหมด (Local = ไม่ส่งข้อมูลออกไปไหน)

= รองรับ Text, Images, Structured Data

### 🔗 เกี่ยวกับโปรเจกต์เรายังไง

ในโปรเจกต์เรา Presidio จะเป็น **PII Masking Engine** ที่อยู่ระหว่าง Backend และ Gemini API:

Network Config (มี password, IP, SNMP)

        ↓

[Presidio — รันบน Server เรา]

        ↓ Mask ข้อมูลออก

Config ที่ปลอดภัย ([MASK_IP], [MASK_PWD], [MASK_SNMP])

        ↓

ส่งไป Gemini API ได้อย่างปลอดภัย

---

## สิ่งที่ Presidio ทำได้ (ที่เกี่ยวกับ Network Config)

|ความสามารถ|ตัวอย่างสำหรับโปรเจกต์เรา|
|---|---|
|**ตรวจจับ IP Address**|`192.168.1.1` → `[IP_ADDRESS]`|
|**ตรวจจับ Password**|`enable secret 5 $abc123` → `enable secret 5 [MASKED]`|
|**Custom Recognizer**|เขียน Regex เพิ่มเองได้ เช่น จับ SNMP community string|
|**Anonymize + Deanonymize**|Mask ก่อนส่ง AI → Unmask กลับหลังได้ผลลัพธ์|
|**100% Local**|ไม่ต้องส่งข้อมูลออกไปไหนเลย|

---

## คำตอบสำหรับคำถามอาจารย์ที่ค้างไว้

> _"แล้วไปดูด้วยนะว่า Lib มันส่งข้อมูลของเราไปด้านนอกหรือป่าว"_

**คำตอบ: ไม่ส่งออกเลยครับ** Presidio รันทั้งหมดบน Local — ไม่มี API call ออกไปข้างนอก เพราะ:

- ใช้ **spaCy NLP model** ที่ download มาเก็บบนเครื่อง
- ใช้ **Regex Engine** ที่รันในโปรเซสเดียวกัน
- ไม่มี telemetry หรือ cloud endpoint ใดๆ

---

## สรุปสั้นๆ

> `presidio.dataprivacystack.org` = เว็บ Docs ของ Microsoft Presidio (domain ใหม่)  
> Presidio = Library สำหรับ **Mask ข้อมูลสำคัญก่อนส่ง AI** รัน Local ทั้งหมด ตอบคำถามอาจารย์ได้เลยว่า **"ไม่ส่งข้อมูลออก"**