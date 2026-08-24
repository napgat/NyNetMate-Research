# API Contracts

| Endpoint                             | สิทธิ์                | Input                     | Output หลัก                                                    | Cache/Error behavior                                                              |
| ------------------------------------ | --------------------- | ------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `GET /api/dashboard/summary`         | Viewer/Operator/Admin | `site_id` (optional)      | Device counts, Security summary, `last_checked_at`, `is_stale` | อาจ Cache ระยะสั้น เช่น 30 วินาที; หากใช้ค่าค้างต้องส่ง `is_stale: true`          |
| `GET /api/dashboard/recent-activity` | ตาม RBAC policy       | `limit` โดยจำกัดค่าสูงสุด | รายการกิจกรรมล่าสุดพร้อม User, Action, Target, Timestamp       | ไม่จำเป็นต้อง Cache สำหรับ 10 รายการล่าสุด หาก Index เหมาะสม                      |
| `GET /api/system/health`             | Viewer/Operator/Admin | ไม่มี                     | Backend, Database, AI mode/status                              | Dependency ภายนอกต้องมี Timeout และ Offline Mode ต้องไม่ถูกส่งเป็น Critical error |

### ตัวอย่าง Response: Dashboard Summary

```json
{
  "devices": {
    "total": 10,
    "online": 8,
    "offline": 1,
    "unknown": 0,
    "maintenance": 1
  },
  "security": {
    "critical_failures": 2
  },
  "last_checked_at": "2026-08-09T10:00:00+07:00",
  "is_stale": false
}
```
