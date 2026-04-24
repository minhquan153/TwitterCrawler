const puppeteer = require("puppeteer-core");

async function loginX() {
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: false,
      defaultViewport: null,
      userDataDir: "C:\\Users\\Adminn\\puppeteer-data",
      args: ["--disable-blink-features=AutomationControlled"],
    });

    const page = await browser.newPage();

    await page.goto("https://x.com/login", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("LOGIN TAY DI.");
    console.log("Sau khi login xong, NHAN ENTER trong terminal.");

    await new Promise((resolve) => process.stdin.once("data", resolve));

    console.log("Da nhan Enter. Kiem tra trang home...");

    await page.goto("https://x.com/home", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector("article", {
      timeout: 30000,
    });

    console.log("Login da duoc luu. Da thay article trong feed.");

    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Login X loi:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = loginX;