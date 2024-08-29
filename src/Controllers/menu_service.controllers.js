const MenuModel = require("../Models/menu_service.model");
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
    const {
      name,
      description,
      content_type,
      content_detail,
      url,
      active_flag
    } = req.body;
    const projectData = {
      name,
      description,
      content_detail,
      url,
      content_type,
      active_flag,
      icon: uploadedFile.id,
    };

    // สร้างโครงการใหม่
    const newProject = await MenuModel.create(projectData);

    res
      .status(201)
      .json({ project: newProject, message: "Project created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


