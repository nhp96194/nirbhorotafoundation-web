import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

let app = null;
let auth = null;
let db = null;
let storage = null;

export function initFirebase() {
  if (!isFirebaseConfigured()) {
    return { configured: false, app: null, auth: null, db: null, storage: null };
  }
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  return { configured: true, app, auth, db, storage };
}

export function showToast(message, type = "info") {
  let stack = document.querySelector(".nf-toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "nf-toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = "nf-toast";
  toast.setAttribute("role", "status");
  if (type === "error") toast.style.borderLeftColor = "#D9534F";
  if (type === "success") toast.style.borderLeftColor = "#267451";
  toast.textContent = message;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4500);
}

export async function fetchSiteSettings() {
  const { configured, db } = initFirebase();
  if (!configured) return null;
  const snap = await getDoc(doc(db, "settings", "global"));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveSiteSettings(data) {
  const { configured, db, auth } = initFirebase();
  if (!configured) throw new Error("Firebase is not configured.");
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication required.");

  await setDoc(
    doc(db, "settings", "global"),
    {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid
    },
    { merge: true }
  );
}

export async function fetchPublishedProjects({ category = "", status = "", pageSize = 6, lastDoc = null } = {}) {
  const { configured, db } = initFirebase();
  if (!configured) return { items: [], lastDoc: null, unconfigured: true };

  const constraints = [where("published", "==", true), orderBy("createdAt", "desc")];
  if (category) constraints.splice(1, 0, where("category", "==", category));
  if (status) constraints.splice(1, 0, where("status", "==", status));
  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(pageSize));

  const q = query(collection(db, "projects"), ...constraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nextLast = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;
  return { items, lastDoc: nextLast, unconfigured: false };
}

export async function fetchProjectByIdOrSlug(idOrSlug) {
  const { configured, db } = initFirebase();
  if (!configured || !idOrSlug) return null;

  const byId = await getDoc(doc(db, "projects", idOrSlug));
  if (byId.exists() && byId.data().published === true) {
    return { id: byId.id, ...byId.data() };
  }

  const q = query(
    collection(db, "projects"),
    where("slug", "==", idOrSlug),
    where("published", "==", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  }
  return null;
}

export async function submitVolunteerApplication(payload) {
  const { configured, db } = initFirebase();
  if (!configured) {
    throw new Error("Firebase is not configured yet. Connect your Firebase project to store applications.");
  }
  return addDoc(collection(db, "volunteers"), {
    ...payload,
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function submitContactMessage(payload) {
  const { configured, db } = initFirebase();
  if (!configured) {
    throw new Error("Firebase is not configured yet. Connect your Firebase project to store messages.");
  }
  return addDoc(collection(db, "contactMessages"), {
    ...payload,
    status: "unread",
    createdAt: serverTimestamp()
  });
}

export function uploadImageWithProgress(file, folder = "uploads", onProgress = () => {}) {
  const { configured, storage, auth } = initFirebase();
  if (!configured) return Promise.reject(new Error("Firebase is not configured."));
  if (!auth.currentUser) return Promise.reject(new Error("Admin sign-in required."));

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxBytes = 3 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return Promise.reject(new Error("Only JPEG, PNG, and WebP images are permitted."));
  }
  if (file.size > maxBytes) {
    return Promise.reject(new Error("Image size must be 3 MB or smaller."));
  }

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(pct);
      },
      (err) => {
        reject(
          new Error(
            `Upload failed (${err.code || "storage-error"}). Ensure Firebase Storage is enabled on your project billing plan.`
          )
        );
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path: task.snapshot.ref.fullPath });
      }
    );
  });
}

export async function deleteStorageObjectByPath(path) {
  const { configured, storage, auth } = initFirebase();
  if (!configured || !auth.currentUser || !path) return;
  await deleteObject(ref(storage, path));
}

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
};
