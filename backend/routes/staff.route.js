const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");
const {staffSignUp, staffSignIn, updateStaffAccount, deleteStaffAccount, getAllStaffs, getSpecificStaff} = require("../controllers/staff.controller")
require("dotenv").config();

router.post("/signup", staffSignUp)
      .post("/signin", staffSignIn)
      .patch("/update/:id",verifyToken, authorizeRole("admin"), updateStaffAccount)
      .delete("/delete/:id",verifyToken, authorizeRole("admin"), deleteStaffAccount)
      .get("/all", getAllStaffs)
      .get("/:id", getSpecificStaff);

module.exports = router;