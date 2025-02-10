const express = require("express");
const router = express.Router();
const {adminSignIn, adminSignUp, adminSignOut} = require("../controllers/admin.controller");

router.post("/admin-signup", adminSignUp)
      .post("/admin-signin", adminSignIn)
      .get("/admin-signout", adminSignOut)


module.exports = router;