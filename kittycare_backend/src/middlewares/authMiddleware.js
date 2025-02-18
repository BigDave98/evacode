const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { supabase } = require('../services/supabaseConnection');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        // First try to verify if it's a Supabase session token
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded?.user) {
            // If it's a valid Supabase token, set the user info
            req.user = {
                          userId: decoded.userId,
                          email: decoded.email,
                          full_name: decoded.full_name,
                          photo: decoded.photo // Novo campo
                        };
            return next();
        }

        // If not a Supabase token, try JWT
        const { userId, email, full_name } = jwt.verify(token, JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);
req.user = {
  userId: decoded.userId,
  email: decoded.email,
  full_name: decoded.full_name,
  photo: decoded.photo // Novo campo
};
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid token. User not authenticated.' });
    }
};

module.exports = authenticateToken;