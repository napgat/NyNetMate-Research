const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/evilm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const xml = fs.readFileSync(path.join(__dirname, 'usecase-diagram-layout.drawio'), 'utf8');
  let browser;
  try { browser = await chromium.launch({headless:true}); }
  catch { browser = await chromium.launch({headless:true,channel:'msedge'}); }
  try {
    const page = await browser.newPage({viewport:{width:1400,height:1220},deviceScaleFactor:1.5});
    await page.route('**/*', route => {
      const url = route.request().url();
      if (/^https:\/\/(www\.)?drawio\.com\//.test(url) || /^https:\/\/(app|viewer)\.diagrams\.net\//.test(url)) return route.continue();
      return route.abort();
    });
    await page.setContent('<html><head><style>html,body{margin:0;background:white;font-family:Arial}#canvas{position:relative;width:1400px;height:1220px;overflow:hidden}</style></head><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({url:'https://viewer.diagrams.net/js/viewer-static.min.js'});
    const result = await page.evaluate(xml => {
      if (typeof Graph !== 'function') throw new Error('Native Graph renderer unavailable');
      const graph = new Graph(document.getElementById('canvas'));
      graph.setEnabled(false);
      const xmlDoc = mxUtils.parseXml(xml);
      new mxCodec(xmlDoc).decode(xmlDoc.getElementsByTagName('mxGraphModel')[0],graph.getModel());
      graph.view.validate();
      const bounds=graph.getGraphBounds();
      const labelErrors=[];
      for(const cell of Object.values(graph.model.cells)){
        if(cell.vertex && graph.view.getState(cell)?.text?.boundingBox){
          const b=graph.view.getState(cell).text.boundingBox;
          if(b.x<0||b.y<0||b.x+b.width>1400||b.y+b.height>1220)labelErrors.push(cell.id);
        }
      }
      window.taskGraph=graph;
      return {bounds:{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height},labelErrors,cellCount:Object.keys(graph.model.cells).length};
    },xml);
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(__dirname,'usecase-diagram-layout.png'),fullPage:true});
    const svg=await page.evaluate(()=>new XMLSerializer().serializeToString(window.taskGraph.getSvg('#ffffff',1,15)));
    fs.writeFileSync(path.join(__dirname,'usecase-diagram-layout.svg'),svg);
    process.stdout.write(JSON.stringify(result));
  } finally {await browser.close();}
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1});
