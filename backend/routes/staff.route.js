const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRoles");
const {staffSignUp, staffSignIn, updateStaffAccount, deleteStaffAccount, getAllStaffs, getSpecificStaff, verifyOTP} = require("../controllers/staff.controller")
require("dotenv").config();

router.post("/create",verifyToken, authorizeRole("admin"), staffSignUp)
      .post("/signin", staffSignIn)
      .post("/verify-otp", verifyOTP)
      .patch("/update",verifyToken, authorizeRole("admin"), updateStaffAccount)
      .delete("/delete",verifyToken, authorizeRole("admin"), deleteStaffAccount)
      .get("/all",verifyToken, authorizeRole("admin"), getAllStaffs)
      .get("/:email", getSpecificStaff);

module.exports = router;