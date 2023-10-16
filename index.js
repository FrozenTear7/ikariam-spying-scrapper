import puppeteer from 'puppeteer';
import 'dotenv/config';

(async () => {
  if (!process.env.IKARIAM_LOGIN || !process.env.IKARIAM_PASSWORD) {
    console.log('Set .env');
    exit(1);
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  // Close the newly opened page on login
  browser.on('targetcreated', async (target) => {
    if (target.type() !== 'page') return;

    if (target.url() === 'https://lobby.ikariam.gameforge.com/loading') {
      const newPage = await target.page();
      await new Promise((r) => setTimeout(r, 5000));
      await newPage.close();
    }
  });

  const page = await browser.newPage();
  await page.goto('https://lobby.ikariam.gameforge.com/pl_PL');

  // Cookies

  const acceptCookiesSelector =
    'body > div:nth-child(5) > div > div > span.cookiebanner4 > button:nth-child(2)';
  await page.waitForSelector(acceptCookiesSelector);
  await page.click(acceptCookiesSelector);

  // Login tab switch

  const loginTabSelector = '#loginRegisterTabs > ul > li:nth-child(1)';
  await page.waitForSelector(loginTabSelector);
  await page.click(loginTabSelector);

  // Login input

  const loginInputSelector =
    '#loginForm > div:nth-child(2) > div > input[type=email]';
  await page.waitForSelector(loginInputSelector);
  await page.type(loginInputSelector, process.env.IKARIAM_LOGIN);

  // Password input

  const passwordInputSelector =
    '#loginForm > div:nth-child(3) > div > input[type=password]';
  await page.type(passwordInputSelector, process.env.IKARIAM_PASSWORD);

  // Press login button

  const loginButtonSelector =
    '#loginForm > p > button.button.button-primary.button-lg';
  await page.click(loginButtonSelector);

  // Choose latest world

  const worldSelectButtonSelector = '#joinGame > button';
  await page.waitForSelector(worldSelectButtonSelector);
  await page.click(worldSelectButtonSelector);

  // The other page login has been handled ->

  await page.goto('https://s54-pl.ikariam.gameforge.com');

  // Open the island view

  const viewIslandNavSelector = '#js_islandLink';
  await page.waitForSelector(viewIslandNavSelector);
  await page.click(viewIslandNavSelector);

  await new Promise((r) => setTimeout(r, 100000));

  await browser.close();
})();
