const {DataTypes} = require('sequelize');
const db = require('../config/database');

const produk = db.define('produk', {
    id_produk: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,   
        autoIncrement: true
        },
    nama_produk: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    harga: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    stok: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    gambar: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ukuran: {
        type: DataTypes.ENUM('Spray', 'Standard bloom', 'Full bloom', 'Bud', 'Mini bouquet', 'Grand bouquet'),
        allowNull: false
    },
    warna: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    kategori: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
}, {
    freezeTableName: true
});

module.exports = produk;