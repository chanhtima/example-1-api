const MenuModel = require("../Models/menu_service.model");
const Upload = require("../Models/uploads.modal");

exports.post = async (req, res) => {
  try {
    const fileData = {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: "/images/" + req.file.filename,
    };
    const uploadedFile = await Upload.create(fileData);

    const {
      name,
      description,
      content_type,
      content_detail,
      url,
      active_flag,
    } = req.body;
    const MenuData = {
      name,
      description,
      content_detail,
      url,
      content_type,
      active_flag,
      icon: uploadedFile.id,
    };

    // สร้างโครงการใหม่
    const newMenu = await MenuModel.create(MenuData);

    res
      .status(201)
      .json({ MenuData: newMenu, message: "Menu created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก trackingModel
    const menus = await MenuModel.findAll({
      where: { display_flag: false },
      include: [
        {
          model: Upload, // รวมข้อมูลจาก Upload
          as: "upload", // ชื่อที่ใช้สำหรับการรวม
          attributes: ["id", "filename", "url"], // เลือกเฉพาะฟิลด์ที่ต้องการ
        },
      ],
    });

    if (!menus || menus.length === 0) {
      return res.status(404).json({ message: "No menus found" });
    }

    res.status(200).json({ message: "successfully!", menus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก trackingModel
    const id = req.params.id;
    const conditions = {
      id,
      display_flag: false,
    };
    const menus = await MenuModel.findOne({
      where: conditions,
      include: [
        {
          model: Upload, // รวมข้อมูลจาก Upload
          as: "upload", // ชื่อที่ใช้สำหรับการรวม
          attributes: ["id", "filename", "url"], // เลือกเฉพาะฟิลด์ที่ต้องการ
        },
      ],
    });

    if (!menus || menus.length === 0) {
      return res.status(404).json({ message: "No menus found" });
    }

    res.status(200).json({
      message: "successfully!",
      menus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
