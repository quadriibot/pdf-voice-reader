
const pool = require("../config/database");

// RECORD WEBSITE ACTIVITY
const recordActivity = async (req, res) => {

    try {

        const { eventType, visitorId } = req.body;

        // CHECK THE ACTIVITY TYPE
        const allowedEvents = ["visit", "upload", "listen"];

        if (!allowedEvents.includes(eventType)) {

            return res.status(400).json({
                message: "Invalid activity type."
            });

        }

        // CHECK VISITOR ID
        if (!visitorId || typeof visitorId !== "string" || visitorId.length > 255) {

            return res.status(400).json({
                message: "A valid visitor ID is required."
            });

        }

        // SAVE ACTIVITY TO DATABASE
        await pool.query(
            "INSERT INTO analytics_events (event_type, visitor_id) VALUES ($1, $2)",
            [eventType, visitorId]
        );

        return res.status(201).json({
            message: "Activity recorded successfully."
        });

    } catch (error) {

        console.log("Analytics error:", error.message);

        return res.status(500).json({
            message: "Could not record activity."
        });

    }

};


// EXPORT FUNCTION
module.exports = {
    recordActivity
};
