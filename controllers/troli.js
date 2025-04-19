// controllers/troliController.js
const Troli = require('../models/troliModels');
const Produk = require('../models/produkModels');

// Tambah ke troli
const addToTroli = async (req, res) => {
  try {
    const { id_produk, quantity, ukuran } = req.body;
    const id_user = req.user.id;

    // Ambil harga produk
    const produk = await Produk.findByPk(id_produk);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const subtotal = produk.harga * quantity;

    const troli = await Troli.create({
      id_user,
      id_produk,
      quantity,
      ukuran,
      subtotal
    });

    res.status(201).json({ message: 'Produk ditambahkan ke troli', troli });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan ke troli', error: error.message });
  }
};

// Ambil semua troli user
const getTroli = async (req, res) => {
  try {
    const id_user = req.user.id;
    const troli = await Troli.findAll({ where: { id_user } });
    res.status(200).json(troli);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil troli', error: error.message });
  }
};

// Update quantity dan ukuran
const updateTroli = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, ukuran } = req.body;

    const troliItem = await Troli.findByPk(id);
    if (!troliItem) return res.status(404).json({ message: 'Item troli tidak ditemukan' });

    const produk = await Produk.findByPk(troliItem.id_produk);
    const subtotal = produk.harga * quantity;

    await Troli.update({ quantity, ukuran, subtotal }, { where: { id_troli: id } });

    res.status(200).json({ message: 'Troli berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update troli', error: error.message });
  }
};

// Hapus troli
const deleteTroli = async (req, res) => {
  try {
    const { id } = req.params;
    await Troli.destroy({ where: { id_troli: id } });
    res.status(200).json({ message: 'Item troli berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal hapus troli', error: error.message });
  }
};

module.exports = { addToTroli, getTroli, updateTroli, deleteTroli };
