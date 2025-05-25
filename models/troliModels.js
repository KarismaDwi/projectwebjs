const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Produk = require('./produkModels');
const User = require('./userModels');
const Checkout = require('./checkoutModels'); // nanti harus ada model checkout

const Cart = db.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  ukuran: {
    type: DataTypes.ENUM(
      'Spray',
      'Standard bloom',
      'Full bloom',
      'Bud',
      'Mini bouquet',
      'Grand bouquet'
    ),
    allowNull: false
  },
  checkout_id: {             // kolom tambahan untuk link ke transaksi checkout
    type: DataTypes.INTEGER,
    allowNull: true,         // null berarti masih di troli (belum checkout)
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cart',
  timestamps: false,
  underscored: true
});

// RELASI DENGAN PRODUK
Cart.belongsTo(Produk, { foreignKey: 'id_produk', as: 'produk' });
Produk.hasMany(Cart, { foreignKey: 'id_produk', as: 'cart' });

// RELASI DENGAN USER
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Cart, { foreignKey: 'user_id', as: 'cart' });

// RELASI DENGAN CHECKOUT
Cart.belongsTo(Checkout, { foreignKey: 'checkout_id', as: 'checkout' });
Checkout.hasMany(Cart, { foreignKey: 'checkout_id', as: 'cart' });

module.exports = Cart;
