const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());


app.use(express.json());

const PORT = process.env.PORT || 3000;

let dogs = [{name: 'Buddy', age: 3, gender: 'male'}]

app.post('/dogs', (req, res) => {
  const newDog = req.body;
  dogs.push(newDog);
  res.status(201).json({message: 'Dog added successfully', dog: newDog});
})

app.get('/dogs', (req, res) => {
  res.json(dogs);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})