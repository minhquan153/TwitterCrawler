const crawlTweets = require("../src/crawler/crawl");

(async () => {
  const tweets = await crawlTweets();

  console.log("Tweets:", tweets);
})();