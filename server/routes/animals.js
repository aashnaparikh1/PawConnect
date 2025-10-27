const express = require("express");
const router = express.Router();

const {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require("../controllers/aninmalContorller.js");


router.get("/",getAllAnimals);
router.get("/:id", getAnimalById);
router.post("/", createAnimal);
router.put("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

module.exports = router;
