const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const specs = JSON.parse(fs.readFileSync(path.join(__dirname, 'diagrams.json'), 'utf8'));
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const html = s => esc(String(s).split('\n').map(esc).join('<br>'));
const font = 'fontFamily=Tahoma;fontSize=18;fontColor=#111111;';
const line = 'strokeColor=#111111;strokeWidth=1.3;';

function build(spec) {
  const xs = spec.separateService ? [150, 475, 800, 1140, 1480] : [150, 490, 875, 1260];
  const width = spec.separateService ? 1640 : 1430;
  let cells = [], serial = 0, y = 190, messages = [], checks = [];
  const id = () => 'c' + (++serial);
  const vertex = (value,x,yy,w,h,style) => {
    const key=id();
    cells.push(`<mxCell id="${key}" value="${html(value)}" vertex="1" parent="1" style="html=1;whiteSpace=wrap;${font}${style}"><mxGeometry x="${x}" y="${yy}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
    return key;
  };
  const edge = (x1,y1,x2,y2,style,points=[]) => {
    const key=id();
    cells.push(`<mxCell id="${key}" value="" edge="1" parent="1" style="html=1;edgeStyle=none;rounded=0;${line}${style}"><mxGeometry relative="1" as="geometry"><mxPoint x="${x1}" y="${y1}" as="sourcePoint"/><mxPoint x="${x2}" y="${y2}" as="targetPoint"/>${points.length?`<Array as="points">${points.map(([x,y])=>`<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`:''}</mxGeometry></mxCell>`);
    return key;
  };
  const text = (label,x,yy,w,h=42,align='center') => {
    checks.push({label,x,y:yy,width:w,height:h});
    return vertex(label,x,yy,w,h,`text;strokeColor=none;fillColor=#ffffff;align=${align};verticalAlign=middle;spacing=1;`);
  };
  function frame(kind,start,end,branches,depth) {
    const left=42+depth*16, right=width-40-depth*16;
    vertex('',left,start,right-left,end-start,`fillColor=none;${line}`);
    vertex(kind,left,start,60,28,`shape=umlFrame;fillColor=#ffffff;${line}fontStyle=1;fontSize=16;`);
    for(let i=0;i<branches.length;i++){
      const b=branches[i];
      if(i)edge(left,b.y,right,b.y,'endArrow=none;dashed=1;dashPattern=6 4;');
      vertex(b.guard,left+76,b.y+2,right-left-88,30,'text;strokeColor=none;fillColor=none;labelBackgroundColor=#ffffff;align=left;verticalAlign=middle;spacing=1;');
    }
  }
  function emit(steps,depth=0) {
    for(const s of steps){
      if(s[0]==='msg'||s[0]==='return'){
        const [,from,to,label]=s;
        const yy=y+48, left=Math.min(xs[from],xs[to])+16;
        edge(xs[from]+(from===0?0:7),yy,xs[to]+(to===0?0:(from<to?-7:7)),yy,`endArrow=${s[0]==='return'?'open':'block'};endFill=${s[0]==='return'?0:1};${s[0]==='return'?'dashed=1;dashPattern=5 4;':''}`);
        text(label,left,y+2,Math.abs(xs[to]-xs[from])-32,42);
        messages.push({from,to,y:yy,return:s[0]==='return'});
        y+=64;
      }else if(s[0]==='self'){
        const [,who,label]=s, xx=xs[who]+7;
        edge(xx,y+24,xx,y+52,'endArrow=block;endFill=1;',[[xx+48,y+24],[xx+48,y+52]]);
        text(label,xx+58,y+10,270,46,'left');
        messages.push({from:who,to:who,y:y+40,self:true});
        y+=68;
      }else if(s[0]==='alt'){
        const start=y, branches=[];
        for(const b of s[1]){branches.push({guard:b.guard,y});y+=38;emit(b.steps,depth+1);y+=8;}
        frame('alt',start,y,branches,depth);y+=12;
      }else if(s[0]==='opt'){
        const start=y;y+=38;emit(s[2],depth+1);y+=8;
        frame('opt',start,y,[{guard:s[1],y:start}],depth);y+=12;
      }else if(s[0]==='note'){
        y+=10;
        vertex(s[1],64,y,width-128,52,`shape=note;fillColor=#ffffff;${line}fontSize=16;spacing=8;`);
        y+=70;
      }
    }
  }
  emit(spec.steps);
  const height=y+58;
  const body=cells;
  cells=[];
  vertex(`${spec.title}`,48,18,width-96,38,'text;fillColor=none;strokeColor=none;fontSize=24;fontStyle=1;');
  for(let i=0;i<xs.length;i++){
    const label=i===0?spec.actor:i===1?(spec.frontend || 'Frontend\nReact / TypeScript'):
      spec.separateService?(i===2?'Backend':i===3?spec.service:'Database\nPostgreSQL'):
      i===2?spec.service:'Database\nPostgreSQL';
    if(i===0){
      vertex('',xs[i]-24,62,48,55,`shape=umlActor;outlineConnect=0;fillColor=#ffffff;${line}`);
      vertex(label,xs[i]-140,120,280,spec.separateService?70:52,'text;strokeColor=none;fillColor=#ffffff;align=center;verticalAlign=top;fontSize=16;');
    }
    else vertex(label,xs[i]-110,60,220,64,`fillColor=#ffffff;${line}`);
    edge(xs[i],i===0?(spec.separateService?205:177):124,xs[i],height-35,'endArrow=none;dashed=1;dashPattern=4 4;strokeWidth=1;strokeColor=#666666;');
  }
  // Thin execution specifications; database bars match query/response pairs.
  for(const who of Array.from({length:xs.length-2},(_,i)=>i+1)){
    const related=messages.filter(m=>m.from===who||m.to===who);
    const start=related[0].y-8, end=related.at(-1).y+10;
    vertex('',xs[who]-7,start,14,end-start,`fillColor=#ffffff;${line}`);
  }
  let dbStart=null;
  const dbIndex=xs.length-1;
  for(const m of messages){
    if(m.to===dbIndex&&dbStart===null)dbStart=m.y-8;
    if(m.from===dbIndex&&dbStart!==null){vertex('',xs[dbIndex]-7,dbStart,14,m.y+8-dbStart,`fillColor=#ffffff;${line}`);dbStart=null;}
  }
  cells.push(...body);
  const model=`<mxGraphModel page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('\n')}</root></mxGraphModel>`;
  return {spec,model,width,height,checks,messageCount:messages.length};
}

function plantuml(spec){
  const aliases=spec.separateService?['U','F','B','S','D']:['U','F','B','D'];
  let lines=['@startuml','hide footbox','skinparam monochrome true','skinparam defaultFontName Tahoma','skinparam defaultFontSize 16','skinparam sequenceMessageAlign center','skinparam responseMessageBelowArrow true',`title ${spec.title}`,`actor "${spec.actor.replaceAll('\n','\\n')}" as U`,`participant "${(spec.frontend || 'Frontend\\nReact / TypeScript').replaceAll('\n','\\n')}" as F`];
  if(spec.separateService){lines.push('participant "Backend" as B',`participant "${spec.service.replaceAll('\n','\\n')}" as S`);}
  else lines.push(`participant "${spec.service.replaceAll('\n','\\n')}" as B`);
  lines.push('database "PostgreSQL" as D');
  function emit(steps){for(const s of steps){
    if(s[0]==='msg'||s[0]==='return')lines.push(`${aliases[s[1]]} ${s[0]==='return'?'-->':'->'} ${aliases[s[2]]} : ${s[3].replaceAll('\n','\\n')}`);
    else if(s[0]==='self')lines.push(`${aliases[s[1]]} -> ${aliases[s[1]]} : ${s[2].replaceAll('\n','\\n')}`);
    else if(s[0]==='alt'){s[1].forEach((b,i)=>{lines.push(`${i?'else':'alt'} ${b.guard}`);emit(b.steps);});lines.push('end');}
    else if(s[0]==='opt'){lines.push(`opt ${s[1]}`);emit(s[2]);lines.push('end');}
    else if(s[0]==='note')lines.push(`note over U,D : ${s[1]}`);
  }}emit(spec.steps);lines.push('@enduml');return lines.join('\n')+'\n';
}

(async()=>{
  const graphs=specs.map(build);
  const target=process.argv[2] || null;
  if(target && !specs.some(s=>s.id===target))throw new Error('Unknown diagram: '+target);
  const wrap=g=>`<diagram id="${g.spec.id}" name="${esc(g.spec.figure+' '+g.spec.title)}">${g.model}</diagram>`;
  fs.writeFileSync(path.join(__dirname,'naphat-sequence-diagrams.drawio'),`<mxfile host="app.diagrams.net">${graphs.map(wrap).join('\n')}</mxfile>`);
  let browser;
  try{browser=await chromium.launch({headless:true});}catch{browser=await chromium.launch({headless:true,channel:'msedge'});}
  const qa=target&&fs.existsSync(path.join(__dirname,'render-qa.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'render-qa.json'),'utf8')).filter(x=>x.id!==target):[];
  try{
    const page=await browser.newPage({deviceScaleFactor:2});
    await page.route('**/*',route=>/^https:\/\/viewer\.diagrams\.net\//.test(route.request().url())?route.continue():route.abort());
    await page.setContent('<html><head><style>html,body{margin:0;background:white}#canvas{position:relative;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({url:'https://viewer.diagrams.net/js/viewer-static.min.js'});
    for(const g of graphs){
      if(target && g.spec.id!==target)continue;
      fs.writeFileSync(path.join(__dirname,g.spec.id+'.drawio'),`<mxfile host="app.diagrams.net">${wrap(g)}</mxfile>`);
      fs.writeFileSync(path.join(__dirname,g.spec.id+'.puml'),plantuml(g.spec));
      await page.setViewportSize({width:g.width,height:g.height});
      const result=await page.evaluate(({model,width,height})=>{
        if(window.taskGraph)window.taskGraph.destroy();
        const canvas=document.getElementById('canvas');canvas.innerHTML='';canvas.style.width=width+'px';canvas.style.height=height+'px';
        const graph=new Graph(canvas);graph.setEnabled(false);
        const doc=mxUtils.parseXml(model);new mxCodec(doc).decode(doc.documentElement,graph.getModel());graph.view.validate();window.taskGraph=graph;
        const errors=[],labelBoxes=[];
        for(const cell of Object.values(graph.model.cells)){
          if(!cell.vertex||!cell.value)continue;
          const s=graph.view.getState(cell),b=s?.text?.boundingBox;
          if(b)labelBoxes.push({id:cell.id,x:b.x,y:b.y,width:b.width,height:b.height});
          if(b&&(b.x<0||b.y<0||b.x+b.width>width||b.y+b.height>height))errors.push({id:cell.id,value:cell.value,reason:'outside-page'});
          if(b&&cell.style.includes('shape=note')&&(b.height>s.height||b.width>s.width))errors.push({id:cell.id,reason:'note-overflow'});
          if(b&&cell.style.includes('text;')&&!cell.value.includes('Sequence Diagram')&&b.height>s.height+3)errors.push({id:cell.id,value:cell.value,reason:'label-overflow',height:b.height,allocated:s.height});
        }
        for(let i=0;i<labelBoxes.length;i++)for(let j=i+1;j<labelBoxes.length;j++){
          const a=labelBoxes[i],b=labelBoxes[j];
          if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>2&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>2)errors.push({ids:[a.id,b.id],reason:'overlapping-labels'});
        }
        return {errors,cells:Object.keys(graph.model.cells).length};
      },g);
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:path.join(__dirname,g.spec.id+'.png'),fullPage:true});
      const svg=await page.evaluate(()=>new XMLSerializer().serializeToString(window.taskGraph.getSvg('#ffffff',1,14)));
      fs.writeFileSync(path.join(__dirname,g.spec.id+'.svg'),svg);
      qa.push({id:g.spec.id,width:g.width,height:g.height,messageCount:g.messageCount,...result});
    }
  }finally{await browser.close();}
  fs.writeFileSync(path.join(__dirname,'render-qa.json'),JSON.stringify(specs.map(s=>qa.find(q=>q.id===s.id)).filter(Boolean),null,2));
  process.stdout.write(JSON.stringify(qa));
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1;});
