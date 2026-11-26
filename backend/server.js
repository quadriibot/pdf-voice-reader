
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

// CREATE EXPRESS APPLICATION
const app = express();


// BASIC MIDDLEWARE
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(express.json());


// SESSION CONFIGURATION
app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }

}));


// ADMIN LOGIN PAGE
app.get("/admin-login.html", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../frontend/admin-login.html")
    );

});


// PROTECT ADMIN DASHBOARD
app.get(["/admin.html", "/admin"], (req, res) => {

    if (!req.session.adminId) {

        return res.redirect("/admin-login.html");

    }

    res.sendFile(
        path.join(__dirname, "../frontend/admin.html")
    );

});


// IMPORT ROUTES
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");


// CONNECT ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);


// SERVE OTHER FRONTEND FILES
app.use(express.static(
    path.join(__dirname, "../frontend")
));


// HOMEPAGE ROUTE
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );

});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("================================");
    console.log("PDF VOICE READER SERVER");
    console.log("================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);

});
