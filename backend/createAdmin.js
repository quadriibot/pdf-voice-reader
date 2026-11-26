
const pool = require("./config/database");
const bcrypt = require("bcryptjs");
const readline = require("readline");

// CREATE INPUT INTERFACE
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ASK FOR ADMIN EMAIL
input.question("Enter admin email: ", function(email) {

    // ASK FOR ADMIN PASSWORD
    input.question("Enter admin password: ", async function(password) {

        try {

            if (!email || !password || password.length < 8) {
                console.log("Enter a valid email and a password of at least 8 characters.");
                return;
            }

            // HASH PASSWORD
            const hashedPassword = await bcrypt.hash(password, 10);

            // SAVE ADMIN TO DATABASE
            await pool.query(
                "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
                [email.trim().toLowerCase(), hashedPassword]
            );

            console.log("================================");
            console.log("ADMIN ACCOUNT CREATED!");
            console.log("================================");

        } catch (error) {

            if (error.code === "23505") {
                console.log("This admin email already exists.");
            } else {
                console.log("Error creating admin:", error.message);
            }

        } finally {

            input.close();
            await pool.end();

        }

    });

});
