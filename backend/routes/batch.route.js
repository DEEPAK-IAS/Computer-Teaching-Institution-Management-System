const express = require("express");
const router = express.Router();
const { createBatch, updateBatch, deleteStudentsFromBatch, deleteBatch, getAllBatches, getSpecificBatch, cloneBatch } = require("../controllers/batch.controller");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.post("/create", verifyToken, authorizeRoles("admin"), createBatch)
      .patch("/update/:batchId", verifyToken, authorizeRoles("admin"), updateBatch)
      .patch("/delete-student/:batchId", verifyToken, authorizeRoles("admin"), deleteStudentsFromBatch)
      .delete("/delete/:batchId", verifyToken, authorizeRoles("admin"), deleteBatch)
      .get("/all", verifyToken, authorizeRoles("admin"), getAllBatches)
      .get("/:batchId", verifyToken, authorizeRoles("admin", "staff"), getSpecificBatch)
      .post("/clone", verifyToken, authorizeRoles("admin"), cloneBatch);

module.exports = router;