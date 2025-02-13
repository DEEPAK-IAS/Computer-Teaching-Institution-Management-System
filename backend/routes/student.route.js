const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles")
const {
  createStudent,
  updateStudentDetails,
  deleteStudentDetails,
  getSpecificStudent,
  getAllStudents,
} = require("../controllers/student.controller");

router.post("/create", verifyToken, authorizeRole("admin","staff"), createStudent)
      .patch("/update/:id", verifyToken, authorizeRole("admin","staff"), updateStudentDetails)
      .delete("/delete/:id", verifyToken, authorizeRole("admin","staff"), deleteStudentDetails)
      .get("/all", verifyToken, authorizeRole("admin","staff"), getAllStudents)
      .get("/:id", getSpecificStudent);

module.exports = router;