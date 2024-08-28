const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ตั้งค่า storage สำหรับ Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "images";
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

// ฟังก์ชันกรองประเภทไฟล์
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
  }
};

// กำหนดค่า Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // จำกัดขนาดไฟล์ที่ 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
