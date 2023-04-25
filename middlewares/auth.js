const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Find user in database
    const user = await User.findOne({ _id: decoded.user.id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    // Add user and token to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;
