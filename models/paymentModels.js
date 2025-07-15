const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Payment = db.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Checkout',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proof_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Payment.associate = (models) => {
  Payment.belongsTo(models.Checkout, {
    foreignKey: 'checkout_id',
    as: 'checkout'
  });
};

module.exports = Payment;