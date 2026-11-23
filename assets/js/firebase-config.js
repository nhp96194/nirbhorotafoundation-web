// Replace these values with your Firebase Web App config during deployment.
// Do NOT commit production secrets or private keys to public repositories.
export const firebaseConfig = {
   apiKey: "AIzaSyB3nMpVQfivLgut2wBQaUYWllM52lBmZKw",
  authDomain: "nirbhorotafoundationorg.firebaseapp.com",
  projectId: "nirbhorotafoundationorg",
  storageBucket: "nirbhorotafoundationorg.firebasestorage.app",
  messagingSenderId: "821416126156",
  appId: "1:821416126156:web:56a3d002e3dc5457da4469",
  measurementId: "G-YTZKG3WQXH"
};

export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith("YOUR_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.startsWith("YOUR_")
  );
