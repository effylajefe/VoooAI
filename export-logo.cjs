const { writeFileSync } = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body></body>
</html>`;

async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const dataUrl = await page.evaluate(async () => {
    await document.fonts.ready;
    const scale = 4;
    const lw = 48 * scale;
    const lh = 48 * scale;
    const r = 10 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = lw;
    canvas.height = lh;
    const ctx = canvas.getContext('2d');

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    const grad = ctx.createLinearGradient(0, 0, lw, lh);
    grad.addColorStop(0, '#00d4aa');
    grad.addColorStop(1, '#e040fb');

    roundRect(ctx, 0, 0, lw, lh, r);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    roundRect(ctx, 0, 0, lw, lh, r);
    ctx.clip();
    const hlGrad = ctx.createLinearGradient(0, 0, 0, 8 * scale);
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.2)');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.fillRect(0, 0, lw, 8 * scale);
    ctx.restore();

    ctx.font = '700 ' + (22 * scale) + 'px "JetBrains Mono", monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', lw/2, lh/2);

    return canvas.toDataURL('image/png');
  });
  await browser.close();

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const buf = Buffer.from(base64, 'base64');
  const outPath = path.join(__dirname, 'assets', 'voooai-logo.png');
  writeFileSync(outPath, buf);
  console.log('Exported:', outPath);
}

main().catch(console.error);
