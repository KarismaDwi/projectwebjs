const User = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validRoles = ['admin', 'user', 'karyawan'];

const createUser = async (req, res) => {
    const { username, phone, email, password, address, role } = req.body;

    if (!username || !phone || !email || !password || !address || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    try {
        const newUser = await User.create({
            username,
            phone,
            email,
            password: hashPassword,
            address,
            role
        });

        // Generate token JWT
        const payload = { userId: newUser.id, role: newUser.role };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            accessToken: token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login user by email and filter role to redirect on FE
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Kata sandi salah' });

    // Buat JWT token
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );

    // Kembalikan role berdasarkan email (role sudah ikut di JWT)
    res.json({ 
      accessToken, 
      role: user.role,
      user_id: user.id // gunakan user_id konsisten dengan FE
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

const editUser = async (req, res) => {
  const userId = req.params.id;
  const { username, phone, email, password, address, role } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.username = username ?? user.username;
    user.phone = phone ?? user.phone;
    user.email = email ?? user.email;
    user.password = password ?? user.password; // hash dulu jika password diubah!
    user.address = address ?? user.address;
    user.role = role ?? user.role;

    await user.save();

    return res.json({ message: 'User berhasil diperbarui', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { include: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};
  
const getUser = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'phone', 'email', 'role', 'address']
        });

        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({message: "user not find"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Error retrieving user", error: error.message});
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await User.findAll({
            where: { role: 'karyawan' },
            attributes: ['id', 'username', 'phone', 'email', 'role', 'address']
        });

        if (!employees.length) {
            return res.status(404).json({ message: 'No employees found' });
        }

        res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'username', 'email', 'phone', 'address', 'role']
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createUser, loginUser, editUser, deleteUser, getMyProfile, getUser, getUserById, getProfile, getEmployees, getMe };