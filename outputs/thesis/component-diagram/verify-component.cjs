const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const root = __dirname;
  const svg = fs.readFileSync(path.join(root, 'network-management-components.svg'), 'utf8');
  const source = fs.readFileSync(path.join(root, 'network-management-components.puml'), 'utf8');
  const markdown = fs.readFileSync(path.join(root, 'component-diagram-network-management.md'), 'utf8');
  const png = fs.readFileSync(path.join(root, 'network-management-components.png'));
  const errors = [];
  const imageTargets = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
  for (const target of imageTargets) if (!fs.existsSync(target)) errors.push({ reason: 'missing-image', target });
  if (imageTargets.length !== 1) errors.push({ reason: 'unexpected-image-count', count: imageTargets.length });
  if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) errors.push({ reason: 'invalid-png' });
  const prohibited = /Operational Monitoring|P2|Config Generation|CIS|SSH Push|AI Config/;
  if (prohibited.test(source) || prohibited.test(markdown)) errors.push({ reason: 'out-of-scope-content' });

  let browser;
  try { browser = await chromium.launch({ headless: true }); }
  catch { browser = await chromium.launch({ headless: true, channel: 'msedge' }); }
  let visual;
  try {
    const page = await browser.newPage();
    await page.setContent(svg);
    await page.evaluate(() => document.fonts.ready);
    visual = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const bounds = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text')].map(element => {
        const box = element.getBoundingClientRect();
        return { text: element.textContent, x: box.x - bounds.x, y: box.y - bounds.y, width: box.width, height: box.height };
      });
      const issues = [];
      for (const label of labels) {
        if (label.x < -1 || label.y < -1 || label.x + label.width > bounds.width + 1 || label.y + label.height > bounds.height + 1) {
          issues.push({ reason: 'text-outside-image', text: label.text });
        }
      }
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i], b = labels[j];
        const dx = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        const dy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        if (dx > 2 && dy > 2) issues.push({ reason: 'overlapping-text', labels: [a.text, b.text] });
      }
      return { width: bounds.width, height: bounds.height, labels: labels.length, issues };
    });
  } finally { await browser.close(); }
  errors.push(...visual.issues);
  const result = {
    scope: 'Current Network Management component structure; no future monitoring features',
    components: (source.match(/^\s*component /gm) || []).length,
    providedInterfaces: (source.match(/^interface /gm) || []).length,
    imageTargets,
    png: { width: png.readUInt32BE(16), height: png.readUInt32BE(20), bytes: png.length },
    svg: { width: visual.width, height: visual.height, labels: visual.labels },
    errors,
    limitation: 'Source/diagram/render verification only; not a MyNetMate runtime or end-to-end test',
  };
  fs.writeFileSync(path.join(root, 'render-qa.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result));
  if (errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
