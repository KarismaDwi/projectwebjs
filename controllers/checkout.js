const Checkout = require('../models/checkoutModels');
const CheckoutDetail = require('../models/checkoutDetailModels');
const Cart = require('../models/troliModels');
const Produk = require('../models/produkModels');
const User = require('../models/userModels');
const Payment = require('../models/paymentModels');
const { v4: uuidv4 } = require('uuid');

const createCheckout = async (req, res) => {
  try {
    const userId = req.user.id; // pastikan middleware autentikasi sudah jalan dan set req.user

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: {
        model: Produk,
        as: 'produk'
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Keranjang kosong.' });
    }

    let total = 0;
    cartItems.forEach(item => {
      total += item.produk.harga * item.quantity;
    });

    const shippingCost = Number(req.body.shipping_cost) || 0;

    const checkout = await Checkout.create({
      user_id: userId,
      order_code: 'INV-' + uuidv4().slice(0, 8).toUpperCase(),
      receiver_name: req.body.receiver_name,
      phone: req.body.phone,
      address: req.body.address,
      payment_method: req.body.payment_method,
      payer_name: req.body.payer_name || null,
      delivery_date: req.body.delivery_date,
      delivery_time: req.body.delivery_time,
      shipping_method: req.body.shipping_method,
      shipping_cost: shippingCost,
      total_amount: total + shippingCost
    });

    for (const item of cartItems) {
      await CheckoutDetail.create({
        checkout_id: checkout.id,
        id_produk: item.id_produk,
        ukuran: item.ukuran,
        quantity: item.quantity,
        harga: item.produk.harga
      });
    }

    await Cart.destroy({ where: { user_id: userId } });

    res.status(201).json({ message: 'Checkout berhasil.', data: checkout });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat checkout.' });
  }
};

const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'address', 'phone']
        },
        {
          model: CheckoutDetail,
          as: 'items', // ganti sesuai alias yang benar
          include: {
            model: Produk,
            as: 'produk',
            attributes: ['name', 'harga', 'gambar']
          }
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: checkouts
    });
  } catch (error) {
    console.error('Get Checkout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve checkouts',
      error: error.message
    });
  }
};

const getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'address', 'phone']
        },
        {
          model: CheckoutDetail,
          as: 'items',
          include: {
            model: Produk,
            as: 'produk',
            attributes: ['name', 'harga', 'gambar', 'deskripsi']
          }
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    if (!checkout) {
      return res.status(404).json({ success: false, message: 'Checkout not found' });
    }

    res.status(200).json({ success: true, data: checkout });
  } catch (error) {
    console.error('Get Checkout Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve checkout', error: error.message });
  }
};

const directCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_produk } = req.params;
    const { ukuran, quantity, receiver_name, phone, address, payment_method, payer_name, delivery_date, delivery_time, shipping_method, shipping_cost } = req.body;

    const produk = await Produk.findByPk(id_produk);

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    const total = produk.harga * quantity;
    const shippingCost = Number(shipping_cost) || 0;

    const checkout = await Checkout.create({
      user_id: userId,
      order_code: 'INV-' + uuidv4().slice(0, 8).toUpperCase(),
      receiver_name,
      phone,
      address,
      payment_method,
      payer_name: payer_name || null,
      delivery_date,
      delivery_time,
      shipping_method,
      shipping_cost: shippingCost,
      total_amount: total + shippingCost
    });

    await CheckoutDetail.create({
      checkout_id: checkout.id,
      id_produk,
      ukuran,
      quantity,
      harga: produk.harga
    });

    res.status(201).json({ message: 'Checkout langsung berhasil.', data: checkout });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat direct checkout.' });
  }
};

const updateCheckoutStatus = async (req, res) => {
  try {
    const { id } = req.params; // id checkout dari param URL
    const { status } = req.body; // status baru dari body request

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid.' });
    }

    const checkout = await Checkout.findOne({ where: { id, user_id: req.user.id } });

    if (!checkout) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    checkout.status = status;
    await checkout.save();

    res.status(200).json({ message: 'Status pesanan berhasil diperbarui.', data: checkout });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Gagal mengupdate status pesanan.', error: error.message });
  }
};

const deleteCheckout = async (req, res) => {
  try {
    const { id } = req.params; // id checkout dari param URL

    const checkout = await Checkout.findOne({ where: { id, user_id: req.user.id } });

    if (!checkout) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    await Checkout.destroy({ where: { id } });

    res.status(200).json({ message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    console.error('Delete Checkout Error:', error);
    res.status(500).json({ message: 'Gagal menghapus pesanan.', error: error.message });
  }
}

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  directCheckout,
  updateCheckoutStatus,
  deleteCheckout
};
