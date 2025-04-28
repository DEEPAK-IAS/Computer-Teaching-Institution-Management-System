const Attendance = require("../models/attendance.model");
const Batch = require("../models/batch.model");
const errHandler = require("../utils/errHandler");



const createInitialAttendanceForBatch = async (batch) => {

  const { _id: batchId, staff, students, startingDate, batchTime } = batch;

  const date = new Date(startingDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const time = batchTime || "morning";
  const formattedStudents = (students || []).map((student) => ({
    studentId: student.toString(),
    dailyAttendance: [],
  }));

  const newAttendance = new Attendance({
    batchId,
    year,
    month,
    time,
    staff,
    students: formattedStudents,
  });

  await newAttendance.save();
};



async function updateStudentAttendance(req, res, next) {
  try {
    const batchId = req.params.batchId;
    const { students } = req.body;

    const attendanceDoc = await Attendance.findOne({ batchId });

    if (!attendanceDoc) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    const formatDate = (d) => new Date(d).toISOString().split('T')[0];

    for (const student of students) {
      const { studentId, dailyAttendance } = student;
      if (!Array.isArray(dailyAttendance) || dailyAttendance.length === 0) continue;

      const { date, status } = dailyAttendance[0];

      const attendanceDate = new Date(date + 'Z');

      const studentRecord = attendanceDoc.students.find(
        (s) => s.studentId.toString() === studentId
      );

      if (studentRecord) {
        const attendanceEntry = studentRecord.dailyAttendance.find(
          (entry) => formatDate(entry.date) === formatDate(attendanceDate)
        );

        if (attendanceEntry) {
          attendanceEntry.status = status;
        } else {
          studentRecord.dailyAttendance.push({
            date: attendanceDate,
            status,
          });
        }
      }
    }

    await attendanceDoc.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
    });
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


async function getAttendanceDetails(req, res, next) {
  try {

    const {batchId} = req.params;

    const attendance = await Attendance.findOne({ batchId: batchId });  
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found." });
    }
    const { students } = attendance;
    const formattedStudents = students.map((student) => ({
      studentId: student.studentId,
      dailyAttendance: student.dailyAttendance.map((entry) => ({
        date: entry.date,
        status: entry.status,
      })),
    }));

    res.status(200).json({
      success: true,
      students: formattedStudents,
    });

  } catch(err) {
    next(err);
  }
}


module.exports = {
  deleteAttendance,
  updateStudentAttendance,
  createInitialAttendanceForBatch,
  getAttendanceDetails
};
