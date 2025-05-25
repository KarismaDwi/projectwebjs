const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

const { createUser, loginUser, editUser, deleteUser, getMyProfile, getUser, getUserById, getProfile } = require('../controllers/user');
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/edit/:id', editUser);
router.delete('/hapus/:id', deleteUser);
router.get('/me', authenticateUser, getMyProfile);
router.get('/user', getUser); 
router.get('/profile', authenticateUser, getProfile); // Menggunakan verifyToken untuk mendapatkan profil user
router.get('/user/:id', authenticateUser, getUserById); // Menggunakan verifyToken untuk mendapatkan user berdasarkan ID

const { getProduk, getProdukById, saveProduk, getProdukByKeyword, editProduk, deleteProduk } = require('../controllers/produk');
router.get('/produk', getProduk);
router.get('/produk/:id', getProdukById);
router.post('/save', saveProduk);
router.get('/search', getProdukByKeyword);
router.put('/produk/:id', editProduk);  // PUT untuk edit
router.delete('/produk/:id', deleteProduk);

const { addToCart, getCart, removeFromCart, updateCartItem } = require('../controllers/troli');
router.post('/cart', authenticateUser, addToCart);
router.get('/cart', authenticateUser, getCart);
router.delete('/cart/:id', authenticateUser, removeFromCart);
router.put('/cart/:id', authenticateUser, updateCartItem);


const { createCheckout, getAllCheckouts, getCheckoutById, directCheckout, updateCheckoutStatus,deleteCheckout } = require('../controllers/checkout');
router.post('/checkout', authenticateUser, createCheckout);
router.get('/checkouts', authenticateUser, getAllCheckouts);
router.get('/checkout/:id', authenticateUser, getCheckoutById);
router.post('/direct/:id_produk', authenticateUser, directCheckout);
router.put('/checkout/:id', authenticateUser, updateCheckoutStatus); // Update checkout status
router.delete('/checkout/:id', authenticateUser, deleteCheckout);

const { createCustomOrder, getCustomOrders, getCustomOrderById } = require('../controllers/customOrder');
router.post('/custom-order', authenticateUser, createCustomOrder);
router.get('/custom-orders', authenticateUser, getCustomOrders);
router.get('/custom-order/:id', authenticateUser, getCustomOrderById);

const { getAllKomplain, getUserKomplain, createKomplain, updateKomplainStatus } = require('../controllers/komplain');
router.get('/komplain', authenticateUser, getAllKomplain); // Admin route
router.get('/komplain/user', authenticateUser, getUserKomplain); // User route  
router.post('/komplain', authenticateUser, createKomplain); // User route
//router.put('/komplain/:id', authenticateUser, updateKomplainStatus); // Admin route

module.exports = router;