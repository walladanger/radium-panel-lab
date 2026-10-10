import { chromium } from 'playwright';
const PAGE = new URL('../index.html', import.meta.url).href;
const launch = () => chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const b = await launch();
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto(PAGE);
await p.waitForTimeout(800);
await p.screenshot({ path: 'smoke.png' });
for (const l of ['Tiles','Split','Tabs','Rows']) { await p.getByRole('button', { name: l, exact: true }).click(); await p.waitForTimeout(400); }
console.log('errors', JSON.stringify(errs));
await b.close();
