
const pool = require("../config/database");
const bcrypt = require("bcryptjs");

// ADMIN LOGIN
const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // CHECK IF EMAIL AND PASSWORD WERE PROVIDED
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password."
            });
        }

        // FIND ADMIN IN DATABASE
        const result = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const admin = result.rows[0];

        // CHECK PASSWORD
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // CREATE A FRESH ADMIN SESSION
        req.session.regenerate((error) => {

            if (error) {
                return res.status(500).json({
                    message: "Could not create admin session."
                });
            }

            req.session.adminId = admin.id;

            req.session.save((error) => {

                if (error) {
                    return res.status(500).json({
                        message: "Could not save admin session."
                    });
                }

                return res.status(200).json({
                    message: "Login successful."
                });

            });

        });

    } catch (error) {

        console.log("Admin login error:", error.message);

        return res.status(500).json({
            message: "Something went wrong during login."
        });

    }

};


// ADMIN LOGOUT
const adminLogout = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: "Could not log out."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logout successful."
        });

    });

};


// GET ADMIN STATISTICS
const getAdminStatistics = async (req, res) => {

    try {

        const visitors = await pool.query(
            "SELECT COUNT(DISTINCT visitor_id) FROM analytics_events WHERE event_type = 'visit'"
        );

        const activeUsers = await pool.query(
            "SELECT COUNT(DISTINCT visitor_id) FROM analytics_events WHERE created_at >= NOW() - INTERVAL '15 minutes'"
        );

        const uploads = await pool.query(
            "SELECT COUNT(*) FROM analytics_events WHERE event_type = 'upload'"
        );

        const listeners = await pool.query(
            "SELECT COUNT(*) FROM analytics_events WHERE event_type = 'listen'"
        );

        return res.status(200).json({

            totalVisitors: Number(visitors.rows[0].count),

            activeUsers: Number(activeUsers.rows[0].count),

            totalUploads: Number(uploads.rows[0].count),

            totalListeners: Number(listeners.rows[0].count)

        });

    } catch (error) {

        console.log("Statistics error:", error.message);

        return res.status(500).json({
            message: "Could not load dashboard statistics."
        });

    }

};


// EXPORT CONTROLLERS
module.exports = {
    adminLogin,
    adminLogout,
    getAdminStatistics
};
