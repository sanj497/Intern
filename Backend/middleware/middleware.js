import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize: regular login signs { userId, role }, admin login signs { id, role }
    // Make both available as req.user.userId
    req.user = {
      ...decoded,
      userId: decoded.userId || decoded.id
    };
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
};