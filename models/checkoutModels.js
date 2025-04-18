const {DataTypes} = require('sequelize');
const db = require('../config/database');

const checkout = db.define('checkout', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        
    },
})