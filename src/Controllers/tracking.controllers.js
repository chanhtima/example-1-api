

const trackingModel = require("../Models/master_tracking_status.model");
const Upload = require("../Models/uploads.modal");

exports.post = async (req, res) => {
  try {
    // อัพโหลดไฟล์หลายไฟล์
    const filePromises = req.files.map(file => {
      const fileData = {
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: "/images/" + file.filename,
      };
      return Upload.create(fileData);
    });
    
    const uploadedFiles = await Promise.all(filePromises);
    const uploadIds = uploadedFiles.map(file => file.id);

    // ข้อมูลโครงการ
    const { name, description, remark, end_date, progress } = req.body;
    const projectData = {
      name,
      description,
      end_date,
      progress,
      remark,
      upload_ids: uploadIds,
    };

    // สร้างโครงการใหม่
    const newProject = await trackingModel.create(projectData);

    res.status(201).json({ project: newProject, message: "Project created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก trackingModel
    const projects = await trackingModel.findAll();

    // ดึงข้อมูลรูปภาพตาม ID ที่เก็บไว้ใน trackingModel
    const projectsWithUploads = await Promise.all(projects.map(async (project) => {
      const uploads = await Upload.findAll({
        where: {
          id: project.upload_ids
        },
        attributes: ['filename', 'url']
      });
      return {
        ...project.toJSON(),
        uploads
      };
    }));

    if (!projectsWithUploads || projectsWithUploads.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json({ projects: projectsWithUploads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
