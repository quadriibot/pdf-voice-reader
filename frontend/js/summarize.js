
// GET THE PDF UPLOAD INPUT
var summaryPdfUpload = document.getElementById("pdfUpload");

// CREATE THE SUMMARY POPUP
var summaryPopup = document.createElement("div");

summaryPopup.id = "summaryPopup";

summaryPopup.innerHTML = `
    <div class="summary-box">

        <h2>Would you like to summarize this PDF?</h2>

        <p>
            Get an AI-powered summary of your document.
        </p>

        <div class="summary-buttons">

            <button id="yesSummary">
                Yes, summarize
            </button>

            <button id="noSummary">
                No, continue reading
            </button>

        </div>

    </div>
`;

document.body.appendChild(summaryPopup);


// CREATE THE COMING SOON POPUP
var comingSoonPopup = document.createElement("div");

comingSoonPopup.id = "comingSoonPopup";

comingSoonPopup.innerHTML = `
    <div class="summary-box">

        <h2>AI PDF Summarizer</h2>

        <h3>Coming Soon!</h3>

        <p>
            We're working on an intelligent PDF summarizer
            that will generate Quick Summaries, Detailed
            Summaries, Key Points and Important Terms.
        </p>

        <button id="closeComingSoon">
            Continue Reading
        </button>

    </div>
`;

document.body.appendChild(comingSoonPopup);


// ADD THE POPUP STYLES
var summaryStyle = document.createElement("style");

summaryStyle.textContent = `

    #summaryPopup,
    #comingSoonPopup {

        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        justify-content: center;
        align-items: center;
        padding: 20px;

    }

    .summary-box {

        background: #17172f;
        border: 1px solid #8055e8;
        border-radius: 15px;
        padding: 30px;
        width: 100%;
        max-width: 450px;
        text-align: center;
        color: white;

    }

    .summary-box h2 {
        margin-bottom: 15px;
    }

    .summary-box h3 {
        color: #a78bfa;
        margin: 15px 0;
    }

    .summary-box p {
        color: #c4c4dc;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .summary-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .summary-box button {

        padding: 13px;
        border: none;
        border-radius: 8px;
        background: #8055e8;
        color: white;
        cursor: pointer;
        font-size: 15px;

    }

    .summary-box button:hover {
        background: #956fff;
    }

`;

document.head.appendChild(summaryStyle);


// ASK THE USER AFTER SELECTING A PDF
summaryPdfUpload.addEventListener("change", function () {

    if (summaryPdfUpload.files.length > 0) {

        summaryPopup.style.display = "flex";

    }

});


// IF THE USER CHOOSES YES
document.getElementById("yesSummary").onclick = function () {

    summaryPopup.style.display = "none";

    comingSoonPopup.style.display = "flex";

};


// IF THE USER CHOOSES NO
document.getElementById("noSummary").onclick = function () {

    summaryPopup.style.display = "none";

};


// CLOSE THE COMING SOON POPUP
document.getElementById("closeComingSoon").onclick = function () {

    comingSoonPopup.style.display = "none";

};
