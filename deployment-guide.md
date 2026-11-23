# Deployment Guide — Nirbhorota Foundation

1. Create a GitHub repository and push the `nirbhorota-foundation` codebase.
2. Create a Firebase project, enable Email/Password Authentication, and initialize Firestore.
3. Deploy Firestore & Storage rules (`firebase deploy --only firestore:rules,storage`).
4. Set custom claim `admin: true` on the first administrator account.
5. Connect the GitHub repository to Vercel or Firebase Hosting and monitor quota usage.
