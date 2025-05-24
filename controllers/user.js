const User = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validRoles = ['admin', 'user'];

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
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: 'Wrong Password' });

        const userId = user.id;
        const username = user.username;
        const userEmail = user.email; // ← ganti nama variabel
        const role = user.role;

        const accessToken = jwt.sign(
            { userId, username, email: userEmail, role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

const editUser = async (req, res) => {
    const { id } = req.params;
    const { username, phone, email, password, address, role } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let editedPassword = user.password;
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            editedPassword = bcrypt.hashSync(password, salt);
        }

        await user.update({
            username: username || user.username,
            phone: phone || user.phone,
            email: email || user.email,
            password: editedPassword,
            address: address || user.address,
            role: role || user.role
    });
        
    res.json({ message: 'User updated successfully', user });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
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

module.exports = { createUser, loginUser, editUser, deleteUser };
