const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");
const Admin = require("../models/admin.model");
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
    const { adminName, adminMail, adminPassword, role, phone } = req.body;
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    const newAdmin = await new Admin({
      adminName: adminName,
      adminMail: adminMail,
      adminPassword: hashedPassword,
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
    const { adminMail, adminPassword } = req.body;
    console.log(adminMail);
    const admin = await Admin.findOne({ adminMail: adminMail });
    if (!admin) next(errHandler(404, "Admin not Found"));
    const isValidPassword = await bcryptjs.compare(
      adminPassword,
      admin.adminPassword
    );
    if (!isValidPassword) next(errHandler(401, "unauthorized"));
    const admin_access_token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).json({
      success: true,
      admin: {
        email: admin.adminMail,
      },
      token: admin_access_token,
    });
  } catch (err) {
    next(err);
  }
}

async function updateAdminAccount(req, res, next) {
  try {
    const {adminMail} = req.body;
    const adminToUpdate = await Admin.findOne({adminMail});
    if (!adminToUpdate) next(errHandler(404, "Admin Not Found"));
    if (req.body.adminPassword)
      req.body.adminPassword = await bcryptjs.hash(req.body.adminPassword, 10);
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        adminName: req.body.adminName,
        adminMail: req.body.adminMail,
        password: req.body.adminPassword,
        phone: req.body.phone,
        role: req.body.role,
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedAdmin._doc;
    res.status(200).json({
      success: true,
      data: {
        admin: rest,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteAdminAccount(req, res, next) {
  try {
    const adminToDelete = await Admin.findOne({ _id: req.params.id });
    if (!adminToDelete) return next(errHandler(404, "Admin Not Found"));
    const deletedAdmin = await Admin.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({
        message: `${deletedAdmin.adminName} account deleted successfully`,
      });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  adminSignIn,
  adminSignUp,
  updateAdminAccount,
  deleteAdminAccount,
};
