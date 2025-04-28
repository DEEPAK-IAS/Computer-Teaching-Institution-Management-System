const Course = require("../models/course.model");
const errHandler = require("../utils/errHandler");

async function createCourse(req, res, next) {
  try {
    const { name, courseIncludes, duration } = req.body;
    const courseExists = await Course.findOne({name});
    if(courseExists) return next(errHandler(401, "course already exists"));
    const newCourse = await new Course({
      name: name,
      duration: duration,
      courseIncludes: courseIncludes,
    }).save();
    res.status(200).json({
      success: true,
      message: "Course created successfully.",
    });
  } catch (err) {
    next(err);
  }
}

async function updateCourse(req, res, next) {
  try {
    const id = req.params.id;
    const courseToUpdate = await Course.findOne({_id : id});
    if (!courseToUpdate) return next(errHandler(404, "Course not found"));
    await Course.findOneAndUpdate(
      { _id: id},
      {
        name: req.body.name,
        duration: req.body.duration,
        courseIncludes: req.body.courseIncludes,
      }
    );
    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const id = req.params.id;
    const courseToDelete = await Course.findOne({ _id: id });
    if (!courseToDelete) return next(errHandler(404, "Course not found"));
    await Course.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
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
      courses: courses,
    });
  } catch (err) {
    next(err);
  }
}

async function getSpecificCourse(req, res, next) {
  try {
    const {id} = req.params;
    const course = await Course.findOne({ _id: id});
    if (!course) return next(errHandler(404, "Course not found"));
    res.status(200).json({
      success: true,
      course: course,
    });
  } catch (err) {
    next(err);
  }
}

async function createCourseObject(name, applyingDate, time, staff) {
  try {
    const course = await Course.findOne({ name : name});
    if (!course) throw new Error("Course not found");
    return {
      applyingFor: name,
      applyingDate: applyingDate,
      duration: course.duration,
      startingDate: new Date(),
      modulesInclude: course.courseIncludes.map((module) => ({
        moduleName: module,
        moduleStatus: "Waiting",
        moduleTime: time
      })),
      currentModule: {
          moduleName: course.courseIncludes[0],
          moduleStatus: "Ongoing",
          batchTime: time || "Not Assigned",
          staff: staff || "Not Assigned",
        },
        courseStatus: "waiting"
    };
  } catch (err) {
    console.error("Error creating course object:", err.message);
    throw err;
  }
}

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getSpecificCourse,
  createCourseObject,
};
