const express = require("express");
const app = express();
const port = 8000;
const { readdirSync } = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const fs = require('fs');
// Import the database connection
const db = require('./src/config/database');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use("/api/images", express.static("images"));

const routersPath = './src/Routers';

if (fs.existsSync(routersPath)) {
  readdirSync(routersPath).map((r) => app.use("/api", require(routersPath + "/" + r)));
} else {
  console.error(`Directory not found: ${routersPath}`);
}

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