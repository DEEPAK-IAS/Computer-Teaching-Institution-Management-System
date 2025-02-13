const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    fatherPhone: { type: String, required: true },
    address: { type: String, required: true },
    applyingFor: { type: String, required: true },
    applyingDate: { type: Date, default: Date.now },
    courseName: { type: String, required: true },
    duration: { type: String, required: true },
    startingDate: { type: Date, required: true },
    batchTime: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    installments: { type: Number, required: true },
    installmentAmounts: [{ type: Number }]
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
