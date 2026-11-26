
var libraryDatabase;

var searchLibrary = document.getElementById("searchLibrary");
var documentsList = document.getElementById("documentsList");


// OPEN THE DATABASE
var databaseRequest = indexedDB.open("PDFVoiceReader", 1);

databaseRequest.onsuccess = function (event) {

    libraryDatabase = event.target.result;

    displayDocuments();

};

databaseRequest.onerror = function () {

    documentsList.innerHTML = "<p>Unable to load your library.</p>";

};


// DISPLAY SAVED DOCUMENTS
function displayDocuments() {

    var transaction = libraryDatabase.transaction(
        ["documents"],
        "readonly"
    );

    var objectStore = transaction.objectStore("documents");

    var request = objectStore.getAll();

    request.onsuccess = function () {

        documentsList.innerHTML = "";

        var documents = request.result;

        // CHECK IF LIBRARY IS EMPTY
        if (documents.length === 0) {

            documentsList.innerHTML = `
                <div class="empty-library">

                    <h3>Your Library Is Empty</h3>

                    <p>
                        You haven't saved any PDF documents yet.
                        Upload your first PDF and start building
                        your personal library.
                    </p>

                    <a href="reader.html" class="upload-link">
                        + Upload Your First PDF
                    </a>

                </div>
            `;

            return;

        }


        // COUNT MATCHING DOCUMENTS
        var matchingDocuments = 0;

        for (var i = 0; i < documents.length; i++) {

            var documentItem = documents[i];

            if (
                searchLibrary.value === "" ||
                documentItem.title.toLowerCase().includes(
                    searchLibrary.value.toLowerCase()
                )
            ) {

                createDocumentCard(documentItem);

                matchingDocuments++;

            }

        }


        // CHECK IF SEARCH HAS RESULTS
        if (matchingDocuments === 0) {

            documentsList.innerHTML = `
                <div class="empty-library">

                    <h3>No Documents Found</h3>

                    <p>
                        We couldn't find any document matching
                        your search.
                    </p>

                </div>
            `;

        }

    };

}


// CREATE A DOCUMENT CARD
function createDocumentCard(documentItem) {

    var card = document.createElement("div");

    card.className = "document-card";

    card.innerHTML = `
        <h3>${documentItem.title}</h3>

        <p>Saved: ${new Date(documentItem.dateAdded).toLocaleDateString()}</p>

        <div class="document-actions">

            <button class="open-button">Open PDF</button>

            <button class="rename-button">Rename</button>

            <button class="delete-button">Delete</button>

        </div>
    `;

    documentsList.appendChild(card);


    // OPEN PDF IN THE READER
    card.querySelector(".open-button").onclick = function () {

        window.location.href =
            "reader.html?documentId=" + documentItem.id;

    };


    // RENAME PDF
    card.querySelector(".rename-button").onclick = function () {

        var newTitle = prompt(
            "Enter a new name:",
            documentItem.title
        );

        if (newTitle !== null && newTitle !== "") {

            documentItem.title = newTitle;

            var transaction = libraryDatabase.transaction(
                ["documents"],
                "readwrite"
            );

            var objectStore = transaction.objectStore("documents");

            objectStore.put(documentItem);

            transaction.oncomplete = function () {

                displayDocuments();

            };

        }

    };


    // DELETE PDF
    card.querySelector(".delete-button").onclick = function () {

        var confirmDelete = confirm(
            "Are you sure you want to delete this PDF?"
        );

        if (confirmDelete) {

            var transaction = libraryDatabase.transaction(
                ["documents"],
                "readwrite"
            );

            var objectStore = transaction.objectStore("documents");

            objectStore.delete(documentItem.id);

            transaction.oncomplete = function () {

                displayDocuments();

            };

        }

    };

}


// SEARCH LIBRARY
searchLibrary.addEventListener("input", function () {

    displayDocuments();

});
