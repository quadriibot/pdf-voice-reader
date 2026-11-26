
// =====================================
// PDF VOICE READER - AUDIO READER
// =====================================


// GET HTML ELEMENTS

let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");
let stopButton = document.getElementById("stopButton");
let previousTextButton = document.getElementById("previousText");
let nextTextButton = document.getElementById("nextText");
let voiceSpeed = document.getElementById("voiceSpeed");
let voiceSelect = document.getElementById("voiceSelect");
let audioTitle = document.getElementById("audioTitle");
let audioStatus = document.getElementById("audioStatus");
let progressFill = document.getElementById("progressFill");
let progressPercentage = document.getElementById("progressPercentage");


// AUDIO VARIABLES

let speech = window.speechSynthesis;
let textParts = [];
let currentTextIndex = 0;
let currentCharIndex = 0;
let selectedVoice = null;
let isReading = false;
let isPaused = false;
let speechSession = 0;


// =====================================
// RECORD LISTENING ACTIVITY
// =====================================

let listeningRecorded = false;

function recordListeningActivity() {

    if (listeningRecorded) {
        return;
    }

    listeningRecorded = true;

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
            eventType: "listen",
            visitorId: visitorId
        })

    })

    .catch(function(error) {

        console.log("Listening tracking error:", error);

    });

}


// =====================================
// UPDATE PLAY BUTTON ICON
// =====================================

function updatePlayButton() {

    if (isReading) {

        playButton.textContent = "Ⅱ";

    } else {

        playButton.textContent = "▶";

    }

}


// =====================================
// LOAD AVAILABLE VOICES
// =====================================

function loadVoices() {

    let availableVoices = speech.getVoices();

    let previousVoice = voiceSelect.value;

    voiceSelect.innerHTML = "";

    let defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Default Voice";

    voiceSelect.appendChild(defaultOption);

    for (let i = 0; i < availableVoices.length; i++) {

        let option = document.createElement("option");

        option.value = i;

        option.textContent = availableVoices[i].name;

        voiceSelect.appendChild(option);

    }

    if (previousVoice !== "" && availableVoices[previousVoice]) {

        voiceSelect.value = previousVoice;

    }

}


// LOAD VOICES WHEN AVAILABLE

loadVoices();

speech.onvoiceschanged = function() {

    loadVoices();

};


// =====================================
// SELECT A VOICE
// =====================================

voiceSelect.addEventListener("change", function() {

    let availableVoices = speech.getVoices();

    if (voiceSelect.value === "") {

        selectedVoice = null;

    } else {

        selectedVoice = availableVoices[voiceSelect.value];

    }

    restartWithNewSettings();

});


// =====================================
// CHANGE READING SPEED
// =====================================

voiceSpeed.addEventListener("change", function() {

    restartWithNewSettings();

});


// =====================================
// RESTART WITH NEW VOICE OR SPEED
// =====================================

function restartWithNewSettings() {

    if (!isReading && !isPaused && !speech.speaking && !speech.paused) {

        return;

    }

    let wasPaused = isPaused || speech.paused;

    speechSession++;

    speech.cancel();

    isReading = false;

    isPaused = wasPaused;

    readText();

    if (wasPaused) {

        speech.pause();

    }

}


// =====================================
// PREPARE PDF TEXT
// =====================================

function prepareText() {

    if (!window.pdfText || window.pdfText === "") {

        alert("Please upload a PDF with readable text first.");

        return false;

    }

    speechSession++;

    speech.cancel();

    isReading = false;

    isPaused = false;

    textParts = window.pdfText.split(". ");

    currentTextIndex = 0;

    currentCharIndex = 0;

    audioTitle.textContent = "Document Ready";

    audioStatus.textContent = "Your document is ready to read.";

    updateProgress();

    updatePlayButton();

    return true;

}


// =====================================
// READ TEXT ALOUD
// =====================================

