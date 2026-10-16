const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { marked } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = __dirname;
const root = path.resolve(out, '../../..');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const copies = [];
for (const dir of ['images','editable','evidence']) fs.mkdirSync(path.join(out,dir), {recursive:true});
function copy(source, folder, dest=path.basename(source)) {
  const original = path.join(root, source), target = path.join(out, folder, dest);
  fs.copyFileSync(original, target);
  copies.push({original, target, identical:hash(original)===hash(target), sha256:hash(target)});
}
for (const name of ['fig-3-6-login','fig-3-13-user-management','fig-3-14-audit-history']) {
  copy(`outputs/thesis/sequence-diagram/naphat/${name}.png`, 'images');
  for (const ext of ['drawio','puml']) copy(`outputs/thesis/sequence-diagram/naphat/${name}.${ext}`, 'editable');
}
for (const ext of ['png','svg']) copy(`outputs/thesis/component-diagram/network-management-components.${ext}`, 'images');
copy('outputs/thesis/component-diagram/network-management-components.puml', 'editable');
copy('outputs/thesis/er-diagram/fig-3-15-mynetmate-er.png','images');
for (const name of ['fig-3-15-mynetmate-er','fig-3-16-users','fig-3-17-auth-sessions','fig-3-18-audit-logs']) copy(`outputs/thesis/er-diagram/${name}.drawio`,'editable');
copy('outputs/thesis/ui-design/navigation-flow/navigation-flow.png','images');
for (const ext of ['drawio','mmd']) copy(`outputs/thesis/ui-design/navigation-flow/navigation-flow.${ext}`,'editable');
copy('outputs/thesis/ui-design/p2-operational-monitoring/dashboard-p2.png','images');
copy('outputs/thesis/ui-design/p2-operational-monitoring/dashboard-p2.drawio','editable');
copy('outputs/thesis/System Architecture/System Diagram.drawio','editable','system-architecture-original.drawio');

