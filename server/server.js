const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connection.js")
// const animalRoutes = require("./routes/animals.js");
// const vetRoutes = require("./routes/vets.js");
// const eventRoutes = require("./routes/events.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

// app.use("/api/animals", animalRoutes);
// app.use("/api/vets", vetRoutes);
// app.use("/api/events", eventRoutes)

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
})