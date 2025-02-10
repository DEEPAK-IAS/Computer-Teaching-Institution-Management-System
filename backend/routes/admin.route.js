const express = require("express");
const router = express.Router();
const {adminSignIn, adminSignUp, updateAdminInfo} = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/admin-signup", adminSignUp)
      .post("/admin-signin", adminSignIn)
      .patch("/admin-update/:id", updateAdminInfo);


module.exports = router;