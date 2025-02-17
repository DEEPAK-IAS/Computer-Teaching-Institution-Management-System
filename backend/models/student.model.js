const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    fatherPhone: { type: String, required: true },
    address: { type: String, required: true },
    applyingFor: { type: String, required: true },
    applyingDate: { type: Date, default: Date.now },
    courseName: { type: String, required: true },
    duration: { type: String, required: true },
    batchTime: { type: String, required: true },
    staff: { type: String, required: true },
    courseStatus: { type: String, enum: ["Waiting", "Ongoing", "Completed", "AddExistingBatch"], default: "Waiting" },
    totalAmount: { type: Number, required: true },
    installments: { type: Number, required: true },
    installmentAmounts: [{ type: Number }],
    startingDate: { type: Date, required: true },
    batchId : {type: String , default: ""},
    otp: {type: String},
    otpExpire: {type: Number}
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
