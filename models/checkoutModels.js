const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./userModels');
const Payment = require('./paymentModels');

const Checkout = db.define('Checkout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  receiver_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payer_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  delivery_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  delivery_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  shipping_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  proof_of_transfer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// RELASI
Checkout.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Checkout.hasOne(Payment, { foreignKey: 'checkout_id', as: 'payment' });

const CheckoutDetail = require('./checkoutDetailModels');
Checkout.hasMany(CheckoutDetail, {
  foreignKey: 'checkout_id',
  as: 'items'
});

module.exports = Checkout;