const nodes = [
 {id:'title',x:40,y:28,w:1340,h:38,fill:'none',stroke:'none',size:27,bold:true,lines:['MyNetMate — ตำแหน่งงานของนภัทรและจุดเชื่อมของระบบ']},
 {id:'subtitle',x:40,y:76,w:1340,h:28,fill:'none',stroke:'none',size:17,lines:['ภาพสรุปเพิ่มเติมจากแบบและโค้ด ณ 9 ตุลาคม 2569 • ไม่ใช่หลักฐาน Deploy หรือ End-to-End']},
 {id:'browser',x:40,y:135,w:1340,h:112,fill:'#ffffff',stroke:'#94a3b8',size:21,lines:['ผู้ใช้ → Browser / Frontend','นภัทร: Login · My Account · Users · Audit UI   |   Devices / Topology: บริบทของทีม   |   Dashboard: Placeholder']},
 {id:'backend',x:40,y:312,w:1340,h:360,fill:'#f8fafc',stroke:'#cbd5e1',size:19,lines:['Backend API / Service'],frame:true,textX:1080},
 {id:'naphat',x:65,y:374,w:404,h:217,fill:'#e0f2fe',stroke:'#0284c7',size:19,bold:false,lines:['พัฒนาแล้ว — นภัทร','Authentication / Session / RBAC foundation','Admin User Management','Audit Writer + Audit Read API','Guard บังคับใช้กับ Users / Audit แล้ว']},
 {id:'team',x:506,y:374,w:404,h:217,fill:'#f1f5f9',stroke:'#64748b',size:19,lines:['บริบทงานสมาชิกผู้รับผิดชอบ','Device Inventory / Credential','Discovery / Read-only Collection','Topology จากข้อมูลที่จัดเก็บ','ไม่อ้างเป็น Implementation ของนภัทร']},
 {id:'dashboard',x:947,y:374,w:404,h:217,fill:'#fffbeb',stroke:'#d97706',size:19,dashed:true,lines:['ออกแบบ / แผน — นภัทร','Dashboard P1 → Operational P2','อ่าน Inventory + Activity ที่อนุญาต','และ System Health ตาม Contract','P2: Manual Refresh หลัง P1 เสถียร']},
 {id:'gap',x:65,y:616,w:1286,h:34,fill:'#f8fafc',stroke:'none',size:17,lines:['จุดที่ต้องเชื่อมต่อ: Guard / Audit ของ API อุปกรณ์ยังไม่ครบ • ไม่รับรอง RBAC ทั้งระบบจากหน้าเว็บเพียงอย่างเดียว']},
 {id:'db-auth',x:65,y:742,w:404,h:116,fill:'#e0f2fe',stroke:'#0284c7',size:20,lines:['PostgreSQL: โมเดลส่วนบัญชี / ประวัติ','users · auth_sessions · audit_logs','มี Schema / Migration; PG Test ยังเหลือ']},
 {id:'db-team',x:506,y:742,w:404,h:116,fill:'#f1f5f9',stroke:'#64748b',size:20,lines:['PostgreSQL: Inventory / Evidence','อุปกรณ์ · ผล Collection · Neighbor','ข้อมูลนี้เป็นบริบทของงานเพื่อน']},
 {id:'p2note',x:947,y:742,w:404,h:116,fill:'#fffbeb',stroke:'#d97706',size:19,dashed:true,lines:['P2 ยังไม่ Implement / ไม่ใช่ Real-time','อ่านอุปกรณ์ลงทะเบียนใน Isolated Lab','เวลา / Freshness / Expected State ต้องตกลง']},
 {id:'legend',x:40,y:910,w:1340,h:54,fill:'none',stroke:'none',size:17,lines:['สีน้ำเงิน: โค้ดงานนภัทร   •   สีเทา: จุดเชื่อมของทีม   •   เส้นประ: แบบ / แผน','เส้นทึบแสดงเส้นทางที่พบในโค้ด ไม่เท่ากับผลทดสอบระบบจริง; ภาพย่อไม่แสดง Infrastructure ทุกกล่อง']},
];
const edges = [
 {id:'auth-api',from:'browser',to:'naphat',x1:267,y1:247,x2:267,y2:374,label:'Auth / Admin / Audit API',ly:287},
 {id:'device-api',from:'browser',to:'team',x1:708,y1:247,x2:708,y2:374,label:'Device / Discovery API',ly:287},
 {id:'auth-db',from:'naphat',to:'db-auth',x1:267,y1:591,x2:267,y2:742},
 {id:'team-db',from:'team',to:'db-team',x1:708,y1:591,x2:708,y2:742},
];
const svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1420" height="980" viewBox="0 0 1420 980"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#475569"/></marker></defs><rect width="1420" height="980" fill="white"/>'];
for (const n of nodes.filter(n=>n.frame)) svg.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" fill="${n.fill}" stroke="${n.stroke}"/>`);
for(const e of edges) {
 svg.push(`<path d="M${e.x1},${e.y1} L${e.x2},${e.y2}" stroke="#475569" stroke-width="2" fill="none" marker-end="url(#arrow)"/>`);
 if(e.label) svg.push(`<rect x="${e.x1-170}" y="${e.ly-20}" width="340" height="29" fill="white"/><text x="${e.x1}" y="${e.ly}" text-anchor="middle" font-family="Tahoma,Arial,sans-serif" font-size="17" fill="#475569">${esc(e.label)}</text>`);
}
for (const n of nodes) {
 if(!n.frame && (n.stroke!=='none'||n.fill!=='none')) svg.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2" ${n.dashed?'stroke-dasharray="8 5"':''}/>`);
 const top=n.frame?n.y+31:n.stroke==='none'?n.y+n.size:n.y+33;
 svg.push(`<g id="${n.id}" font-family="Tahoma,Arial,sans-serif" fill="#0f172a" font-size="${n.size}">`);
 n.lines.forEach((line,i)=>svg.push(`<text x="${n.textX||n.x+(n.stroke==='none'?0:18)}" y="${top+i*35}" ${i===0||n.bold?'font-weight="700"':''}>${esc(line)}</text>`));
 svg.push('</g>');
}
svg.push('</svg>');
fs.writeFileSync(path.join(out,'images/overview-naphat.svg'),svg.join('\n'));
const cells=['<mxCell id="0"/><mxCell id="1" parent="0"/>'];
for(const n of nodes){
 const label=n.lines.map((s,i)=>`<div style="line-height:${n.stroke==='none'?'1.3':'1.7'};${i===0?'font-weight:bold;':''}">${esc(s)}</div>`).join('');
 cells.push(`<mxCell id="${n.id}" parent="1" vertex="1" value="${esc(label)}" style="rounded=1;arcSize=8;whiteSpace=wrap;html=1;align=${n.frame?'right':'left'};verticalAlign=top;spacingRight=20;spacingLeft=18;spacingTop=10;fontFamily=Tahoma;fontSize=${n.size};fillColor=${n.fill};strokeColor=${n.stroke};${n.dashed?'dashed=1;':''}${n.stroke==='none'?'text;spacingLeft=0;spacingTop=0;':''}"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>`);
}
for(const e of edges) cells.push(`<mxCell id="${e.id}" parent="1" edge="1" value="${esc(e.label||'')}" style="endArrow=block;html=1;fontFamily=Tahoma;fontSize=17;strokeColor=#475569;labelBackgroundColor=#ffffff;"><mxGeometry relative="1" as="geometry"><mxPoint x="${e.x1}" y="${e.y1}" as="sourcePoint"/><mxPoint x="${e.x2}" y="${e.y2}" as="targetPoint"/></mxGeometry></mxCell>`);
fs.writeFileSync(path.join(out,'editable/overview-naphat.drawio'),`<mxfile host="app.diagrams.net"><diagram name="Naphat scope summary"><mxGraphModel page="1" pageWidth="1420" pageHeight="980"><root>${cells.join('')}</root></mxGraphModel></diagram></mxfile>`);
fs.writeFileSync(path.join(out,'editable/overview-naphat.mmd'),`flowchart TB
  UI["Browser / Frontend — Login, My Account, Users, Audit เชื่อมแล้ว"]
  AUTH["นภัทร — Auth / Session / User Management / Audit"]
  TEAM["บริบทงานเพื่อน — Inventory / Discovery / Collection / Topology"]
  OWNDB[("users / auth_sessions / audit_logs")]
  TEAMDB[("Inventory / Collection / Neighbor Evidence")]
  PLAN["นภัทร: Dashboard P1 / Operational P2 — แบบและแผน"]
  GAP["Guard / Audit ของ API งานอุปกรณ์ยังต้องเชื่อมให้ครบ"]
  UI -->|Auth / Admin / Audit API| AUTH
  UI -->|Device / Discovery API| TEAM
  AUTH --> OWNDB
  TEAM --> TEAMDB
  PLAN -.->|อ่านข้อมูลตาม Contract ที่ต้องพัฒนา| OWNDB
  PLAN -.->|อ่านข้อมูลตาม Contract ที่ต้องพัฒนา| TEAMDB
  GAP -.-> TEAM
  classDef own fill:#e0f2fe,stroke:#0284c7;
  classDef team fill:#f1f5f9,stroke:#64748b;
  classDef planned fill:#fffbeb,stroke:#d97706,stroke-dasharray:5 5;
  class AUTH,OWNDB own;
  class TEAM,TEAMDB team;
  class PLAN,GAP planned;
`);

