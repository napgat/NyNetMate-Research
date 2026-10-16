/* Schema-grounded Chen-style figures; generated SVG, PNG and editable draw.io. */
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const schema = JSON.parse(fs.readFileSync(path.join(__dirname,'schema.json'),'utf8'));
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const entityDescriptions = {
 users:'เก็บบัญชีผู้ใช้งานและบทบาท Admin, Operator และ Viewer สำหรับการเข้าสู่ระบบและตรวจสอบสิทธิ์',
 auth_sessions:'เก็บ Session ฝั่งเซิร์ฟเวอร์ เชื่อมโยงกับผู้ใช้งาน เพื่อกำหนดอายุและเพิกถอนการเข้าใช้งาน โดยเก็บเฉพาะค่า Hash ของ Session Token',
 audit_logs:'เก็บประวัติเหตุการณ์ที่ระบบกำหนดให้บันทึก เช่น การเข้าสู่ระบบและการจัดการผู้ใช้งาน เพื่อให้ผู้ดูแลตรวจสอบผู้กระทำ การกระทำ ผลลัพธ์ และเวลา',
 credential_profiles:'เก็บชุดข้อมูลรับรองสำหรับอ่านข้อมูลอุปกรณ์เครือข่าย โดยแยกข้อมูลลับที่เข้ารหัสออกจากข้อมูลอุปกรณ์',
 sites:'เก็บชื่อและรายละเอียดสถานที่ติดตั้ง เพื่อจัดหมวดหมู่อุปกรณ์ตามพื้นที่',
 device_groups:'เก็บกลุ่มอุปกรณ์สำหรับการจัดหมวดหมู่ โดยอุปกรณ์หนึ่งรายการสามารถอยู่ได้หลายกลุ่ม',
 devices:'เก็บตัวตน ข้อมูลประกอบ และสถานะของอุปกรณ์เครือข่าย เป็นข้อมูลหลักสำหรับ Device Inventory และการแสดง Topology',
 device_group_members:'เก็บความสัมพันธ์ระหว่างอุปกรณ์กับกลุ่ม เพื่อรองรับความสัมพันธ์แบบหลายต่อหลายระหว่าง devices และ device_groups',
 device_interfaces:'เก็บข้อมูล Interface ของอุปกรณ์ รวมถึงสถานะการทำงาน ความเร็ว และเวลาที่รวบรวมข้อมูล',
 interface_ip_addresses:'เก็บรายการที่อยู่ IP ของแต่ละ Interface เพื่อรองรับ Interface ที่มีมากกว่าหนึ่งที่อยู่',
 discovery_scans:'เก็บคำขอและสถานะของงานค้นหาเครือข่าย โดยระบุ Seed IP ชุดข้อมูลรับรอง และขอบเขตการค้นหา',
 collection_runs:'เก็บประวัติการรวบรวมข้อมูลรายเป้าหมาย ทั้งการเพิ่มอุปกรณ์ การค้นหา และการรวบรวมข้อมูลซ้ำ',
 neighbor_observations:'เก็บหลักฐานเพื่อนบ้านจาก LLDP ที่รวบรวมได้ในแต่ละรอบ เพื่อนำไปประมวลผลเส้นเชื่อมใน Topology',
 topology_default_routes:'เก็บข้อมูล Default Gateway ที่สังเกตได้ของอุปกรณ์ เพื่อใช้ประกอบการแสดง Topology ไม่ใช่คำสั่งแก้ไข Routing ของอุปกรณ์'
};
const attrDescriptions = {
 id:'รหัสประจำรายการ', username:'ชื่อบัญชีผู้ใช้งาน', email:'อีเมลของผู้ใช้งาน โดยไม่จำเป็นต้องระบุ',
 password_hash:'ค่า Hash ของรหัสผ่าน ไม่ใช่รหัสผ่านแบบข้อความปกติ', role:'บทบาทของผู้ใช้งาน ได้แก่ admin, operator หรือ viewer',
 is_active:'สถานะการเปิดใช้งานบัญชี', created_at:'วันและเวลาที่สร้างรายการ', updated_at:'วันและเวลาที่ปรับปรุงรายการล่าสุด',
 session_token_hash:'ค่า Hash ของ Token สำหรับตรวจสอบ Session', user_id:'รหัสผู้ใช้งานที่เชื่อมโยงกับรายการ',
 expires_at:'วันและเวลาที่ Session หมดอายุ', is_revoked:'สถานะการเพิกถอน Session',
 ip_address:'ที่อยู่ IP ประกอบ Session โดยเป็นช่องที่อนุญาตให้ไม่มีค่า', user_agent:'ข้อมูลโปรแกรมลูกข่ายประกอบ Session โดยเป็นช่องที่อนุญาตให้ไม่มีค่า',
 action:'ชื่อเหตุการณ์ที่บันทึก', resource_type:'ประเภททรัพยากรที่เกี่ยวข้องกับเหตุการณ์', resource_id:'รหัสทรัพยากรที่เกี่ยวข้อง โดยไม่ได้กำหนดเป็น Foreign Key',
 result:'ผลลัพธ์ของเหตุการณ์ ได้แก่ success หรือ failure', safe_error_category:'ประเภทข้อผิดพลาดที่ผ่านการจำกัดข้อมูลอ่อนไหว',
 description:'รายละเอียดเพิ่มเติมของรายการ', name:'ชื่อรายการ', password_encrypted:'รหัสผ่านสำหรับเข้าถึงอุปกรณ์ในรูปแบบเข้ารหัส',
 enable_secret_encrypted:'ข้อมูลลับสำหรับสิทธิ์ระดับสูงของอุปกรณ์ในรูปแบบเข้ารหัส',
 snmp_community_ro_encrypted:'SNMP Read-only Community ในรูปแบบเข้ารหัส', ssh_port:'หมายเลขพอร์ต SSH', snmp_port:'หมายเลขพอร์ต SNMP',
 created_by:'รหัสผู้สร้างรายการ โดย Schema ปัจจุบันยังไม่ได้กำหนดเป็น Foreign Key', location_detail:'รายละเอียดสถานที่ติดตั้ง',
 color_tag:'รหัสสีสำหรับแสดงกลุ่มอุปกรณ์', management_ip:'ที่อยู่ IP ที่ใช้เข้าถึงอุปกรณ์เพื่อจัดการข้อมูล',
 advertised_management_ip:'ที่อยู่ Management IP ที่อุปกรณ์ประกาศให้ทราบ', hostname:'ชื่ออุปกรณ์', device_type:'ประเภทอุปกรณ์ เช่น router หรือ switch',
 vendor:'ผู้ผลิตอุปกรณ์', model:'รุ่นอุปกรณ์', os_version:'รุ่นของระบบปฏิบัติการอุปกรณ์', serial_number:'หมายเลขประจำเครื่อง',
 chassis_id_subtype:'ประเภทของ Chassis ID', chassis_id:'ตัวระบุ Chassis ที่ใช้แยกตัวตนอุปกรณ์', site_id:'รหัสสถานที่ติดตั้งอุปกรณ์',
 credential_profile_id:'รหัสชุดข้อมูลรับรองที่ใช้เข้าถึงอุปกรณ์', platform:'ชื่อแพลตฟอร์มหรือชนิดไดรเวอร์ของอุปกรณ์',
 management_state:'สถานะการจัดการในระบบ ได้แก่ active, unmanaged, maintenance หรือ retired',
 reachability:'ผลการตรวจการเข้าถึง ได้แก่ unknown, reachable หรือ unreachable', enrollment_source:'ที่มาของรายการอุปกรณ์',
 last_seen_at:'วันและเวลาที่พบว่าเข้าถึงอุปกรณ์ได้ล่าสุด', reachability_checked_at:'วันและเวลาที่ตรวจการเข้าถึงล่าสุด',
 last_collected_at:'วันและเวลาที่รวบรวมข้อมูลอุปกรณ์ล่าสุด', notes:'บันทึกเพิ่มเติมของอุปกรณ์', device_id:'รหัสอุปกรณ์ที่เกี่ยวข้อง',
 group_id:'รหัสกลุ่มอุปกรณ์', added_at:'วันและเวลาที่เพิ่มอุปกรณ์เข้ากลุ่ม', if_index:'เลขดัชนี Interface ที่อุปกรณ์รายงาน',
 mac_address:'ที่อยู่ MAC ของ Interface', mode:'รูปแบบ Interface เช่น access, trunk หรือ routed', access_vlan_id:'หมายเลข VLAN สำหรับ Access Port',
 admin_status:'สถานะ Interface ตามการตั้งค่าทางการบริหาร', oper_status:'สถานะการทำงานที่ Interface รายงาน',
 speed_bps:'ความเร็ว Interface ในหน่วยบิตต่อวินาที', collected_at:'วันและเวลาที่รวบรวมข้อมูล Interface',
 retired_at:'วันและเวลาที่เลิกใช้รายการ Interface โดยอาจไม่มีค่า', interface_id:'รหัส Interface ที่เป็นเจ้าของที่อยู่ IP', address:'ที่อยู่ IP พร้อม Prefix',
 seed_ip:'ที่อยู่ IP เริ่มต้นสำหรับงานค้นหา', status:'สถานะของงาน ได้แก่ queued, running, succeeded, partial, failed หรือ cancelled',
 timeout_seconds:'ระยะเวลารอคำตอบต่อเป้าหมายในหน่วยวินาที', max_depth:'ความลึกสูงสุดของการค้นหาต่อเนื่อง', max_devices:'จำนวนอุปกรณ์สูงสุดที่กำหนดให้ค้นหา',
 environment:'ประเภทสภาพแวดล้อมทดสอบ ได้แก่ physical หรือ emulated', initiated_by:'รหัสผู้เริ่มงาน โดย Schema ปัจจุบันยังไม่ได้กำหนดเป็น Foreign Key',
 error_message:'ข้อความข้อผิดพลาดของงาน', requested_at:'วันและเวลาที่ขอเริ่มงาน', started_at:'วันและเวลาที่เริ่มทำงาน', finished_at:'วันและเวลาที่สิ้นสุดงาน',
 discovery_scan_id:'รหัสงานค้นหา โดยอาจไม่มีค่าเมื่อเป็นการรวบรวมข้อมูลนอกงานค้นหา', target_ip:'ที่อยู่ IP เป้าหมายของการรวบรวมข้อมูล',
 purpose:'วัตถุประสงค์ เช่น manual_enrollment, csv_import, discovery หรือ recollect', transport:'โพรโทคอลการรวบรวมข้อมูล เช่น snmp หรือ ssh',
 neighbor_status:'ผลการรวบรวมเพื่อนบ้าน ได้แก่ not_attempted, succeeded, failed หรือ unsupported', collection_run_id:'รหัสรอบการรวบรวมข้อมูลที่เป็นแหล่งหลักฐาน',
 local_device_id:'รหัสอุปกรณ์ฝั่งที่เก็บหลักฐาน', local_interface_id:'รหัส Interface ฝั่งที่เก็บหลักฐาน', observation_key:'ตัวระบุหลักฐานภายในรอบการรวบรวม',
 protocol:'โพรโทคอลของหลักฐานเพื่อนบ้าน โดย Schema ปัจจุบันกำหนดเป็น lldp', remote_chassis_id_subtype:'ประเภท Chassis ID ของเพื่อนบ้าน',
 remote_chassis_id:'Chassis ID ของเพื่อนบ้าน', remote_port_id_subtype:'ประเภท Port ID ของเพื่อนบ้าน', remote_port_id:'Port ID ของเพื่อนบ้าน',
 remote_system_name:'ชื่อระบบที่เพื่อนบ้านประกาศ', remote_port_description:'คำอธิบายพอร์ตของเพื่อนบ้าน', remote_management_ip:'Management IP ที่เพื่อนบ้านประกาศ',
 observed_at:'วันและเวลาที่สังเกตข้อมูล', source_device_id:'รหัสอุปกรณ์ต้นทางของข้อมูล Default Gateway', gateway_ip:'ที่อยู่ IP ของ Default Gateway',
 gateway_hostname:'ชื่อที่ใช้แสดง Default Gateway', source_interface_name:'ชื่อ Interface ต้นทางที่สัมพันธ์กับข้อมูล Gateway'
};
const notes = {
 auth_sessions:'ผู้ใช้งานหนึ่งบัญชีมี Session ได้ตั้งแต่ศูนย์ถึงหลายรายการ แต่แต่ละ Session ต้องอ้างถึงผู้ใช้งานหนึ่งบัญชี ช่อง ip_address และ user_agent มีอยู่ใน Schema โดยไม่ได้หมายความว่าระบบจะบันทึกค่าเหล่านี้ทุกครั้ง',
 audit_logs:'user_id เป็น Foreign Key ที่อนุญาตให้ไม่มีค่า เช่น เหตุการณ์เข้าสู่ระบบไม่สำเร็จที่ไม่สามารถระบุผู้กระทำได้ ส่วน resource_id ใช้ร่วมกับ resource_type เพื่อระบุทรัพยากร ไม่ใช่ Foreign Key ไปยัง devices หรือ users โดยตรง ระบบไม่บันทึกรหัสผ่าน Token หรือ IP ของลูกข่ายลง Audit Log',
 credential_profiles:'created_by เป็น UUID ที่ยังไม่มี Foreign Key บังคับเชื่อม users ใน Schema ปัจจุบัน ภาพรวมจึงไม่แสดงความสัมพันธ์ดังกล่าว',
 devices:'role ใน Entity นี้หมายถึงบทบาททางเครือข่าย เช่น core หรือ access ไม่ใช่สิทธิ์ผู้ใช้งาน ส่วน site_id และ credential_profile_id อนุญาตให้ไม่มีค่าได้ และ created_by ยังไม่เป็น Foreign Key',
 device_group_members:'Primary Key เป็นคีย์ผสม (device_id, group_id) เพื่อป้องกันการเพิ่มอุปกรณ์เดิมในกลุ่มเดิมซ้ำ',
 interface_ip_addresses:'Primary Key เป็นคีย์ผสม (interface_id, address) อุปกรณ์หนึ่ง Interface จึงมีที่อยู่ IP ได้หลายรายการ',
 discovery_scans:'งานค้นหาหนึ่งรายการมี Collection Run ได้หลายรายการ ส่วน initiated_by ยังไม่เป็น Foreign Key ใน Schema ปัจจุบัน',
 collection_runs:'device_id อนุญาตให้ไม่มีค่าขณะยังระบุตัวตนอุปกรณ์ไม่ได้ แต่ต้องมีค่าเมื่อสถานะเป็น succeeded หรือ partial ส่วน discovery_scan_id ต้องมีค่าเมื่อ purpose เป็น discovery และไม่มีค่าในกรณีอื่น',
 neighbor_observations:'มี Foreign Key แบบผสม (collection_run_id, local_device_id) ไปยัง collection_runs และ (local_device_id, local_interface_id) ไปยัง device_interfaces เพื่อให้หลักฐานอ้างถึงอุปกรณ์เดียวกับรอบการรวบรวมและ Interface จริง ข้อมูลฝั่ง remote เป็นข้อมูลที่เพื่อนบ้านประกาศ ไม่ใช่ Foreign Key ไปยัง devices',
 topology_default_routes:'source_device_id เป็นทั้ง Primary Key และ Foreign Key อุปกรณ์หนึ่งรายการจึงมีข้อมูลใน Entity นี้ได้ไม่เกินหนึ่งรายการ ภาพรวมแสดงความสัมพันธ์ 1 ต่อ 0..1'
};

