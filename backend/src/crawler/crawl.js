const puppeteer = require("puppeteer-core");

async function crawlTweets() {
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: false,
      defaultViewport: null,
      userDataDir: "C:\\Users\\Adminn\\puppeteer-data",
      args: ["--disable-blink-features=AutomationControlled"],
    });

    const page = await browser.newPage();

    await page.goto("https://x.com/home", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("Dang vao feed...");

    await page.waitForSelector("article", {
      timeout: 30000,
    });

    console.log("Da load tweet");

    await page.waitForSelector("article", {
      timeout: 30000,
    });

    console.log("Da load tweet");

    for (let i = 0; i < 5; i++) {
      console.log("Scroll lan:", i + 1);

      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // 👇 extract
    const tweets = await page.$$eval("article", (items) => {
      return items
        .map((item) => {
          const contentEl = item.querySelector('[data-testid="tweetText"]');
          const userEl = item.querySelector('[data-testid="User-Name"]');
          const timeLinkEl = item.querySelector('a[href*="/status/"]');

          const content = contentEl ? contentEl.innerText : null;

          let name = null;
          let handle = null;
          let time = null;
          let tweetUrl = null;
          let tweetId = null;

          if (userEl) {
            const parts = userEl.innerText.split("\n");

            name = parts[0] || null;
            handle = parts.find((part) => part.startsWith("@")) || null;
            time =
              parts.find(
                (part) =>
                  part.includes("h") ||
                  part.includes("m") ||
                  part.includes("s"),
              ) || null;
          }

          if (timeLinkEl) {
            const href = timeLinkEl.getAttribute("href");
            tweetUrl = href ? `https://x.com${href}` : null;

            const match = href ? href.match(/status\/(\d+)/) : null;
            tweetId = match ? match[1] : null;
          }

          return {
            tweetId,
            name,
            handle,
            time,
            tweetUrl,
            content,
          };
        })
        .filter((tweet) => tweet.content && tweet.tweetId);
    });

    console.log("Extract xong:", tweets.length);

    await browser.close();

    return tweets;
  } catch (error) {
    console.error("Crawl loi:", error.message);
    if (browser) await browser.close();
    return [];
  }
}

module.exports = crawlTweets;
