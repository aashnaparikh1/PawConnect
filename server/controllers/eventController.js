const Event = require('../models/events');

const getAllEvents = async (req, res) => {
  try{
    const events = await Event.find({});
    res.status(200).json(events);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const getEventById = async (req, res) => {
  try{
    const event = await Event.findById(req.params.id);
    res.status(200).json(event);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const createEvent = async (req, res) => {
  try{
    const event = await Event.create(req.body);
    res.status(201).json(event);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const updateEvent = async (req, res) => {
  try{
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(event);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

const deleteEvent = async (req, res) => {
  try{ 
    const event = await Event.findByIdAndDelete(req.params.id);
  }
  catch(error){
    res.status(500).json({ message: error.message, error });
  }
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };