import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
};