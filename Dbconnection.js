const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const connectToDatabase = async () => {
    try {
        await mongoose.connect(`mongodb+srv://naitikraj12935:${process.env.DB_PASSWORD}@cluster0.hz0aftd.mongodb.net/?retryWrites=true&w=majority`);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

module.exports = connectToDatabase;
