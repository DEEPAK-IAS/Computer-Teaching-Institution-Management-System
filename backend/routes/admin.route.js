const express = require("express");
const router = express.Router();
const {
  adminSignIn,
  adminSignUp,
  updateAdminAccount,
  deleteAdminAccount,
} = require("../controllers/admin.controller");
const authorizeRoles = require("../middlewares/authorizeRoles");
const verifyToken = require("../middlewares/authMiddleware");

router
  .post(
    "/signup",
    adminSignUp
  )
  .post("/signin", adminSignIn)
  .patch(
    "/update",
    verifyToken,
    authorizeRoles("admin"),
    updateAdminAccount
  )
  .delete(
    "/delete/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteAdminAccount
  );

module.exports = router;
