const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");

const {
  crawlTweets,
  listTweets,
  removeTweet,
  exportTweetData,
  importTweetData,
} = require("../controllers/tweet.controller");

router.post("/crawl-x", adminAuth, crawlTweets);
router.get("/export", adminAuth, exportTweetData);
router.post("/import", adminAuth, importTweetData);

router.get("/", listTweets);
router.delete("/:id", adminAuth, removeTweet);

module.exports = router;