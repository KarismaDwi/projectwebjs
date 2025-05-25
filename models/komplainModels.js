const { DataTypes } = require('sequelize');
const db = require('../config/database'); // sesuaikan dengan path koneksi db-mu

const Komplain = db.define('Komplain', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
},
  subject: { 
    type: DataTypes.STRING, 
    allowNull: false 
},
  message: { 
    type: DataTypes.TEXT, 
    allowNull: false 
},
}, {
  tableName: 'komplain',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Komplain;