function readText() {

    if (currentTextIndex >= textParts.length) {

        isReading = false;

        isPaused = false;

        updatePlayButton();

        audioTitle.textContent = "Reading Completed";

        audioStatus.textContent = "You have finished listening to this document.";

        return;

    }

    let textToRead = textParts[currentTextIndex];

    let startPosition = currentCharIndex;

    let remainingText = textToRead.substring(startPosition);

    if (remainingText === "") {

        currentTextIndex++;

        currentCharIndex = 0;

        updateProgress();

        readText();

        return;

    }

    let speechText = new SpeechSynthesisUtterance(remainingText);

    let thisSession = speechSession;

    speechText.rate = Number(voiceSpeed.value);

    if (selectedVoice !== null) {

        speechText.voice = selectedVoice;

    }

    // TRACK THE CURRENT READING POSITION

    speechText.onboundary = function(event) {

        if (thisSession !== speechSession) {

            return;

        }

        currentCharIndex = startPosition + event.charIndex;

        if (event.charLength) {

            currentCharIndex += event.charLength;

        }

    };

    speechText.onstart = function() {

        if (thisSession !== speechSession) {

            return;

        }

        if (!isPaused) {

            isReading = true;

            audioTitle.textContent = "Now Reading";

            audioStatus.textContent = "Reading your document aloud...";

        }

        updatePlayButton();

    };

    speechText.onend = function() {

        if (thisSession !== speechSession) {

            return;

        }

        currentTextIndex++;

        currentCharIndex = 0;

        updateProgress();

        if (isReading) {

            readText();

        } else {

            isPaused = false;

            updatePlayButton();

        }

    };

    speechText.onerror = function() {

        if (thisSession !== speechSession) {

            return;

        }

        isReading = false;

        isPaused = false;

        updatePlayButton();

        audioTitle.textContent = "Reading Error";

        audioStatus.textContent = "Unable to continue reading.";

    };

    speech.speak(speechText);

}


// =====================================
// PAUSE READING
// =====================================

function pauseReading() {

    if (speech.speaking && !speech.paused) {

        speech.pause();

        isReading = false;

        isPaused = true;

        updatePlayButton();

        audioTitle.textContent = "Reading Paused";

        audioStatus.textContent = "Your reading is paused.";

    }

}


// =====================================
// PLAY BUTTON - PLAY AND PAUSE
// =====================================

playButton.addEventListener("click", function() {

    // PAUSE IF CURRENTLY READING

    if (isReading && speech.speaking && !speech.paused) {

        pauseReading();

        return;

    }

    // RESUME IF PAUSED

    if (isPaused || speech.paused) {

        speech.resume();

        isReading = true;

        isPaused = false;

        updatePlayButton();

        audioTitle.textContent = "Now Reading";

        audioStatus.textContent = "Reading your document aloud.";

        return;

    }

    if (!window.pdfText || window.pdfText === "") {

        alert("Please wait for your PDF text to load.");

        return;

    }

    if (textParts.length === 0) {

        if (!prepareText()) {

            return;

        }

    }

    if (currentTextIndex >= textParts.length) {

        currentTextIndex = 0;

        currentCharIndex = 0;

    }

    if (!isReading) {

        recordListeningActivity();

        isReading = true;

        isPaused = false;

        updatePlayButton();

        readText();

    }

});


// =====================================
// SEPARATE PAUSE BUTTON
// =====================================

pauseButton.addEventListener("click", function() {

    pauseReading();

});


// =====================================
// STOP BUTTON
// =====================================

stopButton.addEventListener("click", function() {

    speechSession++;

    speech.cancel();

    isReading = false;

    isPaused = false;

    currentTextIndex = 0;

    currentCharIndex = 0;

    updateProgress();

    updatePlayButton();

    audioTitle.textContent = "Reading Stopped";

    audioStatus.textContent = "Press play when you are ready.";

});


// =====================================
// NEXT TEXT
// =====================================

nextTextButton.addEventListener("click", function() {

    if (textParts.length === 0) {

        if (!prepareText()) {

            return;

        }

    }

    speechSession++;

    speech.cancel();

    isReading = false;

    isPaused = false;

    currentTextIndex++;

    currentCharIndex = 0;

    if (currentTextIndex >= textParts.length) {

        currentTextIndex = textParts.length - 1;

    }

    updateProgress();

    recordListeningActivity();

    isReading = true;

    updatePlayButton();

    readText();

});


// =====================================
// PREVIOUS TEXT
// =====================================

previousTextButton.addEventListener("click", function() {

    if (textParts.length === 0) {

        if (!prepareText()) {

            return;

        }

    }

    speechSession++;

    speech.cancel();

    isReading = false;

    isPaused = false;

    currentTextIndex--;

    currentCharIndex = 0;

    if (currentTextIndex < 0) {

        currentTextIndex = 0;

    }

    updateProgress();

    recordListeningActivity();

    isReading = true;

    updatePlayButton();

    readText();

});


// =====================================
// UPDATE READING PROGRESS
// =====================================

function updateProgress() {

    if (textParts.length === 0) {

        return;

    }

    let percentage = (currentTextIndex / textParts.length) * 100;

    if (percentage > 100) {

        percentage = 100;

    }

    progressFill.style.width = percentage + "%";

    progressPercentage.textContent = Math.round(percentage) + "%";

}
