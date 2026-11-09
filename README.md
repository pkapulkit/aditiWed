# Aditi & Krishan · Shubh Vivah

Wedding invitation website for **Aditi (Payal) & Krishan Kumar**, 5 December 2026, Divya Resort, Sikandra, Agra.

![Preview of the site](docs/preview.jpg)

Palace doors that open on a tap, the bride and groom exchanging varmala, an animated Saat Phere,
the programme with calendar links, the venue on Google Maps, R.S.V.P. on WhatsApp, and the printed card.
Plain HTML, no build step. Hosted on Firebase Hosting.

## What's in here

```
.
├── public/                    everything that goes live
│   ├── index.html             the invitation
│   ├── 404.html               shown for a wrong link
│   ├── card-*.jpg             scans of the printed card
│   ├── og-image.jpg           WhatsApp preview: the real printed card
│   ├── og-image-couple.jpg    alternative preview: the illustrated couple
│   ├── favicon.svg
│   └── apple-touch-icon.png
├── scripts/set-share-url.js   fills in the WhatsApp preview address before every deploy
├── site.config.json           custom domain and which preview picture to use
├── firebase.json              hosting settings
├── .firebaserc                which Firebase project to deploy to
└── .github/workflows/         automatic deploys from GitHub
```

## 1. Put it on GitHub

Unzip, then from inside the folder:

```
git init -b main
git add .
git commit -m "Wedding website"
git remote add origin https://github.com/YOUR-USERNAME/aditi-krishan-wedding.git
git push -u origin main
```

Create the empty repository on github.com first (no README, no .gitignore, since they're already here).
Making it **Private** is a good idea because the page has family names and phone numbers.

Uploading by drag and drop on github.com also works, but your computer hides files that start
with a dot (`.github`, `.firebaserc`, `.gitignore`). Show hidden files first (Mac: Cmd+Shift+. in Finder,
Windows: View → Show → Hidden items), or use the commands above or GitHub Desktop.

## 2. Create the Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Try the project ID `aditi-krishan-wedding`. Google Analytics isn't needed.
3. If Firebase gives you a different ID, put it in `.firebaserc` in place of `aditi-krishan-wedding`.

## 3. Turn on automatic deploys (one time)

Install Node.js 18 or newer from nodejs.org, then in this folder:

```
npm install -g firebase-tools
firebase login
firebase init hosting:github
```

Answer the questions like this:

| Question | Answer |
|---|---|
| For which GitHub repository? | `YOUR-USERNAME/aditi-krishan-wedding` |
| Set up the workflow to run a build script before every deploy? | **No** |
| Set up automatic deployment when a PR is merged? | **Yes**, branch `main` |
| File `.github/workflows/...yml` already exists. Overwrite? | **Yes** |

This creates a secure key in your GitHub repository's secrets so GitHub can publish to Firebase,
and writes the two workflow files for your exact project ID.
Commit and push those workflow files:

```
git add .github
git commit -m "Connect Firebase"
git push
```

From now on every push to `main` puts the new version live at `https://YOUR-ID.web.app`
within a couple of minutes. Watch it under the **Actions** tab on GitHub.
Pull requests get their own temporary preview link.

If you'd rather deploy by hand, skip this step and run `firebase deploy --only hosting`.

## WhatsApp preview not showing?

The preview address is filled in automatically on every deploy (`scripts/set-share-url.js`).
If the picture still doesn't appear:

1. Open `https://YOUR-ID.web.app/og-image.jpg` in a browser. You should see the card.
2. Paste your site link into https://developers.facebook.com/tools/debug/ and press **Scrape Again**.
   WhatsApp reads the same tags.
3. WhatsApp remembers the first preview it saw for a link, even a blank one. Share the link with
   something new on the end, for example `https://YOUR-ID.web.app/?v=2`.
4. Always send the full link starting with `https://`.

To show the illustrated couple instead of the printed card, set
`"previewImage": "og-image-couple.jpg"` in `site.config.json` and push.

## Custom domain (optional)

Firebase console → Hosting → **Add custom domain**, and add the DNS records it shows at your domain
registrar. Then set `"customDomain": "https://your-domain.in"` in `site.config.json` and push,
so the WhatsApp preview uses the new address.

## Try it on your computer

```
firebase serve --only hosting
```
Open http://localhost:5000

## Notes

- `noindex` is set, so Google won't list the site. Only people with the link find it.
  Remove the `robots` line in `public/index.html` to change that.
- Never commit a service account `.json` key. `.gitignore` blocks the usual file names.
- Fonts come from Google Fonts. The music, animations and flowers are built into the page.
