const toggleBtn = document.getElementById('toggle');
const transcriptionDiv = document.getElementById('transcription');
const translationDiv = document.getElementById('translation');
const notesDiv = document.getElementById('notes');
const summaryDiv = document.getElementById('summary');
const suggestionsDiv = document.getElementById('suggestions');

let listening = false;
let recognition;
let notes = [];

function initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Web Speech API not supported in this browser');
        return null;
    }
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.continuous = true;
    recog.interimResults = true;
    recog.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                notes.push(transcript.trim());
                addNote(transcript.trim());
                translateText(transcript.trim());
                updateSummary();
                updateSuggestions();
            } else {
                interim += transcript;
            }
        }
        transcriptionDiv.textContent = interim;
    };
    return recog;
}

function addNote(text) {
    const div = document.createElement('div');
    div.textContent = text;
    notesDiv.appendChild(div);
}

async function translateText(text) {
    // Placeholder for translation API. Replace with real service call.
    try {
        const targetLang = 'es';
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
        const data = await res.json();
        const translated = data.responseData.translatedText;
        translationDiv.textContent = `Translation: ${translated}`;
    } catch (e) {
        console.error('Translation failed', e);
    }
}

function updateSummary() {
    // Simple summary: most common words excluding stop words
    const text = notes.join(' ').toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    const stopWords = new Set(['the','is','at','which','on','and','a','to']);
    const freq = {};
    words.forEach(w => {
        if (!stopWords.has(w)) {
            freq[w] = (freq[w] || 0) + 1;
        }
    });
    const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5);
    summaryDiv.textContent = 'Key topics: ' + sorted.map(([w]) => w).join(', ');
}

function updateSuggestions() {
    // Placeholder suggestions
    suggestionsDiv.textContent = 'Suggestion: ask for clarification if something is unclear.';
}

toggleBtn.addEventListener('click', () => {
    if (!recognition) {
        recognition = initializeRecognition();
        if (!recognition) return;
    }

    if (!listening) {
        recognition.start();
        toggleBtn.textContent = 'Stop Listening';
    } else {
        recognition.stop();
        toggleBtn.textContent = 'Start Listening';
        transcriptionDiv.textContent = '';
    }
    listening = !listening;
});
