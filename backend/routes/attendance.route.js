const express = require("express");
const router = express.Router();

const {
  createAttendance,
  updateAttendance,
  updateStudentAttendance,
  deleteAttendance,
} = require("../controllers/attendance.controller");


router.post("/create", createAttendance)
      .patch("/update-student-attendance/:batchId", updateStudentAttendance)



module.exports = router;