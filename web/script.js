const toggleBtn = document.getElementById('toggle');
const loadHistoryBtn = document.getElementById('loadHistory');
const transcriptionDiv = document.getElementById('transcription');
const translationDiv = document.getElementById('translation');
const notesDiv = document.getElementById('notes');
const summaryDiv = document.getElementById('summary');
const suggestionsDiv = document.getElementById('suggestions');
const historyDiv = document.getElementById('history');

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
    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, target: 'es' })
        });
        const data = await res.json();
        translationDiv.textContent = `Translation: ${data.translation}`;
    } catch (e) {
        console.error('Translation failed', e);
    }
}

async function updateSummary() {
    try {
        const res = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: notes.join(' ') })
        });
        const data = await res.json();
        summaryDiv.textContent = data.summary;
    } catch (e) {
        console.error('Summarization failed', e);
    }
}

function updateSuggestions() {
    suggestionsDiv.textContent = 'Suggestion: ask for clarification if something is unclear.';
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        const history = await res.json();
        historyDiv.innerHTML = '<h3>Call History</h3>' + history.map(h => `<pre>${new Date(h.timestamp).toLocaleString()}\n${h.summary}</pre>`).join('');
    } catch (e) {
        console.error('Failed to load history', e);
    }
}

loadHistoryBtn.addEventListener('click', loadHistory);

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
