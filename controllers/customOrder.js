const CustomOrder = require('../models/customOrderModels');
const User = require('../models/userModels'); // pastikan ini di-import
const path = require('path');
const { Op } = require('sequelize');

const createCustomOrder = async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const imagePath = `/upload/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image type' });
  }
  if (fileSize > 5_000_000) {
    return res.status(422).json({ msg: 'Image must be less than 5MB' });
  }

  file.mv(`./upload/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      const {
        deliveryDate,
        flowerType,
        flowerColor,
        size,
        arrangement,
        theme,
        messageCard,
        paymentMethod,
        notes
      } = req.body;

      // Ambil userId dari req.user.id (hasil decode JWT)
      const userId = req.user && req.user.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. User not found.' });
      }

      // Ambil data user lengkap dari DB
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found in database.' });
      }

      const deliveryDateTime = new Date(deliveryDate);
      const now = new Date();

      if (deliveryDateTime < now) {
        return res.status(400).json({ message: 'Delivery date must be in the future' });
      }

      if (deliveryDateTime.getHours() >= 20) {
        return res.status(400).json({ message: 'Delivery time must be before 8 PM' });
      }

      const order = await CustomOrder.create({
        userId: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        address: user.address,
        deliveryDate: deliveryDateTime,
        flowerType,
        flowerColor,
        size,
        arrangement,
        theme,
        messageCard,
        paymentMethod,
        notes,
        imagePath
      });

      res.status(201).json({
        message: 'Custom order created successfully',
        order
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating custom order', error: error.message });
    }
  });
};

const getCustomOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }

    const orders = await CustomOrder.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching custom orders', error: error.message });
  }
};

const getCustomOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Dapatkan custom order berdasarkan ID, beserta user info
    const order = await CustomOrder.findOne({
      where: { id },
      // Jika ingin include data user:
      // include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone', 'address'] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching custom order', error: error.message });
  }
};

module.exports = {createCustomOrder, getCustomOrders, getCustomOrderById};