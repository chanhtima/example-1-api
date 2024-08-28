const { findUserByEmail, createUser } = require('../Models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await findUserByEmail(email);

    // Check if user already exists
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser(email, username, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      userData: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error during registration');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      userData: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error during login');
  }
};
