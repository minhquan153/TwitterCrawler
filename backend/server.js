require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const tweetRoutes = require("./src/routes/tweet.routes");

const app = express();

app.use(express.json({ limit: "10mb" }));

async function startServer() {
  try {
    await connectDB();

    app.use("/tweets", tweetRoutes);

    const port = process.env.PORT || 6700;

    app.listen(port, () => {
      console.log(`Server dang chay o cong ${port}`);
    });
  } catch (error) {
    console.error("Khoi dong server that bai:", error.message);
    process.exit(1);
  }
}

startServer();