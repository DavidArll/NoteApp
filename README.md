# NoteApp

A simple proof-of-concept application that listens to meetings through the microphone, translates the speech, takes notes and provides basic suggestions in real time.

## Web Application

The web version lives in the `web` folder. Open `web/index.html` in a modern browser that supports the Web Speech API. Click **Start Listening** to begin transcribing the meeting. The app will show interim transcription, attempt a translation to Spanish using a public API and extract key topics from the conversation.

## Mobile Application

The `mobile` folder contains instructions for creating a React Native (Expo) application with similar functionality. Follow the steps in `mobile/README.md` to get started.

## Limitations

- The translation feature uses a free public API and may be rate limited or unavailable.
- Suggestions and summarization are simplistic heuristics for demonstration purposes only.
