const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Item = db.define('Item', {
  checkoutId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'checkouts',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'items',
  timestamps: false
});

module.exports = Item;
