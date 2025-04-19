const express = require('express');
const router = express.Router();

const { createUser, loginUser } = require('../controllers/user');
router.post('/register', createUser);
router.post('/login', loginUser);

const { AddProduk, DeleteProduk, UpdateProduk, searchProduk, upload } = require('../controllers/produk');
router.post('/add', upload.single('gambar'), AddProduk);
router.delete('/delete/:id', DeleteProduk);
router.put('/update/:id', upload.single('gambar'), UpdateProduk);
router.get('/search/:keyword', searchProduk);

module.exports = router;