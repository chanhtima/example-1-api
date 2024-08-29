const trackingModel = require("../Models/master_tracking_status.model");
const Upload = require("../Models/uploads.modal");

exports.post = async (req, res) => {
  try {
 
    // ข้อมูลไฟล์ที่อัพโหลด
    const fileData = {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: "/images/" + req.file.filename,
    };
    const uploadedFile = await Upload.create(fileData);

    // ข้อมูลโครงการ
    const { name, description, remark,end_date ,progress} = req.body;
    const projectData = {
      name,
      description,
      end_date,
      progress,
      remark,
      upload_id: uploadedFile.id,
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
      const projects = await trackingModel.findAll({
        include: [
          {
            model: Upload, // รวมข้อมูลจาก Upload
            as: 'upload', // ชื่อที่ใช้สำหรับการรวม
            attributes: ['id', 'filename', 'url'] // เลือกเฉพาะฟิลด์ที่ต้องการ
          }
        ]
      });
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found" });
      }
  
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };