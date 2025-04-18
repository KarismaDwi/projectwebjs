const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
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
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: false  
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
    }
}, {
    freezeTableName: true
});

module.exports = User;