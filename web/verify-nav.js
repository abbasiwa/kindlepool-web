import { chromium } from 'playwright';

const base = 'http://localhost:4199';

async function visible(page, sel) {
  const el = await page.$(sel);
  if (!el) return false;
  return el.isVisible();
}

(async () => {
  const browser = await chromium.launch();
  const results = [];

  // Non-auth mobile
  const ctx = await browser.newContext({ viewport: { width: 375, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const navLabels = await page.$$eval('nav[class*="fixed bottom-0"] button span', els => els.map(e => e.textContent));
  results.push({ label: 'anon-bottomnav-labels', labels: navLabels });
  // No prominent raised icon: check all buttons share the same flex layout
  const btnClasses = await page.$$eval('nav[class*="fixed bottom-0"] button', els => els.map(e => e.className.includes('-top-5')));
  results.push({ label: 'anon-bottomnav-no-prominent', noProminent: !btnClasses.some(Boolean) });
  // Header on mobile: no profile icon link to /settings
  results.push({ label: 'anon-header-no-settings-icon', noSettingsIcon: !(await page.$('header a[aria-label="Settings"]')) });
  // header text on mobile
  const headerText = await page.$eval('header', el => el.textContent);
  results.push({ label: 'anon-header-text', text: headerText.replace(/\s+/g, ' ').trim() });

  // Open menu (anon) — should show only public pages
  await page.click('button[aria-label="Menu"]');
  await page.waitForTimeout(500);
  const menuLinks = await page.$$eval('[role="dialog"] a', els => els.map(e => e.textContent.trim()));
  results.push({ label: 'anon-menu-links', links: menuLinks });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await ctx.close();

  // Auth mobile
  const actx = await browser.newContext({ viewport: { width: 375, height: 780 } });
  const apage = await actx.newPage();
  await apage.goto(base + '/', { waitUntil: 'networkidle' });
  await apage.evaluate(() => {
    localStorage.setItem('kindlepool_session', 't');
    localStorage.setItem('kindlepool_user', JSON.stringify({ id: '1', email: 'user@example.com', linkedWallets: [] }));
  });
  await apage.reload({ waitUntil: 'networkidle' });
  await apage.waitForTimeout(600);
  const authLabels = await apage.$$eval('nav[class*="fixed bottom-0"] button span', els => els.map(e => e.textContent));
  results.push({ label: 'auth-bottomnav-labels', labels: authLabels });
  const headerText2 = await apage.$eval('header', el => el.textContent);
  results.push({ label: 'auth-header-text', text: headerText2.replace(/\s+/g, ' ').trim() });
  await apage.click('button[aria-label="Menu"]');
  await apage.waitForTimeout(500);
  const authMenuLinks = await apage.$$eval('[role="dialog"] a', els => els.map(e => e.textContent.trim()));
  results.push({ label: 'auth-menu-links', links: authMenuLinks });
  await actx.close();

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
