const express = require("express");
const app = express();
const port = 8000;
const { readdirSync } = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

// Import the database connection
const db = require('./src/config/database');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use("/api/images", express.static("images"));

// Routes
readdirSync("./src/Routers").map((r) => app.use("/api", require("./src/Routers/" + r)));


// Root route
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
db.authenticate()
  .then(() => {
    // console.log('Database connected...');
    return db.sync(); // Sync the database models
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is Running on port: http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });