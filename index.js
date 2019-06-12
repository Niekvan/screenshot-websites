const path = 'PATH_TO_YOUR_JSON_ARRAY_FILE'
const puppeteer = require('puppeteer');
const list = require(path);

async function run() {
  let browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await takeScreenshots(page);
  await page.close();
  await browser.close();
}

async function takeScreenshots(page, offset = 0) {
  const screenshot = await takeScreenshot(page, offset);
  if (screenshot.nextPage) {
    return screenshot.data.concat(
      await takeScreenshots(page, screenshot.nextPage)
    );
  } else {
    return screenshot.data;
  }
}

async function takeScreenshot(page, offset = 0) {
  const url = list[offset];
  const fileName = url.replace(/http(s)?:\/\//, '');
  console.log(fileName, `${offset + 1} of ${list.length}`);
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2'
      // timeout: 30000
    });
  } catch (e) {
    console.log('failed at page', url);
    return {
      data: `failed at ${url}`,
      nextPage: offset + 1 < list.length ? offset + 1 : undefined
    };
  }
  await page.screenshot({ path: `./images/idle2/${fileName}.png`, type: 'png' });
  return {
    data: fileName,
    nextPage: offset + 1 < list.length ? offset + 1 : undefined
  };
}

async function singelShot(url) {
  let browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const fileName = url.replace(/http(s)?:\/\//, '');
  console.log(fileName);
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 120000
    });
  } catch (e) {
    console.log('failed at page', url);
  }
  await page.screenshot({ path: `./new/idle2/${fileName}.png`, type: 'png' });
  console.log('screenshot taken');
  await page.close();
  await browser.close();
}

run();
// singelShot('https://blotter.js.org');
