import jwt from 'jsonwebtoken';
require('dotenv').config();

module.exports = function (req, res, next) {
  // Expect token in header: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  const [ , token ] = authHeader.split(' ');
  if (!token) return res.status(401).json({ msg: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;           // e.g. { id: '...' }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