function diagram(id,width,height){
 const nodes=[],edges=[]; let seq=0;
 const shape=(kind,text,x,y,w,h,opts={})=>{const n={id:`${id}-${++seq}`,kind,text,x,y,w,h,...opts};nodes.push(n);return n;};
 const edge=(points)=>edges.push({id:`${id}-${++seq}`,points});
 const label=(text,x,y,w=75,h=24)=>shape('text',text,x,y,w,h,{font:20});
 const svg=()=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/>`+
  edges.map(e=>`<polyline points="${e.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#303030" stroke-width="1.4"/>`).join('')+
  nodes.map(n=>{const fill=n.kind==='rect'?'#9bcdfb':n.kind==='diamond'?'#ffd19c':'white';let base='';
   if(n.kind==='rect')base=`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${fill}" stroke="#303030"/>`;
   if(n.kind==='ellipse')base=`<ellipse cx="${n.x+n.w/2}" cy="${n.y+n.h/2}" rx="${n.w/2}" ry="${n.h/2}" fill="white" stroke="#303030"/>`;
   if(n.kind==='diamond')base=`<polygon points="${n.x+n.w/2},${n.y} ${n.x+n.w},${n.y+n.h/2} ${n.x+n.w/2},${n.y+n.h} ${n.x},${n.y+n.h/2}" fill="${fill}" stroke="#303030"/>`;
   const lines=n.text.split('\n'),font=n.font||22;
   return base+`<text x="${n.x+n.w/2}" y="${n.y+n.h/2-(lines.length-1)*font*0.56}" text-anchor="middle" dominant-baseline="central" font-family="Arial" font-size="${font}" fill="#161616" ${n.pk?'text-decoration="underline"':''}>`+lines.map((s,i)=>`<tspan x="${n.x+n.w/2}" dy="${i?font*1.12:0}">${esc(s)}</tspan>`).join('')+'</text>';
  }).join('')+'</svg>';
 const model=()=>`<mxGraphModel page="1" pageWidth="${width}" pageHeight="${height}" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/>`+
  edges.map(e=>{const a=e.points[0],b=e.points.at(-1);return `<mxCell id="${e.id}" parent="1" edge="1" style="endArrow=none;startArrow=none;strokeColor=#303030;strokeWidth=1.4;"><mxGeometry relative="1" as="geometry"><mxPoint x="${a[0]}" y="${a[1]}" as="sourcePoint"/><mxPoint x="${b[0]}" y="${b[1]}" as="targetPoint"/><Array as="points">${e.points.slice(1,-1).map(p=>`<mxPoint x="${p[0]}" y="${p[1]}"/>`).join('')}</Array></mxGeometry></mxCell>`;}).join('')+
  nodes.map(n=>`<mxCell id="${n.id}" parent="1" vertex="1" value="${esc(n.text)}" style="${n.kind==='text'?'text;strokeColor=none;fillColor=none;':`shape=${n.kind==='rect'?'rectangle':n.kind==='diamond'?'rhombus':'ellipse'};strokeColor=#303030;fillColor=${n.kind==='rect'?'#9bcdfb':n.kind==='diamond'?'#ffd19c':'#ffffff'};`}fontFamily=Arial;fontSize=${n.font||22};fontStyle=${n.pk?4:0};whiteSpace=wrap;align=center;verticalAlign=middle;"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>`).join('')+'</root></mxGraphModel>';
 return {id,width,height,shape,edge,label,nodes,edges,svg,model};
}

