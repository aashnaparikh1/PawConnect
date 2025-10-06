const express = require('express');
const cors = require('cors');
const app = express();
const dogRouter = require('./dog');
const catRouter = require('./cat');

app.use(cors());


app.use(express.json());

const PORT = process.env.PORT || 3000;

// Mount routers
app.use('/dogs', dogRouter);
app.use('/cats', catRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})