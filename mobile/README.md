# NoteApp Mobile

This folder contains high-level guidance to build the mobile client in React Native (using Expo). The mobile app should record audio, send it to the backend and display transcripts, translations and summaries.

## Getting Started

1. Install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) and create a new project:

```bash
npm install -g expo-cli
expo init NoteAppMobile
```

2. Add packages for audio recording and networking, e.g. `expo-av` for microphone access and `axios` for API calls.

3. Implement logic similar to `web/script.js` to start/stop recording and send the audio buffer to `http://<your-server>/api/transcribe`. Use the responses from `/api/translate` and `/api/summarize` to populate the UI.

4. Run the app:

```bash
cd NoteAppMobile
expo start
```

The backend from this repository must be running and reachable from the device for transcription and translation.
