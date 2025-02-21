const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Student = require("../models/student.model");
const errHandler = require("../utils/errHandler");
const { generateOTP } = require("../utils/generateOTP");
const { createCourseObject } = require("../controllers/course.controller");
const sendOTPEmail = require("../config/nodemailer.config");

async function createStudent(req, res, next) {
  try {
    const {
      studentId,
      name,
      gender,
      phone,
      email,
      dob,
      fname,
      fatherPhone,
      address,
      totalAmount,
      installments,
      installmentAmounts,
      time,
      staff,
      courseName,
      applyingDate,
    } = req.body;
    const course = await createCourseObject(
      courseName,
      applyingDate,
      time,
      staff
    );
    const existsStudent = await Student.findOne({ studentId: studentId });
    if (existsStudent) return next(errHandler(401, "student already Exists"));
    const newStudent = await new Student({
      studentId,
      name,
      gender,
      phone,
      email,
      fname,
      dob,
      fatherPhone,
      address,
      totalAmount,
      installments,
      installmentAmounts,
      courses: course,
    }).save();

    res.status(201).json({
      success: true,
      message: `${newStudent.name} created successfully`,
    });
  } catch (err) {
    next(err);
  }
}

async function studentSignIn(req, res, next) {
  try {
    const { email } = req.body;
    const existsStudent = await Student.findOne({
      email: email,
    });
    if (!existsStudent) return next(errHandler(401, "Student not found"));

    const OTP = generateOTP();

    sendOTPEmail(email, OTP);
    existsStudent.otp = OTP;
    existsStudent.otpExpire = Date.now() + 5 * 60 * 1000;
    await existsStudent.save();

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
      return next(errorHandler(400, "All fields are required"));
    const student = await Student.findOne({ email });
    if (!student) return next(errHandler(404, "student not found"));
    if (Date.now() > student.otpExpire)
      return next(errHandler(400, "OTP expired"));
    if (otp != student.otp) return next(errHandler(401, "Unauthorized"));

    const token = jwt.sign(
      { id: student.studentId, role: "student" },
      process.env.JWT_SECRET_KEY
    );

    student.otp = undefined;
    student.otpExpire = undefined;

    await student.save();

    res.status(200).json({
      message: "SignIn successfully.",
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

async function updateStudentDetails(req, res, next) {
  try {
    const existsStudent = await Student.findOne({ studentId: req.params.id });
    if (!existsStudent) return next(errHandler(404, "student not found"));
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      {
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        fname: req.body.fname,
        dob: req.body.dob,
        fatherPhone: req.body.fatherPhone,
        address: req.body.address,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `${updatedStudent.name} updated successfully`,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteStudentDetails(req, res, next) {
  try {
    const existStudent = await Student.findOne({ studentId: req.params.id });
    if (!existStudent) return next(errHandler(404, "student not found"));
    const deletedStudent = await Student.findOneAndDelete({
      studentId: req.params.id,
    });
    res.status(200).json({
      success: true,
      message: `${deletedStudent.name} deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
}

async function addCourse(req, res, next) {
  try {
    const { studentId, courseName, time, applyingDate, staff } = req.body;
    const student = await Student.findOne({ studentId });
    if (!student) return next(errHandler(404, "student not found"));
    const course = await createCourseObject(
      courseName,
      applyingDate,
      time,
      staff
    );

    const existingCourse = student.courses.find(
      (course) => course.applyingFor === courseName
    );

    if (existingCourse) {
      return next(errHandler(400, "Course already exists for this student"));
    }

    student.courses.push(course);

    await student.save();

    res.status(200).json({
      success: true,
      message: `${student.name}'s course updated successfully..`,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCourse(req, res, next) {
  try {
    const { studentId, courseName } = req.body;
    const student = await Student.findOne({ studentId });
    if (!student) return next(errHandler(404, "Student not found"));

    if (req.body.currentModule) {
      const updatedStudent = await Student.findOneAndUpdate(
        { studentId, "courses.applyingFor": courseName },
        {
          $set: {
            "courses.$.currentModule.moduleName": currentModule.moduleName,
            "courses.$.currentModule.batchTime": currentModule.batchTime,
            "courses.$.currentModule.staff": currentModule.staff,
          },
        },
        { new: true }
      );

      if (!updatedStudent) return next(errHandler(404, "Course not found"));

      res
        .status(200)
        .json({ success: true, message: "Course updated", updatedStudent });
    }
    if (req.body.courseFinished) {
      const { moduleName, moduleStatus } = req.body;

      const updatedStudent = await Student.findOneAndUpdate(
        {
          studentId,
          "courses.applyingFor": courseName,
        },
        {
          $set: {
            "courses.$.modulesInclude.$[elem].moduleStatus": moduleStatus,
          },
        },
        {
          new: true,
          arrayFilters: [{ "elem.moduleName": moduleName }],
        }
      );

      if (!updatedStudent) return next(errHandler(404, "Module not found"));

      res
        .status(200)
        .json({ success: true, message: "Module updated", updatedStudent });
    }
    if (req.body.time) {
      const {newTime} = req.body;
      const updatedStudent = await Student.findOneAndUpdate(
        {
          studentId,
          "courses.applyingFor": courseName,
        },
        {
          $set: {
            
            "courses.$.modulesInclude": {
              $map: {
                input: "$courses.modulesInclude",
                as: "module",
                in: {
                  moduleName: "$$module.moduleName",
                  moduleStatus: "$$module.moduleStatus",
                  moduleTime: newTime,
                },
              },
            },
            "courses.$.currentModule.batchTime": newTime,
          },
        },
        { new: true }
      );

      if (!updatedStudent)
        return next(errHandler(404, "Student or course not found"));
    }
  } catch (err) {
    next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const { studentId, courseName } = req.body;

    const result = await Student.updateOne(
      { studentId },
      { $pull: { courses: { applyingFor: courseName } } }
    );

    if (result.modifiedCount === 0) {
      return next(errHandler(400, "Course not found for this student"));
    }

    res.status(200).json({
      success: true,
      message: `Course '${courseName}' removed successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllStudents(req, res, next) {
  try {
    const students = await Student.find();
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (err) {
    next(err);
  }
}

async function getSpecificStudent(req, res, next) {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return next(errHandler(404, "student not found"));
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createStudent,
  studentSignIn,
  verifyOTP,
  updateStudentDetails,
  deleteStudentDetails,
  addCourse,
  deleteCourse,
  updateCourse,
  getAllStudents,
  getSpecificStudent
};
