const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  time: {type: String, required: true},
  students: [
    {
      studentId: { type: String, required: true },
      dailyAttendance: [
        {
          date: { type: Date },
          status: { type: String, enum: ["Present", "Absent"] }
        }
      ]
    }
  ]
}, {timestamps: true});

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;