const express = require("express");
const dbConnect = require("./db/index");
const app = express();






app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message
  });
});


const PORT = process.env.PORT || 3000;
dbConnect()
app.listen(PORT, () => console.log(`server running on http://127.0.0.1:${PORT}`));