const markdownPath=path.join(out,'naphat-advisor-update-2026-10-09.md');
let rendered=marked.parse(fs.readFileSync(markdownPath,'utf8'));
rendered=rendered.replace(/(src|href)="(D:\/[^"<>]+)"/g,(all,key,p)=>{
 const decoded=decodeURI(p).replaceAll('&amp;','&');
 const rel=path.relative(out,decoded).replaceAll('\\','/');
 return `${key}="${esc(rel.startsWith('..')?'file:///'+encodeURI(decoded):encodeURI(rel))}"`;
});
rendered=rendered.replace(/<h2>(\d+)\./g,'<h2 id="section-$1">$1.');
const sections=rendered.split(/(?=<h2 id="section-)/);
rendered=sections.map((s,i)=>`<section data-part="${i?(/section-(\d+)/.exec(s)||[])[1]:'intro'}">${s}</section>`).join('\n');
const style=`*{box-sizing:border-box}body{margin:0;background:#f1f5f9;color:#172b4d;font:18px/1.9 Tahoma,Arial,sans-serif}header{position:sticky;top:0;z-index:3;background:#0c4a6e;color:white;padding:12px 24px}header strong{font-size:18px}nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}button{font:15px Tahoma;border:1px solid #cbd5e1;border-radius:8px;padding:9px 14px;background:white;color:#075985;cursor:pointer}main{max-width:1200px;margin:26px auto;background:white;padding:36px 46px;box-shadow:0 2px 14px #cbd5e1;border-radius:14px}h1{font-size:30px;line-height:1.6}h2{font-size:26px;margin-top:48px;scroll-margin-top:145px;color:#075985}h3{font-size:21px;margin-top:36px}p{margin:16px 0}a{color:#0369a1;overflow-wrap:anywhere}blockquote{margin:18px 0;border-left:5px solid #0284c7;background:#f0f9ff;padding:8px 24px}table{width:100%;border-collapse:collapse;font-size:16px;line-height:1.8;margin:24px 0}td,th{border:1px solid #cbd5e1;padding:12px;vertical-align:top}th{background:#e0f2fe;text-align:left}img{display:block;max-width:100%;max-height:760px;width:auto;height:auto;margin:25px auto;object-fit:contain;cursor:zoom-in;border:1px solid #cbd5e1;background:white}li{margin:9px 0}code{font-size:15px;background:#f1f5f9;padding:2px 5px;border-radius:4px}dialog{width:96vw;height:95vh;max-width:none;max-height:none;border:0;border-radius:12px;padding:0;background:#e2e8f0}dialog::backdrop{background:#0f172abf}.viewerbar{height:65px;display:flex;align-items:center;gap:18px;background:white;padding:12px 22px}.viewerbody{height:calc(100% - 65px);overflow:auto;padding:20px}.viewerbody img{max-width:none;max-height:none;cursor:default;margin:0 auto}.hint{font-size:14px;color:#dbeafe;margin-left:15px}@media(max-width:700px){main{padding:22px 18px;margin:12px}table{font-size:13px}body{font-size:16px}header{padding:10px}h1{font-size:25px}}@media print{header,dialog{display:none}main{box-shadow:none;margin:0;padding:0}section[hidden]{display:block!important}img{max-height:900px}body{background:white;font-size:13px}h2{break-before:page}table{font-size:11px}}`;
const script=`function showPart(n){document.querySelectorAll('main section').forEach(s=>s.hidden=n!=='all'&&s.dataset.part!==n);window.scrollTo(0,0)}const dlg=document.querySelector('dialog'),zoom=document.querySelector('#zoom'),large=document.querySelector('#large');document.querySelectorAll('main img').forEach(img=>img.addEventListener('click',()=>{large.src=img.src;large.alt=img.alt;zoom.value=100;large.style.width='100%';dlg.showModal()}));zoom.addEventListener('input',()=>large.style.width=zoom.value+'%');document.querySelector('#close').onclick=()=>dlg.close();`;
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>นภัทร — MyNetMate Advisor Update 9 Oct 2026</title><style>${style}</style></head><body><header><strong>MyNetMate • เนื้อหาให้นภัทรอัปเดตอาจารย์ • 9 ตุลาคม 2569</strong><span class="hint">คลิกภาพเพื่อขยาย • เปิดได้โดยไม่ใช้อินเทอร์เน็ต</span><nav><button onclick="showPart('2')">บทเปิด 1 นาที</button><button onclick="showPart('3')">บทพูด 5–7 นาที</button><button onclick="showPart('7')">ภาพและบทอธิบาย</button><button onclick="showPart('9')">คำถาม–คำตอบ</button><button onclick="showPart('6')">ผลทดสอบ</button><button onclick="showPart('all')">ทั้งหมด</button></nav></header><main>${rendered}</main><dialog><div class="viewerbar"><button id="close">ปิดภาพ</button><label>ขยาย <input id="zoom" type="range" min="60" max="300" value="100"></label><span>เลื่อนดูรายละเอียดในภาพได้</span></div><div class="viewerbody"><img id="large" alt=""></div></dialog><script>${script}</script></body></html>`);

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1420,height:980},deviceScaleFactor:1.5});
 await page.goto('file:///'+path.join(out,'images/overview-naphat.svg').replaceAll('\\','/'));
 await page.screenshot({path:path.join(out,'images/overview-naphat.png')});
 const overflows=await page.evaluate(()=>Array.from(document.querySelectorAll('g')).flatMap(g=>Array.from(g.querySelectorAll('text')).map(t=>{const b=t.getBBox();return {id:g.id,b:{x:b.x,y:b.y,width:b.width,height:b.height}};})));
 const textBounds=[];
 for(const b of overflows){const n=nodes.find(n=>n.id===b.id);if(n&&b.b.x+b.b.width>n.x+n.w-5)textBounds.push({id:b.id,...b.b});}
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('file:///'+path.join(out,'index.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).every(i=>i.complete));
 const imageStatus=await page.evaluate(()=>Array.from(document.querySelectorAll('main img')).map(i=>({src:i.getAttribute('src'),loaded:i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})));
 await page.screenshot({path:path.join(out,'evidence/preview-opening.png')});
 await page.getByRole('button',{name:'บทพูด 5–7 นาที',exact:true}).click();
 await page.screenshot({path:path.join(out,'evidence/preview-script.png')});
 await page.getByRole('button',{name:'ภาพและบทอธิบาย',exact:true}).click();
 await page.screenshot({path:path.join(out,'evidence/preview-diagrams.png')});
 await page.locator('main img').first().click();
 const viewerOpened=await page.locator('dialog').evaluate(e=>e.open);
 await page.screenshot({path:path.join(out,'evidence/preview-component.png')});
 const links=await page.evaluate(()=>Array.from(document.querySelectorAll('main a')).map(a=>a.getAttribute('href')));
 const missingLinks=links.filter(l=>!l.startsWith('http')&&!l.startsWith('#')).filter(l=>{const p=l.startsWith('file:///')?decodeURI(l.slice(8)):path.resolve(out,decodeURI(l));return !fs.existsSync(p)});
 const qa={checked_at:new Date().toISOString(),copies,selected_images:imageStatus,overview_text_overflow:textBounds,missing_links:missingLinks,image_viewer_opened:viewerOpened,scope:'Artifact rendering and local links only; no system runtime/E2E assertions'};
 fs.writeFileSync(path.join(out,'evidence/artifact-qa.json'),JSON.stringify(qa,null,2));
 console.log(JSON.stringify({images:imageStatus.length,broken_images:imageStatus.filter(i=>!i.loaded).length,text_overflow:textBounds.length,missing_links:missingLinks.length,viewerOpened,copies_identical:copies.every(c=>c.identical)}));
 await browser.close();
})();
