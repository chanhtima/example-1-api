const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  name_project: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manager_project: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fiscal_year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Project',
  timestamps: true,
});

module.exports = Project;
