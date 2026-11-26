
// =====================================
// PDF VOICE READER - ADMIN SCRIPT
// =====================================


// GET DASHBOARD ELEMENTS

let totalVisitors = document.getElementById("totalVisitors");
let activeUsers = document.getElementById("activeUsers");
let totalUploads = document.getElementById("totalUploads");
let totalListeners = document.getElementById("totalListeners");
let dashboardMessage = document.getElementById("dashboardMessage");


// =====================================
// DISPLAY DASHBOARD MESSAGE
// =====================================

function showDashboardMessage(message) {

    if (dashboardMessage) {
        dashboardMessage.textContent = message;
    }

}


// =====================================
// ADMIN LOGIN
// =====================================

let adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let loginMessage = document.getElementById("loginMessage");

        loginMessage.textContent = "Checking login details...";

        fetch("/api/admin/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        .then(function(response) {

            return response.json().then(function(data) {

                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;

            });

        })

        .then(function(data) {

            loginMessage.textContent = data.message;

            window.location.href = "/admin.html";

        })

        .catch(function(error) {

            loginMessage.textContent = error.message;

        });

    });

}


// =====================================
// LOAD ADMIN STATISTICS
// =====================================

function loadAdminStatistics() {

    showDashboardMessage("Loading dashboard statistics...");

    fetch("/api/admin/stats", {

        method: "GET",

        credentials: "include"

    })

    .then(function(response) {

        if (response.status === 401) {

            window.location.href = "/admin-login.html";

            throw new Error("Please log in first.");

        }

        if (!response.ok) {
            throw new Error("Unable to load statistics.");
        }

        return response.json();

    })

    .then(function(data) {

        if (totalVisitors) {
            totalVisitors.textContent = data.totalVisitors;
        }

        if (activeUsers) {
            activeUsers.textContent = data.activeUsers;
        }

        if (totalUploads) {
            totalUploads.textContent = data.totalUploads;
        }

        if (totalListeners) {
            totalListeners.textContent = data.totalListeners;
        }

        showDashboardMessage("Dashboard statistics updated.");

    })

    .catch(function(error) {

        showDashboardMessage(
            "Unable to load statistics. Please check your admin connection."
        );

        console.log(error);

    });

}


// =====================================
// ADMIN LOGOUT
// =====================================

let adminLogoutButton = document.getElementById("adminLogoutButton");

if (adminLogoutButton) {

    adminLogoutButton.addEventListener("click", function() {

        adminLogoutButton.disabled = true;

        fetch("/api/admin/logout", {

            method: "POST",

            credentials: "include"

        })

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Logout failed.");
            }

            window.location.href = "/admin-login.html";

        })

        .catch(function(error) {

            adminLogoutButton.disabled = false;

            alert("Unable to log out. Please try again.");

            console.log(error);

        });

    });

}


// =====================================
// START ADMIN DASHBOARD
// =====================================

if (window.location.pathname.includes("admin.html")) {

    loadAdminStatistics();

}
