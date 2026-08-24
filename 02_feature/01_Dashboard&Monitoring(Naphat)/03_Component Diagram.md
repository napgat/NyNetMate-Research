## 6. Component Architecture

```mermaid
flowchart LR
    UI["Dashboard UI<br/>React + TanStack Query"] -->|JWT + dashboard requests| API["Dashboard API<br/>FastAPI"]
    API -->|authorize request| RBAC["Authentication & RBAC Guard"]
    API -->|summary query| AGG["Dashboard Aggregation Service"]
    API -->|health request| HEALTH["System Health Checker"]

    AGG -->|device status| DEVICE["Device Repository"]
    AGG -->|latest findings| VALIDATION["Validation Repository"]
    AGG -->|recent actions| AUDIT["Audit Repository"]

    DEVICE --> DB[("PostgreSQL")]
    VALIDATION --> DB
    AUDIT --> DB
    HEALTH -->|database check| DB
    HEALTH -->|mode/status check| GEMINI["Gemini API / Offline Mode"]

    API -->|aggregated JSON + freshness metadata| UI
```

### Component Responsibilities

| Component                         | หน้าที่                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| **Dashboard UI**                  | แสดง Widget, Polling/Manual Refresh, Empty/Error/Stale state และ RBAC-aware actions |
| **Dashboard API**                 | รับ Request และคืน Response ที่เหมาะกับหน้า Dashboard                               |
| **Dashboard Aggregation Service** | รวม Device, Validation และ Audit data เป็น Response เดียว                           |
| **Authentication & RBAC Guard**   | ตรวจ Session/JWT และสิทธิ์ของผู้ใช้                                                 |
| **Repositories**                  | แยก Query ตาม Domain และป้องกัน Query logic กระจายใน Route                          |
| **System Health Checker**         | ตรวจ Dependency แบบ Asynchronous และจำกัด Timeout                                   |
| **PostgreSQL**                    | Source of Truth ของ Current state, Validation และ Audit                             |

สถาปัตยกรรม P1 ไม่ต้องมี Message Queue หรือ Streaming pipeline
