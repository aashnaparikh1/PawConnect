const PetProfile = require('../Models/PetProfile');

// POST /api/pet-profiles
const createPetProfile = async (req, res) => {
  try {
    const pet = await PetProfile.create({ ...req.body, owner: req.user._id });
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/pet-profiles/my-pets
const getMyPets = async (req, res) => {
  try {
    const pets = await PetProfile.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pet-profiles/:id
const getPetProfileById = async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/pet-profiles/:id
const updatePetProfile = async (req, res) => {
  try {
    const pet = await PetProfile.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/pet-profiles/:id
const deletePetProfile = async (req, res) => {
  try {
    const pet = await PetProfile.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPetProfile,
  getMyPets,
  getPetProfileById,
  updatePetProfile,
  deletePetProfile,
};
