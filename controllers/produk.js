const { Op } = require('sequelize'); 
const Product = require('../models/produkModels');
const path = require('path');
const fs = require('fs');

const validSizes = ['Spray', 'Standard bloom', 'Full bloom', 'Bud', 'Mini bouquet', 'Grand bouquet'];

const validateSizes = (sizeString) => {
  if (!sizeString) return false;
  const sizes = sizeString.split(',').map(s => s.trim());
  return sizes.every(size => validSizes.includes(size));
};

const getProduk = async(req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const getProdukById = async(req, res) => {
    const { id } = req.params;
    try {
        const response = await Product.findOne({ where: { id_produk: id } });
        if (!response) {
            return res.status(404).json({ message: 'Produk not found' });
        }
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

const saveProduk = (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  const { name, harga, deskripsi, stok, warna, kategori, ukuran } = req.body;

  if (!name || !harga || !deskripsi || !stok) {
    return res.status(400).json({ msg: "Please fill in all required fields" });
  }

  if (ukuran && !validateSizes(ukuran)) {
    return res.status(400).json({ msg: "Invalid size selection" });
  }

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/upload/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid image type" });
  }
  if (fileSize > 5000000) {
    return res.status(422).json({ msg: "Image must be less than 5MB" });
  }

  file.mv(`./upload/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      await Product.create({
        name,
        harga,
        deskripsi,
        stok,
        gambar: fileName,
        url,
        warna,
        kategori,
        ukuran: ukuran || 'Spray,Standard bloom,Full bloom,Bud,Mini bouquet,Grand bouquet'
      });
      res.status(201).json({ msg: "Product created successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Error saving product" });
    }
  });
};

const getProdukByKeyword = async (req, res) => {
    const { keyword } = req.query;
    try {
        const response = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${keyword}%` } },
                    { deskripsi: { [Op.like]: `%${keyword}%` } },
                    { kategori: { [Op.like]: `%${keyword}%` } },
                    { warna: { [Op.like]: `%${keyword}%` } }
                ]
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch products by keyword' });
    }
};

const editProduk = async (req, res) => {
    const { id } = req.params;
    const { name, harga, deskripsi, stok, warna, kategori, ukuran } = req.body;

    try {
        const product = await Product.findOne({ where: { id_produk: id } });
        if (!product) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        if (ukuran && !validateSizes(ukuran)) {
            return res.status(400).json({ msg: "Invalid size selection" });
        }

        const updateData = {
            name,
            harga,
            deskripsi,
            stok,
            warna,
            kategori,
            ukuran: ukuran || product.ukuran
        };

        // Handle image update if provided
        if (req.files && req.files.file) {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const fileName = file.md5 + ext;
            const url = `${req.protocol}://${req.get('host')}/upload/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Invalid image type" });
            }
            if (fileSize > 5000000) {
                return res.status(422).json({ msg: "Image must be less than 5MB" });
            }

            // Delete old image
            try {
                if (product.gambar) {
                    fs.unlinkSync(`./upload/${product.gambar}`);
                }
            } catch (err) {
                console.error("Error deleting old image:", err);
            }

            // Save new image
            await file.mv(`./upload/${fileName}`);
            updateData.gambar = fileName;
            updateData.url = url;
        }

        await Product.update(updateData, { where: { id_produk: id } });
        res.status(200).json({ msg: 'Produk berhasil diperbarui' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Terjadi kesalahan saat memperbarui produk' });
    }
};

const deleteProduk = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { id_produk: id } });
        if (!product) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        // Delete associated image
        try {
            if (product.gambar) {
                fs.unlinkSync(`./upload/${product.gambar}`);
            }
        } catch (err) {
            console.error("Error deleting image:", err);
        }

        await Product.destroy({ where: { id_produk: id } });
        res.status(200).json({ msg: 'Produk berhasil dihapus' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Terjadi kesalahan saat menghapus produk' });
    }
};

module.exports = { 
    getProduk, 
    getProdukById, 
    saveProduk, 
    getProdukByKeyword, 
    editProduk, 
    deleteProduk 
};