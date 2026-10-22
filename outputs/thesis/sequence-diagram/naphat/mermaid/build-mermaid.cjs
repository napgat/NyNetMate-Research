const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const specs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'diagrams.json'), 'utf8'));
const version = '11.12.0';
const aliases = ['U', 'F', 'B', 'D'];
const label = value => String(value).replaceAll(';', '#59;').replaceAll('&', '#38;').replaceAll('\n', '<br/>');
const guard = value => label(value.replace(/^\[(.*)\]$/s, '$1'));
const html = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const config = {
  theme: 'base',
  fontFamily: 'Tahoma, Arial, sans-serif',
  themeVariables: {
    background: '#ffffff', primaryColor: '#ffffff', primaryBorderColor: '#111111', primaryTextColor: '#111111',
    secondaryColor: '#ffffff', tertiaryColor: '#ffffff', lineColor: '#111111', textColor: '#111111',
    actorBkg: '#ffffff', actorBorder: '#111111', actorTextColor: '#111111', actorLineColor: '#111111',
    signalColor: '#111111', signalTextColor: '#111111',
    labelBoxBkgColor: '#ffffff', labelBoxBorderColor: '#111111', labelTextColor: '#111111', loopTextColor: '#111111',
    noteBkgColor: '#ffffff', noteBorderColor: '#111111', noteTextColor: '#111111',
    activationBkgColor: '#d9d9d9', activationBorderColor: '#666666', sequenceNumberColor: '#111111'
  },
  themeCSS: '.actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}',
  sequence: {useMaxWidth: false, mirrorActors: true, actorMargin: 70, messageMargin: 35, noteMargin: 14}
};

function convert(spec) {
  const diagramConfig = ['fig-3-6-login', 'fig-3-7-view-dashboard', 'fig-3-12-view-topology', 'fig-3-13-user-management', 'fig-3-14-audit-history'].includes(spec.id) ? {...config, themeVariables: {...config.themeVariables, fontSize: '17px'}, sequence: {...config.sequence, actorFontSize: 17, messageFontSize: 17, noteFontSize: 17}, themeCSS: config.themeCSS + 'text,tspan{font-size:17px!important}'} : config;
  const roleAliases=spec.separateService?['U','F','B','S','D']:aliases;
  const lines = [`%%{init: ${JSON.stringify(diagramConfig)}}%%`, 'sequenceDiagram', `    actor U as ${label(spec.actor.replaceAll('\n', ' / '))}`, `    participant F as ${label(spec.frontend || 'Frontend (React / TypeScript)')}`, `    participant B as ${spec.separateService ? 'Backend' : label(spec.service)}`];
  if(spec.separateService)lines.push(`    participant S as ${label(spec.service)}`);
  lines.push('    participant D as PostgreSQL');
  const dbIndex=roleAliases.length-1;
  let fActive=false,bActive=false,sActive=false,dActive=false,messageCount=0,fragmentCount=0;
  function emit(steps, depth = 1) {
    const put = text => lines.push('    '.repeat(depth) + text);
    for (const step of steps) {
      if (step[0] === 'msg' || step[0] === 'return' || step[0] === 'self') {
        const self = step[0] === 'self';
        const from = step[1], to = self ? from : step[2], text = self ? step[2] : step[3];
        put(`${roleAliases[from]}${step[0] === 'return' ? (['fig-3-6-login', 'fig-3-7-view-dashboard', 'fig-3-12-view-topology', 'fig-3-13-user-management', 'fig-3-14-audit-history'].includes(spec.id) ? '--)' : '-->>') : '->>'}${roleAliases[to]}: ${label(text)}`);
        messageCount++;
        if (to === 1 && !fActive) { put('activate F'); fActive = true; }
        if (to === 2 && !bActive) { put('activate B'); bActive = true; }
        if (spec.separateService && to === 3 && !sActive) { put('activate S'); sActive = true; }
        if (to === dbIndex && !dActive) { put('activate D'); dActive = true; }
        if (from === dbIndex && dActive) { put('deactivate D'); dActive = false; }
      } else if (step[0] === 'alt') {
        fragmentCount++;
        step[1].forEach((branch, i) => { put(`${i ? 'else' : 'alt'} ${guard(branch.guard)}`); emit(branch.steps, depth + 1); });
        put('end');
      } else if (step[0] === 'opt') {
        fragmentCount++;
        put(`opt ${guard(step[1])}`); emit(step[2], depth + 1); put('end');
      } else if (step[0] === 'note') {
        if (dActive) { put('deactivate D'); dActive = false; }
        if (sActive) { put('deactivate S'); sActive = false; }
        if (bActive) { put('deactivate B'); bActive = false; }
        if (fActive) { put('deactivate F'); fActive = false; }
        put(`Note over U,D: ${label(step[1])}`);
      } else throw new Error(`Unsupported source step: ${step[0]}`);
    }
  }
  emit(spec.steps);
  return {spec, code: lines.join('\n') + '\n', messageCount, fragmentCount};
}

