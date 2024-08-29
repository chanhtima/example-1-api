const express = require("express");
const router = express.Router();
const { get, create, update, softDelete, getById } = require("../Controllers/project.controllers");

// Route to create a new project
router.post("/projects", create);
// Route to get all projects
router.get("/projects", get);
// Route to getbyid a project
router.get("/projects/:id", getById);
// Route to update a project
router.put("/projects/:id", update);
// Route to delete a project
router.delete("/projects/:id", softDelete);

module.exports = router;
