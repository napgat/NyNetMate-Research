const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

// Every element is a native, editable Draw.io cell. Previews decode the same XML.
// This script generates a design artifact only; it never contacts network devices.
const OUT = __dirname, W = 1512, H = 1272;
const C = {
  bg:'#f8fafc', paper:'#ffffff', ink:'#0f172a', body:'#334155', muted:'#64748b',
  border:'#e2e8f0', blue:'#0284c7', blueInk:'#0369a1', blueSoft:'#e0f2fe',
  red:'#b91c1c', redSoft:'#fef2f2', amber:'#92400e', amberSoft:'#fffbeb',
  green:'#166534', greenSoft:'#f0fdf4', gray:'#475569', graySoft:'#f1f5f9',
};
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const label = s => esc(String(s).split('\n').map(esc).join('<br>'));
const cells = [];
let serial = 0;
function cell(v,x,y,w,h,style='') {
  const id = 'p2-' + ++serial;
  cells.push(`<mxCell id="${id}" value="${label(v)}" vertex="1" parent="1" style="html=1;whiteSpace=wrap;fontFamily=Segoe UI;fontSize=15;fontColor=${C.ink};fillColor=none;strokeColor=none;align=left;verticalAlign=middle;spacing=0;${style}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
  return id;
}
const text = (v,x,y,w,h=24,size=15,color=C.ink,bold=false,extra='') => cell(v,x,y,w,h,`text;fontSize=${size};fontColor=${color};fontStyle=${bold?1:0};${extra}`);
const rect = (x,y,w,h,fill=C.paper,stroke=C.border,radius=12,extra='') => cell('',x,y,w,h,`fillColor=${fill};strokeColor=${stroke};rounded=${radius?1:0};absoluteArcSize=1;arcSize=${radius};${extra}`);
const line = (x,y,w,color=C.border) => rect(x,y,w,1,color,'none',0);
const pill = (v,x,y,w,kind='gray',h=27) => cell(v,x,y,w,h,`fillColor=${C[kind+'Soft']};fontColor=${kind==='blue'?C.blueInk:C[kind]};rounded=1;absoluteArcSize=1;arcSize=8;align=center;fontSize=12;fontStyle=1;spacing=3;`);
const button = (v,x,y,w=180,primary=false,h=40) => cell(v,x,y,w,h,`fillColor=${primary?C.blue:C.paper};strokeColor=${primary?'none':C.border};fontColor=${primary?C.paper:C.body};rounded=1;absoluteArcSize=1;arcSize=8;align=center;spacing=8;fontStyle=1;fontSize=14;`);
const circle = (x,y,d,fill,stroke='none') => cell('',x,y,d,d,`shape=ellipse;fillColor=${fill};strokeColor=${stroke};`);
function navIcon(kind,x,y,active=false) {
  const color = active ? C.blueInk : C.muted;
  if(kind==='dashboard') {
    for(const dx of [0,10]) for(const dy of [0,10]) rect(x+dx,y+dy,7,7,'none',color,2);
  } else if(kind==='devices') {
    rect(x,y,19,7,'none',color,2); rect(x,y+11,19,7,'none',color,2);
    circle(x+3,y+2,2,color); circle(x+3,y+13,2,color);
  } else if(kind==='topology') {
    line(x+4,y+10,12,color);rect(x+9,y+3,1,10,color,'none',0);
    circle(x+6,y,7,C.paper,color); circle(x,y+12,7,C.paper,color);circle(x+13,y+12,7,C.paper,color);
  } else if(kind==='users') {
    circle(x+6,y,9,'none',color);rect(x+2,y+12,18,9,'none',color,6);
  } else {
    rect(x+2,y,16,20,'none',color,2);
    for(const dy of [5,10,15]) line(x+5,y+dy,10,color);
  }
}

// Product shell: existing MyNetMate blue palette, not a new application implementation.
rect(0,0,W,H,C.bg,'none',0);
rect(0,0,224,H,C.paper,'none',0);rect(223,0,1,H,C.border,'none',0);
rect(0,0,224,72,C.paper,'none',0);
rect(24,23,30,30,C.blue,'none',8);
circle(31,29,6,C.paper);circle(42,29,6,C.paper);circle(37,41,6,C.paper);
text('MyNetMate',66,21,142,29,20,C.ink,true);
text('NETWORK MANAGEMENT',24,91,190,21,11,C.muted,true);
const nav = [
  ['Dashboard','dashboard'],['Devices','devices'],['Topology','topology'],
  ['Users','users'],['Audit history','audit'],
];
nav.forEach(([v,kind],i)=>{
  const y=137+i*52;
  if(i===0)rect(12,y,199,44,C.blueSoft,'none',8);
  navIcon(kind,28,y+12,i===0);
  text(v,64,y+7,133,30,15,i===0?C.blueInk:C.body,i===0);
});
text('LAB ENVIRONMENT',24,454,183,23,11,C.muted,true);
rect(18,491,188,145,C.bg,C.border,10);
pill('READ-ONLY',33,507,107,'blue');
text('Manual collection',33,546,158,24,14,C.ink,true);
text('Registered devices only\nInside the lab allowlist',33,578,159,43,12,C.muted);
line(20,1150,183);
circle(24,1172,35,C.blueSoft);
text('NA',24,1174,35,31,13,C.blueInk,true,'align=center;');
text('demo_admin',72,1167,132,26,14,C.ink,true);
text('Administrator',72,1194,132,22,12,C.muted);
text('Sign out',24,1231,180,22,13,C.muted);

rect(224,0,1288,72,C.paper,'none',0);line(224,71,1288);
text('Workspace  /  Lab HQ',256,24,460,25,14,C.muted);
pill('P2 · DESIGN PREVIEW',1268,23,212,'blue',28);
text('Operational Dashboard',256,98,780,41,30,C.ink,true);
text('ตรวจปัญหาเครือข่ายจากข้อมูลที่เก็บล่าสุด · ไม่ใช่การเฝ้าตรวจแบบ Real-time',256,143,960,26,15,C.muted);
pill('SAMPLE DATA',1356,111,124,'gray',27);

rect(256,187,1224,68,C.paper,C.border,10);
text('Site',276,203,42,33,13,C.muted);
button('Lab HQ  ▾',326,201,173,false,38);
text('Latest attempt: 10:06',531,198,264,24,14,C.ink,true);
text('08 Oct 2026 · Asia/Bangkok',531,224,280,19,12,C.muted);
text('Choose targets below',900,203,278,21,13,C.muted);
text('Read-only · 3 selected',900,225,278,20,12,C.blueInk,true);
button('↻  Refresh selected',1222,200,237,true,42);

text('NETWORK OVERVIEW',256,277,400,20,11,C.muted,true);
text('4 devices · 2 reachable · 1 unreachable · 1 unknown',874,275,606,25,13,C.muted,false,'align=right;');
const metrics = [
  ['Unreachable','1','Cannot reach management','red'],
  ['Collection failed','1','Latest attempt unsuccessful','amber'],
  ['Stale snapshots','1','Last known state only','amber'],
  ['Critical problems','4','From fresh operational evidence','red'],
];
metrics.forEach(([name,value,note,kind],i)=>{
  const x=256+i*310;
  rect(x,310,294,116,C.paper,C.border,12);
  text(name,x+19,324,256,26,15,C.body,true);
  text(value,x+19,354,150,43,34,C[kind],true);
  text(note,x+19,399,263,19,12,C.muted);
  pill('VIEW →',x+203,363,70,'gray',25);
});
text('Counts overlap: a device can be unreachable, failed and stale at the same time.',256,433,1150,20,12,C.muted);

// Current operational problems: compare configured expected state, not invented root causes.
function problemPanel(x,title,sub,rows) {
  rect(x,470,604,210,C.paper,C.border,12);
  text(title,x+20,485,445,26,18,C.ink,true);
  pill('2 CRITICAL',x+478,486,106,'red');
  text(sub,x+20,516,560,19,12,C.muted);
  line(x+20,548,564);
  rows.forEach(([name,detail],i)=>{
    const y=558+i*57;
    circle(x+20,y+8,20,C.redSoft);
    text('!',x+20,y+7,20,22,13,C.red,true,'align=center;');
    text(name,x+52,y,477,25,15,C.ink,true);
    text(detail,x+52,y+27,475,21,12,C.muted);
    text('→',x+552,y+13,32,25,20,C.blueInk,false,'align=center;');
  });
}
problemPanel(256,'Switch operations','CORE-SW · snapshot 10:04 · expected state configured',[
  ['Critical uplink down','Gi0/24 · Expected Up → Actual Down'],
  ['Err-disabled port','Gi0/12 · Critical interface · Actual Err-disabled'],
]);
problemPanel(876,'Router operations','EDGE-R1 · snapshot 10:04 · expected state configured',[
  ['Critical WAN down','Gi0/1 · Expected Up → Actual Down'],
  ['Expected default route missing','EDGE-R1 · Expected present → Actual absent'],
]);

// A compact device summary, not an all-interface / all-route table.
rect(256,702,1224,275,C.paper,C.border,12);
text('Collection & data freshness',276,716,690,29,18,C.ink,true);
text('Latest collection result is separate from management reachability.',276,748,830,21,12,C.muted);
text('Device inventory →',1236,720,224,23,13,C.blueInk,true,'align=right;');
rect(276,787,1184,30,C.bg,'none',0);
const headers = [['Device',316,208],['Reachability',556,156],['Latest attempt',736,152],['Last success',932,143],['Freshness',1108,150],['Action',1340,97]];
headers.forEach(([v,x,w])=>text(v,x,791,w,21,12,C.muted,true));
rect(282,795,15,15,C.paper,C.border,3);
const states = [
  ['CORE-SW','Switch',true,'Reachable','green','Success','green','10:04','10:04','Fresh','green','Details →'],
  ['EDGE-R1','Router',true,'Reachable','green','Success','green','10:04','10:04','Fresh','green','Details →'],
  ['FLOOR2-SW','Switch',true,'Unreachable','red','Failed','amber','10:06','09:12','Stale · Last known','amber','Details →'],
  ['LAB-SW3','Switch',false,'Unknown','gray','Never collected','gray','—','—','Unknown','gray','Details →'],
];
states.forEach((d,i)=>{
  const [name,type,checked,reach,rk,attempt,ak,at,success,fresh,fk,action]=d;
  const y=823+i*36;
  if(i===2)rect(276,y-2,1184,36,C.amberSoft,'none',0);
  rect(282,y+6,15,15,checked?C.blue:C.paper,checked?'none':C.border,3);
  if(checked)text('✓',282,y+3,15,20,12,C.paper,true,'align=center;');
  text(name,316,y,157,29,13,C.ink,true);
  text(type,478,y+2,68,26,12,C.muted);
  pill(reach,556,y+2,147,rk,27);
  pill(attempt,736,y+2,145,ak,27);
  text(at,889,y+4,40,24,12,C.muted);
  text(success,932,y+3,130,27,13,C.body);
  pill(fresh,1108,y+2,184,fk,27);
  text(action,1340,y+3,114,27,13,C.blueInk,true);
});

// Linked summaries owned by other features, kept apart from network problems.
rect(256,1000,360,198,C.paper,C.border,12);
text('Security summary',276,1015,318,28,17,C.ink,true);
pill('FROM CIS VALIDATION',276,1052,176,'gray',25);
text('2',276,1090,70,43,31,C.red,true);
text('Critical findings',350,1097,235,29,14,C.body);
text('Last scan: 09:45 · 1 device',276,1140,317,24,12,C.muted);
text('Separate from operational problems',276,1170,317,20,12,C.muted);

rect(632,1000,360,198,C.paper,C.border,12);
text('MyNetMate system health',652,1015,316,28,17,C.ink,true);
[['Backend','Ready','green'],['Database','Ready','green'],['Offline mode','On · intentional','gray']].forEach(([v,s,k],i)=>{
  const y=1061+i*39;
  text(v,652,y,139,26,13,C.body);
  pill(s,804,y,166,k,27);
});
text('Application health ≠ network health',652,1170,318,20,12,C.muted);

rect(1008,1000,472,198,C.paper,C.border,12);
text('Recent activity',1028,1015,316,28,17,C.ink,true);
text('Audit →',1370,1018,90,24,13,C.blueInk,true,'align=right;');
const events=[
  ['10:06','demo_admin','Refreshed 3 devices · 1 failed'],
  ['09:58','demo_admin','Updated device notes'],
  ['09:52','demo_operator','Signed in successfully'],
];
events.forEach(([t,actor,action],i)=>{
  const y=1054+i*37;
  text(t,1028,y,61,26,12,C.muted);
  text(actor,1098,y,151,26,12,C.body,true);
  text(action,1255,y,205,29,12,C.muted);
});
text('Activity is context, not proof of root cause.',1028,1170,431,20,12,C.muted);

text('QUICK ACTIONS',256,1221,161,24,11,C.muted,true);
button('Open Devices',432,1213,171,false,39);
button('View Topology',619,1213,171,false,39);
button('View Audit History',806,1213,183,false,39);
text('Proposed P2 UI · sample data only',1020,1220,460,24,12,C.muted,false,'align=right;');

const model=`<mxGraphModel page="1" pageScale="1" pageWidth="${W}" pageHeight="${H}" background="${C.bg}" grid="1" gridSize="8" guides="1" connect="1" arrows="1"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('\n')}</root></mxGraphModel>`;
const xml=`<mxfile host="app.diagrams.net" type="device"><diagram id="p2-operational-dashboard" name="P2 Operational Dashboard">${model}</diagram></mxfile>`;

(async()=>{
  fs.writeFileSync(path.join(OUT,'dashboard-p2.drawio'),xml);
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
    // Only load the renderer code. The editable design is decoded locally, not uploaded.
    await page.route('**/*',r=>/^https:\/\/viewer\.diagrams\.net\//.test(r.request().url())?r.continue():r.abort());
    await page.setContent(`<html><head><style>html,body{margin:0;background:${C.bg}}#canvas{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>`);
    await page.addScriptTag({url:'https://viewer.diagrams.net/js/viewer-static.min.js'});
    await page.evaluate(model=>{
      const doc=mxUtils.parseXml(model);
      const graph=new Graph(document.getElementById('canvas'));
      graph.setEnabled(false);
      new mxCodec(doc).decode(doc.documentElement,graph.getModel());
      graph.view.validate();window.dashboardGraph=graph;
    },model);
    await page.evaluate(()=>document.fonts.ready);
    const qa=await page.evaluate(({W,H})=>{
      const graph=window.dashboardGraph, errors=[], labels=[];
      for(const c of Object.values(graph.model.cells)) {
        if(!c.vertex)continue;
        const g=c.geometry;
        if(g.x<0||g.y<0||g.x+g.width>W||g.y+g.height>H)errors.push({id:c.id,reason:'outside-page'});
        if(!c.value)continue;
        const b=graph.view.getState(c)?.text?.boundingBox;
        if(b&&(b.width>g.width+3||b.height>g.height+3))errors.push({id:c.id,value:c.value,reason:'label-overflow',measured:[b.width,b.height],allocated:[g.width,g.height]});
        if(b)labels.push({id:c.id,value:c.value,x:b.x,y:b.y,w:b.width,h:b.height});
      }
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
        const a=labels[i],b=labels[j];
        if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>3&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>3)errors.push({ids:[a.id,b.id],values:[a.value,b.value],reason:'overlapping-labels'});
      }
      return{width:W,height:H,nativeCells:Object.keys(graph.model.cells).length-2,labels:labels.length,errors};
    },{W,H});
    await page.screenshot({path:path.join(OUT,'dashboard-p2.png'),fullPage:true});
    const svg=await page.evaluate(()=>new XMLSerializer().serializeToString(window.dashboardGraph.getSvg('#f8fafc',1,0)));
    fs.writeFileSync(path.join(OUT,'dashboard-p2.svg'),svg);
    fs.writeFileSync(path.join(OUT,'render-qa.json'),JSON.stringify(qa,null,2));
    process.stdout.write(JSON.stringify(qa));
    if(qa.errors.length)process.exitCode=1;
  } finally {await browser.close();}
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1;});
