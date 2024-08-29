const { Op } = require("sequelize");
const Project = require("../Models/project.model");

exports.get = async (req, res) => {
  try {
    const {
      name_project,
      manager_project,
      fiscal_year,
      budget,
      date_start,
      date_end,
      status,
    } = req.query;

    // Simplify conditions building
    const conditions = {
      ...(name_project && { name_project: { [Op.like]: `%${name_project}%` } }),
      ...(manager_project && {
        manager_project: { [Op.like]: `%${manager_project}%` },
      }),
      ...(fiscal_year && { fiscal_year }),
      ...(budget && { budget }),
      ...(date_start && { date_start: { [Op.gte]: new Date(date_start) } }),
      ...(date_end && { date_end: { [Op.lte]: new Date(date_end) } }),
      ...(status && { status }),
      deleted: false,
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
};
exports.create = async (req, res) => {
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
};
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const conditions = {
      id,
      deleted: false,
    };
    const project = await Project.findOne({
      where: conditions,
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลโครงการ",
      });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.update = async (req, res) => {
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
};
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาโปรเจคโดยใช้ id
    const project = await Project.findOne({ where: { id: id } });

    // หากไม่พบโปรเจคหรือโปรเจคถูกลบไปแล้ว
    if (!project || project.deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    // อัพเดทค่า deleted เป็น true
    await Project.update({ deleted: true }, { where: { id: id } });

    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
