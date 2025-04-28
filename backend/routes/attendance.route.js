const express = require("express");
const router = express.Router();

const {
  updateAttendance,
  updateStudentAttendance,
  deleteAttendance,
  getAttendanceDetails,
} = require("../controllers/attendance.controller");


router.patch("/update/:batchId", updateStudentAttendance)
      .get("/:batchId", getAttendanceDetails)



module.exports = router;