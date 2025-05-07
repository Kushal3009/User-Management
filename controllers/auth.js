import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sequelize } from '../config/dbConnection.js';
import logger from '../logger/logger.js';

export const signUp = async (req, res) => {
    const { email, username, password, currency } = req.body;

    const transaction = await sequelize.transaction();
    try {
        const existingUser = await User.findOne({ where: { email }, transaction });
        if (existingUser) {
            await transaction.rollback();
            logger.info(`Signup failed: User already exists for email: ${email}`);
            return res.status(400).json({ statusCode: 400, message: 'User Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, username, password: hashedPassword, currency_type: currency }, { transaction });

        await transaction.commit();
        logger.info(`User created successfully: ${email}`);
        res.status(201).json({ statusCode: 200, status: "success", message: 'User created successfully', data: "" });
    } catch (error) {
        await transaction.rollback();
        logger.error('Error creating user:', error);
        res.status(500).json({ statusCode: 500, message: 'Error creating user', error });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Find the user by username
        const user = await User.findOne({ where: { email } }, transaction);

        const SECREATE_KEY = process.env.JWT_SECREATE_KEY;
        if (!user) {
            logger.info(`Login failed: User not found for email: ${email}`);
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.info(`Login failed: Invalid credentials for email: ${email}`);
            return res.status(401).json({ statusCode: 401, message: 'Invalid Credential' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECREATE_KEY, { expiresIn: '1d' });


        logger.info(`User logged in successfully`);
        res.status(200).json({
            statusCode: 200, status: "success", message: 'Login Successfully', data: {
                token, currency_type: user.currency_type
            }
        });
    } catch (error) {
        logger.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
}

export const modifyUserInfo = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, currency_type } = req.body;
        const { id } = req.user;

        console.log("Updating User Info:", { id, username, email, currency_type });

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findByPk(id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username;
        user.currency_type = currency_type;
        await user.save({ transaction });
        await transaction.commit();

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "User updated successfully",
            data: user,
        });

    } catch (error) {
        await transaction.rollback();
        logger.error('Error modifying user info:', error);
        res.status(500).json({ message: 'Error updating user info', error });
    }
};



export const verifyUser = async (req, res) => {
    const token = req.headers.authToken || req.headers['authtoken'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ statusCode: 401, message: 'Access Denied. No token provided' });
    }

    try {
        const SECREATE_KEY = process.env.JWT_SECREATE_KEY;
        const verified = jwt.verify(token, SECREATE_KEY);
        req.user = verified;
        logger.info(`User verified successfully`);
        res.status(200).json({ statusCode: 200, status: "success", message: 'User verified successfully', data: verified });
    } catch (error) {
        logger.error('Invalid token:', error);
        const status = error.statusCode || 401;
        res.status(status).json({ statusCode: 400, message: error.message || "Access Denied" });
    }
}

export const userDetails = async (req, res) => {
    try {
        const { id } = req.user;

        const userInfo = await User.findOne({
            where: { id },
            attributes: ["username", "email", "currency_type"]
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: 'User details fetched successfully',
            data: userInfo
        });

    } catch (error) {
        logger.error('Error fetching user details:', error);

        const status = error.statusCode || 500;
        res.status(status).json({
            statusCode: status,
            message: error.message || "Something went wrong"
        });
    }
};
