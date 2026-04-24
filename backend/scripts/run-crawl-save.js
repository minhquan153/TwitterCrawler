const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("../src/config/db");
const crawlTweets = require("../src/crawler/crawl");
const { saveTweets } = require("../src/services/tweet.service");

(async () => {
  await connectDB();

  const tweets = await crawlTweets();

  console.log("Crawl xong:", tweets.length);

  const result = await saveTweets(tweets);

  console.log("Save result:", result);

  process.exit();
})();