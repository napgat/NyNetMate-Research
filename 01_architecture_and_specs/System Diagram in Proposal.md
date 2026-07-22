# System Diagram: Application for Network Management and Configuration Automation
แผนภาพนี้แสดงสถาปัตยกรรมระบบ (System Architecture) ของแอปพลิเคชันสำหรับจัดการและตั้งค่าเครือข่ายอัตโนมัติ โดยแบ่งออกเป็นส่วนประกอบหลักๆ 8 ส่วน ซึ่งทำงานสอดประสานกันดังนี้:
## 1. Browser (ฝั่งผู้ใช้งาน)
ส่วนติดต่อผู้ใช้งานผ่านเว็บบราวเซอร์ (ตัวอย่าง URL: `https://www.inwza.io`)
* **การโต้ตอบ:**
  * ส่ง `Request webpage` ไปยังส่วน Frontend
  * รับ `Response webpage` กลับมาจากส่วน Frontend เพื่อแสดงผลให้ผู้ใช้
* **การนำไปใช้งาน (Deployment):**
  * รับการ `Deploy` มาจากส่วนประกอบ DevOps
## 2. Frontend (ระบบส่วนหน้า)
พัฒนาด้วยเทคโนโลยีสมัยใหม่เพื่อสร้าง Web Application ที่ตอบสนองได้รวดเร็ว
* **เทคโนโลยีที่ใช้:**
  * **TypeScript:** ภาษาหลักในการเขียนโค้ดเพื่อความปลอดภัยของชนิดตัวแปร (Type safety)
  * **React:** ไลบรารีสำหรับสร้าง User Interface
  * **TanStack Router:** สำหรับจัดการระบบ Routing ภายในแอป
  * **TanStack Query:** สำหรับจัดการการดึงข้อมูล (Data fetching) และจัดการ State ของเซิร์ฟเวอร์
  * **Tailwind CSS:** Framework สำหรับจัดการความสวยงามและ UI (Styling)
  * **Zustand:** สำหรับจัดการ State ภายในแอปพลิเคชัน (State management)
* **การเชื่อมต่อ:**
  * ส่งคำสั่ง `GET, POST, PUT, DELETE` ไปยัง Backend
  * รับ `Backend Response` กลับมาจาก Backend
  * ส่งโค้ดไปทำการ `Unit and Integration Testing` ที่ส่วน Testing
  * รับกระบวนการ `Testing, Building` มาจาก DevOps
## 3. Backend (ระบบส่วนหลัง)
ระบบประมวลผลหลัก ทำหน้าที่จัดการลอจิก, ฐานข้อมูล และสื่อสารกับอุปกรณ์เครือข่าย
* **เทคโนโลยีที่ใช้:**
  * **Python:** ภาษาหลักในการพัฒนา
  * **FastAPI:** Web Framework สำหรับสร้าง API ที่รวดเร็ว
  * **PostgreSQL:** ระบบฐานข้อมูลเชิงสัมพันธ์สำหรับเก็บข้อมูล
  * **Pydantic:** สำหรับจัดการ Data validation
  * **SQLAlchemy:** ORM สำหรับจัดการและสื่อสารกับฐานข้อมูล PostgreSQL
  * **Jinja2:** Template engine สำหรับสร้างไฟล์ Configuration
* **การเชื่อมต่อ:**
  * สื่อสารกับ Frontend ผ่าน API
  * **ไปยังส่วน Network Device:** ส่งคำสั่ง `Apply config, restore config via SSH, SNMP`
  * **รับจากส่วน Network Device:** รับข้อมูล `Send the current config to the Database` กลับมาบันทึก
  * **ไปยังส่วน LLM Integration:** `Send frontend request to LLM API`
  * **รับจากส่วน LLM Integration:** รับ `LLM API Response`
  * **เชื่อมต่อกับ CEPP Backend:** แลกเปลี่ยนข้อมูล `Request Pro Features` และ `Response Pro Features`
  * ส่งโค้ดไปทำการ `Unit and Integration Testing` ที่ส่วน Testing
  * รับกระบวนการ `Testing, Building` มาจาก DevOps
## 4. CEPP Backend (ระบบหลังบ้านส่วนเสริม - Pro Features)
ส่วนหลังบ้านเพิ่มเติมที่คาดว่าจะจัดการเกี่ยวกับฟีเจอร์ระดับพรีเมียมหรือบริการเฉพาะทาง
* **เทคโนโลยีที่ใช้:** Python, FastAPI, PostgreSQL
* **การเชื่อมต่อ:**
  * สื่อสารกับ Backend หลักเพื่อให้บริการ Pro Features
  * แลกเปลี่ยนข้อมูลกับระบบ LLM Integration (เช่น `Request to LLM API + RAG` และรับ `LLM API Response`)
  * อาจมีการส่ง `Return result` ไปยังส่วน Testing
## 5. LLM Integration (ระบบปัญญาประดิษฐ์)
ส่วนประมวลผลทางด้าน AI และภาษาธรรมชาติ (Natural Language Processing)
* **เทคโนโลยีที่ใช้:**
  * **Gemini API:** โมเดลภาษาหลัก (LLM)
  * **LangChain:** Framework สำหรับเชื่อมต่อและจัดการ LLM
  * **ChromaDB, Pinecone, Weaviate:** Vector Databases สำหรับระบบ RAG (Retrieval-Augmented Generation)
* **การทำงาน:** รับคำขอจาก Backend หรือ CEPP Backend เพื่อประมวลผลคำสั่งหรือสอบถามข้อมูล และส่ง Response กลับไป
## 6. Network Device (อุปกรณ์เครือข่าย)
อุปกรณ์ฮาร์ดแวร์จริงที่ระบบเข้าไปบริหารจัดการ
* **ประเภทอุปกรณ์:**
  * Router (เราเตอร์)
  * Switch (สวิตช์)
  * L3 Switch (เลเยอร์ 3 สวิตช์)
  * Access Point (จุดกระจายสัญญาณไร้สาย)
* **การโต้ตอบ:** รับการปรับแต่งค่า (Config) จาก Backend ผ่าน SSH/SNMP และส่งค่า Config ปัจจุบันกลับไปอัปเดตที่ฐานข้อมูล
## 7. Testing (ระบบทดสอบ)
จัดการการทดสอบคุณภาพของซอฟต์แวร์ทั้งระบบ
* **เทคโนโลยีที่ใช้:**
  * **Jest:** สำหรับทดสอบฝั่ง Frontend
  * **Pytest:** สำหรับทดสอบฝั่ง Backend (Python)
  * **Containerlab:** สำหรับจำลองและทดสอบระบบเครือข่าย (Network Simulation)
* **การทำงาน:** รับโค้ด/ผลลัพธ์จาก Frontend และ Backend มาทำการทดสอบ (Unit and Integration Testing) และส่งผลลัพธ์ `Return result`
## 8. DevOps (ระบบจัดการและส่งมอบซอฟต์แวร์)
ควบคุมกระบวนการพัฒนา ทดสอบ และนำไปใช้งาน (CI/CD)
* **เทคโนโลยีที่ใช้:**
  * **Docker:** สำหรับทำ Containerization
  * **Git:** สำหรับควบคุมเวอร์ชันของโค้ด (Version Control)
  * **GitHub:** แหล่งเก็บโค้ดส่วนกลาง (Repository)
  * **GitHub Actions:** สำหรับทำระบบ CI/CD Pipeline อัตโนมัติ
* **การทำงาน:** รับหน้าที่จัดการ `Testing, Building` ให้กับ Frontend และ Backend และทำการ `Deploy` ระบบไปสู่โปรดักชัน (Browser/Server)