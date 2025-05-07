import logger from "../logger/logger.js";
import { User } from "../models/User.js"
export const modelSync = async () => {
    try {
        // await User.sync({ alter: true })
        logger.info('Model sync executed successfully.');
    } catch (error) {
        logger.error('Error during model sync:', error);
    }
}