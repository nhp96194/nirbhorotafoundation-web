# Nirbhorota Foundation website (static: HTML5, CSS3, Bootstrap 5, JavaScript, Firebase)
No Python, no build step. Public site + `/admin/` dashboard.

## 1. Firebase (one time)
1. console.firebase.google.com > Add project > Add a **Web app** > copy the config into `assets/js/firebase.js`.
2. **Authentication** > Sign-in method > enable Email/Password. Add a user (your admin email + strong password).
3. **Firestore Database** > Create (production mode, e.g. asia-southeast1). Paste `firebase/firestore.rules` into Rules > Publish.
4. **First admin (secure):** copy that user's UID (Authentication > Users). In Firestore create collection `admins`, Document ID = the UID, one field e.g. `role: "admin"`. Nobody can create this from the website.
5. **Storage (optional):** current Firebase rules require the Blaze plan to create a bucket. No-cost quota still applies, but set a Budget alert. Paste `firebase/storage.rules`. Without Storage, paste image URLs in the admin forms.
6. Authentication > Settings > **Authorized domains**: add your Vercel domain (and custom domain).

## 2. Run locally
ES modules need http, not file://. Use the VS Code "Live Server" extension (or `npx serve`). Open `/admin/login.html`, log in, open **Settings**, then add projects/stories and press **Publish**.

## 3. Deploy on Vercel
GitHub: create a private repo, upload the folder. Vercel > Add New > Project > import the repo > Framework preset **Other**, no build command, output = root. Deploy. Every `git push` updates the live site.

## Change content
Everything (texts, hero image, contact info, donation info, projects, stories) is edited in `/admin/`. Bangla/English UI labels live in `assets/js/site.js` (object `T`). Colours: top of `assets/css/main.css`.

## Security notes
The Firebase web config is public by design; protection = the rules files. Public can read only `published` items and can only *create* volunteer/contact entries. Never commit service-account keys.
