const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "staff",
    },
    courses: {
      type: [String],
      required: true,
    },
    availableTime: {
      type: [String],
      required: true
    },
    otp: { type: String },
    otpExpire: { type: Number },
  },
  { timestamps: true }
);

const Staff = mongoose.model("staff", staffSchema);
module.exports = Staff;
