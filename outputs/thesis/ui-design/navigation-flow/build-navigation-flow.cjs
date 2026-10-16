const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

// Native editable cells. This is a screen map, not a backend activity diagram.
const W=1400,H=900,OUT=__dirname,cells=[];
let serial=0;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const label=s=>esc(String(s).split('\n').map(esc).join('<br>'));
function vertex(v,x,y,w,h,style='') {
  const id='nav'+ ++serial;
  cells.push(`<mxCell id="${id}" value="${label(v)}" vertex="1" parent="1" style="html=1;whiteSpace=wrap;fontFamily=Tahoma;fontSize=17;fontColor=#1e293b;fillColor=#ffffff;strokeColor=#94a3b8;rounded=1;absoluteArcSize=1;arcSize=10;align=center;verticalAlign=middle;spacing=6;${style}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
  return id;
}
const text=(v,x,y,w,h=24,style='')=>vertex(v,x,y,w,h,'text;fillColor=none;strokeColor=none;align=left;spacing=0;fontSize=14;'+style);
const screen=(v,x,y)=>vertex(v,x,y,264,68,'fillColor=#f1f5f9;fontStyle=1;');
const overlay=(v,x,y)=>vertex(v,x,y,264,70,'dashed=1;fontSize=16;');
function edge(a,b,points=[],style='') {
  const id='nav'+ ++serial;
  const waypoints=points.length?`<Array as="points">${points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:'';
  cells.push(`<mxCell id="${id}" edge="1" parent="1" source="${a}" target="${b}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#64748b;strokeWidth=1.5;endArrow=block;endFill=1;${style}"><mxGeometry relative="1" as="geometry">${waypoints}</mxGeometry></mxCell>`);
}

text('Navigation Flow — MyNetMate',32,22,1250,35,'fontSize=25;fontStyle=1;');
text('แสดงการเปลี่ยนหน้าจอและการเปิดหน้าต่างเท่านั้น · ไม่แสดง API หรือฐานข้อมูล',32,63,1300,25,'fontColor=#64748b;');
const login=screen('Login\nAdmin · Operator · Viewer',568,106);
const home=screen('Dashboard\nหน้าหลักหลังเข้าสู่ระบบ',568,228);
edge(login,home,[],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
text('เข้าสู่ระบบสำเร็จ',734,184,295,24,'fontSize=13;fontColor=#64748b;');
const junction=vertex('',697,336,6,6,'shape=ellipse;fillColor=#64748b;strokeColor=none;');
edge(home,junction,[],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;endArrow=none;');

text('หน้าสำหรับเรียกดูข้อมูลตามสิทธิ์ของผู้ใช้',40,363,638,25,'fontSize=13;fontColor=#64748b;');
text('เมนูเฉพาะ Admin',740,363,608,25,'fontSize=13;fontStyle=1;fontColor=#475569;');
const devices=screen('Device Inventory\nรายการอุปกรณ์',40,405);
const topology=screen('Topology\nแผนผังเครือข่าย',390,405);
const users=screen('User Management\nจัดการบัญชีผู้ใช้',740,405);
const audit=screen('Audit History\nประวัติเหตุการณ์',1090,405);
for(const [target,x] of [[devices,172],[topology,522],[users,872],[audit,1222]]) {
  edge(junction,target,[[x,339]],'exitX=0.5;exitY=0.5;entryX=0.5;entryY=0;');
}

const deviceDetail=overlay('Device Details\nDrawer · รายละเอียดอุปกรณ์',40,517);
const addDevice=overlay('Add Device\nDialog · ผู้มีสิทธิ์จัดการ',40,619);
const discovery=overlay('Network Discovery\nDialog · ผู้มีสิทธิ์ค้นหา',40,721);
for(const [target,y] of [[deviceDetail,552],[addDevice,654],[discovery,756]]) {
  edge(devices,target,[[20,439],[20,y]],'exitX=0;exitY=0.5;entryX=0;entryY=0.5;');
}
const topologyDetail=overlay('Device Details\nDrawer · เมื่อเลือกอุปกรณ์',390,517);
edge(topology,topologyDetail,[],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
edge(discovery,topology,[[350,756],[350,439]],'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
text('เมื่อเริ่มค้นหา → เปิดหน้า Topology',40,796,640,23,'fontSize=13;fontColor=#64748b;');

const create=overlay('Create User\nDialog · สร้างบัญชี',740,517);
const edit=overlay('Edit User\nDialog · เปลี่ยน Role / สถานะ',740,619);
for(const [target,y] of [[create,552],[edit,654]]) {
  edge(users,target,[[720,439],[720,y]],'exitX=0;exitY=0.5;entryX=0;entryY=0.5;');
}
const auditDetail=overlay('Audit Event Details\nDialog · อ่านอย่างเดียว',1090,517);
edge(audit,auditDetail,[],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
text('กรอบเส้นทึบ = หน้าหลัก   |   กรอบเส้นประ = Dialog / Drawer ที่เปิดทับหน้าเดิม',32,849,1325,26,'fontSize=14;fontColor=#475569;');

const model=`<mxGraphModel page="1" pageScale="1" pageWidth="${W}" pageHeight="${H}" background="#ffffff" grid="1" gridSize="10" guides="1"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('\n')}</root></mxGraphModel>`;
const xml=`<mxfile host="app.diagrams.net" type="device"><diagram id="navigation-flow" name="MyNetMate Navigation Flow">${model}</diagram></mxfile>`;

(async()=>{
  fs.writeFileSync(path.join(OUT,'navigation-flow.drawio'),xml);
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
    await page.route('**/*',r=>/^https:\/\/viewer\.diagrams\.net\//.test(r.request().url())?r.continue():r.abort());
    await page.setContent(`<html><head><style>html,body{margin:0;background:white}#canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>`);
    await page.addScriptTag({url:'https://viewer.diagrams.net/js/viewer-static.min.js'});
    await page.evaluate(model=>{
      const doc=mxUtils.parseXml(model),graph=new Graph(document.getElementById('canvas'));
      graph.setEnabled(false);new mxCodec(doc).decode(doc.documentElement,graph.getModel());graph.view.validate();window.navGraph=graph;
    },model);
    await page.evaluate(()=>document.fonts.ready);
    const qa=await page.evaluate(({W,H})=>{
      const graph=window.navGraph,labels=[],errors=[];
      for(const c of Object.values(graph.model.cells)) {
        if(!c.vertex)continue;
        const g=c.geometry,b=graph.view.getState(c)?.text?.boundingBox;
        if(g.x<0||g.y<0||g.x+g.width>W||g.y+g.height>H)errors.push({id:c.id,reason:'outside-page'});
        if(!c.value)continue;
        if(b&&(b.width>g.width+3||b.height>g.height+3))errors.push({id:c.id,value:c.value,reason:'label-overflow'});
        if(b)labels.push({id:c.id,x:b.x,y:b.y,w:b.width,h:b.height});
      }
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
        const a=labels[i],b=labels[j];
        if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>3&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>3)errors.push({ids:[a.id,b.id],reason:'overlapping-labels'});
      }
      return{width:W,height:H,labels:labels.length,errors};
    },{W,H});
    await page.screenshot({path:path.join(OUT,'navigation-flow.png'),fullPage:true});
    fs.writeFileSync(path.join(OUT,'navigation-flow.svg'),await page.evaluate(()=>new XMLSerializer().serializeToString(window.navGraph.getSvg('#ffffff',1,0))));
    fs.writeFileSync(path.join(OUT,'render-qa.json'),JSON.stringify(qa,null,2));
    process.stdout.write(JSON.stringify(qa));if(qa.errors.length)process.exitCode=1;
  } finally {await browser.close();}
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1;});
