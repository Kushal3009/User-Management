import { DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnection.js';

// Define the User model
export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD' // Default currency set to USD
    }
});
