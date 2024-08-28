const express = require("express");
const router = express.Router();
const Project = require("../Models/project.model"); // Adjust the path as needed
const { Op } = require("sequelize");

// Route to create a new project
router.post("/projects", async (req, res) => {
  try {
    const {
      name_project,
      manager_project,
      fiscal_year,
      budget,
      date_start,
      date_end,
      status,
    } = req.body;

    // Create a new project
    const newProject = await Project.create({
      name_project,
      manager_project,
      fiscal_year,
      budget,
      date_start,
      date_end,
      status,
    });

    res.status(201).json({
      message: "New project created successfully!",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Route to get all projects
router.get("/projects", async (req, res) => {
  try {
    const { name_project, manager_project, fiscal_year, budget, date_start, date_end, status } = req.query;

    // Simplify conditions building
    const conditions = {
      ...(name_project && { name_project: { [Op.like]: `%${name_project}%` } }),
      ...(manager_project && { manager_project: { [Op.like]: `%${manager_project}%` } }),
      ...(fiscal_year && { fiscal_year }),
      ...(budget && { budget }),
      ...(date_start && { date_start: { [Op.gte]: new Date(date_start) } }),
      ...(date_end && { date_end: { [Op.lte]: new Date(date_end) } }),
      ...(status && { status }),
    };

    // Fetch projects based on the conditions
    const projects = await Project.findAll({ where: conditions });

    res.status(200).json({
      message: "Projects retrieved successfully!",
      projects: projects,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
});

// Route to delete a project
router.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.destroy({
      where: { id: id },
    });

    if (deletedProject) {
      res.status(200).json({
        message: "Project deleted successfully!",
      });
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Route to update a project
router.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_project,
      manager_project,
      fiscal_year,
      budget,
      date_start,
      date_end,
      status,
    } = req.body;

    const [updated] = await Project.update(
      {
        name_project,
        manager_project,
        fiscal_year,
        budget,
        date_start,
        date_end,
        status,
      },
      {
        where: { id: id },
        returning: true,
      }
    );

    if (updated) {
      const updatedProject = await Project.findByPk(id);
      res.status(200).json({
        message: "Project updated successfully!",
        project: updatedProject,
      });
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

module.exports = router;
