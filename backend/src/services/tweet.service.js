const Tweet = require("../models/tweet.model");

async function saveTweets(tweets) {
  const validTweets = tweets.filter((tweet) => tweet.tweetId && tweet.content);

  const operations = validTweets.map((tweet) => ({
    updateOne: {
      filter: { tweetId: tweet.tweetId },
      update: {
        $setOnInsert: tweet,
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return {
      inserted: 0,
      matched: 0,
      total: 0,
    };
  }

  const result = await Tweet.bulkWrite(operations);

  return {
    inserted: result.upsertedCount,
    matched: result.matchedCount,
    total: validTweets.length,
  };
}

async function getTweets(query) {
  const { search, handle, sort } = query;

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.content = {
      $regex: search,
      $options: "i",
    };
  }

  if (handle) {
    filter.handle = handle;
  }

  let sortOption = { createdAt: -1 };

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

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
    sort: sort || "latest",
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
};