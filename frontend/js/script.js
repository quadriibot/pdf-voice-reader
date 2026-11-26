
// =====================================
// PDF VOICE READER - GENERAL SCRIPT
// =====================================


// GET THE CURRENT PAGE

let currentPage = window.location.pathname;


// =====================================
// CREATE VISITOR ID
// =====================================

let visitorId = localStorage.getItem("pdfVoiceReaderVisitor");

if (!visitorId) {

    visitorId = "visitor-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

    localStorage.setItem("pdfVoiceReaderVisitor", visitorId);

}


// =====================================
// RECORD WEBSITE VISIT
// =====================================

fetch("/api/analytics/record", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        eventType: "visit",
        visitorId: visitorId
    })

})

.then(function(response) {

    if (response.ok) {
        console.log("Website visit recorded!");
    }

})

.catch(function(error) {

    console.log("Visitor tracking error:", error);

});


// =====================================
// HOMEPAGE INTERACTIONS
// =====================================

if (currentPage.includes("index.html") || currentPage === "/") {

    console.log("Welcome to PDF Voice Reader!");

}


// =====================================
// READER PAGE INTERACTIONS
// =====================================

if (currentPage.includes("reader.html")) {

    console.log("PDF Reader is ready!");

}


// =====================================
// NAVIGATION INTERACTIONS
// =====================================

let navigationLinks = document.querySelectorAll(".nav-links a");

for (let i = 0; i < navigationLinks.length; i++) {

    navigationLinks[i].addEventListener("click", function() {

        console.log("Navigation link clicked!");

    });

}
