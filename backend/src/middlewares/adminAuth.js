function adminAuth(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({
      message: "ADMIN_API_KEY chua duoc cau hinh",
    });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      message: "Khong co quyen truy cap",
    });
  }

  next();
}

module.exports = adminAuth;