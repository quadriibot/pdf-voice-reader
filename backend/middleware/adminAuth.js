
// CHECK IF ADMIN IS LOGGED IN

const adminAuth = (req, res, next) => {

    // CHECK IF ADMIN SESSION EXISTS
    if (!req.session.adminId) {

        return res.status(401).json({
            message: "Access denied. Please log in first."
        });

    }

    // ALLOW ADMIN TO CONTINUE
    next();

};


// EXPORT MIDDLEWARE
module.exports = adminAuth;
