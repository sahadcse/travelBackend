/**
 * Router middleware function
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const routerUse = (req, res, next) => {
    // Check if request method is allowed
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add commonly used headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));

    // Error handling wrapper
    try {
        next();
    } catch (error) {
        console.error('Router middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = routerUse;