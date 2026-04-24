const Tweet = require("../models/tweet.model");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidTweetInput(tweet) {
  return (
    tweet &&
    typeof tweet === "object" &&
    typeof tweet.tweetId === "string" &&
    tweet.tweetId.trim() &&
    typeof tweet.content === "string" &&
    tweet.content.trim()
  );
}

function buildTweetUpdate(tweet) {
  const set = {
    content: tweet.content,
  };

  if (typeof tweet.name === "string" && tweet.name.trim()) {
    set.name = tweet.name;
  }

  if (typeof tweet.handle === "string" && tweet.handle.trim()) {
    set.handle = tweet.handle;
  }

  if (typeof tweet.time === "string" && tweet.time.trim()) {
    set.time = tweet.time;
  }

  if (typeof tweet.tweetUrl === "string" && tweet.tweetUrl.trim()) {
    set.tweetUrl = tweet.tweetUrl;
  }

  return set;
}

async function saveTweets(tweets) {
  if (!Array.isArray(tweets)) {
    return {
      inserted: 0,
      matched: 0,
      modified: 0,
      total: 0,
    };
  }

  const validTweets = tweets.filter(isValidTweetInput);

  const operations = validTweets.map((tweet) => ({
    updateOne: {
      filter: { tweetId: tweet.tweetId },
      update: {
        $set: buildTweetUpdate(tweet),
        $setOnInsert: {
          tweetId: tweet.tweetId,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return {
      inserted: 0,
      matched: 0,
      modified: 0,
      total: 0,
    };
  }

  const result = await Tweet.bulkWrite(operations);

  return {
    inserted: result.upsertedCount,
    matched: result.matchedCount,
    modified: result.modifiedCount,
    total: validTweets.length,
  };
}

function parsePositiveInteger(value, defaultValue, maxValue) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return defaultValue;
  }

  if (maxValue && number > maxValue) {
    return maxValue;
  }

  return number;
}

async function getTweets(query) {
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const handle = typeof query.handle === "string" ? query.handle.trim() : "";
  const sort = typeof query.sort === "string" ? query.sort : "latest";

  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.content = {
      $regex: escapeRegex(search),
      $options: "i",
    };
  }

  if (handle) {
    filter.handle = handle;
  }

  const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const total = await Tweet.countDocuments(filter);

  const tweets = await Tweet.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    sort: sort === "oldest" ? "oldest" : "latest",
    data: tweets,
  };
}

async function deleteTweet(id) {
  return Tweet.findByIdAndDelete(id);
}

async function exportTweets() {
  return Tweet.find().sort({ createdAt: -1 });
}

async function importTweets(tweets) {
  return saveTweets(tweets);
}

module.exports = {
  saveTweets,
  getTweets,
  deleteTweet,
  exportTweets,
  importTweets,
  isValidTweetInput,
};