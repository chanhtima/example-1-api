const trackingModel = require("../Models/master_tracking_status.model");
const Upload = require("../Models/uploads.modal");

exports.post = async (req, res) => {
  try {
    // ตรวจสอบและแปลงรูปแบบวันที่
    let formattedEndDate = null;
    try {
      formattedEndDate = req.body.end_date ? new Date(req.body.end_date).toISOString() : null;
    } catch (error) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // ข้อมูลไฟล์ที่อัพโหลด
    const fileData = {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: "/images/" + req.file.filename,
    };
    const uploadedFile = await Upload.create(fileData);

    // ตรวจสอบและจัดการค่า progress ให้เป็นจำนวนเต็ม
    let progress = parseInt(req.body.progress, 10);
    if (isNaN(progress)) {
      return res.status(400).json({ error: "Invalid progress value. Must be a number." });
    }

    // ข้อมูลโครงการ
    const { name, description, remark } = req.body;
    const projectData = {
      name,
      description,
      end_date: formattedEndDate,
      progress: progress,
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