require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in .env");
    }

    console.log("URI:", process.env.MONGO_URI);
    console.log("readyState before connect:", mongoose.connection.readyState);

    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("DB Connected");
    console.log("readyState after connect:", mongoose.connection.readyState);

    // ✅ Load model AFTER connection
    require("./models/User");

    // ✅ Routes
    app.use("/api/auth", require("./routes/authroutes"));
    app.use("/api/projects", require("./routes/projectroutes"));
    app.use("/api/tasks", require("./routes/taskroutes"));

    // test route
    app.get("/", (req, res) => {
      res.send("API Running");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

start();