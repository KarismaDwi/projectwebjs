const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Produk = db.define('Produk', {
  id_produk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  warna: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  kategori: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ukuran: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
  }
}, {
  tableName: 'produk',
  freezeTableName: true,
  timestamps: false
});

module.exports = Produk;