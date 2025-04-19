const { DataTypes } = require('sequelize');
const db = require('../config/database');
const produk = require('./produkModels');
const user = require('./userModels');

const troli = db.define('troli', {
    id_troli: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        }
    },
    id_produk: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: produk,
            key: 'id_produk'
        }
    },
    quantity: {
        type: DataTypes.INTEGER(11),
        defaultValue: 1,
    },
    subtotal: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    freezeTableName: true,
});

troli.belongsTo(user, { foreignKey: 'id_user' });
troli.belongsTo(produk, { foreignKey: 'id_produk' });

module.exports = troli;