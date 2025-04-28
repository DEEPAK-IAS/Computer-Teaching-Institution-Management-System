const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: { type: String },
    courseName: { type: String, required: true },
    startingDate: { type: Date, required: true },
    batchTime: { type: String, required: true },
    staff: { type: String, required: true },
    courseStatus: {
      type: String,
      enum: ["Waiting", "Ongoing", "Break", "Completed"],
      default: "Ongoing",
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], 
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
