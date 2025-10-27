const express = require("express");
const router = express.Router();

const {
  getAllVets,
  getVetById,
  createVet,
  updateVet,
  deleteVet,
} = require("../controllers/vetController.js");

router.get("/", getAllVets);
router.get("/:id", getVetById);
router.post("/", createVet);
router.put("/:id", updateVet);
router.delete("/:id", deleteVet);

module.exports = router;