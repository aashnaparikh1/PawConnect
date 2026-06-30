const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./db/connection.js");

const authRoutes = require("./routes/auth.js");
const animalRoutes = require("./routes/animals.js");
const vetRoutes = require("./routes/vets.js");
const eventRoutes = require("./routes/events.js");
const applicationRoutes = require("./routes/applications.js");
const favoriteRoutes = require("./routes/favorites.js");
const petProfileRoutes = require("./routes/petProfiles.js");
const healthLogRoutes = require("./routes/healthLogs.js");
const reminderRoutes = require("./routes/reminders.js");
const resourceRoutes = require("./routes/resources.js");
const reviewRoutes = require("./routes/reviews.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.json({ message: "PawConnect API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/vets", vetRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/pet-profiles", petProfileRoutes);
app.use("/api/health-logs", healthLogRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
