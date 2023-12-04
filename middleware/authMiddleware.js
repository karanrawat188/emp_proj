
require('dotenv').config();

const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1]; // 

  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decoded = jwt.verify(token, process.env.secret_key); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};
module.exports = {
    requireAuth,
}