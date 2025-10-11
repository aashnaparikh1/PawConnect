const express = require('express');
const router = express.Router();
const { getDB } = require('./db/connection.js');

// GET all cats
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const cats = await db.collection('cats').find({}).toArray();
    res.json(cats);
  } catch (error) {
    console.error('Error fetching cats:', error);
    res.status(500).json({ message: 'Error fetching cats from database' });
  }
});

// GET a specific cat by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    const cat = await db.collection('cats').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }
    
    res.json(cat);
  } catch (error) {
    console.error('Error fetching cat:', error);
    res.status(500).json({ message: 'Error fetching cat from database' });
  }
});

// POST - Add a new cat
router.post('/', async (req, res) => {
  try {
    const newCat = req.body;
    if (!newCat || !newCat.name) {
      return res.status(400).json({ message: 'Invalid cat payload' });
    }

    const db = getDB();
    const result = await db.collection('cats').insertOne(newCat);
    
    res.status(201).json({ 
      message: 'Cat added successfully', 
      cat: { ...newCat, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error adding cat:', error);
    res.status(500).json({ message: 'Error adding cat to database' });
  }
});

// PUT - Update a cat
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const updatedCat = req.body;
    
    const db = getDB();
    const result = await db.collection('cats').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedCat }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Cat not found' });
    }
    
    res.json({ message: 'Cat updated successfully', cat: updatedCat });
  } catch (error) {
    console.error('Error updating cat:', error);
    res.status(500).json({ message: 'Error updating cat in database' });
  }
});

// DELETE - Remove a cat
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = getDB();
    const result = await db.collection('cats').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cat not found' });
    }
    
    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    console.error('Error deleting cat:', error);
    res.status(500).json({ message: 'Error deleting cat from database' });
  }
});

module.exports = router;