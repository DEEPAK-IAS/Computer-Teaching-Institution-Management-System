const Staff = require("../models/staff.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errHandler = require("../utils/errHandler");

async function staffSignUp(req, res, next) {
  try {
    const { name, email, password, phone, role, courses, availableTime } =
      req.body;
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
      message: "Staff signedUp successfully.",
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
    if (req.body.id || req.body._id)
      return next(errHandler(400, "cannot update id"));
    const staffToUpdate = await Staff.findOne({_id: req.params.id});
    if (!staffToUpdate) return next(errHandler(404, "Staff not found"));
    if (req.body.password)
      req.body.password = await bcryptjs.hash(password, 10);
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
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
    const staffToDelete = await Staff.findOne({ _id: req.params.id });
    if (!staffToDelete) return next(errHandler(404, "staff not found."));
    const deletedAdmin = await Staff.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ message: `${deletedAdmin.name} was deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

async function getSpecificStaff(req, res, next) {
  try {
    const staff = await Staff.findOne(req.params.id);
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
