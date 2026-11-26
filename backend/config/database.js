
const { Pool } = require("pg");
require("dotenv").config({ path: "./backend/.env" });

// DATABASE CONNECTION
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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
