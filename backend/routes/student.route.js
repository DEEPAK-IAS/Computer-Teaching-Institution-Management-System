const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");
const {
  createStudent,
  studentSignIn,
  verifyOTP,
  updateStudentDetails,
  deleteStudentDetails,
  addCourse,
  deleteCourse,
  updateCourse,
  getSpecificStudent,
  getAllStudents,
  getStudentsDetails,
} = require("../controllers/student.controller");

router.post("/create", verifyToken, authorizeRole("admin"), createStudent)
      .post("/signin", studentSignIn)
      .post("/verify-otp", verifyOTP)
      .patch("/add-course", verifyToken, authorizeRole("admin"), addCourse )
      .patch("/update-course", verifyToken, authorizeRole("admin"), updateCourse)
      .patch("/update/:id", verifyToken, authorizeRole("admin"), updateStudentDetails)
      .delete("/delete/:id", verifyToken, authorizeRole("admin"), deleteStudentDetails)
      .delete("/delete-course", verifyToken, authorizeRole("admin"), deleteCourse)
      .get("/all", verifyToken, authorizeRole("admin"), getAllStudents)
      .get("/:studentId", verifyToken, authorizeRole("admin", "staff", "student"), getSpecificStudent)
      .post("/many", verifyToken, authorizeRole("admin", "staff"), getStudentsDetails);

module.exports = router;