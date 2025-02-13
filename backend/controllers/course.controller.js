const Course = require("../models/course.model");
const errHandler = require("../utils/errHandler");


async function createCourse(req, res, next) {
  try {
    const { courseId, courseName, courseIncludes } = req.body;
    const newCourse = await new Course({
      courseId: courseId,
      courseName : courseName,
      courseIncludes: courseIncludes
    }).save();
    res.status(200).json({
      success: true,
      message: "Course created successfully."
    });
  } catch (err) { 
    next(err);
  }
}


async function updateCourse(req, res, next) {
  try {
    const courseToUpdate = await Course.findOne({_id: req.params.id});
    if(!courseToUpdate) return next(errHandler("404", "Course not found"));
    await Course.findByIdAndUpdate({_id: req.params.id}, {
      courseId: req.body.courseId,
      name: req.body.name,
      courseIncludes: req.body.courseIncludes
    });
    res.status(200).json({
      success: true,
      message: "Course updated successfully."
    });
  } catch (err) {
    next(err);
  }
}


async function deleteCourse(req, res, next) {
  try {
    const courseToDelete = await Course.findOne({_id: req.params.id});
    if(!courseToDelete) return next(errHandler("404", "Course not found"));
    await Course.findByIdAndDelete({_id: req.params.id});
    res.status(200).json({
      success: true,
      message: "Course deleted successfully."
    });
  } catch (err) {
    next(err);
  }
}


async function getAllCourses(req, res, next) {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (err) {
    next(err);
  }
}


async function getSpecificCourse(req, res, next) {
  try {
    const course = await Course.findOne({courseId: req.params.id});
    if(!course) return next(errHandler("404", "Course not found"));
    res.status(200).json({
      success: true,
      data: course
    });
  }
  catch (err) {
    next(err);
  }
}

module.exports = {  
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getSpecificCourse
};