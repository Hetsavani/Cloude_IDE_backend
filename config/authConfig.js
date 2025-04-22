<<<<<<< HEAD
// server/config/authConfig.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key', // Use environment variable or default
    jwtExpiration: '1m', // Example: Token expires in 1 hour
=======
// server/config/authConfig.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key', // Use environment variable or default
    jwtExpiration: '30d', // Example: Token expires in 1 hour
>>>>>>> Het
};