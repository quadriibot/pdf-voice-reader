
// =====================================
// PDF VOICE READER - PDF HANDLER
// =====================================


// GET HTML ELEMENTS

let pdfUpload = document.getElementById("pdfUpload");

let uploadButton = document.getElementById("uploadButton");

let emptyUploadButton = document.getElementById("emptyUploadButton");

let pdfPageArea = document.getElementById("pdfPageArea");

let documentTitle = document.getElementById("documentTitle");

let pageInformation = document.getElementById("pageInformation");

let currentPageDisplay = document.getElementById("currentPage");

let totalPagesDisplay = document.getElementById("totalPages");

let previousPageButton = document.getElementById("previousPage");

let nextPageButton = document.getElementById("nextPage");

let extractedText = document.getElementById("extractedText");


// PDF VARIABLES

let pdfDocument = null;

let currentPdfPage = 1;

let pdfText = "";


// MAKE PDF VARIABLES AVAILABLE TO OTHER FILES

window.pdfDocument = pdfDocument;
window.currentPdfPage = currentPdfPage;
window.pdfText = pdfText;


// =====================================
// OPEN FILE SELECTOR
// =====================================

uploadButton.addEventListener("click", function() {

    pdfUpload.click();

});

emptyUploadButton.addEventListener("click", function() {

    pdfUpload.click();

});


// =====================================
// SELECT PDF DOCUMENT
// =====================================

pdfUpload.addEventListener("change", function() {

    let selectedFile = pdfUpload.files[0];

    if (selectedFile) {

        if (selectedFile.type !== "application/pdf") {

            alert("Please select a valid PDF document.");

            return;

        }

        let fileReader = new FileReader();

        fileReader.onload = function() {

            let typedArray = new Uint8Array(fileReader.result);

            openPDF(typedArray, selectedFile.name);

        };

        fileReader.readAsArrayBuffer(selectedFile);

    }

});


// =====================================
// CHECK FOR A SAVED PDF
// =====================================

function loadSavedPDF() {

    let documentId = window.location.search.split("documentId=")[1];

    if (!documentId) {

        return;

    }

    let databaseRequest = indexedDB.open("PDFVoiceReader", 1);

    databaseRequest.onsuccess = function(event) {

        let database = event.target.result;

        let transaction = database.transaction(
            ["documents"],
            "readonly"
        );

        let objectStore = transaction.objectStore("documents");

        let request = objectStore.get(Number(documentId));

        request.onsuccess = function() {

            let savedDocument = request.result;

            if (savedDocument && savedDocument.file) {

                let fileReader = new FileReader();

                fileReader.onload = function() {

                    let typedArray = new Uint8Array(fileReader.result);

                    openPDF(typedArray, savedDocument.title);

                };

                fileReader.readAsArrayBuffer(savedDocument.file);

            } else {

                alert("Saved PDF could not be found.");

            }

        };

    };

    databaseRequest.onerror = function() {

        alert("Unable to access your saved PDF library.");

    };

}


// =====================================
// OPEN PDF DOCUMENT
// =====================================

function openPDF(pdfData, fileName) {

    if (typeof pdfjsLib === "undefined") {

        alert("PDF.js library has not been loaded.");

        return;

    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    pdfjsLib.getDocument({data: pdfData}).promise.then(function(pdf) {

        pdfDocument = pdf;

        currentPdfPage = 1;

        window.pdfDocument = pdfDocument;

        window.currentPdfPage = currentPdfPage;

        documentTitle.textContent = fileName;

        totalPagesDisplay.textContent = pdf.numPages;

        previousPageButton.disabled = false;

        nextPageButton.disabled = false;

        document.getElementById("saveDocument").disabled = false;

        document.getElementById("playButton").disabled = false;

        document.getElementById("pauseButton").disabled = false;

        document.getElementById("stopButton").disabled = false;

        document.getElementById("previousText").disabled = false;

        document.getElementById("nextText").disabled = false;

        getPDFText();

        renderPDFPage(currentPdfPage);

    }).catch(function(error) {

        alert("Unable to open this PDF document.");

        console.log(error);

    });

}


// =====================================
// DISPLAY PDF PAGE
// =====================================

function renderPDFPage(pageNumber) {

    pdfDocument.getPage(pageNumber).then(function(page) {

        let viewport = page.getViewport({scale: 1.3});

        let canvas = document.createElement("canvas");

        let context = canvas.getContext("2d");

        canvas.height = viewport.height;

        canvas.width = viewport.width;

        pdfPageArea.innerHTML = "";

        pdfPageArea.appendChild(canvas);

        let renderTask = page.render({

            canvasContext: context,

            viewport: viewport

        });

        renderTask.promise.then(function() {

            currentPageDisplay.textContent = pageNumber;

            pageInformation.textContent =
                "Page " + pageNumber + " of " + pdfDocument.numPages;

            previousPageButton.disabled = pageNumber === 1;

            nextPageButton.disabled = pageNumber === pdfDocument.numPages;

        });

    });

}


// =====================================
// NEXT PDF PAGE
// =====================================

nextPageButton.addEventListener("click", function() {

    if (pdfDocument && currentPdfPage < pdfDocument.numPages) {

        currentPdfPage++;

        window.currentPdfPage = currentPdfPage;

        renderPDFPage(currentPdfPage);

    }

});


// =====================================
// PREVIOUS PDF PAGE
// =====================================

previousPageButton.addEventListener("click", function() {

    if (pdfDocument && currentPdfPage > 1) {

        currentPdfPage--;

        window.currentPdfPage = currentPdfPage;

        renderPDFPage(currentPdfPage);

    }

});


// =====================================
// EXTRACT TEXT FROM PDF
// =====================================

function getPDFText() {

    pdfText = "";

    let pagePromises = [];

    for (let i = 1; i <= pdfDocument.numPages; i++) {

        let pagePromise = pdfDocument.getPage(i).then(function(page) {

            return page.getTextContent().then(function(textContent) {

                let pageText = "";

                for (let j = 0; j < textContent.items.length; j++) {

                    pageText += textContent.items[j].str + " ";

                }

                return pageText;

            });

        });

        pagePromises.push(pagePromise);

    }

    Promise.all(pagePromises).then(function(allPagesText) {

        pdfText = allPagesText.join(" ");

        window.pdfText = pdfText;

        extractedText.textContent = pdfText;

    });

}


// =====================================
// LOAD SAVED PDF WHEN READER OPENS
// =====================================

loadSavedPDF();

