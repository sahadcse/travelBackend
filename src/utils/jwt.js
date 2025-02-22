const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.test.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
    );
    return token;
};

module.exports = { generateToken };