function entity(t,i){
 const rows=Math.ceil(t.columns.length/2),height=Math.max(240,rows*58+34),d=diagram(`entity-${t.name}`,1000,height);
 const cy=height/2,dw=250; d.shape('rect',t.name,375,cy-40,dw,80,{font:22});
 t.columns.forEach((c,j)=>{
  const side=j%2,row=Math.floor(j/2),x=side?690:10,y=20+row*58;
  const foreign=c.foreign.length||t.composite_foreign.some(f=>f.columns.includes(c.name));
  const text=c.name+(foreign?' (FK)':'');
  const lines=text.length>28?text.replace(/_(?=[^_]*$)/,'_\n'):text;
  d.shape('ellipse',lines,x,y,300,46,{pk:c.pk,font:19});
  d.edge(side?[[625,cy],[690,y+23]]:[[375,cy],[310,y+23]]);
 });
 d.figure=`3.${16+i}`; d.file=`fig-3-${16+i}-${t.name.replaceAll('_','-')}`; d.table=t;return d;
}

function overview(){
 const d=diagram('overview',1100,1470);
 const rect=(s,x,y)=>d.shape('rect',s,x,y,240,64);
 rect('users',410,40);rect('auth_sessions',20,230);rect('audit_logs',820,230);
 rect('credential_profiles',410,410);rect('sites',820,410);
 rect('device_groups',20,630);rect('devices',410,630);rect('topology_default_routes',820,630);
 rect('device_group_members',20,840);rect('device_interfaces',820,840);
 rect('interface_ip_addresses',820,1050);rect('discovery_scans',20,1110);rect('collection_runs',410,1110);rect('neighbor_observations',410,1370);
 const card=(text,p,q,at)=>{
  const dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);
  const cx=at?at[0]:(p[0]+q[0])/2+dy/length*24,cy=at?at[1]:(p[1]+q[1])/2-dx/length*24;
  d.label(text,cx-28,cy-12,56,24);
 };
 const rel=(title,x,y,a,b,ca,cb,caAt,cbAt)=>{d.shape('diamond',title,x,y,110,64,{font:17});d.edge(a);d.edge(b);card(ca,a[0],a[1],caAt);card(cb,b.at(-2),b.at(-1),cbAt);};
 rel('has',260,137,[[410,72],[315,137]],[[315,201],[260,262]],'1','0..N');
 rel('performs',690,137,[[650,72],[745,137]],[[745,201],[820,262]],'0..1','0..N');
 rel('uses',475,520,[[530,474],[530,520]],[[530,584],[530,630]],'0..1','0..N');
 rel('located\nat',720,520,[[820,442],[775,520]],[[775,584],[650,662]],'0..1','0..N',null,[681,588]);
 rel('contains',85,735,[[140,694],[140,735]],[[140,799],[140,840]],'1','0..N');
 rel('belongs\nto',265,746,[[410,662],[320,746]],[[320,810],[260,872]],'1','0..N');
 rel('has',705,746,[[650,662],[760,746]],[[760,810],[820,872]],'1','0..N');
 rel('has',705,630,[[650,662],[705,662]],[[815,662],[820,662]],'1','0..1',[672,618],[838,618]);
 rel('assigned',885,944,[[940,904],[940,944]],[[940,1008],[940,1050]],'1','0..N');
 rel('uses',200,985,[[410,442],[325,442],[325,1017],[310,1017]],[[255,1049],[140,1110]],'1','0..N');
 rel('uses',655,960,[[650,442],[705,442],[705,960]],[[710,1024],[650,1142]],'1','0..N');
 rel('collects',475,965,[[530,694],[530,965]],[[530,1029],[530,1110]],'0..1','0..N');
 rel('includes',285,1110,[[260,1142],[285,1142]],[[395,1142],[410,1142]],'0..1','0..N',[270,1085],[399,1085]);
 rel('records',475,1240,[[530,1174],[530,1240]],[[530,1304],[530,1370]],'1','0..N');
 rel('observed\non',720,1280,[[820,872],[785,872],[785,1280]],[[775,1344],[650,1402]],'1','0..N');
 d.label('Authentication and Audit',350,0,400,24);
 d.label('Inventory, Discovery and Topology evidence',260,355,580,24);
 d.figure='3.15';d.file='fig-3-15-mynetmate-er';return d;
}

