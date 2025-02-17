const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  currentCourse: {type: String},
  courseIncludes : {
    type: [String],
    required: true,
  }
}, {timestamps: true});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;