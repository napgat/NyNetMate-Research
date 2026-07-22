This is the start of the #material channel. 
January 29, 2026

เพลง สุขใดจะเท่าสุโคย😏 — 1/29/2026 12:08 AMThursday, January 29, 2026 12:08 AM
Rules ตัวอย่าง:
RULES = {
    'security': [
        {
            'name': 'default_password',
            'check': lambda config: 'enable secret' not in config,
            'severity': 'critical',
            'message': 'No enable password configured!'
        },
        {
            'name': 'ssh_enabled',
            'check': lambda config: 'transport input ssh' in config,
            'severity': 'warning',
            'message': 'SSH not enabled, using Telnet is insecure'
        }
    ],
    'performance': [
        {
            'name': 'stp_check',
            'check': lambda config: 'spanning-tree' in config,
            'severity': 'warning',
            'message': 'STP not configured, loops possible'
        }
    ]
}

def analyze_config(config: str):
    warnings = []

    for category, rules in RULES.items():
        for rule in rules:
            if not rule['check'](config):
               warnings.append({
                   'category': category,
                   'rule': rule['name'],
                   'severity': rule['severity'],
                   'message': rule['message']
                })

    return warnings
March 10, 2026

King! — 3/10/2026 11:41 PMTuesday, March 10, 2026 11:41 PM
microsoft.github.io/presidio/installation/#using-pip
March 11, 2026

whyzotee — 3/11/2026 12:51 AMWednesday, March 11, 2026 12:51 AM
apt update && apt install netdiscover

pip install pandas paramiko pysnmplib snmpclitools
March 13, 2026

whyzotee — 3/13/2026 8:44 PMFriday, March 13, 2026 8:44 PM
Flow Network Admin generate config อุปกรณ์ network
sequenceDiagram
    autonumber
    actor Admin as Network Administrator
    participant Web as Website (Frontend)
    participant BE as Backend Server
    participant PII as Masking Engine (Regex+NER)
    participant LLM as LLM API (Gemini)
    participant DB as Database (Temporal/Standard)

    Admin->>Web: ป้อนความต้องการ (e.g., "Config VLAN 10")
    Web->>BE: POST /generate-command (Prompt + Device Context)
    
    Note over BE: เตรียม Context และ <br/>Apply Template (ถ้ามี)

    BE->>PII: ส่ง Raw Data ไป Masking
    PII-->>BE: ข้อมูลที่ถูก Mask แล้ว (e.g., [MASK_IP])
    
    BE->>LLM: Request Command Generation (API Call)
    LLM-->>BE: Response Generated Command (Raw Text/JSON)
    
    Note over BE: ตรวจสอบความถูกต้องเบื้องต้น <br/>(Security Validation / PII Masking)

    BE->>DB: Save Generated Command (Version Control)
    DB-->>BE: Success Acknowledgement

    BE-->>Web: Return Generated Command
    Web-->>Admin: แสดงผล Command บนหน้าจอ (Preview)
 (edited)Saturday, March 14, 2026 10:07 AM
March 14, 2026

whyzotee — 3/14/2026 10:07 AMSaturday, March 14, 2026 10:07 AM
Flow Network Admin แก้ไข Topology
sequenceDiagram
    autonumber
    actor Admin as Network Administrator
    participant Web as Website (Frontend)
    participant BE as Backend Server
    participant Logic as Topology Logic Engine
    participant DB as Database (Temporal/Standard)

    Admin->>Web: เพิ่ม/ลบ อุปกรณ์ (Drag & Drop หรือ Form)
    Web->>BE: POST /update-inventory (Device Info / Action)

    BE->>Logic: เชื่อมโยงอุปกรณ์ Network เข้าด้วยกัน (Link Node)
    Logic-->>BE: ข้อมูล Topology ที่อัปเดตแล้ว (Nodes & Edges)

    BE->>DB: บันทึกข้อมูลอุปกรณ์และสถานะ Link ล่าสุด
    DB-->>BE: บันทึกสำเร็จ (Success)

    BE-->>Web: ส่งข้อมูล Topology ใหม่กลับไปแสดงผล
    Web-->>Admin: แสดงผล Topology ที่อัปเดตแบบ Real-time

whyzotee — 3/14/2026 10:14 AMSaturday, March 14, 2026 10:14 AM
Flow Verison control: Network Admin กด save config หรือ ระบบ auto backup ให้
sequenceDiagram
    autonumber
    actor Admin as Network Administrator
    participant Web as Website (Frontend)
    participant BE as Backend Server
    participant Sch as Scheduler (Task Manager)
    participant DB as Temporal Database

    Note over Admin, DB: [วิธีที่ 1] Manual Save Config
    Admin->>Web: กดปุ่ม Save Config
    Web->>BE: POST /version-control/save (Config ID + Content)
    BE->>BE: ตรวจสอบ Config Generate ID & Metadata
    BE->>DB: บันทึกข้อมูลแบบ Temporal (New Version)
    DB-->>BE: Success (Version ID Created)
    BE-->>Web: แสดงสถานะบันทึกสำเร็จ

    Note over Admin, DB: [วิธีที่ 2] Auto Backup Configuration
    Admin->>Web: ตั้งค่าความถี่การ Backup (e.g., ทุก 1 ชม., ทุกการ Gen)
    Web->>BE: PUT /backup-settings (Frequency/Timestamp)
    BE->>Sch: ตั้งค่า Job Scheduler ตามเงื่อนไข (Cron Job)
    
    loop ตามเงื่อนไขเวลาที่ตั้งไว้
        Sch->>BE: Trigger Backup Job
        BE->>BE: ดึง Config ปัจจุบันจากระบบ/อุปกรณ์
        BE->>DB: บันทึก Backup พร้อมระบุ Timestamp
    end
    
    DB-->>BE: Backup History Saved
    BE-->>Web: อัปเดตรายการใน Version History
April 1, 2026

whyzotee — 4/1/2026 6:28 PMWednesday, April 1, 2026 6:28 PM

Usecase.drawio
15.70 KB
Download

System-Diagram.drawio
1.15 MB
Download
May 16, 2026

whyzotee — 5/16/2026 9:35 PMSaturday, May 16, 2026 9:35 PM
https://drive.google.com/drive/folders/1NdY-E5W8CflSTXEdl5XJFCCgOcINdb4L?usp=sharing
Google Drive: Sign-in
Access Google Drive with a Google account (for personal use) or Google Workspace account (for business use).
[9:35 PM]Saturday, May 16, 2026 9:35 PM
ไฟล์ network os