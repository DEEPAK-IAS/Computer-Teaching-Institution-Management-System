const Attendance = require("../models/attendance.model");
const Batch = require("../models/batch.model");
const errHandler = require("../utils/errHandler");

async function createAttendance(req, res, next) {
  try {
    const { batchId, year, month } = req.body;
    const existingAttendance = await Attendance.findOne({
      batchId,
      year,
      month,
    });
    if (existingAttendance)
      return next(errHandler(403, "Attendance already exists"));
    const batch = await Batch.findOne({ batchId: batchId });
    const formattedStudents = batch.students.map((student) => ({
      studentId: student,
      dailyAttendance: [],
    }));

    const newAttendance = await new Attendance({
      batchId: batchId,
      month: month,
      year: year,
      students: formattedStudents,
    }).save();

    res.status(200).json({
      success: true,
      message: `${batchId}, ${month}, ${year} attendance  was created successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

async function updateStudentAttendance(req, res, next) {
  try {
    const batchId = req.params.batchId;
    const { year, month, students } = req.body;
    const existingAttendance = await Attendance.findOne({ batchId: batchId });
    if (!existingAttendance)  return next(errHandler(404, "Attendance not found"));
    let updatedCount = 0;
    for (const student of students) {
      const { studentId, dailyAttendance } = student;
      const { date, status } = dailyAttendance;

      const attendanceDate = new Date(date);
      const result = await Attendance.findOneAndUpdate(
        {
          batchId,
          year,
          month,
          "students.studentId": studentId,
        },
        {
          $push: {
            "students.$.dailyAttendance": { date: attendanceDate, status },
          },
        },
        { new: true }
      );
      if (result.isModified > 0) {
        updatedCount++;
      }
    }
    res.status(200).json({
      success: true,
      message: `${updatedCount} students will be attendance updated successfully..`,
    });
  } catch (err) {
    next(err);
  }
}

async function updateAttendance(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

async function deleteAttendance(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  updateStudentAttendance,
};
