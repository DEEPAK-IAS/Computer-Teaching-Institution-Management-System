const express = require("express");
const router = express.Router();
const { createCourse, updateCourse, deleteCourse, getAllCourses, getSpecificCourse} = require("../controllers/course.controller.js");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");


router.post("/create", verifyToken, authorizeRole("admin"), createCourse)
      .put("/update/:id", verifyToken, authorizeRole("admin"), updateCourse)
      .delete("/delete/:id", verifyToken, authorizeRole("admin"), deleteCourse)
      .get("/all", getAllCourses)
      .get("/:id", getSpecificCourse);


module.exports = router;