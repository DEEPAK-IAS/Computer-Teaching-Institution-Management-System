const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");
const Admin = require("../models/admin.model");
require("dotenv").config();



async function adminSignUp(req, res, next) {
  try {
    const { adminName, adminMail, adminPassword, role, phone } = req.body;
    const hashedPassword = bcryptjs.hashSync(adminPassword, 10);
    const newAdmin = await new Admin({
      adminName: adminName,
      adminMail: adminMail,
      adminPassword: hashedPassword,
      role: role,
      phone: phone
    }).save();

    const { password: _, ...rest } = newAdmin._doc;
    res.status(201).json({
      success: true,
      message: "Admin SignUp Successfully...",
    });
  } catch (err) {
    next(err);
  }
}



async function adminSignIn(req, res, next) {
  try {
    const { adminEmail, adminPassword } = req.body;
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) next(errHandler(404, "Admin not Found"));
    const isValidPassword = bcryptjs.compareSync(
      adminPassword,
      admin.adminPassword
    );
    if (!isValidPassword) next(errHandler(401, "unauthorized"));
    const admin_access_token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.adminMail,
      },
      token: admin_access_token
    });
  } catch (err) {
    next(err);
  }
}




async function adminSignOut(req, res, next) {
  try {

  } catch (err) {
    next(err);
  }
}



module.exports = {
  adminSignIn,
  adminSignUp,
  adminSignOut
};
