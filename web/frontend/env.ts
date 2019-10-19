import { config } from 'dotenv';
config();

// Define the defaults if no .env file is present.
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';
process.env.BACKEND_LOCATION = process.env.BACKEND_LOCATION || '127.0.0.1:34345';

module.exports = { env: process.env };
