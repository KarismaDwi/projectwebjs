const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./userModels');
const Product = require('./produkModels');

// Membuat model Checkout
const Checkout = db.define('Checkout', {
    id_checkout: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // UUID otomatis
        allowNull: false,
        unique: true
    },
    deliveryMethod: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        allowNull: false
    },
    recipientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipientPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.ENUM('bank_transfer', 'e_wallet'),
        allowNull: false
    },
    paymentVia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shippingCost: {
        type: DataTypes.INTEGER,
        defaultValue: 60000
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentStatus: {  // Menambahkan status pembayaran
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',  // Status awal adalah pending
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = Checkout;
