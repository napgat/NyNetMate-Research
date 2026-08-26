# API Contracts

เอกสารนี้ระบุรายละเอียดของ Contract ทั้งแบบภายใน (Internal) และภายนอก (REST API)

## 1. Internal Contract (Producer Interface)
ฟังก์ชันนี้ออกแบบมาให้ Feature อื่นเรียกใช้ใน Backend (Python/FastAPI)

```python
async def record_audit_event(
    db: AsyncSession,          # ต้องใช้ Session เดียวกับ Business Action
    action: str,               # เช่น 'device.create'
    resource_type: str,        # เช่น 'device'
    result: str,               # 'success' หรือ 'failure'
    user_id: UUID | None = None,
    resource_id: UUID | None = None,
    safe_error_category: str | None = None,
    description: str | None = None, # ต้องทำ Redaction ก่อนส่งเข้ามา
    ip_address: str | None = None
) -> None:
    pass
```

## 2. External API: Full Audit Trail (Admin)

| Endpoint | สิทธิ์ | Input | Output หลัก | Cache/Error behavior |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/audit-logs` | `audit.read` (Admin) | `limit`, `offset` (หรือ `cursor`), `action`, `resource_type`, `user_id`, `result`, `start_date`, `end_date` | ประวัติการทำงานฉบับเต็ม รวมถึง IP Address, Safe Error และ Description | ไม่มีการ Cache เนื่องจากข้อมูลอัปเดตตลอดเวลา |

### ตัวอย่าง Response: Full Audit Trail

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "987e6543-e21b-34d3-b456-426614174111",
      "action": "device.create",
      "resource_type": "device",
      "resource_id": "456e4567-e89b-12d3-a456-426614174222",
      "result": "success",
      "safe_error_category": null,
      "description": "Added new switch BKK-SW1",
      "ip_address": "10.0.0.5",
      "created_at": "2026-08-26T10:00:00+07:00"
    }
  ],
  "pagination": {
    "total": 1500,
    "limit": 50,
    "offset": 0
  }
}
```

## 3. D&M Recent Activity API (Consumer Reference)
*หมายเหตุ: Contract นี้นิยามไว้ที่ `02_feature/01_Dashboard&Monitoring(Naphat)/04_API Contracts.md` แต่สรุปเงื่อนไขสำคัญที่อิงจาก Audit Trail ดังนี้:*
- **สิทธิ์:** `activity.read_summary`
- **เงื่อนไข:** ดึงตรงจากตาราง `audit_logs`
- **Allowlist:** แสดงเฉพาะ (`user.login_success`, `user.logout`, `user.password_changed`, `user.created`, `user.updated`)
- **Redaction:** หา user ไม่เจอ = `Unknown`, ไม่แสดง identifier ดิบ, ห้ามส่ง IP, User-Agent, Error Detail, Secret, หรือ Full Audit Description ออกไป
