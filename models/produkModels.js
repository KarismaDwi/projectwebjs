const {DataTypes} = require('sequelize');
const db = require('../config/database');

const produk = db.define('produk', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    jumlah: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = produk;