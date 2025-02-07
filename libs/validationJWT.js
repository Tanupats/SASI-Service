require("dotenv").config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const validateJwt = async (apikey) => {
  // Check if apikey is provided; if not, return immediately
  if (!apikey) {
    return { msg: 'API key missing', status: false };
  }

  try {
    const { userId } = await jwt.verify(apikey, secretKey);
    if (userId) {
      return { msg: 'Auth OK', status: true, userId: userId };
    } else {
      return { msg: 'User ID not found in token', status: false };
    }
  } catch (error) {
    // Handle errors (e.g., invalid token) gracefully
    return { msg: 'Invalid token', status: false };
  }
};
module.exports = validateJwt