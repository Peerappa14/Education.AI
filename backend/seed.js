const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function seedData() {
    const sql = fs.readFileSync(path.join(__dirname, 'seed_data.sql'), 'utf8');
    try {
        await pool.query(sql);
        console.log('Database seeded successfully! Your AI is now smarter. 🧠');
    } catch (err) {
        console.error('Error seeding data:', err.message);
    } finally {
        await pool.end();
    }
}

seedData();
