# Nirbhorota Foundation Website

Static multi-page frontend with bilingual support (English / Bangla) and Firebase integration.

## Setup
1. Update `assets/js/firebase-config.js` with your Firebase project credentials.
2. Deploy `firebase/firestore.rules` and `firebase/storage.rules` (if Storage is enabled).
3. Assign `{ "admin": true }` custom claim to authorized admin accounts via Firebase Admin SDK.
4. Serve locally with any static server (e.g., `npx serve .` or VS Code Live Server).
