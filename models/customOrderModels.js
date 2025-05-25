const { DataTypes } = require('sequelize');
const db = require('../config/database');

const CustomOrder = db.define('custom_order', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  flowerType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  flowerColor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  arrangement: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  theme: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  messageCard: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagePath: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  freezeTableName: true,
  timestamps: true
});

module.exports = CustomOrder;