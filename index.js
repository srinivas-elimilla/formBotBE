const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use morgan for logging HTTP requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logs in a concise, colored format
} else {
  app.use(morgan("combined")); // Logs in a more detailed format (for production)
}

// Routes
app.use("/api/auth", authRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT || 5000}`)
);
