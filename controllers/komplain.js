// komplain.js
const Komplain = require('../models/komplainModels');

// Get semua komplain (admin)
const getAllKomplain = async (req, res) => {
  try {
    const komplain = await Komplain.findAll({ 
      order: [['created_at', 'DESC']]
    });
    res.json({ 
      success: true,
      data: komplain 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Gagal mengambil data komplain' 
    });
  }
};

// Get komplain user sendiri
const getUserKomplain = async (req, res) => {
  const userId = req.user.id;
  try {
    const komplain = await Komplain.findAll({ 
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
    res.json({ 
      success: true,
      data: komplain 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Gagal mengambil data komplain' 
    });
  }
};

// Tambah komplain (user)
const createKomplain = async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user.id;
  
  if (!subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Subject dan message harus diisi'
    });
  }

  try {
    const newKomplain = await Komplain.create({ 
      user_id: userId, 
      subject, 
      message 
    });
    res.status(201).json({ 
      success: true,
      data: newKomplain 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Gagal membuat komplain' 
    });
  }
};

module.exports = {
  getAllKomplain,
  getUserKomplain,
  createKomplain
};
