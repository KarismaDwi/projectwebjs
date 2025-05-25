const db = require('../config/database');
const Cart = require('../models/troliModels');
const Produk = require('../models/produkModels');

const validUkuran = ['Spray', 'Standard bloom', 'Full bloom', 'Bud', 'Mini bouquet', 'Grand bouquet'];

const addToCart = async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { product_id, quantity = 1, ukuran } = req.body;
    const user_id = req.user.id;

    if (!product_id || isNaN(product_id)) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ error: 'Invalid produk ID' });
    }
    if (quantity < 1) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    if (!validUkuran.includes(ukuran)) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ error: 'Invalid ukuran' });
    }

    const produk = await Produk.findByPk(product_id, { transaction });
    if (!produk) {
      if (transaction) await transaction.rollback();
      return res.status(404).json({ error: 'Produk not found' });
    }

    const availableSizes = produk.ukuran.split(',').map(s => s.trim());
    if (!availableSizes.includes(ukuran)) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ error: 'Selected size not available for this produk' });
    }

    const [cartItem, created] = await Cart.findOrCreate({
      where: { user_id, id_produk: product_id, ukuran },
      defaults: { quantity, ukuran, user_id, id_produk: product_id },
      transaction
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      message: 'Produk added to cart successfully',
      cartItem
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Cart error:', error);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
};



const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Produk,
          as: 'produk',
          attributes: ['id_produk', 'name', 'harga', 'gambar', 'url'],
          foreignKey: 'produk_id',
          targetKey: 'id_produk'
        }
      ]
    });

    const cartWithTotal = cartItems.map(item => {
      const total = item.quantity * item.produk?.harga;
      return {
        ...item.toJSON(),
        total
      };
    });

    res.status(200).json(cartWithTotal);
  } catch (err) {
    console.error('Detailed getCart error:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};


const updateCartItem = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    if (quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findOne({ 
      where: { id, user_id },
      transaction
    });

    if (!cartItem) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save({ transaction });

    await transaction.commit();
    return res.status(200).json({
      message: 'Cart item updated successfully',
      cartItem
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update cart error:', error);
    return res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const removeFromCart = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const deleted = await Cart.destroy({
      where: { id, user_id },
      transaction
    });

    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await transaction.commit();
    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    await transaction.rollback();
    console.error('Remove from cart error:', error);
    return res.status(500).json({ error: 'Failed to remove item' });
  }
};

module.exports = { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart 
};
