import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../logger/logger.js';

dotenv.config();


// Initialize Sequelize with MSSQL configuration
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    port: 1433
});

// Test the database connection
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection to MSSQL has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
}

