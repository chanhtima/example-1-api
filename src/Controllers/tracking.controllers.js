const trackingModel = require("../Models/master_tracking_status.model");
const Upload = require("../Models/uploads.modal");

exports.post = async (req, res) => {
  try {
    // อัพโหลดไฟล์หลายไฟล์
    const filePromises = req.files.map((file) => {
      const fileData = {
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: "/images/" + file.filename,
      };
      return Upload.create(fileData);
    });

    const uploadedFiles = await Promise.all(filePromises);
    const uploadIds = uploadedFiles.map((file) => file.id);

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

    res
      .status(201)
      .json({
        success: true,
        project: newProject,
        message: "Project created successfully!",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก trackingModel
    const projects = await trackingModel.findAll({ where: { deleted: false } });

    // ดึงข้อมูลรูปภาพตาม ID ที่เก็บไว้ใน trackingModel
    const projectsWithUploads = await Promise.all(
      projects.map(async (project) => {
        const uploads = await Upload.findAll({
          where: {
            id: project.upload_ids,
          },
          attributes: ["filename", "url"],
        });
        return {
          ...project.toJSON(),
          uploads,
        };
      })
    );

    if (!projectsWithUploads || projectsWithUploads.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json({ success: true, projects: projectsWithUploads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const conditions = {
      id,
      deleted: false,
    };

    // ค้นหาโครงการตาม ID
    const tracking = await trackingModel.findOne({ where: conditions });

    if (!tracking) {
      return res.status(404).json({ message: "tracking not found" });
    }

    // ดึงข้อมูลรูปภาพตาม ID ที่เก็บไว้ใน trackingModel
    const uploads = await Upload.findAll({
      where: {
        id: tracking.upload_ids, // ใช้ upload_ids จาก tracking ที่พบ
      },
      attributes: ["filename", "url"],
    });

    const trackingWithUploads = {
      ...tracking.toJSON(),
      uploads,
    };

    res.status(200).json({
      success: true,
      tracking: trackingWithUploads,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาโปรเจคโดยใช้ id
    const tracking = await trackingModel.findOne({ where: { id: id } });

    // หากไม่พบโปรเจคหรือโปรเจคถูกลบไปแล้ว
    if (!tracking || tracking.deleted) {
      return res.status(404).json({ error: "tracking not found" });
    }

    // อัพเดทค่า deleted เป็น true
    await trackingModel.update({ deleted: true }, { where: { id: id } });

    res.status(200).json({ message: "tracking deleted successfully!" });
  } catch (error) {
    console.error("Error deleting tracking:", error);
    res.status(500).json({ error: "Failed to delete tracking" });
  }
};


exports.updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, remark, end_date, progress, removeUploads = [] } = req.body;

    // ตรวจสอบว่าโครงการมีอยู่หรือไม่
    const existingProject = await trackingModel.findOne({ where: { id, deleted: false } });
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    let uploadIds = existingProject.upload_ids || [];

    // ถ้ามีไฟล์ใหม่ที่อัพโหลด
    if (req.files && req.files.length > 0) {
      // อัพโหลดไฟล์หลายไฟล์
      const filePromises = req.files.map((file) => {
        const fileData = {
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          url: "/images/" + file.filename,
        };
        return Upload.create(fileData);
      });

      const uploadedFiles = await Promise.all(filePromises);
      const newUploadIds = uploadedFiles.map((file) => file.id);

      // อัพเดท upload_ids
      uploadIds = [...uploadIds, ...newUploadIds];
    }

    // ลบ upload_ids ที่ต้องการออก
    if (removeUploads.length > 0) {
      uploadIds = uploadIds.filter(id => !removeUploads.includes(id));
      // ลบไฟล์จาก Upload model
      await Upload.destroy({ where: { id: removeUploads } });
    }

    // อัพเดทข้อมูลโครงการ
    const updatedData = {
      name,
      description,
      remark,
      end_date,
      progress,
      upload_ids: uploadIds,
    };

    // ทำการอัพเดทข้อมูล
    await trackingModel.update(updatedData, { where: { id } });

    // ดึงข้อมูลโครงการที่อัพเดทแล้ว
    const updatedProject = await trackingModel.findOne({ where: { id } });

    res.status(200).json({
      success: true,
      project: updatedProject,
      message: "Project and images updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


