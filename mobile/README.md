# NoteApp Mobile

This folder contains a skeleton for a mobile application built with React Native (e.g. using Expo). The mobile app should mirror the web functionality:

- Use the device microphone to capture meeting audio.
- Transcribe speech to text.
- Translate the text to a target language.
- Display notes, key topics and suggestions in real time.

## Getting Started

1. Install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) and initialize a new project:

```bash
npm install -g expo-cli
expo init NoteAppMobile
```

2. Replace the generated `App.js` with an implementation similar to `web/script.js`, using packages like `expo-speech`, `react-native-voice` or other speech-to-text libraries.

3. Run the app on your device:

```bash
cd NoteAppMobile
expo start
```

This repository only provides a high level guide. You can extend the mobile app with the same features as the web version.