(async () => {
  const diagrams = specs.map(convert);
  const target=process.argv[2] || null;
  if(target&&!specs.some(s=>s.id===target))throw new Error('Unknown diagram '+target);
  const markdown = ['# Sequence Diagram ของนภัทร — Mermaid ขาวดำ', '', 'แปลงจากชุด Draw.io เดิมโดยคงข้อความ ลำดับ และเงื่อนไข ใช้พื้นขาว ตัวอักษรและเส้นสีดำ กล่องไม่มีสี และ Activation สีเทา ตามรูปแบบภาพของเพื่อน เหมาะสำหรับรายงานและการพิมพ์ขาวดำ', '', 'ประกอบด้วย Login, View Dashboard, View Topology, User Management และ Audit History', '', 'Dashboard และการตรวจสิทธิ์ของ Topology เป็นลำดับตามการออกแบบ ไม่ใช่การรับรองว่า Implementation เสร็จครบแล้ว เลขรูปคงตามชุดเดิม', ''];
  for (const d of diagrams) {
    if(!target || d.spec.id===target)fs.writeFileSync(path.join(__dirname, d.spec.id + '.mmd'), d.code);
    markdown.push(`## รูป ${d.spec.figure} ${d.spec.title}`, '', '```mermaid', d.code.trimEnd(), '```', '');
  }
  fs.writeFileSync(path.join(__dirname, 'naphat-sequence-diagrams.md'), markdown.join('\n'));
  let browser;
  try { browser = await chromium.launch({headless: true}); }
  catch { browser = await chromium.launch({headless: true, channel: 'msedge'}); }
  const results=target&&fs.existsSync(path.join(__dirname,'render-qa.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'render-qa.json'),'utf8')).filter(x=>x.id!==target):[], previews=[];
  try {
    const page = await browser.newPage({deviceScaleFactor: 1.5});
    await page.route('**/*', route => route.request().url().startsWith(`https://cdn.jsdelivr.net/npm/mermaid@${version}/`) ? route.continue() : route.abort());
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:white}#diagram{display:inline-block;padding:24px;background:white}svg{display:block;max-width:none!important}</style></head><body><div id="diagram"></div></body></html>');
    await page.evaluate(async version => { window.mermaid = (await import(`https://cdn.jsdelivr.net/npm/mermaid@${version}/dist/mermaid.esm.min.mjs`)).default; window.mermaid.initialize({startOnLoad: false, securityLevel: 'strict'}); }, version);
    for (const d of diagrams) {
      if(target && d.spec.id!==target)continue;
      const rendered = await page.evaluate(async ({code, id}) => {
        await window.mermaid.parse(code);
        const container = document.getElementById('diagram'); container.innerHTML = '';
        const result = await window.mermaid.render('diagram_' + id.replaceAll('-', '_'), code);
        container.innerHTML = result.svg;
        await document.fonts.ready;
        const svg = container.querySelector('svg');
        svg.style.backgroundColor = '#ffffff';
        const original = svg.viewBox.baseVal, content = svg.getBBox();
        const left = Math.min(original.x, content.x - 12), top = Math.min(original.y, content.y - 12);
        const right = Math.max(original.x + original.width, content.x + content.width + 12);
        const bottom = Math.max(original.y + original.height, content.y + content.height + 12);
        svg.setAttribute('viewBox', `${left} ${top} ${right - left} ${bottom - top}`);
        const box = svg.viewBox.baseVal;
        svg.setAttribute('width', Math.ceil(box.width)); svg.setAttribute('height', Math.ceil(box.height));
        const labels = [...svg.querySelectorAll('text')].map(n => n.textContent);
        const messages = [...svg.querySelectorAll('text.messageText')].map(n => n.textContent);
        const arrowCount = svg.querySelectorAll('.messageLine0, .messageLine1').length;
        const actualMessageFontSize = getComputedStyle(svg.querySelector('text.messageText')).fontSize;
        const errors = [];
        const nonGrayscale = [];
        for (const node of svg.querySelectorAll('text,tspan,rect,line,path,circle,polygon,polyline')) {
          if (node.closest('defs')) continue;
          const style = getComputedStyle(node);
          for (const property of ['fill', 'stroke']) {
            const color = style[property], match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match && !(match[1] === match[2] && match[2] === match[3])) nonGrayscale.push({tag: node.tagName, property, color});
          }
        }
        if (nonGrayscale.length) errors.push({reason: 'non-grayscale-color', elements: nonGrayscale});
        for (const node of svg.querySelectorAll('text')) {
          const b = node.getBoundingClientRect(), bounds = svg.getBoundingClientRect();
          if (b.left < bounds.left - 3 || b.top < bounds.top - 3 || b.right > bounds.right + 3 || b.bottom > bounds.bottom + 3) errors.push({text: node.textContent, reason: 'outside-svg'});
        }
        return {svg: new XMLSerializer().serializeToString(svg), width: Math.ceil(box.width), height: Math.ceil(box.height), labels, messages, arrowCount, actualMessageFontSize, nonGrayscaleElements: nonGrayscale.length, errors};
      }, {code: d.code, id: d.spec.id});
      if(['fig-3-6-login', 'fig-3-7-view-dashboard', 'fig-3-12-view-topology', 'fig-3-13-user-management', 'fig-3-14-audit-history'].includes(d.spec.id) && rendered.actualMessageFontSize !== '17px') rendered.errors.push({reason:'font-size-mismatch',expected:'17px',actual:rendered.actualMessageFontSize});
      const expected = [];
      function walk(steps) { for (const s of steps) {
        if (s[0] === 'msg' || s[0] === 'return') expected.push(s[3]);
        else if (s[0] === 'self') expected.push(s[2]);
        else if (s[0] === 'alt') s[1].forEach(b => walk(b.steps));
        else if (s[0] === 'opt') walk(s[2]);
      } }
      walk(d.spec.steps);
      const normal = text => text.replace(/\s+/g, '');
      if (rendered.arrowCount !== expected.length) rendered.errors.push({reason: 'message-count-mismatch', expected: expected.length, actual: rendered.arrowCount});
      const expectedLines = expected.flatMap(text => text.split('\n'));
      if (rendered.messages.length !== expectedLines.length) rendered.errors.push({reason: 'message-line-count-mismatch', expected: expectedLines.length, actual: rendered.messages.length});
      expectedLines.forEach((text, i) => { if (normal(text) !== normal(rendered.messages[i] || '')) rendered.errors.push({reason: 'message-text-mismatch', index: i, expected: text, actual: rendered.messages[i]}); });
      fs.writeFileSync(path.join(__dirname, d.spec.id + '.svg'), rendered.svg);
      await page.setViewportSize({width: rendered.width + 48, height: rendered.height + 48});
      await page.locator('#diagram').screenshot({path: path.join(__dirname, d.spec.id + '.png')});
      results.push({id: d.spec.id, mermaidVersion: version, style: 'monochrome-peer-style', nonGrayscaleElements: rendered.nonGrayscaleElements, messageCount: d.messageCount, renderedMessageCount: rendered.arrowCount, fragmentCount: d.fragmentCount, width: rendered.width, height: rendered.height, errors: rendered.errors});
      previews.push(`<section id="${d.spec.id}"><h2>รูป ${d.spec.figure} ${html(d.spec.title)}</h2><div class="figure">${rendered.svg}</div><details><summary>โค้ด Mermaid</summary><pre>${html(d.code)}</pre></details></section>`);
    }
  } finally { await browser.close(); }
  const preview = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sequence Diagram ของนภัทร — Mermaid</title><style>body{font-family:Tahoma,Arial,sans-serif;color:#202130;margin:0;background:#f5f6f8}main{max-width:1600px;margin:auto;padding:28px}h1{font-size:26px}nav{display:flex;gap:12px;flex-wrap:wrap}a{color:#334eac}section{background:white;border:1px solid #dddfe6;border-radius:10px;margin:24px 0;padding:20px}h2{font-size:20px}.figure{overflow:auto;background:white;padding:12px}svg{max-width:100%;height:auto}pre{overflow:auto;background:#f7f7fa;padding:16px;line-height:1.6;font-size:13px}summary{cursor:pointer;margin-top:16px}@media print{body{background:white}section{break-before:page;border:0}nav,details{display:none}}</style></head><body><main><h1>Sequence Diagram ของนภัทร — Mermaid</h1><p>ทั้ง 5 ภาพคงลำดับและเงื่อนไขจากชุดเดิม เปิดดูได้แบบออฟไลน์</p><nav>${diagrams.map(d => `<a href="#${d.spec.id}">${html(d.spec.title.replace(' Sequence Diagram', ''))}</a>`).join('')}</nav>${previews.join('')}</main></body></html>`;
  const monochromePreview = preview.replaceAll('Sequence Diagram ของนภัทร — Mermaid', 'Sequence Diagram ของนภัทร — Mermaid ขาวดำ').replace('</style>', 'body,main{background:#fff;color:#111}a{color:#111}section{border:1px solid #aaa;border-radius:0}pre{background:#f5f5f5}</style>');
  const previewPath=path.join(__dirname,'preview.html');
  if(target&&fs.existsSync(previewPath)){
    const old=fs.readFileSync(previewPath,'utf8'), start=old.indexOf('<section id="'+target+'">');
    const end=old.indexOf('</section>',start);
    if(start<0||end<0)throw new Error('Cannot find target preview section');
    fs.writeFileSync(previewPath,old.slice(0,start)+previews[0]+old.slice(end+'</section>'.length));
  }else fs.writeFileSync(previewPath,monochromePreview);
  fs.writeFileSync(path.join(__dirname, 'render-qa.json'), JSON.stringify(specs.map(s=>results.find(q=>q.id===s.id)).filter(Boolean), null, 2));
  process.stdout.write(JSON.stringify(results));
  if (results.some(r => r.errors.length)) process.exitCode = 1;
})().catch(error => { process.stderr.write(error.stack); process.exitCode = 1; });
