const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const specs = JSON.parse(fs.readFileSync(path.join(__dirname, 'diagrams.json'), 'utf8'));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const html = value => esc(String(value).split('\n').map(esc).join('<br>'));
const font = 'fontFamily=Tahoma;fontSize=18;fontColor=#111111;';
const line = 'strokeColor=#111111;strokeWidth=1.3;';

function build(spec) {
  const labels = [spec.actor, ...spec.participants];
  const xs = labels.map((_, i) => i === 0 ? 150 : 490 + (i - 1) * 385);
  const width = xs.at(-1) + 170;
  let serial = 0, y = 190;
  const body = [], headers = [], activations = [], messages = [], semantics = [];
  const vertex = (dest, value, x, yy, w, h, style) => {
    const id = `c${++serial}`;
    dest.push(`<mxCell id="${id}" value="${html(value)}" vertex="1" parent="1" style="html=1;whiteSpace=wrap;${font}${style}"><mxGeometry x="${x}" y="${yy}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
    return id;
  };
  const edge = (dest, x1, y1, x2, y2, style) => {
    const id = `c${++serial}`;
    dest.push(`<mxCell id="${id}" value="" edge="1" parent="1" style="html=1;edgeStyle=none;rounded=0;${line}${style}"><mxGeometry relative="1" as="geometry"><mxPoint x="${x1}" y="${y1}" as="sourcePoint"/><mxPoint x="${x2}" y="${y2}" as="targetPoint"/></mxGeometry></mxCell>`);
    return id;
  };
  function frame(kind, start, end, branches, depth, range) {
    const [from, to] = range || [0, labels.length - 1];
    const left = Math.max(42, xs[from] - 108) + depth * 12;
    const right = Math.min(width - 40, xs[to] + 130) - depth * 12;
    vertex(body, '', left, start, right - left, end - start, `fillColor=none;${line}`);
    vertex(body, kind, left, start, 60, 28, `shape=umlFrame;fillColor=#ffffff;${line}fontStyle=1;fontSize=16;`);
    branches.forEach((branch, i) => {
      if (i) edge(body, left, branch.y, right, branch.y, 'endArrow=none;dashed=1;dashPattern=6 4;');
      vertex(body, branch.guard, left + 76, branch.y + 2, right - left - 88, 30, 'text;strokeColor=none;fillColor=none;labelBackgroundColor=#ffffff;align=left;verticalAlign=middle;spacing=1;');
    });
  }
  function emit(steps, depth = 0) {
    for (const step of steps) {
      const kind = step[0];
      if (kind === 'msg' || kind === 'return') {
        const [, from, to, label] = step;
        if (!Number.isInteger(from) || !Number.isInteger(to) || !labels[from] || !labels[to]) throw new Error(`Invalid participant in ${spec.id}`);
        const yy = y + 60, direction = from < to ? 1 : -1;
        const x1 = xs[from] + (from === 0 ? 0 : direction * 7);
        const x2 = xs[to] - (to === 0 ? 0 : direction * 7);
        const arrowId = edge(body, x1, yy, x2, yy, `endArrow=${kind === 'return' ? 'open' : 'block'};endFill=${kind === 'return' ? 0 : 1};${kind === 'return' ? 'dashed=1;dashPattern=5 4;' : ''}`);
        const labelId = vertex(body, label, Math.min(xs[from], xs[to]) + 16, y + 2, Math.abs(xs[to] - xs[from]) - 32, 52, 'text;strokeColor=none;fillColor=#ffffff;align=center;verticalAlign=middle;spacing=1;');
        messages.push({from, to, y: yy, kind});
        semantics.push({kind, from: labels[from], to: labels[to], label, arrowId, labelId});
        y += 78;
      } else if (kind === 'alt') {
        const start = y, branches = [];
        for (const branch of step[1]) {
          branches.push({guard: branch.guard, y});
          semantics.push({kind: 'alt-guard', label: branch.guard});
          y += 40; emit(branch.steps, depth + 1); y += 10;
        }
        frame('alt', start, y, branches, depth, step[2]); y += 16;
      } else if (kind === 'loop' || kind === 'opt') {
        const start = y;
        semantics.push({kind, label: step[1]});
        y += 40; emit(step[2], depth + 1); y += 10;
        frame(kind, start, y, [{guard: step[1], y: start}], depth, step[3]); y += 16;
      } else if (kind === 'note') {
        semantics.push({kind, label: step[1]});
        vertex(body, step[1], 64, y, width - 128, 52, `shape=note;fillColor=#ffffff;${line}fontSize=16;spacing=8;`);
        y += 74;
      } else throw new Error(`Unknown step ${kind}`);
    }
  }
  emit(spec.steps);
  const height = y + 58;
  vertex(headers, spec.title, 48, 18, width - 96, 38, 'text;fillColor=none;strokeColor=none;fontSize=24;fontStyle=1;');
  labels.forEach((label, i) => {
    if (i === 0) {
      vertex(headers, '', xs[i] - 24, 62, 48, 55, `shape=umlActor;outlineConnect=0;fillColor=#ffffff;${line}`);
      vertex(headers, label, xs[i] - 140, 120, 280, 52, 'text;strokeColor=none;fillColor=#ffffff;align=center;verticalAlign=top;fontSize=16;');
    } else {
      vertex(headers, label, xs[i] - 110, 60, 220, 64, `fillColor=#ffffff;${line}`);
    }
    edge(headers, xs[i], i === 0 ? 177 : 124, xs[i], height - 35, 'endArrow=none;dashed=1;dashPattern=4 4;strokeWidth=1;strokeColor=#666666;');
  });
  labels.forEach((label, who) => {
    if (who === 0) return;
    const related = messages.filter(m => m.from === who || m.to === who);
    if (!related.length) return;
    const segments = [];
    if (/^(PostgreSQL|Device via SNMP|Network Devices)$/.test(label)) {
      let start = null;
      for (const m of related) {
        if (m.to === who && m.kind === 'msg' && start === null) start = m.y - 8;
        if (m.from === who && m.kind === 'return') {
          segments.push([start === null ? m.y - 30 : start, m.y + 8]); start = null;
        }
      }
      if (start !== null) segments.push([start, related.at(-1).y + 8]);
    } else segments.push([related[0].y - 8, related.at(-1).y + 10]);
    segments.forEach(([start, end]) => vertex(activations, '', xs[who] - 7, start, 14, end - start, `fillColor=#ffffff;${line}`));
  });
  const model = `<mxGraphModel page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${[...headers, ...activations, ...body].join('\n')}</root></mxGraphModel>`;
  return {spec, model, width, height, labels, semantics, messageCount: messages.length};
}

(async () => {
  const graphs = specs.map(build);
  const wrap = g => `<diagram id="${g.spec.id}" name="${esc(g.spec.figure + ' ' + g.spec.title)}">${g.model}</diagram>`;
  fs.writeFileSync(path.join(__dirname, 'teammate-sequence-diagrams.drawio'), `<mxfile host="app.diagrams.net">${graphs.map(wrap).join('\n')}</mxfile>`);
  for (const g of graphs) fs.writeFileSync(path.join(__dirname, g.spec.id + '.drawio'), `<mxfile host="app.diagrams.net">${wrap(g)}</mxfile>`);
  let browser;
  try { browser = await chromium.launch({headless: true}); }
  catch { browser = await chromium.launch({headless: true, channel: 'msedge'}); }
  const qa = [];
  try {
    const page = await browser.newPage({deviceScaleFactor: 1.5});
    // Only the static diagrams.net renderer is downloaded. Models stay in the local page.
    await page.route('**/*', route => /^https:\/\/viewer\.diagrams\.net\//.test(route.request().url()) ? route.continue() : route.abort());
    await page.setContent('<html><head><style>html,body{margin:0;background:white}#canvas{position:relative;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({url: 'https://viewer.diagrams.net/js/viewer-static.min.js'});
    for (const g of graphs) {
      await page.setViewportSize({width: g.width, height: g.height});
      const result = await page.evaluate(({model, width, height, semantics}) => {
        if (window.taskGraph) window.taskGraph.destroy();
        const canvas = document.getElementById('canvas'); canvas.innerHTML = ''; canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
        const graph = new Graph(canvas); graph.setEnabled(false);
        new mxCodec(mxUtils.parseXml(model)).decode(mxUtils.parseXml(model).documentElement, graph.getModel()); graph.view.validate(); window.taskGraph = graph;
        const errors = [], labelBoxes = [];
        const plain = value => { const div = document.createElement('div'); div.innerHTML = value.replace(/<br\s*\/?\s*>/gi, ' '); return div.textContent.replace(/\s+/g, ' ').trim(); };
        for (const cell of Object.values(graph.model.cells)) {
          if (cell.style?.includes('image=')) errors.push({id: cell.id, reason: 'non-editable-image'});
          if (!cell.vertex || !cell.value) continue;
          const state = graph.view.getState(cell), box = state?.text?.boundingBox;
          if (box) labelBoxes.push({id: cell.id, x: box.x, y: box.y, width: box.width, height: box.height});
          if (box && (box.x < 0 || box.y < 0 || box.x + box.width > width || box.y + box.height > height)) errors.push({id: cell.id, reason: 'outside-page'});
          if (box && box.height > state.height + 3) errors.push({id: cell.id, value: cell.value, reason: 'label-overflow', height: box.height, allocated: state.height});
        }
        for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
          const a = labelBoxes[i], b = labelBoxes[j];
          if (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 2 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 2) errors.push({ids: [a.id, b.id], reason: 'overlapping-labels'});
        }
        const mapped = semantics.filter(s => s.arrowId);
        for (const s of mapped) {
          const arrow = graph.model.getCell(s.arrowId), label = graph.model.getCell(s.labelId);
          if (!arrow?.edge || !label?.vertex || plain(label.value) !== s.label.replace(/\s+/g, ' ').trim()) errors.push({id: s.labelId, reason: 'source-action-mismatch'});
        }
        return {errors, cells: Object.keys(graph.model.cells).length, verifiedMessageLabels: mapped.length};
      }, g);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({path: path.join(__dirname, g.spec.id + '.png'), fullPage: true});
      const svg = await page.evaluate(() => new XMLSerializer().serializeToString(window.taskGraph.getSvg('#ffffff', 1, 14)));
      fs.writeFileSync(path.join(__dirname, g.spec.id + '.svg'), svg);
      qa.push({id: g.spec.id, width: g.width, height: g.height, messageCount: g.messageCount, ...result});
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, 'render-qa.json'), JSON.stringify(qa, null, 2));
  fs.writeFileSync(path.join(__dirname, 'source-actions.json'), JSON.stringify(graphs.map(g => ({id: g.spec.id, sourceImageId: g.spec.sourceImageId, participants: g.labels, actions: g.semantics})), null, 2));
  process.stdout.write(JSON.stringify(qa));
  if (qa.some(g => g.errors.length)) process.exitCode = 1;
})().catch(error => { process.stderr.write(error.stack); process.exitCode = 1; });
