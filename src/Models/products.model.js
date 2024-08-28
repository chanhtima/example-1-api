const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Upload = require('./uploads.modal'); 

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  upload_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Upload,
      key: 'id',
    },
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'products',
  timestamps: false,
});

Product.belongsTo(Upload, { foreignKey: 'upload_id', as: 'upload' });

module.exports = Product;
