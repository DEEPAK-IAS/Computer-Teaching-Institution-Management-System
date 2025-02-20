const Staff = require("../models/staff.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");

async function staffSignUp(req, res, next) {
  try {
    const { name, email, password, phone, role, courses, availableTime } = req.body;
    const isStaffExists = await Staff.findOne({ email });
    if (isStaffExists) return next(errHandler(403, "staff already exists"));
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newStaff = await new Staff({
      name: name,
      email: email,
      password: hashedPassword,
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
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });
    if (!staff) return next(errHandler(404, "Staff not found"));
    const isValidPassword = await bcryptjs.compare(password, staff.password);
    if (!isValidPassword) return next(errHandler(401, "Unauthorized"));
    const staff_access_token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).json({
      success: true,
      staff: {
        email: staff.email,
      },
      token: staff_access_token,
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
    if (req.body.password) req.body.password = await bcryptjs.hash(req.body.password, 10);
    const updatedStaff = await Staff.findOneAndUpdate(
      {email : email},
      {
        name: req.body.name,
        email: req.body.newEmail,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role,
        courses: req.body.role,
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
};
