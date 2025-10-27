const Vet = require('../models/vet');

const getAllVets = async (req, res) => {
  try{
    const vets = await Vet.find({});
    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
}

const getVetById = async (req, res) => {
  try{
    const vet = await Vet.findById(req.params.id);
    res.status(200).json(vet);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const createVet = async (req, res) => {
  try{
    const vet = await Vet.create(req.body);
    res.status(201).json(vet);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const updateVet = async (req, res) => {
  try{
    const vet = await Vet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(vet);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
} 

const deleteVet = async (req, res) => {
  try{
    const vet = await Vet.findByIdAndDelete(req.params.id)
    res.status(200).json(vet);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

module.exports = { getAllVets, getVetById, createVet, updateVet, deleteVet };