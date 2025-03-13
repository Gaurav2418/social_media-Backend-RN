const bcrypt = require("bcrypt");

// HASH FUNCTION
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw err;
  }
};

// COMPARE || DECRYPT FUNCTION
const comparePassword = async (password, hashed) => {
  try {
    const isMatch = await bcrypt.compare(password, hashed);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

module.exports = { hashPassword, comparePassword }