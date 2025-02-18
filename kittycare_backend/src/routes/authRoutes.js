const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { findUserByEmail, createUserInDatabase } = require('../services/supabaseConnection');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await findUserByEmail(email);

    if (!user) {
      user = await createUserInDatabase(
        name.split(' ')[0], // first_name
        name.split(' ')[1] || '', // last_name
        email,
        null, // password
        null, // phone_number
        picture // photo
      );
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      full_name: name,
      photo: picture
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      expiresIn: '7d',
      email,
      photo: picture,
      name
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

module.exports = router;