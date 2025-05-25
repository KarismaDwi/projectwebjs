const Sequelize = require('sequelize');
const db = require('../config/database');

// Import semua model
const User = require('./userModels');
const Checkout = require('./checkoutModels');
const Payment = require('./paymentModels');
const Product = require('./produkModels'); // gunakan nama Product secara konsisten
const Cart = require('./troliModels');

// === ASSOCIATIONS === //

// User -> Checkout (One-to-Many)
User.hasMany(Checkout, {
  foreignKey: 'user_id',
  as: 'checkouts' // Changed from 'checkout' to 'checkouts' for consistency
});
Checkout.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Product -> Checkout (One-to-Many)
Product.hasMany(Checkout, {
  foreignKey: 'id_produk',
  as: 'checkouts' // Changed from 'checkout' to 'checkouts'
});
Checkout.belongsTo(Product, {
  foreignKey: 'id_produk',
  as: 'produk' // Make sure this matches what you use in queries
});

// Checkout -> Payment (One-to-One)
Checkout.hasOne(Payment, {
  foreignKey: 'checkout_id',
  as: 'payment'
});
Payment.belongsTo(Checkout, {
  foreignKey: 'checkout_id',
  as: 'checkout'
});

// (Opsional) User -> Cart (One-to-Many)
User.hasMany(Cart, {
  foreignKey: 'user_id',
  as: 'cart'
});
Cart.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// (Opsional) Product -> Cart (One-to-Many)
Product.hasMany(Cart, {
  foreignKey: 'product_id',
  as: 'cart'
});
Cart.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Export semua model dan Sequelize instance
module.exports = {
  db,
  Sequelize,
  User,
  Checkout,
  Payment,
  Product,
  Cart
};
