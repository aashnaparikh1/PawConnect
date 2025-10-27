const Animal = require('../models/Animal');

// GET all animals
const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// GET animal by ID
const getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animal', error });
  }
};

// POST - Add new animal
const createAnimal = async (req, res) => {
  try {
    const animal = new Animal(req.body);
    const savedAnimal = await animal.save();
    res.status(201).json({ message: 'Animal created successfully', animal: savedAnimal });
  } catch (error) {
    res.status(400).json({ message: 'Error creating animal', error });
  }
};

// PUT - Update existing animal
const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.status(200).json({ message: 'Animal updated successfully', animal });
  } catch (error) {
    res.status(400).json({ message: 'Error updating animal', error });
  }
};

// DELETE - Remove animal
const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting animal', error });
  }
};

module.exports = {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};
