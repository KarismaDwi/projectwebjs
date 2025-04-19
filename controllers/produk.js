const { Op } = require('sequelize'); // Mengimpor Op untuk operasi pencarian
const produk = require('../models/produkModels');
const multer = require('multer');
const path = require('path');
const validRoles = ['Spray', 'Standard bloom', 'Full bloom', 'Bud', 'Mini bouquet', 'Grand bouquet']

// Setup multer untuk menyimpan gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/'); // Gambar akan disimpan di folder 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Menggunakan nama file yang unik
    }
});

const fileFilter = (req, file, cb) => {
    const allowesTypes = /jpeg|jpg|png/;
    const extName = allowesTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowesTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Fungsi untuk menambah produk
const AddProduk = async (req, res) => {
    try {
        // Jika ada gambar, ambil nama file gambar
        const gambar = req.file ? req.file.filename : null;
        const { nama_produk, harga, deskripsi, stok, ukuran } = req.body;

        if (!validRoles.includes(ukuran)){
            return res.status(400).json({message: 'invalid size'});
        }

        // Menyimpan data produk ke database
        await produk.create({ nama_produk, harga, deskripsi, stok, gambar, ukuran });

        res.status(201).json({ message: 'Produk berhasil ditambahkan' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding produk', error: error.message });
    }
};

// Fungsi untuk menghapus produk
const DeleteProduk = async (req, res) => {
    const { id } = req.params;  // Mengambil id dari URL
    try {
        // Hapus produk berdasarkan id
        const result = await produk.destroy({ where: { id_produk: id } });

        if (result === 0) {
            // Jika produk tidak ditemukan
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        res.status(200).json({ message: 'Produk deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting produk', error: error.message });
    }
};
// Fungsi untuk memperbarui produk
const UpdateProduk = async (req, res) => {
    const { id } = req.params;
    const { nama_produk, harga, deskripsi, stok, ukuran } = req.body;

    if (!validRoles.includes(ukuran)){
        return res.status(400).json({message: 'invalid size'});
    }

    try {
        const gambar = req.file ? req.file.filename : null; // Mengambil gambar baru jika ada

        await produk.update({ nama_produk, harga, deskripsi, stok, gambar, ukuran }, { where: { id_produk: id } });
        res.status(200).json({ message: 'Produk updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating produk', error: error.message });
    }
};

// Fungsi untuk mencari produk berdasarkan keyword
const searchProduk = async (req, res) => {
    const { keyword } = req.params;
    try {
        const results = await produk.findAll({
            where: {
                nama_produk: {
                    [Op.like]: `%${keyword}%` // Pencarian menggunakan LIKE
                }
            }
        });
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error searching produk', error: error.message });
    }
};

// Ekspor controller untuk digunakan di router
module.exports = { AddProduk, DeleteProduk, UpdateProduk, searchProduk, upload };
