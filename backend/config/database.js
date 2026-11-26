
const { Pool } = require("pg");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

// DATABASE CONNECTION
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // SECURE CONNECTION FOR PRODUCTION DATABASE
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
});

// CHECK DATABASE CONNECTION
pool.connect((error, client, release) => {

    if (error) {
        console.log("Database connection failed!");
        console.log(error.message);
    } else {
        console.log("Database connected successfully!");

        release();
    }

});

// EXPORT DATABASE CONNECTION
module.exports = pool;
