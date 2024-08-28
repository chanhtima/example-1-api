const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Upload = require("./uploads.modal");

const trackingModel = sequelize.define("master_tracking_status", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  upload_id: {
    type: DataTypes.UUID,
    references: {
      model: Upload,
      key: "id",
    },
    allowNull: true,
  },
});
trackingModel.belongsTo(Upload, { as: "upload", foreignKey: "upload_id" });
module.exports = trackingModel;
