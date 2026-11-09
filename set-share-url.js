// Runs automatically before every `firebase deploy` (see firebase.json -> hosting.predeploy).
// It writes the real site address into the WhatsApp / Facebook preview tags in public/index.html,
// so the preview picture always points at the site you are deploying to.
//
// Address used, in this order:
//   1. "customDomain" in site.config.json, e.g. "https://aditiwedskrishan.in"
//   2. https://<your Firebase project ID>.web.app   (Firebase tells this script the ID)
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const root = path.join(__dirname, '..');
const cfgPath = path.join(root, 'site.config.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {};

let base = (cfg.customDomain || '').trim();
if (!base) {
  let id = process.env.GCLOUD_PROJECT || process.argv[2];
  if (!id) {
    try { id = JSON.parse(fs.readFileSync(path.join(root, '.firebaserc'), 'utf8')).projects.default; } catch (_) {}
  }
  if (!id) { console.error('set-share-url: could not find the Firebase project ID'); process.exit(1); }
  base = `https://${id}.web.app`;
}
if (!/^https:\/\//.test(base)) base = 'https://' + base.replace(/^http:\/\//, '');
base = base.replace(/\/+$/, '');

const image = (cfg.previewImage || 'og-image.jpg').replace(/^\/+/, '');
const imgPath = path.join(root, 'public', image);
if (!fs.existsSync(imgPath)) { console.error(`set-share-url: public/${image} not found`); process.exit(1); }
// changes only when the picture changes, so WhatsApp fetches a new one exactly when needed
const version = crypto.createHash('md5').update(fs.readFileSync(imgPath)).digest('hex').slice(0, 8);

const file = path.join(root, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const set = (prop, value) => {
  const re = new RegExp(`(<meta property="${prop}" content=")[^"]*(")`);
  if (!re.test(html)) { console.error(`set-share-url: missing ${prop} tag`); process.exit(1); }
  html = html.replace(re, `$1${value}$2`);
};
set('og:url', `${base}/`);
set('og:image', `${base}/${image}?v=${version}`);
set('og:image:secure_url', `${base}/${image}?v=${version}`);
html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${base}/$2`);
fs.writeFileSync(file, html);
console.log(`set-share-url: preview tags now point to ${base}/${image}`);
