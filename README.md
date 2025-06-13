# NoteApp

NoteApp is a cross-platform assistant that listens to meetings or phone calls and provides live transcription, translation and summaries.

## Backend

The `backend` folder contains a small Node.js service using Express. It exposes the following endpoints:

- `POST /api/transcribe` – upload an audio file and receive a transcript via OpenAI Whisper.
- `POST /api/summarize` – send text and receive a concise summary.
- `POST /api/translate` – translate text to a target language.
- `GET /api/history` – retrieve stored call summaries.

To start the backend you need Node.js installed and an `OPENAI_API_KEY` environment variable.

```bash
cd backend
npm install
npm start
```

## Web Application

Open `web/index.html` in a modern browser. The page uses the Web Speech API to capture the microphone. Transcripts are sent to the backend for translation and summarization. A history of conversations is also available.

## Mobile Application

See `mobile/README.md` for instructions on creating a React Native application that connects to the same backend.

## Limitations

- The demo uses browser APIs for recording and may not work in all browsers.
- Real-time transcription and translation depend on network latency and API quotas.
- For a production deployment you should secure requests and store data using a database or cloud storage.
