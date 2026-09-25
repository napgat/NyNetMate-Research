# 🗺️ Data Flow: การขอดูอุปกรณ์ในหน้า Topology

แผนภาพนี้แสดงลำดับการไหลของข้อมูล (Data Flow) ตั้งแต่ที่ผู้ใช้คลิกหน้าเว็บ ไปจนถึงการดึงข้อมูลจากฐานข้อมูลออกมาแสดงผล โดยอิงจากโครงสร้างสถาปัตยกรรม (Architecture) ที่เราคุยกันครับ

```mermaid
sequenceDiagram
    autonumber
    actor FE as 💻 Frontend (React)<br/>หน้า Topology
    box rgba(100, 150, 250, 0.1) Application Entry
    participant Server as ⚙️ server.py<br/>main.py
    participant CoreRouter as 🔀 core/router.py
    end
    
    box rgba(250, 150, 100, 0.1) Feature: Topology
    participant FeatRouter as 🚦 topology/router.py
    participant Schema as 🛡️ schemas.py
    participant Service as 🧠 service.py
    end
    
    box rgba(100, 200, 100, 0.1) Data Layer
    participant DB as 🗄️ models.py<br/>core/database.py
    end

    FE->>Server: ส่ง Request: GET /api/topology/devices
    Note over FE,Server: 1. ผู้ใช้เปิดหน้าเว็บ Frontend จึงยิง API มาที่ Backend
    
    Server->>CoreRouter: ส่งต่อ Request เข้ามาในแอปพลิเคชัน
    Note over Server,CoreRouter: 2. main.py เช็ค CORS และ Security เบื้องต้น
    
    CoreRouter->>FeatRouter: กระจาย Route ตาม Prefix (/api/topology)
    Note over CoreRouter,FeatRouter: 3. ส่งคำขอไปให้แผนกที่ดูแลเรื่อง Topology
    
    FeatRouter->>Schema: ตรวจสอบ Request Parameters (ถ้ามี)
    Note over FeatRouter,Schema: 4. เช่น มีการค้นหา หรือระบุ Site ID หรือไม่
    
    Schema-->>FeatRouter: ✅ ข้อมูลถูกต้อง (Valid)
    
    FeatRouter->>Service: เรียกใช้ฟังก์ชัน get_topology_data()
    Note over FeatRouter,Service: 5. ส่งต่องานให้ "สมองกล" จัดการ Business Logic
    
    Service->>DB: สั่ง Query ข้อมูล Node และ Link
    Note over Service,DB: 6. ติดต่อ PostgreSQL ผ่าน SQLAlchemy
    
    DB-->>Service: คืนค่าข้อมูลดิบจากตาราง (Raw Data)
    
    Note over Service: 7. Service ประมวลผลข้อมูล<br/>(จัดโครงสร้างให้พร้อมสำหรับวาดแผนผัง)
    
    Service-->>FeatRouter: คืนค่าข้อมูลที่จัดรูปแบบแล้ว
    
    FeatRouter-->>Server: แพ็กข้อมูลกลับเป็น HTTP Response (JSON)
    
    Server-->>FE: ส่งข้อมูล 200 OK + JSON
    Note over Server,FE: 8. Frontend รับ JSON ไปเรนเดอร์เป็นภาพ Topology
```

### 📝 คำอธิบายเพิ่มเติมตามภาพ:
1. **Frontend** ยิงคำขอ (Request) ไปที่ URL ของ Topology (เช่น `GET /api/topology/devices`)
2. **`main.py` / `server.py`** รับแขกที่หน้าประตู เช็คความปลอดภัย (เช่น ตรวจสอบ Session Cookie)
3. **`core/router.py`** อ่าน URL แล้วรู้ว่าต้องส่งไปให้แฟ้มงานไหน (แยกไปที่แฟ้ม Topology)
4. **`topology/router.py`** รับเรื่องต่อ แล้วสั่งให้ **`schemas.py`** ตรวจสอบว่า Frontend ส่งข้อมูลมาถูกต้องตามฟอร์แมตไหม
5. เมื่อข้อมูลถูกต้อง **`topology/router.py`** จะไปสะกิด **`service.py`** ว่า *"ไปคำนวณและหาข้อมูล Topology มาให้หน่อย"*
6. **`service.py`** เดินไปที่คลังสินค้า สั่งผ่าน **`database.py`** ให้ไปดึงข้อมูลอุปกรณ์ (Devices) และเส้นเชื่อมต่อ (Links) จากฐานข้อมูลตามแปลนของ **`models.py`**
7. เมื่อได้ของมาครบ **`service.py`** จะจัดการปั้นข้อมูลให้อยู่ในรูปทรงที่ Frontend ต้องการวาดรูป
8. สุดท้าย ข้อมูลถูกส่งกลับย้อนเส้นทางเดิม ออกไปเป็นข้อมูล JSON ให้ Frontend นำไปแสดงผลบนหน้าจอครับ
