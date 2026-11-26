
// =====================================
// PDF VOICE READER - LOCAL STORAGE
// =====================================


// DATABASE VARIABLES

let database;

let databaseName = "PDFVoiceReader";

let databaseVersion = 1;

let selectedPDF;


// =====================================
// RECORD PDF UPLOAD ACTIVITY
// =====================================

function recordUploadActivity() {

    let visitorId = localStorage.getItem("pdfVoiceReaderVisitor");

    if (!visitorId) {

        visitorId = "visitor-" + Date.now();

        localStorage.setItem("pdfVoiceReaderVisitor", visitorId);

    }

    fetch("/api/analytics/record", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            eventType: "upload",
            visitorId: visitorId
        })

    })

    .catch(function(error) {

        console.log("Upload tracking error:", error);

    });

}


// =====================================
// OPEN THE DATABASE
// =====================================

function openDatabase() {

    let request = indexedDB.open(databaseName, databaseVersion);


    request.onupgradeneeded = function(event) {

        database = event.target.result;

        if (!database.objectStoreNames.contains("documents")) {

            database.createObjectStore("documents", {
                keyPath: "id",
                autoIncrement: true
            });

        }

    };


    request.onsuccess = function(event) {

        database = event.target.result;

        console.log("Database opened successfully!");

    };


    request.onerror = function() {

        console.log("Unable to open database.");

    };

}


// =====================================
// OPEN CUSTOM SAVE PDF POPUP
// =====================================

function savePDF() {

    let pdfUpload = document.getElementById("pdfUpload");

    selectedPDF = pdfUpload.files[0];

    if (!selectedPDF) {

        alert("Please upload a PDF first.");

        return;

    }

    if (!database) {

        alert("Please wait for the database to open.");

        return;

    }


    let savePdfModal = document.getElementById("savePdfModal");

    let savePdfName = document.getElementById("savePdfName");


    // SHOW ORIGINAL PDF NAME

    savePdfName.value = selectedPDF.name;


    // OPEN POPUP

    savePdfModal.hidden = false;

    savePdfName.focus();

}


// =====================================
// SAVE PDF DOCUMENT
// =====================================

function confirmSavePDF() {

    if (!selectedPDF) {

        return;

    }


    let savePdfName = document.getElementById("savePdfName");

    let savePdfModal = document.getElementById("savePdfModal");


    // GET DOCUMENT NAME

    let documentName = savePdfName.value;


    // USE ORIGINAL NAME IF EMPTY

    if (documentName === "") {

        documentName = selectedPDF.name;

    }


    let transaction = database.transaction(
        ["documents"],
        "readwrite"
    );

    let storage = transaction.objectStore("documents");


    let documentData = {

        title: documentName,

        file: selectedPDF,

        dateAdded: new Date()

    };


    let request = storage.add(documentData);


    request.onsuccess = function() {

        savePdfModal.hidden = true;

        alert("PDF saved successfully!");

        console.log("Document saved!");

        recordUploadActivity();

        selectedPDF = null;

    };


    request.onerror = function() {

        alert("Unable to save this PDF.");

    };

}


// =====================================
// CANCEL PDF SAVING
// =====================================

function cancelSavePDF() {

    let savePdfModal = document.getElementById("savePdfModal");

    savePdfModal.hidden = true;

    selectedPDF = null;

}


// =====================================
// GET ALL SAVED DOCUMENTS
// =====================================

function getSavedDocuments() {

    let transaction = database.transaction(
        ["documents"],
        "readonly"
    );

    let storage = transaction.objectStore("documents");

    let request = storage.getAll();


    request.onsuccess = function() {

        let documents = request.result;

        console.log("Saved documents:", documents);

    };


    request.onerror = function() {

        console.log("Unable to retrieve documents.");

    };

}


// =====================================
// DELETE A SAVED DOCUMENT
// =====================================

function deleteSavedDocument(documentID) {

    let transaction = database.transaction(
        ["documents"],
        "readwrite"
    );

    let storage = transaction.objectStore("documents");

    let request = storage.delete(documentID);


    request.onsuccess = function() {

        alert("Document deleted successfully!");

        getSavedDocuments();

    };


    request.onerror = function() {

        alert("Unable to delete document.");

    };

}


// =====================================
// CONNECT SAVE BUTTON
// =====================================

let saveDocumentButton = document.getElementById("saveDocument");

if (saveDocumentButton) {

    saveDocumentButton.addEventListener("click", function() {

        savePDF();

    });

}


// =====================================
// CONNECT POPUP BUTTONS
// =====================================

let confirmSaveButton = document.getElementById("confirmSavePdf");

let cancelSaveButton = document.getElementById("cancelSavePdf");


if (confirmSaveButton) {

    confirmSaveButton.addEventListener("click", function() {

        confirmSavePDF();

    });

}


if (cancelSaveButton) {

    cancelSaveButton.addEventListener("click", function() {

        cancelSavePDF();

    });

}


// =====================================
// START DATABASE
// =====================================

openDatabase();
