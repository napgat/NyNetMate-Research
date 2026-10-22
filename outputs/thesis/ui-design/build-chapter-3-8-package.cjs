const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const reportPath = path.join(root, 'chapter-3-8-ui-design.md');
const report = fs.readFileSync(reportPath, 'utf8');
const packageDir = path.join(root, 'chapter-3-8-package');
const imageDir = path.join(packageDir, 'images');
const editableDir = path.join(packageDir, 'editable');
const images = [...report.matchAll(/!\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
  label: match[1],
  source: match[2].includes('/outputs/thesis/ui-design/') ? path.join(root, match[2].split('/outputs/thesis/ui-design/')[1]) : path.resolve(root, match[2]),
  originalSource: match[2],
  filename: path.basename(match[2]),
}));
const errors = [];
const captions = [...report.matchAll(/^\*รูป: .+\*$/gm)].length;
if (images.length !== 15) errors.push(`Expected 15 images, found ${images.length}`);
if (captions !== images.length) errors.push(`Caption count ${captions} does not match image count`);
if (new Set(images.map((item) => item.filename)).size !== images.length) {
  errors.push('Duplicate image filenames in portable package');
}
for (const heading of ['# 3.8 ', '## 3.8.1 ', '## 3.8.2 ']) {
  if (!report.includes(heading)) errors.push(`Missing heading: ${heading}`);
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
for (const item of images) {
  if (!fs.existsSync(item.source)) {
    errors.push(`Missing image: ${item.source}`);
    continue;
  }
  const data = fs.readFileSync(item.source);
  if (data.length < 24 || !data.subarray(0, 8).equals(signature)) {
    errors.push(`Invalid PNG: ${item.source}`);
    continue;
  }
  item.width = data.readUInt32BE(16);
  item.height = data.readUInt32BE(20);
  item.bytes = data.length;
  if (item.width < 1000 || item.height < 700) errors.push(`Low-resolution image: ${item.source}`);
}

const editableSources = [
  path.join(root, 'wireframes', 'mynetmate-ui-wireframes.drawio'),
  path.join(root, 'p2-operational-monitoring', 'dashboard-p2.drawio'),
  path.join(root, 'navigation-flow', 'navigation-flow.drawio'),
  path.join(root, 'navigation-flow', 'navigation-flow.mmd'),
];
for (const source of editableSources) {
  if (!fs.existsSync(source)) errors.push(`Missing editable source: ${source}`);
}

const qa = {
  report: reportPath,
  imageCount: images.length,
  captionCount: captions,
  images,
  editableSources,
  errors,
};
fs.writeFileSync(path.join(root, 'chapter-3-8-qa.json'), `${JSON.stringify(qa, null, 2)}\n`);
if (errors.length) throw new Error(errors.join('\n'));

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(editableDir, { recursive: true });
let portableReport = report;
for (const item of images) {
  fs.copyFileSync(item.source, path.join(imageDir, item.filename));
  portableReport = portableReport.split(item.originalSource).join(`images/${item.filename}`);
}
// Mechanical conversion only: report content remains identical; image targets become portable.
fs.writeFileSync(path.join(packageDir, 'chapter-3-8-ui-design.md'), portableReport);
for (const source of editableSources) fs.copyFileSync(source, path.join(editableDir, path.basename(source)));
fs.copyFileSync(path.join(root, 'chapter-3-8-qa.json'), path.join(packageDir, 'image-check.json'));
console.log(JSON.stringify({ packageDir, images: images.length, captions, editableFiles: editableSources.length, errors }));
