import jwt from 'jsonwebtoken';
import logger from '../logger/logger.js';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authToken'] || req.headers["authtoken"];
    if (!token) {
        logger.info('No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const secret = process.env.JWT_SECREATE_KEY;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        logger.debug(`Authenticated user: ${decoded.email}`);
        next();
    } catch (error) {
        logger.error('Invalid token:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};