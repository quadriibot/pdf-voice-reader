
const express = require("express");

const router = express.Router();

// IMPORT ANALYTICS CONTROLLER
const {
    recordActivity
} = require("../controllers/analyticsController");


// RECORD WEBSITE ACTIVITY
router.post("/record", recordActivity);


// EXPORT ROUTER
module.exports = router;
