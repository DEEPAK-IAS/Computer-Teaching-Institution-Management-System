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
    const {adminMail, adminPassword} = req.body;
    const adminToUpdate = await Admin.findOne({adminMail});
    if (!adminToUpdate) return next(errHandler(404, "Admin Not Found"));
    const isValidPassword = await bcryptjs.compare(adminPassword, adminToUpdate.adminPassword);
    if(!isValidPassword) return next(errHandler(401, "password incorrect"));
    if (req.body.newAdminPassword){
      console.log(req.body.newAdminPassword);
      req.body.newAdminPassword = await bcryptjs.hash(req.body.newAdminPassword, 10);
    }
    const updatedAdmin = await Admin.findOneAndUpdate(
      {adminMail: adminMail},
      {
        adminName: req.body.adminName,
        adminPassword: req.body.newAdminPassword,
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
        email: rest.adminMail
      }
    });
  } catch (err) {
    next(err);
  }
}

async function deleteAdminAccount(req, res, next) {
  try {
    const {adminMail, adminPassword} = req.body;
    const adminToDelete = await Admin.findOne({ adminMail: adminMail });
    if (!adminToDelete) return next(errHandler(404, "Admin Not Found"));
    const isValidPassword = await bcryptjs.compare(adminPassword, adminToDelete.adminPassword);
    if(!isValidPassword) return next(errHandler(401, "password incorrect"));
    const deletedAdmin = await Admin.findOneAndDelete({adminMail: adminMail });
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
