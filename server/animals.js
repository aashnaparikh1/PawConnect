const express = require('express');
const router = express.Router();
const { getDB } = require('./db/connection.js');

router.get('/', async (req, res) => {
  try{
    const db = getDB();
    const animals = await db.collection('animals').find({}).toArray();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});


module.exports = router;