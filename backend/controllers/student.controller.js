const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Student = require("../models/student.model");
const errHandler = require("../utils/errHandler");

async function createStudent(req, res, next) {
  try {
    const { 
      studentId, name, gender, 
      phone, email, fname, fatherPhone, 
      address,applyingFor, applyingDate, 
      courseName, duration, startingDate, 
      batchTime, totalAmount, installments, 
      installmentAmounts, staff, courseStatus
    } = req.body;

    
    const existsStudent = await Student.findOne({studentId: studentId});
    if(existsStudent) return next(errHandler(401, "student already Exists"));

    const newStudent = await new Student({
      studentId, name, gender, 
      phone, email, fname, fatherPhone, 
      address,applyingFor, applyingDate, 
      courseName, duration, startingDate, 
      batchTime, totalAmount, installments, 
      installmentAmounts, staff, courseStatus
    }).save();

    res.status(201).json({
      success: true,
      message: `${newStudent.name} created successfully`,
    });
  } catch(err) {
    next(err);
  }
}



async function updateStudentDetails(req, res, next) {
  try {
    const existsStudent = await Student.findOne({studentId: req.params.id});
    if(!existsStudent) return next(errHandler(404, "student not found"));
    const updatedStudent = await Student.findOneAndUpdate(
      {studentId: req.params.id}, 
      {
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        fname: req.body.fname,
        fatherPhone: req.body.fatherPhone,
        address: req.body.address,
        applyingFor: req.body.applyingFor,
        applyingDate: req.body.applyingDate,
        courseName: req.body.courseName,  
        duration: req.body.duration,
        startingDate: req.body.startingDate,
        batchTime: req.body.batchTime,
        totalAmount: req.body.totalAmount,
        installments: req.body.installments,
        installmentAmounts: req.body.installmentAmounts,
        staff: req.body.staff,
        courseStatus: req.body.courseStatus
      }, 
      {new: true}
    );

    res.status(200).json({
      success: true,
      message: `${updatedStudent.name} updated successfully`,
    });

  } catch(err) {
    next(err);
  }
}



async function deleteStudentDetails(req, res, next) {
  try {
    const existStudent = await Student.findOne({ studentId: req.params.id});
    if(!existStudent) return next(errHandler(404,"student not found"));
    const deletedStudent = await Student.findOneAndDelete({ studentId: req.params.id });
    res.status(200).json({
      success: true,
      message: `${deletedStudent.name} deleted successfully`,
    });
  } catch(err) {
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
  } catch(err) {
    next(err);
  }
}


async function getSpecificStudent(req, res, next) {
  try {
    const student = await Student.findOne({studentId: req.params.id});  
    if(!student) return next(errHandler(404, "student not found"));
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch(err) {
    next(err);
  }
}


module.exports = {
  createStudent,
  updateStudentDetails,
  deleteStudentDetails,
  getAllStudents,
  getSpecificStudent,
}