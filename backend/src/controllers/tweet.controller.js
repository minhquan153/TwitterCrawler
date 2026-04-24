const crawlTweetsFromX = require("../crawler/crawl");
const {
  saveTweets,
  getTweets,
  deleteTweet,
  exportTweets,
  importTweets,
} = require("../services/tweet.service");

const crawlTweets = async (req, res) => {
  try {
    const tweets = await crawlTweetsFromX();
    const saveResult = await saveTweets(tweets);

    return res.json({
      message: "Crawl X thanh cong",
      crawled: tweets.length,
      saveResult,
      tweets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Crawl X that bai",
      error: error.message,
    });
  }
};

const listTweets = async (req, res) => {
  try {
    const result = await getTweets(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Lay danh sach tweet that bai",
      error: error.message,
    });
  }
};

const removeTweet = async (req, res) => {
  try {
    const tweet = await deleteTweet(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Khong tim thay tweet",
      });
    }

    return res.json({
      message: "Xoa tweet thanh cong",
      data: tweet,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Xoa tweet that bai",
      error: error.message,
    });
  }
};

const exportTweetData = async (req, res) => {
  try {
    const tweets = await exportTweets();

    return res.json({
      total: tweets.length,
      data: tweets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Export tweet that bai",
      error: error.message,
    });
  }
};

const importTweetData = async (req, res) => {
  try {
    const tweets = req.body.tweets;

    if (!Array.isArray(tweets)) {
      return res.status(400).json({
        message: "tweets phai la array",
      });
    }

    const result = await importTweets(tweets);

    return res.json({
      message: "Import tweet thanh cong",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Import tweet that bai",
      error: error.message,
    });
  }
};

module.exports = {
  crawlTweets,
  listTweets,
  removeTweet,
  exportTweetData,
  importTweetData,
};