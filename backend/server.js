const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(express.json());

const historyFile = path.join(__dirname, 'history.json');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function transcribeAudio(filePath) {
    const resp = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1'
    });
    return resp.text;
}

async function summarizeText(text) {
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'Summarize the call and highlight key action items.' },
            { role: 'user', content: text }
        ]
    });
    return resp.choices[0].message.content;
}

async function translateText(text, target) {
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: `Translate the following text to ${target}.` },
            { role: 'user', content: text }
        ]
    });
    return resp.choices[0].message.content;
}

function loadHistory() {
    if (!fs.existsSync(historyFile)) return [];
    return JSON.parse(fs.readFileSync(historyFile, 'utf8'));
}

function saveHistory(history) {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const text = await transcribeAudio(req.file.path);
        res.json({ text });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Transcription failed' });
    } finally {
        fs.unlink(req.file.path, () => {});
    }
});

app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        const summary = await summarizeText(text);
        const history = loadHistory();
        history.push({ timestamp: Date.now(), text, summary });
        saveHistory(history);
        res.json({ summary });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Summarization failed' });
    }
});

app.post('/api/translate', async (req, res) => {
    try {
        const { text, target } = req.body;
        const translation = await translateText(text, target || 'es');
        res.json({ translation });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.get('/api/history', (req, res) => {
    res.json(loadHistory());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
