import express from 'express';
import { login, signUp, verifyUser, userDetails, modifyUserInfo } from '../controllers/auth.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

//signup route
router.post('/signup', signUp);

// Login route
router.post('/login', login);

// Modify User Details
router.post('/modifyUser', authenticateToken, modifyUserInfo);

// verifyUser route
router.post('/verifyUser', verifyUser);

// Get User Details
router.get('/userDetails', authenticateToken, userDetails)

export default router;