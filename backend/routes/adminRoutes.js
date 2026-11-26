
const express = require("express");

const router = express.Router();

// IMPORT ADMIN CONTROLLER FUNCTIONS
const {
    adminLogin,
    adminLogout,
    getAdminStatistics
} = require("../controllers/adminController");

// IMPORT ADMIN AUTHENTICATION MIDDLEWARE
const adminAuth = require("../middleware/adminAuth");


// ADMIN LOGIN ROUTE
router.post("/login", adminLogin);


// ADMIN LOGOUT ROUTE
router.post("/logout", adminAuth, adminLogout);


// ADMIN STATISTICS ROUTE
router.get("/stats", adminAuth, getAdminStatistics);


// EXPORT ROUTER
module.exports = router;
