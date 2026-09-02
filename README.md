# StudyLock Desktop

The Windows desktop edition of StudyLock preserves the original StudyLock HTML interface and features while adding a native Electron focus lock.

## Features

- Focus, Planner, Tutor, Quiz, Notes, Progress, Learn, and Rewards views
- Focus timer, session presets, pause, add time, history, and streaks
- Block-list controls and distraction protection
- AI tutor and quiz generator with a user-supplied OpenRouter API key
- Voice input/output where supported by Windows
- Native focus lock: kiosk/full-screen mode, always-on-top protection, blocked minimize/close, and blocked external links during a session
- Optional parent password required to end a focus session early
- Windows installer and portable build targets

## Run

1. Install Node.js 20 or newer.
2. Open this folder in Terminal.
3. Run `npm install`.
4. Run `npm start`.

## Build Windows installer

Run `npm run dist:win`. Files are created in `dist/`.

## API key

Open Settings in StudyLock, paste an OpenRouter API key, test it, and save it. The key stays in the app's local browser storage and is sent only to OpenRouter for AI requests.

## Focus-lock safety

While a focus session is active, normal close, minimize, Alt+F4, external links, and Escape from full screen are blocked. Complete the timer or use **End session early**. If a parent password is configured, that password is required to end early. Windows security controls such as Ctrl+Alt+Delete remain available for emergencies.
