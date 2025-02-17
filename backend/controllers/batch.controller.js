const Batch = require("../models/batch.model");
const Student = require("../models/student.model");
const errHandler = require("../utils/errHandler");

async function createBatch(req, res, next) {
  try {
    const { batchId, courseName, startingDate, batchTime, staff } = req.body;
    const existsBatch = await Batch.findOne({ batchId });
    if (existsBatch) return next(errHandler(400, "Batch already exists"));
    const students = await Student.find(
      {
        $and: [
          { applyingFor: courseName },
          { staff: staff },
          { batchTime: batchTime },
          { courseStatus: { $ne: "Completed" } },
        ],
      },
      { studentId: 1, _id: 0 }
    );

    const formattedStudents = students.map((student) => student.studentId);

    const newBatch = await new Batch({
      batchId,
      courseName,
      startingDate,
      batchTime,
      staff,
      courseStatus: "Ongoing",
      students: formattedStudents,
    }).save();

    await Student.updateMany(
      { studentId: { $in: formattedStudents } },
      { $set: { courseStatus: "Ongoing", batchId: batchId } }
    );

    res.status(201).json({
      success: true,
      data: newBatch._doc,
    });
  } catch (err) {
    next(err);
  }
}

async function updateBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    const existsBatch = await Batch.findOne({ batchId });
    if (!existsBatch) return next(errHandler(404, "Batch not found"));
    
    const students = await Student.find(
      {
        $and: [
          { applyingFor: existsBatch.courseName },
          { staff: existsBatch.staff },
          { batchTime: existsBatch.batchTime },
          { courseStatus: "AddExistingBatch" },
        ],
      },
      { studentId: 1, _id: 0 }
    );

    const formattedStudents = students.map((student) => student.studentId);

    await Student.updateMany(
      { studentId: { $in: existsBatch.students } },
      { $set: { staff: req.body.staff } }
    );

    await Student.updateMany(
      { studentId: { $in: formattedStudents } },
      { $set: { courseStatus: "Ongoing" } }
    );

    const updatedBatch = await Batch.findOneAndUpdate(
      { batchId },
      { 
        courseName: req.body.courseName, 
        startingDate: req.body.startingDate, 
        batchTime: req.body.batchTime, 
        staff: req.body.staff, 
        $push: { students: { $each: formattedStudents } }  
      },
      { new: true } 
    );

    res.status(200).json({
      success: true,
      message: `${updatedBatch.name, batchId} updated successfully`,
    });
  } catch(err) {
    next(err);
  }
}



async function deleteStudentsFromBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    const existsBatch = await Batch.findOne({ batchId }); 
    if (!existsBatch) return next(errHandler(404, "Batch not found"));
    const deletedStudent  = await Batch.findOneAndUpdate({batchId},
      { $pull : { students: req.body.studentId } },
      {new: true}
    );
    res.status(200).json({
      success: true,
      message: `Student ${req.body.studentId} deleted from ${batchId} successfully`,
    });
  } catch(err) {
    next(err);
  }
}



async function deleteBatch(req, res, next) {
  try {

    const {batchId} = req.params;
    const existingBatch = await Batch.findOne({batchId});
    if(!existingBatch) return next(errHandler(404, "batch not found"));
    const deletedBatch = await Batch.findOneAndDelete({batchId});
    res.status(200).json({
      success: true,
      message: `${deleteBatch.courseName} was deleted successfully..`
    })
  } catch(err) {
    next(err);
  }
}



async function getAllBatches(req, res, next) {
  try {
    const batches = await Batch.find();
    res.status(200).json({
      success: true,
      data: batches,
    });
  } catch(err) {
    next(err);
  }
}


async function getSpecificBatch(req, res, next) {
  try {
    const batch = await Batch.findOne({batchId: req.params.batchId});
    if(!batch) return next(errHandler(404, "batch not found"));
    res.status(200).json({
      success: true,
      data: batch,
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
  getSpecificBatch
};
