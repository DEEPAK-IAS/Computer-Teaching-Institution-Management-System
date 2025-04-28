const Batch = require("../models/batch.model");
const Student = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const errHandler = require("../utils/errHandler");
const createInitialAttendanceForBatch = require("./attendance.controller").createInitialAttendanceForBatch;


async function createBatch(req, res, next) {
  try {
    const {
      name,
      courseName,
      startingDate,
      batchTime,
      staff,
      students, 
    } = req.body;

    const existsBatch = await Batch.findOne({ name });
    if (existsBatch) return next(errHandler(400, "Batch already exists"));

    const rawDate = new Date(startingDate);

    const isoDate = rawDate.toISOString().split('T')[0];

    
    const newBatch = new Batch({
      name: `${name}-${isoDate}`,
      courseName,
      startingDate,
      batchTime,
      staff,
      courseStatus: "Ongoing",
      students: students || [],
    });
    await newBatch.save();

    if (students && students.length > 0) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { batchIds: newBatch._id.toString() } }
      );
    }

    await createInitialAttendanceForBatch(newBatch);


    res.status(201).json({
      success: true,
      message: "Batch and initial attendance created successfully!",
      batch: newBatch,
    });
  } catch (err) {
    next(err);
  }
}


async function updateBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    const existsBatch = await Batch.findOne({ _id: batchId });
    if (!existsBatch) return next(errHandler(404, "Batch not found"));

    const oldStudents = existsBatch.students.map(s => s.toString());
    const newStudents = req.body.students.map(s => s.toString());


    const updatedBatch = await Batch.findOneAndUpdate(
      { _id: batchId },
      {
        $set: {
          name: req.body.name,
          courseName: req.body.courseName,
          startingDate: req.body.startingDate,
          batchTime: req.body.batchTime,
          staff: req.body.staff,
          students: req.body.students,
          courseStatus: req.body.courseStatus,
        },
      },
      { new: true }
    );

    const attendanceDocs = await Attendance.find({ batchId });

    for (const doc of attendanceDocs) {
      const existingStudentIds = doc.students.map(s => s.studentId.toString());

      const studentsToAdd = newStudents.filter(id => !existingStudentIds.includes(id));
      const studentsToRemove = existingStudentIds.filter(id => !newStudents.includes(id));

      for (const id of studentsToAdd) {
        doc.students.push({
          studentId: id,
          dailyAttendance: []
        });
      }

      doc.students = doc.students.filter(s => !studentsToRemove.includes(s.studentId.toString()));

      await doc.save();
    }

    res.status(200).json({
      success: true,
      message: `${updatedBatch.courseName} was updated successfully..`,
      batch: updatedBatch,
    });

  } catch (err) {
    next(err);
  }
}


async function deleteStudentsFromBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    const existsBatch = await Batch.findOne({ batchId });
    if (!existsBatch) return next(errHandler(404, "Batch not found"));
    const deletedStudent = await Batch.findOneAndUpdate(
      { batchId },
      { $pull: { students: req.body.studentId } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: `Student ${req.body.studentId} deleted from ${batchId} successfully`,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    const existingBatch = await Batch.findOne({ _id: batchId });
    if (!existingBatch) return next(errHandler(404, "batch not found"));
    const deletedBatch = await Batch.findOneAndDelete({ _id:batchId });
    res.status(200).json({
      success: true,
      message: `${deletedBatch.name} was deleted successfully..`,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllBatches(req, res, next) {
  try {
    const batches = await Batch.find();
    res.status(200).json({
      success: true,
      batches: batches,
    });
  } catch (err) {
    next(err);
  }
}

async function getSpecificBatch(req, res, next) {
  try {
    const batch = await Batch.findOne({ _id: req.params.batchId });
    if (!batch) return next(errHandler(404, "batch not found"));
    res.status(200).json({
      success: true,
      batch: batch,
    });
  } catch (err) {
    next(err);
  }
}

async function cloneBatch(req, res, next) {
  try {
    const {
      name,
      courseName,
      startingDate,
      batchTime,
      staff,
      students,
    } = req.body;
    const existsBatch = await Batch.findOne({ name, startingDate,batchTime, staff });
    if (existsBatch) return next(errHandler(400, "Batch already exists"));
    let originalName = name;
    if (name.includes('-')) {
      originalName = name.split('-')[0];
    }

    const rawDate = new Date(startingDate);
    const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${rawDate.getFullYear()}`;

    const newBatch = new Batch({
      name: `${originalName}-${new Date(formattedDate).toISOString().split('T')[0]}`,
      courseName,
      startingDate,
      batchTime,
      staff,
      courseStatus: "Ongoing",
      students: students || [],
    });
    await newBatch.save();
    res.status(201).json({
      success: true,
      message: "Batch clone successfully!",
      batch: newBatch,
    });
  } catch(err) {
    next(err);
  }
}

module.exports = {
  createBatch,
  updateBatch,
  deleteStudentsFromBatch,
  deleteBatch,
  getAllBatches,
  getSpecificBatch,
  cloneBatch
};
