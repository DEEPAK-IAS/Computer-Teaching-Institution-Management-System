const Attendance = require("../models/attendance.model");
const Batch = require("../models/batch.model");
const errHandler = require("../utils/errHandler");

async function createAttendance(req, res, next) {
  try {
    const { batchId, year, month, time, staff } = req.body;
    const existingAttendance = await Attendance.findOne({
      batchId,
      year,
      month,
      time,
      staff,
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
      time: time,
      staff: staff,
      students: formattedStudents,
    }).save();

    res.status(200).json({
      success: true,
      message: `${batchId}, ${month}, ${year} ${staff} attendance  was created successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

async function updateStudentAttendance(req, res, next) {
  try {
    const batchId = req.params.batchId;
    const { year, month, time, students } = req.body;
    const existingAttendance = await Attendance.findOne({ batchId: batchId });
    if (!existingAttendance)
      return next(errHandler(404, "Attendance not found"));
    for (const student of students) {
      const { studentId, dailyAttendance } = student;
      const { date, status } = dailyAttendance;

      const attendanceDate = new Date(date);
      const result = await Attendance.findOneAndUpdate(
        {
          batchId,
          year,
          month,
          time,
          staff,
          "students.studentId": studentId,
          "students.dailyAttendance.date": { $ne: attendanceDate },
        },
        {
          $push: {
            "students.$.dailyAttendance": { date: attendanceDate, status },
          },
        },
        { new: true }
      );
      if (!result) {
        await Attendance.updateOne(
          {
            batchId,
            year,
            month,
            time,
            staff,
            "students.studentId": studentId,
            "students.dailyAttendance.date": attendanceDate,
          },
          {
            $set: {
              "students.$.dailyAttendance.$[attendance].status": status,
            },
          },
          {
            arrayFilters: [{ "attendance.date": attendanceDate }],
          }
        );
      } else {
      }
    }
    res.status(200).json({
      success: true,
      message: `students will be attendance updated successfully..`,
    });
  } catch (err) {
    next(err);
  }
}

async function updateAttendance(req, res, next) {
  try {
    const { batchId, year, month, time, staff } = req.body;
    const existingAttendance = await Attendance.findOne({
      batchId: batchId,
      year: year,
      month: month,
      time: time,
      staff: staff,
    });
    if (!existingAttendance)
      return next(errHandler(404, "attendance not found"));

    const updatedAttendance = await Attendance.findOneAndUpdate(
      {
        batchId: batchId,
        year: year,
        month: month,
        time: time,
        staff: staff,
      },
      {
        year: year,
        month: month,
        time: time,
        staff: staff
      },
      { new: true }
    );
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
