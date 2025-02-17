const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");
const {
  createStudent,
  updateStudentDetails,
  deleteStudentDetails,
  getSpecificStudent,
  getAllStudents,
  studentSignIn,
  verifyOTP
} = require("../controllers/student.controller");

router.post("/create", verifyToken, authorizeRole("admin"), createStudent)
      .post("/signin", studentSignIn)
      .post("/verify-otp", verifyOTP)
      .patch("/update/:id", verifyToken, authorizeRole("admin"), updateStudentDetails)
      .delete("/delete/:id", verifyToken, authorizeRole("admin"), deleteStudentDetails)
      .get("/all", verifyToken, authorizeRole("admin"), getAllStudents)
      .get("/:id", getSpecificStudent);

module.exports = router;