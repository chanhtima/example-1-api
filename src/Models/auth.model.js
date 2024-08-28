const db = require('../config/db'); // Import PostgreSQL connection

// Function to check if a user exists
const findUserByEmail = async (email) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    return user;
  } catch (error) {
    throw new Error('Failed to find user: ' + error.message);
  }
};

// Function to create a new user
const createUser = async (email, username, hashedPassword) => {
  try {
    const result = await db.one(
      'INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *',
      [email, username, hashedPassword]
    );
    return result;
  } catch (error) {
    throw new Error('Failed to create user: ' + error.message);
  }
};

module.exports = { findUserByEmail, createUser };
