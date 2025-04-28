const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    fatherPhone: { type: String, required: true },
    address: { type: String, required: true },
    courses: [
      {
        applyingFor: { type: String },
        applyingDate: { type: Date },
        duration: { type: String },
        startingDate: { type: Date },
        courseStatus: {type: String, enum: ["waiting", "break", "ongoing", "completed"], default: "waiting"},
        modulesInclude: [
          {
            moduleName: { type: String },
            moduleStatus: { type: String },
            moduleTime: {type: String},
          },
        ],
        currentModule: {
          moduleName: { type: String },
          moduleStatus: {
            type: String,
            enum: ["Waiting", "Ongoing", "Completed", "AddExistingBatch"],
            default: "Waiting",
          },
          batchTime: { type: String },
          staff: { type: String },
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    installments: { type: Number, required: true },
    installmentAmounts: [{ type: String }],
    batchIds: [{ type: String, default: "" }],
    otp: { type: String },
    otpExpire: { type: Number },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
