const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId; // Pastikan ini sesuai dengan payload JWT
    req.user = { id: decoded.userId }; // Tambahkan user object ke request
    next();
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
};

module.exports = authenticateUser;