require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const tweetRoutes = require("./src/routes/tweet.routes");

const app = express();

app.use(express.json({ limit: "10mb" }));

connectDB();

app.use("/tweets", tweetRoutes);

app.listen(6700, () => {
  console.log("Server dang chay o cong 6700");
});