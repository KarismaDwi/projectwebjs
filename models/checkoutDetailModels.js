const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Produk = require('./produkModels');

const CheckoutDetail = db.define('CheckoutDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkout_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ukuran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

// RELASI KE PRODUK
CheckoutDetail.belongsTo(Produk, { foreignKey: 'id_produk', as: 'produk' });

module.exports = CheckoutDetail;
