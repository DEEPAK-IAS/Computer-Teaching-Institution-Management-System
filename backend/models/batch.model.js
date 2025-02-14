const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    startingDate: { type: Date, required: true },
    batchTime: { type: String, required: true },
    staff: { type: String, required: true },
    courseStatus: {
      type: String,
      enum: ["Waiting","Ongoing", "break", "Completed"],
      default: "Ongoing",
    },
    students: [String],
  },
  { timestamps: true }
);

const Batch = mongoose.model("batch", batchSchema);
module.exports = Batch;
