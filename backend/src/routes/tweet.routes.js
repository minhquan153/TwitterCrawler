const express = require("express");
const router = express.Router();

const {
  crawlTweets,
  listTweets,
  removeTweet,
  exportTweetData,
  importTweetData,
} = require("../controllers/tweet.controller");

router.get("/crawl-x", crawlTweets);
router.get("/export", exportTweetData);
router.post("/import", importTweetData);

router.get("/", listTweets);
router.delete("/:id", removeTweet);

module.exports = router;