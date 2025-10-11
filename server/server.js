const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/connection.js');
const dogRouter = require('./dog');
const catRouter = require('./cat');
const animalsRouter = require('./animals')

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting server
const startServer = async () => {
  try {
    await connectDB();
    
    // Mount routers
    app.use('/dogs', dogRouter);
    app.use('/cats', catRouter);
    app.use('/animals', animalsRouter);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();