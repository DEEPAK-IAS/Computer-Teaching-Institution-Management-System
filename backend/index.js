const express = require("express");
const dbConnect = require("./db/index");
const adminRouter = require("./routes/admin.route");
const staffRouter = require("./routes/staff.route");
const courseRouter = require("./routes/course.route");
const studentRouter = require("./routes/student.route");
const app = express();

app.use(express.json());
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/student", studentRouter);

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