function content(graphs){
 const blocks=[];
 const add=(kind,text,extra={})=>blocks.push({kind,text,...extra});
 add('h2','3.6 การออกแบบ Entity Relationship Diagram');
 add('body','จากการออกแบบ Sequence Diagram ระบบ MyNetMate มีการเรียกใช้และจัดเก็บข้อมูลหลายประเภท ได้แก่ บัญชีผู้ใช้งาน Session อุปกรณ์เครือข่าย Interface ผลการค้นหา และประวัติเหตุการณ์ จึงต้องออกแบบโครงสร้างข้อมูลให้เชื่อมโยงกันอย่างเป็นระบบและรองรับกระบวนการทำงานที่กำหนดไว้ใน Use Case และ Sequence Diagram');
 add('body','การออกแบบ Entity Relationship Diagram (ER Diagram) ใช้แสดง Entity, Attribute และความสัมพันธ์ของข้อมูล โดยอ้างอิงโครงสร้างฐานข้อมูล PostgreSQL และแบบจำลอง SQLAlchemy ปัจจุบัน ในหัวข้อนี้ครอบคลุมเฉพาะ Network Management ไม่รวมข้อมูลการสร้าง การปรับใช้ หรือการจัดเก็บเวอร์ชัน Configuration');
 add('body','ภาพรวมประกอบด้วยข้อมูลผู้ใช้งานและประวัติเหตุการณ์ รวมถึงข้อมูล Inventory และหลักฐานการค้นหาเครือข่าย แผนภาพใช้สี่เหลี่ยมแทน Entity สี่เหลี่ยมข้าวหลามตัดแทนความสัมพันธ์ และวงรีแทน Attribute โดยขีดเส้นใต้ชื่อ Attribute ที่เป็น Primary Key ภาพรวมแสดงความสัมพันธ์หลัก ส่วน Attribute แสดงในภาพราย Entity หมายเลข 0..1 และ 0..N หมายถึงมีข้อมูลที่สัมพันธ์กันได้ตั้งแต่ศูนย์ถึงหนึ่งรายการ และตั้งแต่ศูนย์ถึงหลายรายการตามลำดับ');
 add('image','',{file:graphs[0].file,width:451,height:603,pageBreakBefore:true});
 add('caption','รูป 3.15 การออกแบบ ER Diagram ของระบบ MyNetMate');
 add('body','จากรูป 3.15 ผู้ใช้งานหนึ่งบัญชีมี Session และประวัติเหตุการณ์ได้หลายรายการ อุปกรณ์สัมพันธ์กับสถานที่ ชุดข้อมูลรับรอง กลุ่ม และ Interface ส่วนการค้นหาหนึ่งงานประกอบด้วยการรวบรวมข้อมูลหลายรอบ โดยแต่ละรอบเก็บหลักฐานเพื่อนบ้านจาก LLDP เพื่อใช้สร้างเส้นเชื่อมของ Topology ความสัมพันธ์ในภาพแสดงตาม Foreign Key ที่มีใน Schema ปัจจุบัน จึงไม่มีเส้นจาก users ไปยังช่อง created_by หรือ initiated_by ที่ยังไม่มีข้อบังคับ Foreign Key');
 add('h3','3.6.1 Entity');
 graphs.slice(1).forEach((g,i)=>{
  const t=g.table,n=i+1;
  add('entity',`${n}) ${t.name}`);
  add('image','',{file:g.file,width:451,height:Math.round(g.height*451/g.width)});
  add('caption',`รูป ${g.figure} ${t.name} Entity`);
  add('body',`${n}.1) เป็น Entity ที่${entityDescriptions[t.name]}`);
  add('body',`${n}.2) มี Attribute ดังต่อไปนี้`);
  t.columns.forEach(c=>{
   let desc=attrDescriptions[c.name];
   if(!desc)throw Error(`Missing description ${t.name}.${c.name}`);
   if(t.name==='devices'&&c.name==='role')desc='บทบาททางเครือข่าย เช่น core, distribution หรือ access';
   if(t.name==='device_interfaces'&&c.name==='name')desc='ชื่อ Interface ที่อุปกรณ์รายงาน';
   if(t.name==='audit_logs'&&c.name==='user_id')desc='รหัสผู้กระทำเหตุการณ์ โดยอนุญาตให้ไม่มีค่าเมื่อไม่สามารถระบุผู้กระทำได้';
   let key=c.pk?(t.columns.filter(v=>v.pk).length>1?' ใช้เป็นส่วนหนึ่งของ Primary Key แบบผสม':' ใช้เป็น Primary Key'):'';
   if(c.foreign.length)key+=` และใช้เป็น Foreign Key เชื่อมกับ ${c.foreign.join(', ')}`;
   if(t.composite_foreign.some(f=>f.columns.includes(c.name)))key+=' และเป็นส่วนหนึ่งของ Foreign Key แบบผสม';
   // FK-only fields do not start with an unnatural "และ".
   if(!c.pk&&key.startsWith(' และ'))key=key.replace(/^ และ/,' ');
   add('attribute',`${c.name}: ${desc}${key}`);
  });
  if(notes[t.name])add('body',`${n}.3) ${notes[t.name]}`);
 });
 return blocks;
}

