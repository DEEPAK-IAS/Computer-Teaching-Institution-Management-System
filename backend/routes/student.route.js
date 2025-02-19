const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");
const {
  createStudent,
  updateStudentDetails,
  deleteStudentDetails,
  deleteCourse,
  getSpecificStudent,
  getAllStudents,
  studentSignIn,
  verifyOTP,
  addCourse
} = require("../controllers/student.controller");

router.post("/create", verifyToken, authorizeRole("admin"), createStudent)
      .post("/signin", studentSignIn)
      .post("/verify-otp", verifyOTP)
      .patch("/add-course", addCourse )
      .patch("/update/:id", verifyToken, authorizeRole("admin"), updateStudentDetails)
      .delete("/delete/:id", verifyToken, authorizeRole("admin"), deleteStudentDetails)
      .delete("/delete-course",verifyToken, authorizeRole("admin"), deleteCourse)
      .get("/all", verifyToken, authorizeRole("admin"), getAllStudents)
      .get("/:id", getSpecificStudent);

module.exports = router;