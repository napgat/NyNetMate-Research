const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

// Native Draw.io cells are the editable source; all previews decode this XML.
const W = 1360, H = 900, OUT = __dirname;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const label = s => esc(String(s).split('\n').map(esc).join('<br>'));
const screens = [];
let cells, serial, current;

function cell(value, x, y, width, height, style = '') {
  const id = 'n' + ++serial;
  cells.push(`<mxCell id="${id}" value="${label(value)}" vertex="1" parent="1" style="html=1;whiteSpace=wrap;rounded=0;fontFamily=Tahoma;fontSize=15;fontColor=#292929;strokeColor=#777777;strokeWidth=1;fillColor=#ffffff;align=left;verticalAlign=middle;spacing=10;${style}"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`);
  return id;
}
const text = (v,x,y,w,h=26,style='') => cell(v,x,y,w,h,'text;fillColor=none;strokeColor=none;spacing=0;'+style);
const box = (x,y,w,h,fill='#ffffff',style='') => cell('',x,y,w,h,`fillColor=${fill};${style}`);
const button = (v,x,y,w=140,primary=false) => cell(v,x,y,w,38,`align=center;spacing=4;${primary?'fillColor=#dddddd;fontStyle=1;':''}`);
function field(v,x,y,w=480,value='') {
  text(v,x,y,w,24,'fontSize=14;');
  cell(value,x,y+29,w,42,'fontColor=#666666;');
}
const pill = (v,x,y,w=110) => cell(v,x,y,w,28,'rounded=1;arcSize=12;align=center;spacing=2;fontSize=13;fillColor=#f0f0f0;');
function rule(x,y,w) { box(x,y,w,1,'#cccccc','strokeColor=none;'); }
function begin(id, title, note) {
  serial = 0; cells = []; current = { id, title, note };
  text(title,24,20,1270,34,'fontSize=25;fontStyle=1;');
  text('MyNetMate · Low-fidelity wireframe · SAMPLE DATA',24,59,1250,20,'fontSize=13;fontColor=#666666;');
  text(note,24,835,1312,44,'fontSize=14;fontColor=#555555;');
}
function finish() {
  const model = `<mxGraphModel page="1" pageScale="1" pageWidth="${W}" pageHeight="${H}" grid="1" gridSize="10" guides="1" connect="1" arrows="1" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('\n')}</root></mxGraphModel>`;
  screens.push({ ...current, model, width:W, height:H });
}
function shell(active, title, subtitle='', role='Admin', muted=false) {
  box(24,90,1312,718);
  box(24,90,220,718,'#f2f2f2');
  text('MyNetMate',44,113,177,30,'fontSize=21;fontStyle=1;');
  text('Network Management',44,147,177,24,'fontSize=13;');
  rule(44,183,177);
  const nav = ['Dashboard','Devices','Topology','My account',...(role==='Admin'?['Users','Audit history']:[])];
  nav.forEach((v,i)=>cell(v,40,204+i*49,188,39,`strokeColor=${v===active?'#555555':'none'};fillColor=${v===active?'#dddddd':'none'};${v===active?'fontStyle=1;':''}`));
  text('demo_user',44,681,170,24,'fontStyle=1;');
  pill(role,44,713,100);
  button('Sign out',44,759,166);
  text(title,276,112,1005,35,`fontSize=24;fontStyle=1;${muted?'fontColor=#777777;':''}`);
  if(subtitle) text(subtitle,276,152,1016,24,'fontSize=14;fontColor=#666666;');
}
function grid(x,y,widths,headers,rows,rowHeight=58) {
  let xx=x;
  headers.forEach((h,i)=>{cell(h,xx,y,widths[i],42,'fillColor=#eeeeee;fontStyle=1;fontSize=14;spacing=8;');xx+=widths[i];});
  rows.forEach((row,r)=>{let xx=x;row.forEach((v,i)=>{cell(v,xx,y+42+r*rowHeight,widths[i],rowHeight,'fontSize=14;spacing=8;');xx+=widths[i];});});
}
const devices = [
  ['LAB-R1','192.0.2.10','Router','Active','Reachable','Details / Check / Edit'],
  ['LAB-SW1','192.0.2.20','Switch','Maintenance','Unknown','Details / Check / Edit'],
  ['LAB-SW2','192.0.2.30','Switch','Active','Unreachable','Details / Check / Edit'],
];
function deviceSkeleton() {
  shell('Devices','Device inventory','หน้าต่างที่เปิดทับรายการอุปกรณ์ — รายการพื้นหลังแสดงเป็นพื้นที่โครงร่าง');
  box(276,210,1016,65,'#f4f4f4','strokeColor=#dddddd;');
  for(let y=297;y<735;y+=64) box(276,y,1016,47,'#f4f4f4','strokeColor=#dddddd;');
}
function modal(title, x=458,y=184,w=590,h=566) {
  box(x,y,w,h,'#ffffff','strokeColor=#444444;strokeWidth=2;');
  text(title,x+24,y+18,w-90,33,'fontSize=20;fontStyle=1;');
  button('X',x+w-54,y+15,32);
  rule(x+24,y+65,w-48);
  return {x,y,w,h,l:x+24,r:x+w-24};
}
function edge(source,target,style='') {
  const id='n'+ ++serial;
  cells.push(`<mxCell id="${id}" edge="1" parent="1" source="${source}" target="${target}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#666666;strokeWidth=1.5;endArrow=none;${style}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
}

begin('wf-01-login','Login / เข้าสู่ระบบ','บัญชีจัดเตรียมโดย Admin · ไม่มีการสมัครบัญชีด้วยตนเอง · ข้อความผิดพลาดอยู่ในแบบฟอร์ม');
box(24,90,1312,718,'#f5f5f5');
box(445,168,470,561);
text('MyNetMate',479,198,402,36,'fontSize=27;fontStyle=1;align=center;');
text('Network Management',479,241,402,23,'align=center;fontSize=14;');
text('Sign in',479,294,402,30,'fontSize=22;fontStyle=1;');
field('Username or email',479,348,402);
field('Password',479,439,402,'••••••••');
button('Sign in',479,546,402,true);
cell('[ ข้อความแจ้งข้อผิดพลาด / กำลังตรวจสอบ / รอให้ลองใหม่ ]',479,608,402,63,'dashed=1;align=center;fontSize=14;');
finish();

begin('wf-02-dashboard','Dashboard / แนวทางข้อมูลสรุป','PROPOSED LAYOUT: หน้าปัจจุบันยังแสดง Dashboard is Empty · ช่องข้อมูลในภาพเป็นพื้นที่เสนอออกแบบ');
shell('Dashboard','Dashboard','แบบร่างเพิ่มเติมสำหรับภาพรวมเครือข่าย ไม่ใช่ผลการทำงานปัจจุบัน');
cell('PROPOSED · ข้อมูลสรุปและกิจกรรมล่าสุดยังต้องพัฒนา',276,199,1016,44,'fillColor=#eeeeee;fontStyle=1;');
for(const [i,v] of ['อุปกรณ์ทั้งหมด','ติดต่อได้','ติดต่อไม่ได้'].entries()) {
  const x=276+i*347;
  box(x,268,322,115);
  text(v,x+20,287,280,28);
  text('—',x+20,325,280,38,'fontSize=26;');
}
text('Recent activity / กิจกรรมล่าสุดที่อนุญาต',276,423,740,30,'fontSize=19;fontStyle=1;');
grid(276,467,[205,456,355],['เวลา','เหตุการณ์สรุป','ผลลัพธ์'],[
  ['[ เวลา ]','[ กิจกรรมที่อนุญาตให้แสดง ]','[ สำเร็จ / ไม่สำเร็จ ]'],
  ['[ เวลา ]','[ กิจกรรมที่อนุญาตให้แสดง ]','[ สำเร็จ / ไม่สำเร็จ ]'],
],57);
button('Go to Devices',276,691,170);
button('View Topology',465,691,170);
text('ยังไม่มีข้อมูล → แสดงข้อความแจ้ง ไม่แสดงตัวเลขสมมติ',276,751,1016,25,'fontSize=14;fontColor=#666666;');
finish();

begin('wf-03-device-inventory','Device Inventory / รายการอุปกรณ์','Management state เป็นสถานะการจัดการ · Reachability เป็นผลตรวจ SNMP · สิทธิ์ปุ่มต้องบังคับตามบทบาท');
shell('Devices','Device inventory','รายการอุปกรณ์ ข้อมูลการจัดการ และผลตรวจสถานะ · ข้อมูลทั้งหมดในภาพเป็นตัวอย่าง');
field('Search',276,204,360,'Hostname / Management IP');
field('Device type',655,204,220,'All types  v');
field('Reachability',894,204,220,'All states  v');
button('Clear',1134,233,158);
button('+ Add Device',276,304,163,true);
button('Network Discovery',454,304,189);
button('Check Status',658,304,155);
button('View Topology',828,304,167);
button('Refresh',1010,304,132);
grid(276,378,[155,172,115,168,165,241],['Hostname','Management IP','Type','Management','Reachability','Actions'],devices,64);
text('3 example devices',276,639,410,26,'fontSize=14;');
text('Details: ดูรายละเอียด · Check: ตรวจ SNMP · Edit: แก้ข้อมูลทะเบียนและ Management State',276,698,1016,30,'fontSize=14;fontColor=#555555;');
text('Admin / Operator: Check และ Edit · Viewer: ดูรายละเอียด · Refresh: โหลดรายการที่จัดเก็บไว้ใหม่',276,738,1016,30,'fontSize=14;fontColor=#555555;');
finish();

begin('wf-04-device-details','Device Details / แผงรายละเอียดอุปกรณ์','แผงรายละเอียดเปิดจาก Devices หรือ Topology · ไม่เปลี่ยนหน้าจอเป็นระบบใหม่');
deviceSkeleton();
box(695,185,617,598,'#ffffff','strokeColor=#444444;strokeWidth=2;');
text('LAB-R1',722,204,493,32,'fontSize=21;fontStyle=1;');
button('X',1253,202,34);
pill('Reachable',722,252,136);
button('View Topology',875,247,166);
button('Check Status',1057,247,181);
cell('Device Overview',722,311,250,40,'fillColor=#dddddd;fontStyle=1;align=center;');
cell('Interfaces',972,311,313,40,'align=center;');
grid(722,375,[179,384],['Field','Value'],[
  ['Management IP','192.0.2.10'],['Device type','Router'],['Management state','Active'],['Credential profile','LAB-PROFILE'],
],50);
text('แท็บ Interfaces: ชื่อ Interface / สถานะ / IP / รายละเอียด',722,651,563,53,'fontSize=14;');
finish();

begin('wf-05-add-device','Add Device / เพิ่มอุปกรณ์','เพิ่มข้อมูลอุปกรณ์ ไม่ใช่สั่งตั้งค่าอุปกรณ์จริง · ข้อมูล Credential แสดงเฉพาะชื่อหรือ ID ไม่แสดง Secret');
deviceSkeleton();
const add=modal('Add device',443,181,620,585);
field('Management IP',add.l,269,572,'192.0.2.10');
field('Credential Profile ID',add.l,354,572,'[ Profile UUID ]');
field('Environment',add.l,439,276,'Physical / Emulated  v');
field('Device role',add.l+296,439,276,'Access / Core / Other  v');
field('Notes (optional)',add.l,529,572,'[ หมายเหตุของอุปกรณ์ ]');
text('[ บริเวณข้อความแจ้งข้อผิดพลาด ]',add.l,617,572,27,'fontSize=14;fontColor=#666666;');
button('Cancel',add.l+266,693,132);
button('Add device',add.l+417,693,155,true);
finish();

begin('wf-13-edit-device','Edit Device / แก้ไขข้อมูลทะเบียนอุปกรณ์','Admin และ Operator เท่านั้น · Reachability เป็นผลตรวจ SNMP แบบอ่านอย่างเดียว · บันทึกข้อมูลภายใน MyNetMate');
deviceSkeleton();
const deviceEdit=modal('Edit device — LAB-R1',418,181,700,593);
text('Management IP (read-only)',deviceEdit.l,268,306,23,'fontSize=14;');
cell('192.0.2.10',deviceEdit.l,296,306,39,'fillColor=#eeeeee;fontColor=#555555;');
text('Reachability (read-only)',deviceEdit.l+326,268,326,23,'fontSize=14;');
cell('Reachable · ผลตรวจล่าสุด',deviceEdit.l+326,296,326,39,'fillColor=#eeeeee;fontColor=#555555;');
field('Site',deviceEdit.l,350,306,'LAB-SITE  v');
field('Credential Profile',deviceEdit.l+326,350,326,'LAB-PROFILE  v');
field('Device Group',deviceEdit.l,440,306,'LAB-GROUP  v');
field('Management State',deviceEdit.l+326,440,326,'Maintenance  v');
text('ค่าที่เลือกได้: Active / Unmanaged / Maintenance / Retired',deviceEdit.l,524,652,25,'fontSize=13;fontColor=#555555;');
field('Notes',deviceEdit.l,566,652,'ตรวจบำรุงรักษาอุปกรณ์ในห้องปฏิบัติการ');
text('[ พื้นที่แจ้งผลตรวจสอบข้อมูลหรือข้อผิดพลาด ]',deviceEdit.l,654,652,28,'fontSize=14;fontColor=#666666;');
button('Cancel',deviceEdit.l+312,704,140);
button('Save changes',deviceEdit.l+472,704,180,true);
finish();

begin('wf-06-network-discovery','Network Discovery / ค้นหาอุปกรณ์','ใช้เฉพาะ Lab ที่ได้รับอนุญาต · การสร้าง Credential Profile แยกจากการเลือก Profile มาใช้งาน');
deviceSkeleton();
const dis=modal('Network discovery',453,215,600,495);
field('Seed IP',dis.l,302,552,'192.0.2.10');
field('Credential Profile',dis.l,395,552,'LAB-PROFILE  v');
button('+ Add credential profile',dis.l,486,270);
text('หากไม่มี Profile: ให้ผู้มีสิทธิ์จัดเตรียมก่อนเริ่มค้นหา',dis.l,541,552,48,'fontSize=14;');
button('Cancel',dis.l+233,633,132);
button('Start Discovery',dis.l+385,633,167,true);
finish();

begin('wf-07-topology','Topology / แผนผังเครือข่าย','View mode อ่านข้อมูลที่จัดเก็บไว้ · Discovery mode เกิดเมื่อผู้ใช้สั่งค้นหา · เส้นเชื่อมในภาพเป็นข้อมูลตัวอย่าง');
shell('Topology','Network topology','การแสดงแผนผังจากข้อมูลทดสอบ — ไม่ใช่แผนผังเครือข่ายจริง');
button('Refresh data',276,201,160);
button('Fit view',453,201,130);
button('Zoom + / -',600,201,148);
pill('View mode',1132,207,160);
box(276,266,1016,452,'#fafafa');
const root=cell('LAB-R1\nRouter',705,303,170,70,'align=center;fillColor=#eeeeee;');
const s1=cell('LAB-SW1\nSwitch',472,444,172,70,'align=center;fillColor=#eeeeee;');
const s2=cell('LAB-SW2\nSwitch',936,444,172,70,'align=center;fillColor=#eeeeee;');
const h1=cell('Endpoint A',356,607,150,58,'align=center;');
const h2=cell('Endpoint B',596,607,150,58,'align=center;');
const h3=cell('Endpoint C',838,607,150,58,'align=center;');
const h4=cell('Endpoint D',1077,607,150,58,'align=center;');
edge(root,s1,'exitX=0.25;exitY=1;entryX=0.5;entryY=0;');
edge(root,s2,'exitX=0.75;exitY=1;entryX=0.5;entryY=0;');
edge(s1,h1,'exitX=0.25;exitY=1;entryX=0.5;entryY=0;');
edge(s1,h2,'exitX=0.75;exitY=1;entryX=0.5;entryY=0;');
edge(s2,h3,'exitX=0.25;exitY=1;entryX=0.5;entryY=0;');
edge(s2,h4,'exitX=0.75;exitY=1;entryX=0.5;entryY=0;');
text('เลือกอุปกรณ์ → เปิดแผง Device Details',276,748,1016,29,'fontSize=14;');
finish();

begin('wf-08-user-management','User Management / รายการผู้ใช้งาน','Admin เท่านั้น · เพิ่มบัญชี / เปลี่ยน Role / เปิด–ปิดบัญชี · ไม่แสดงปุ่มลบผู้ใช้');
shell('Users','User management','Manage account roles and status');
field('Account status',276,205,269,'All statuses  v');
button('+ Create user',1098,234,194,true);
grid(276,330,[200,267,170,168,211],['Username','Email','Role','Status','Actions'],[
  ['demo_admin','admin@example.test','Admin','Active','Edit'],
  ['demo_operator','operator@example.test','Operator','Active','Edit'],
  ['demo_viewer','viewer@example.test','Viewer','Inactive','Edit'],
],66);
text('Rows per page: 50     |     1–3 of 3     |     < Previous   Next >',276,603,1016,34,'fontSize=14;');
cell('[ Success / Error message ]',276,682,1016,49,'dashed=1;fontSize=14;');
finish();

begin('wf-09-create-user','Create User / เพิ่มบัญชีผู้ใช้งาน','Admin เป็นผู้สร้างบัญชี · กำหนด Role เริ่มต้น · แสดงข้อผิดพลาดหากชื่อผู้ใช้หรืออีเมลซ้ำ');
shell('Users','User management','หน้าต่างสร้างบัญชีเปิดทับรายการผู้ใช้');
const create=modal('Create user',443,185,620,589);
field('Username',create.l,273,572,'[ username ]');
field('Email (optional)',create.l,363,572,'user@example.test');
field('Initial password',create.l,453,572,'••••••••••••');
field('Role',create.l,543,572,'Viewer / Operator / Admin  v');
text('[ Validation / duplicate account message ]',create.l,632,572,30,'fontSize=14;');
button('Cancel',create.l+266,704,132);
button('Create user',create.l+417,704,155,true);
finish();

begin('wf-10-edit-user','Edit User / แก้ไขบทบาทและสถานะบัญชี','เปลี่ยน Role หรือปิดบัญชี → เพิกถอน Session เดิม · ป้องกันการทำให้ไม่เหลือ Admin ที่ใช้งานได้');
shell('Users','User management','แก้ไขบัญชีที่เลือกและยืนยันก่อนบันทึก');
const edit=modal('Edit demo_operator',453,207,600,529);
text('operator@example.test',edit.l,294,552,24,'fontSize=14;');
field('Role',edit.l,342,552,'Operator  v');
field('Account status',edit.l,436,552,'Active / Inactive  v');
cell('Confirm changes\nการเปลี่ยน Role หรือปิดบัญชีจะเพิกถอน Session เดิม',edit.l,543,552,76,'fillColor=#f2f2f2;fontSize=14;');
button('Cancel',edit.l+236,664,132);
button('Confirm changes',edit.l+386,664,166,true);
finish();

begin('wf-11-audit-history','Audit History / ประวัติเหตุการณ์','Admin เท่านั้น · อ่านอย่างเดียว · บันทึกเฉพาะเหตุการณ์ที่ระบบรองรับ ไม่ใช่ทุกการคลิก');
shell('Audit history','Audit history','System events and their outcomes');
field('Event',276,198,321,'All events  v');
field('Resource type',623,198,321,'All types  v');
field('Outcome',970,198,322,'All outcomes  v');
field('Actor ID (UUID)',276,286,321,'[ Actor UUID ]');
field('From',623,286,321,'[ Local date and time ]');
field('Until',970,286,322,'[ Local date and time ]');
button('Apply filters',276,382,161,true);
button('Clear filters',454,382,155);
grid(276,449,[166,212,166,179,122,171],['Time','Event','Actor','Resource','Outcome','Details'],[
  ['[ Local time ]','Login success','demo_admin','Authentication','Success','View details'],
  ['[ Local time ]','User updated','demo_admin','demo_operator','Success','View details'],
  ['[ Local time ]','Permission denied','demo_viewer','Authentication','Failed','View details'],
],63);
button('Load more',276,716,180);
text('ไม่พบรายการ → แสดง No events match these filters.',477,722,800,31,'fontSize=14;');
finish();

begin('wf-12-audit-details','Audit Event Details / รายละเอียดเหตุการณ์','อ่านอย่างเดียว · ไม่แสดง Password, Session Token หรือข้อมูลลับ · ไม่มีปุ่มแก้ไขหรือลบ');
shell('Audit history','Audit history','หน้าต่างรายละเอียดเปิดจากรายการเหตุการณ์');
const audit=modal('Event details',443,185,620,589);
text('ข้อมูลชื่อปัจจุบันอาจต่างจากชื่อ ณ เวลาที่เกิดเหตุการณ์',audit.l,270,572,48,'fontSize=14;');
grid(audit.l,335,[164,408],['Field','Value'],[
  ['Time','[ Local date and time ]'],['Event','User updated'],['Actor','demo_admin'],['Resource','demo_operator'],['Outcome','Success'],['Details','[ ข้อความรายละเอียดที่อนุญาต ]'],
],46);
button('Close',audit.l+417,704,155,true);
finish();

function wrap(s) { return `<diagram id="${s.id}" name="${esc(s.title)}">${s.model}</diagram>`; }
const mxFile = s => `<mxfile host="app.diagrams.net" type="device">${s.map(wrap).join('\n')}</mxfile>`;

(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'mynetmate-ui-wireframes.drawio'),mxFile(screens));
  let browser;
  try { browser = await chromium.launch({headless:true}); }
  catch { browser = await chromium.launch({headless:true,channel:'msedge'}); }
  const qa=[];
  try {
    const page=await browser.newPage({deviceScaleFactor:2});
    await page.route('**/*',route=>/^https:\/\/viewer\.diagrams\.net\//.test(route.request().url())?route.continue():route.abort());
    await page.setContent('<html><head><style>html,body{margin:0;background:#ffffff}#canvas{position:relative;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({url:'https://viewer.diagrams.net/js/viewer-static.min.js'});
    await page.setViewportSize({width:W,height:H});
    for(const s of screens) {
      fs.writeFileSync(path.join(OUT,s.id+'.drawio'),mxFile([s]));
      const result=await page.evaluate(({model,width,height})=>{
        if(window.taskGraph)window.taskGraph.destroy();
        const canvas=document.getElementById('canvas');canvas.innerHTML='';canvas.style.width=width+'px';canvas.style.height=height+'px';
        const graph=new Graph(canvas);graph.setEnabled(false);new mxCodec(mxUtils.parseXml(model)).decode(mxUtils.parseXml(model).documentElement,graph.getModel());graph.view.validate();window.taskGraph=graph;
        const errors=[],labels=[];
        for(const c of Object.values(graph.model.cells)) {
          if(!c.vertex)continue;
          const g=c.geometry;
          if(g.x<0||g.y<0||g.x+g.width>width||g.y+g.height>height)errors.push({id:c.id,reason:'outside-page'});
          if(!c.value)continue;
          const state=graph.view.getState(c),b=state?.text?.boundingBox;
          if(b&&(b.width>g.width+3||b.height>g.height+3))errors.push({id:c.id,value:c.value,reason:'label-overflow',width:b.width,height:b.height,allocated:[g.width,g.height]});
          if(b)labels.push({id:c.id,value:c.value,x:b.x,y:b.y,w:b.width,h:b.height});
        }
        for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
          const a=labels[i],b=labels[j];
          if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>3&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>3)errors.push({ids:[a.id,b.id],reason:'overlapping-labels'});
        }
        return{cells:Object.keys(graph.model.cells).length,labels:labels.length,errors};
      },s);
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:path.join(OUT,s.id+'.png'),fullPage:true});
      const svg=await page.evaluate(()=>new XMLSerializer().serializeToString(window.taskGraph.getSvg('#ffffff',1,0)));
      fs.writeFileSync(path.join(OUT,s.id+'.svg'),svg);
      qa.push({id:s.id,title:s.title,width:W,height:H,...result});
    }
    const tiles=screens.map(s=>`<div class="tile"><h2>${esc(s.title)}</h2><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT,s.id+'.png')).toString('base64')}"/></div>`).join('');
    await page.setViewportSize({width:1560,height:1600});
    await page.setContent(`<html><head><style>body{margin:0;padding:28px;font-family:Tahoma;background:#ffffff;color:#252525}h1{font-size:26px;margin:0 0 8px}p{font-size:15px;margin:0 0 22px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.tile{border:1px solid #cccccc;padding:10px}h2{font-size:14px;font-weight:400;margin:0 0 8px}.tile img{width:100%;display:block}</style></head><body><h1>MyNetMate · Editable UI Wireframes</h1><p>${screens.length} screens · Network Management · low-fidelity / sample data · Dashboard is proposed</p><div class="grid">${tiles}</div></body></html>`);
    await page.screenshot({path:path.join(OUT,'wireframes-overview.png'),fullPage:true});
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(OUT,'render-qa.json'),JSON.stringify(qa,null,2));
  process.stdout.write(JSON.stringify(qa));
  if(qa.some(q=>q.errors.length))process.exitCode=1;
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1;});
