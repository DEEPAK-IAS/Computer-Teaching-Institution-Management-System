const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");
const Admin = require("../models/admin.model");
const {generateOTP} = require("../utils/generateOTP");
const sendOTPEmail = require("../config/nodemailer.config");
require("dotenv").config();

async function adminSignUp(req, res, next) {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists. Only one admin is allowed.",
      });
    }
    const { name, email, password, role, phone } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newAdmin = await new Admin({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      phone: phone,
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
    const { email } = req.body;
    const existsAdmin = await Admin.findOne({
      email: email,
    });
    if (!existsAdmin) return next(errHandler(401, "Admin not found.."));
    const OTP = generateOTP();

    sendOTPEmail(email, OTP);
    existsAdmin.otp = OTP;
    existsAdmin.otpExpire = Date.now() + 5 * 60 * 1000;
    await existsAdmin.save();
    res.status(200).json({
      success: true,
      message: "OTP has been sent successfully to email",
    });
  } catch (err) {
    next(err);
  }
}



async function verifyOTP(req, res, next) {
  try {
    const { email, password, otp } = req.body;
    if (!email || !otp || !password) return next(errHandler(400, "All fields are required"));
    const admin = await Admin.findOne({ email: email });
    if (!admin) return next(errHandler(404, "*Admin Not found..."));
    const isValidPassword = await bcryptjs.compare(
      password,
      admin.password
    );
    if (!isValidPassword) return next(errHandler(401, "*Invalid Admin Password"));
    if (Date.now() > admin.otpExpire) return next(errHandler(400, "OTP expired"));
    if (otp != admin.otp) return next(errHandler(401, "Unauthorized"));

    const admin_access_token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET_KEY
    );

    admin.otp = undefined;
    admin.otpExpire = undefined;

    await admin.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      role: "admin",
      email: admin.email,
      token: admin_access_token,
    });
  } catch (err) {
    next(err);
  }
}


async function updateAdminAccount(req, res, next) {
  try {
    const {email, password} = req.body;
    const adminToUpdate = await Admin.findOne({email});
    if (!adminToUpdate) return next(errHandler(404, "Admin Not Found"));
    const isValidPassword = await bcryptjs.compare(password, adminToUpdate.password);
    if(!isValidPassword) return next(errHandler(401, "password incorrect"));
    if (req.body.newPassword){
      console.log(req.body.newPassword);
      req.body.newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    }
    const updatedAdmin = await Admin.findOneAndUpdate(
      {email: email},
      {
        name: req.body.name,
        password: req.body.newPassword,
        phone: req.body.phone,
        role: req.body.role,
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedAdmin._doc;
    res.status(200).json({
      success: true,
      message: "Admin Account has been updated successfully.",
      admin: {
        email: rest.email
      }
    });
  } catch (err) {
    next(err);
  }
}

async function deleteAdminAccount(req, res, next) {
  try {
    const {email, password} = req.body;
    const adminToDelete = await Admin.findOne({ email: email });
    if (!adminToDelete) return next(errHandler(404, "Admin Not Found"));
    const isValidPassword = await bcryptjs.compare(password, adminToDelete.password);
    if(!isValidPassword) return next(errHandler(401, "password incorrect"));
    const deletedAdmin = await Admin.findOneAndDelete({email: email });
    res
      .status(200)
      .json({
        message: `${deletedAdmin.name} account deleted successfully`,
      });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  adminSignIn,
  verifyOTP,
  adminSignUp,
  updateAdminAccount,
  deleteAdminAccount,
};
