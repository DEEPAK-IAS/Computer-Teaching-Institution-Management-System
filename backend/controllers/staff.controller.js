const Staff = require("../models/staff.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");
const {generateOTP} = require("../utils/generateOTP");
const sendOTPEmail = require("../config/nodemailer.config");

async function staffSignUp(req, res, next) {
  try {
    const { name, email,  phone, role, courses, availableTime } = req.body;
    const isStaffExists = await Staff.findOne({ email });
    if (isStaffExists) return next(errHandler(403, "staff already exists"));
    const newStaff = await new Staff({
      name: name,
      email: email,
      phone: phone,
      role: role,
      courses: courses,
      availableTime: availableTime,
    }).save();

    res.status(200).json({
      success: true,
      message: `${newStaff.name }Staff signedUp successfully.`,
    });
  } catch (err) {
    next(err);
  }
}



async function staffSignIn(req, res, next) {
  try {
    const { email } = req.body;
    const existStaff = await Staff.findOne({
      email: email,
    });
    if (!existStaff) return next(errHandler(401, "Staff not found.."));
    const OTP = generateOTP();
    sendOTPEmail(email, OTP);
    existStaff.otp = OTP;
    existStaff.otpExpire = Date.now() + 5 * 60 * 1000;
    await existStaff.save();
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
    const { email, otp } = req.body;
    if (!email || !otp)
      return next(errHandler(400, "All fields are required"));
    const staff = await Staff.findOne({ email });
    if (!staff) return next(errHandler(404, "Staff not found"));
    if (Date.now() > staff.otpExpire)
      return next(errHandler(400, "OTP expired"));
    if (otp != staff.otp) return next(errHandler(401, "Unauthorized"));

    const token = jwt.sign(
      { id: staff.StaffId, role: "Staff" },
      process.env.JWT_SECRET_KEY
    );

    staff.otp = undefined;
    staff.otpExpire = undefined;

    await staff.save();

    res.status(200).json({
      message: "Staff SignIn successfully.",
      token: token,
    });
  } catch (err) {
    next(err);
  }
}


async function updateStaffAccount(req, res, next) {
  try {
    const { email } = req.body;
    const staffToUpdate = await Staff.findOne({email : email });
    if (!staffToUpdate) return next(errHandler(404, "Staff not found"));
    const updatedStaff = await Staff.findOneAndUpdate(
      {email : email},
      {
        name: req.body.name,
        email: req.body.newEmail,
        phone: req.body.phone,
        role: req.body.role,
        courses: req.body.courses,
        availableTime: req.body.availableTime,
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedStaff._doc;
    res.status(200).json({
      success: true,
      data: {
        staff: rest,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteStaffAccount(req, res, next) {
  try {
    const { email }= req.body;
    const staffToDelete = await Staff.findOne({email : email });
    if (!staffToDelete) return next(errHandler(404, "staff not found."));
    const deletedAdmin = await Staff.findOneAndDelete({ email: email});
    res
      .status(200)
      .json({ message: `${deletedAdmin.name} Account was deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

async function getSpecificStaff(req, res, next) {
  try {
    const email = req.params.email;
    const staff = await Staff.findOne({email: email});
    if (!staff) return next(errHandler(404, "Staff not found"));
    res.status(200).json({
      success: true,
      data: {
        staff: staff,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAllStaffs(req, res, next) {
  try {
    const staffs = await Staff.find();
    res.status(200).json({
      success: true,
      data: {
        staffs: staffs,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  staffSignIn,
  staffSignUp,
  updateStaffAccount,
  deleteStaffAccount,
  getAllStaffs,
  getSpecificStaff,
  verifyOTP
};
