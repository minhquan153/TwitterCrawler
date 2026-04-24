const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    tweetId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: String,
    handle: String,
    time: String,
    tweetUrl: String,
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tweet", tweetSchema);