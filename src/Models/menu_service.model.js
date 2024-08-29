const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Upload = require("./uploads.modal");

const MenuModel = sequelize.define("menu_service", {
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
  icon: {
    type: DataTypes.UUID,
    references: {
      model: Upload,
      key: "id",
    },
    allowNull: true,
  },
  content_type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content_detail: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  active_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  display_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
MenuModel.belongsTo(Upload, { as: "upload", foreignKey: "icon" });
module.exports = MenuModel;

