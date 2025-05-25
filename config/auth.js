import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId; 
  } catch (error) {
    return null;
  }
};
