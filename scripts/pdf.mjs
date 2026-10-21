// Renders every CV role to dist/cv/<slug>.pdf from the built site.
// Runs after `astro build`; uses the same pages people see, printed by Chromium.
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { chromium } from 'playwright';

const { roles } = await import('../src/data/roles.ts');
// The same design for every run, whatever a visitor would see (the paper itself ignores the design).
const { DEFAULT_DESIGN } = await import('../src/lib/design.ts');

const server = await preview({ root: fileURLToPath(new URL('..', import.meta.url)), logLevel: 'warn' });
const base = `http://localhost:${server.port}`;
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  for (const role of roles) {
    await page.goto(`${base}/cv/${role.slug}/?design=${DEFAULT_DESIGN}`, { waitUntil: 'networkidle' });
    await page.pdf({
      path: fileURLToPath(new URL(`../dist/cv/${role.slug}.pdf`, import.meta.url)),
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
    });
    console.log(`cv/${role.slug}.pdf`);
  }
} finally {
  await browser.close();
  await server.stop();
}
