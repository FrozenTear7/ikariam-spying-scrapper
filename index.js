import puppeteer from 'puppeteer';
import 'dotenv/config';

(async () => {
  if (!process.env.IKARIAM_LOGIN || !process.env.IKARIAM_PASSWORD) {
    console.log('Set .env');
    exit(1);
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://lobby.ikariam.gameforge.com/pl_PL');
  await page.setViewport({ width: 1920, height: 1080 });

  const loginTabSelector = '#loginRegisterTabs > ul > li:nth-child(1)';
  await page.waitForSelector(loginTabSelector);
  await page.click(loginTabSelector);

  const loginInputSelector =
    '#loginForm > div:nth-child(2) > div > input[type=email]';
  await page.waitForSelector(loginInputSelector);
  await page.type(loginInputSelector, process.env.IKARIAM_LOGIN);

  const passwordInputSelector =
    '#loginForm > div:nth-child(3) > div > input[type=password]';
  await page.type(passwordInputSelector, process.env.IKARIAM_PASSWORD);

  const loginButtonSelector =
    '#loginForm > p > button.button.button-primary.button-lg';
  await page.click(loginButtonSelector);

  const worldSelectButtonSelector = '#joinGame > button';
  await page.waitForSelector(worldSelectButtonSelector);
  await page.click(worldSelectButtonSelector);

  const acceptCookiesSelector =
    '#city > div:nth-child(2) > div > div > span.cookiebanner4 > button:nth-child(2)';
  await page.waitForSelector(acceptCookiesSelector);
  await page.click(acceptCookiesSelector);

  await new Promise((r) => setTimeout(r, 100000));

  await browser.close();
})();
