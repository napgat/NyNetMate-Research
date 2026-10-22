from pathlib import Path
import json
root=Path(r"E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\outputs\thesis\sequence-diagram\naphat")
source=root/"diagrams.json"
gen=root/"mermaid"/"build-mermaid.cjs"
all_specs=json.loads(source.read_text(encoding="utf-8"))
spec=next(s for s in all_specs if s["id"]=="fig-3-14-audit-history")
assert spec["actor"]=="Admin" and spec["service"]=="Backend\nAudit Read Service"
assert spec["steps"][0]==["msg",0,1,"เปิดหน้า Audit History\nและกำหนดตัวกรองถ้าต้องการ"]
spec["frontend"]="Frontend"
spec["service"]="Audit Read Service"
spec["separateService"]=True
spec["steps"]=[
 ["msg",0,1,"เปิดหน้า Audit History\nและกำหนดตัวกรองถ้าต้องการ"],
 ["msg",1,2,"GET /api/audit-logs\nตัวกรอง + Cursor + Session Cookie"],
 ["msg",2,3,"ตรวจ Session และบัญชีผู้ใช้งาน"],
 ["msg",3,4,"อ่าน Session และบัญชีผู้ใช้งาน"],
 ["return",4,3,"ข้อมูลผู้ใช้และ Role ปัจจุบัน"],
 ["return",3,2,"ข้อมูลผู้ใช้และ Role ปัจจุบัน"],
 ["self",2,"ตรวจสิทธิ์ audit.read\nและตรวจรูปแบบตัวกรอง"],
 ["alt",[
   {"guard":"[เป็น Admin และคำขอถูกต้อง]","steps":[
     ["msg",2,3,"ขอรายการ Audit ตามตัวกรอง\nพร้อม Cursor ที่ตรวจสอบแล้ว"],
     ["msg",3,4,"อ่าน audit_logs ตามตัวกรอง\nเรียงเวลาและ ID จากใหม่ไปเก่า"],
     ["return",4,3,"รายการเหตุการณ์และข้อมูลผู้เกี่ยวข้อง"],
     ["self",3,"ตรวจความปลอดภัยของข้อมูล\nจัดรูปแบบรายการและ Next Cursor"],
     ["return",3,2,"รายการ Audit และ Next Cursor"],
     ["return",2,1,"รายการ Audit และ Next Cursor"],
     ["return",1,0,"แสดงประวัติแบบอ่านอย่างเดียว\nหรือข้อความเมื่อไม่พบรายการ"],
     ["opt","[ผู้ใช้เลือกดูหน้าถัดไป]",[
       ["msg",0,1,"เลือกดูรายการถัดไป"],
       ["msg",1,2,"ขอรายการต่อด้วย Next Cursor"],
       ["self",2,"ตรวจ Session, สิทธิ์ audit.read\nและรูปแบบ Cursor อีกครั้ง"],
       ["msg",2,3,"ขอข้อมูล Audit หน้าถัดไป\nด้วย Next Cursor ที่ตรวจสอบแล้ว"],
       ["msg",3,4,"อ่าน audit_logs หน้าถัดไป\nเรียงเวลาและ ID"],
       ["return",4,3,"รายการเหตุการณ์หน้าถัดไป"],
       ["self",3,"ตรวจข้อมูลและจัด Next Cursor ใหม่"],
       ["return",3,2,"รายการหน้าถัดไปและ Next Cursor"],
       ["return",2,1,"รายการหน้าถัดไปและ Next Cursor"],
       ["return",1,0,"แสดงรายการหน้าถัดไป"]
     ]]
   ]},
   {"guard":"[Session สิทธิ์ หรือตัวกรองไม่ถูกต้อง]","steps":[
     ["return",2,1,"401 / 403 / 422\nตามสาเหตุที่ปฏิเสธ"],
     ["return",1,0,"แจ้งข้อผิดพลาด\nโดยไม่เปิดเผยประวัติ"]
   ]}
 ]],
 ["note","ไม่แก้ไขหรือลบ Audit จากหน้านี้ และไม่บันทึก Audit ใหม่จากการอ่านที่สำเร็จ"]
]
t=gen.read_text(encoding="utf-8")
old="['fig-3-6-login', 'fig-3-7-view-dashboard', 'fig-3-12-view-topology', 'fig-3-13-user-management']"
new=old[:-1]+", 'fig-3-14-audit-history']"
assert t.count(old)==3,t.count(old)
t=t.replace(old,new)
source.write_text(json.dumps(all_specs,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
gen.write_text(t,encoding="utf-8")
print("AUDIT_HISTORY_SOURCE_AND_GENERATOR_UPDATED")
