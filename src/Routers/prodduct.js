const express = require("express");
const Upload = require("../Models/uploads.modal");
const Product = require("../Models/products.model");
const router = express.Router();

router.get("/prodduct", async (req, res) => {
    try {
      const projects = await Product.findAll();
      res.status(200).json({
        message: "Projects retrieved successfully!",
        projects: projects,
      });
    } catch (error) {
      console.error("Error retrieving projects:", error);
      res.status(500).json({ error: "Failed to retrieve projects" });
    }
  });

module.exports = router;