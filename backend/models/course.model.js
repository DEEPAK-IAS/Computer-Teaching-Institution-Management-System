const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true
  },
  courseIncludes : {
    type: [String],
    required: true,
  }
}, {timestamps: true});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;