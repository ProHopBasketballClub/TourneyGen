import { config } from 'dotenv';
config();

// Define the defaults if no .env file is present.
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';
process.env.BACKEND_LOCATION = process.env.BACKEND_LOCATION || 'http://127.0.0.1:34345';

console.log('ENV=' + process.env.ENVIRONMENT);
console.log('BL=' + process.env.BACKEND_LOCATION);
module.exports = { env: process.env };
