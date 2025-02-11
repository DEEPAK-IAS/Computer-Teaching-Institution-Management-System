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
    password: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Staff = mongoose.model("staff", staffSchema);
module.exports = Staff;