(async()=>{
 const graphs=[overview(),...schema.map(entity)];
 const drawio=`<mxfile host="app.diagrams.net">${graphs.map(g=>`<diagram id="${g.id}" name="${esc(g.figure+' '+(g.table?.name||'MyNetMate ER'))}">${g.model()}</diagram>`).join('')}</mxfile>`;
 fs.writeFileSync(path.join(__dirname,'mynetmate-er.drawio'),drawio);
 const blocks=content(graphs);
 fs.writeFileSync(path.join(__dirname,'section-blocks.json'),JSON.stringify(blocks,null,2));
 fs.writeFileSync(path.join(__dirname,'chapter-3-6-er.md'),blocks.map(b=>b.kind==='image'?`![ER figure](${b.file}.png)`:b.kind==='attribute'?`- ${b.text}`:['h2','h3','entity'].includes(b.kind)?`### ${b.text}`:b.text).join('\n\n')+'\n');
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({deviceScaleFactor:2});
 const qa=[];
 for(const g of graphs){
  const svg=g.svg();fs.writeFileSync(path.join(__dirname,g.file+'.svg'),svg);
  await page.setViewportSize({width:g.width,height:g.height});
  await page.setContent(`<html><body style="margin:0;background:white">${svg}</body></html>`);
  const errors=await page.evaluate(()=>Array.from(document.querySelectorAll('text')).filter(n=>{const b=n.getBBox();return b.x<0||b.y<0||b.x+b.width>Number(document.querySelector('svg').getAttribute('width'))||b.y+b.height>Number(document.querySelector('svg').getAttribute('height'));}).map(n=>n.textContent));
  await page.screenshot({path:path.join(__dirname,g.file+'.png')});
  fs.writeFileSync(path.join(__dirname,g.file+'.drawio'),`<mxfile host="app.diagrams.net"><diagram id="${g.id}" name="${esc(g.table?.name||'MyNetMate ER')}">${g.model()}</diagram></mxfile>`);
  qa.push({file:g.file,width:g.width,height:g.height,clippedLabels:errors});
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,'render-qa.json'),JSON.stringify(qa,null,2));
 if(qa.some(q=>q.clippedLabels.length))throw Error('Clipped labels');
 console.log(JSON.stringify({figures:graphs.length,attributes:schema.reduce((n,t)=>n+t.columns.length,0),clippedLabels:0}));
})().catch(e=>{console.error(e);process.exit(1);});
