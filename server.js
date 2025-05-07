import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import cors from 'cors';

dotenv.config();

import { connectDB } from './config/dbConnection.js';
import { modelSync } from './config/modelSync.js';
import logger from './logger/logger.js';
import { morganMiddleware } from './middleware/morgan.js';
await connectDB();
await modelSync();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware)
// Middleware for logging HTTP requests
app.use('/api/auth', auth);


// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});