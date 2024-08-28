const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Upload = sequelize.define(
  "uploads",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    upload_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    tableName: "uploads",
    timestamps: false,
  }
);

module.exports = Upload;
