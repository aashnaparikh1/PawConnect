const express = require('express');
const router = express.Router();
const { getDB } = require('./db/connection.js');

// GET all dogs
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const dogs = await db.collection('dogs').find({}).toArray();
    res.json(dogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ message: 'Error fetching dogs from database' });
  }
});

// GET a specific dog by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    const dog = await db.collection('dogs').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    res.json(dog);
  } catch (error) {
    console.error('Error fetching dog:', error);
    res.status(500).json({ message: 'Error fetching dog from database' });
  }
});

// POST - Add a new dog
router.post('/', async (req, res) => {
  try {
    const newDog = req.body;
    if (!newDog || !newDog.name) {
      return res.status(400).json({ message: 'Invalid dog payload' });
    }

    const db = getDB();
    const result = await db.collection('dogs').insertOne(newDog);
    
    res.status(201).json({ 
      message: 'Dog added successfully', 
      dog: { ...newDog, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error adding dog:', error);
    res.status(500).json({ message: 'Error adding dog to database' });
  }
});

// PUT - Update a dog
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const updatedDog = req.body;
    
    const db = getDB();
    const result = await db.collection('dogs').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedDog }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    res.json({ message: 'Dog updated successfully', dog: updatedDog });
  } catch (error) {
    console.error('Error updating dog:', error);
    res.status(500).json({ message: 'Error updating dog in database' });
  }
});

// DELETE - Remove a dog
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = getDB();
    const result = await db.collection('dogs').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    res.json({ message: 'Dog deleted successfully' });
  } catch (error) {
    console.error('Error deleting dog:', error);
    res.status(500).json({ message: 'Error deleting dog from database' });
  }
});

module.exports = router;


