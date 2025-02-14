const express = require("express");
const router = express.Router();
const { createBatch, updateBatch, deleteStudentsFromBatch } = require("../controllers/batch.controller");

router.post("/create", createBatch)
      .patch("/update/:batchId", updateBatch)
      .patch("/delete/:batchId", deleteStudentsFromBatch);

module.exports = router;