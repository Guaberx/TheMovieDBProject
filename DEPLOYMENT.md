# Deployment

The app is hosted on Firebase Hosting at **https://themoviedbproject.web.app**.

## ⚠️ It lives in the wrong Firebase project

The `themoviedbproject` hosting site was created inside the **MonedaRapida** project (`monedarapida`) instead of the project meant for this app, **MovieDBProject** (`moviedbproject-f4847`). It was probably picked by mistake during `firebase init` back in 2019.

Checked on 2026-10-15 with `firebase hosting:sites:list`:

| Firebase project                        | Hosting sites                                                   | What's there                                        |
| --------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| MonedaRapida (`monedarapida`)           | `monedarapida`, `moviedatabaseproject`, **`themoviedbproject`** | `themoviedbproject` serves this app                 |
| MovieDBProject (`moviedbproject-f4847`) | `moviedbproject-f4847`                                          | Only the default "Welcome to Firebase Hosting" page |
| BikesRentalV1 (`bikesrentalv1`)         | `bikesrentalv1`                                                 | Not related to this app                             |

`.firebaserc` points at where the site actually is today (`monedarapida`), so deploys keep working. See [Moving it to the right project](#moving-it-to-the-right-project) below.

## Requirements

- Node.js `^22.22.3`, `^24.15.0` or `>=26`
- Firebase CLI: `npm install -g firebase-tools`, then `firebase login`. The account needs access to the project above. `gcloud` isn't needed.

## How it's configured

- **`.firebaserc`** maps the `app` deploy target to the `themoviedbproject` site in `monedarapida`.
- **`firebase.json`**:
  - Serves `dist/movies-app/browser`, which is the output of `npm run build`.
  - Rewrites every path to `/index.html`. Without this, opening any URL other than `/` (for example `/movies`) returns a 404, because those pages only exist inside the Angular router. That was the bug in the 2019 deploy.
  - Caches JS/CSS for a year. Their filenames change on every build, so that's safe. Everything else (including `/` and deep links like `/movies/123`, which are served `index.html`) is `no-cache`, so new deploys show up right away.
  - Sends security headers on every response: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.

### If the CSP breaks the page

The CSP only allows scripts from the site itself plus one inline script, identified by its hash. The Angular build adds that script to load the CSS without blocking the first paint. If a future Angular version changes it, the page stays unstyled and the console shows a CSP error naming the expected hash. To get the new hash, run:

```bash
npm run build
node -e "const h=require('fs').readFileSync('dist/movies-app/browser/index.html','utf8');for(const m of h.matchAll(/<script>([\s\S]*?)<\/script>/g))console.log('sha256-'+require('crypto').createHash('sha256').update(m[1]).digest('base64'))"
```

Put it in `script-src` in `firebase.json`. The TMDB hosts are allowed in `img-src` (images) and `connect-src` (API), and YouTube's privacy-enhanced player in `frame-src` (trailers); a new external service needs to be added there too. The local hosting emulator ignores `headers`, so check CSP changes on a preview channel.

## Try it on a temporary URL first

Preview channels get their own URL, expire automatically and don't touch the live site:

```bash
npm run build
firebase hosting:channel:deploy <name> --only app --expires 7d
```

The command prints the preview URL (`https://themoviedbproject--<name>-<hash>.web.app`). Search engines don't index previews.

## Deploy to the live site

```bash
npm run build
firebase deploy --only hosting:app
```

If something goes wrong, go to the Firebase console → Hosting → release history and roll back to the previous release with one click.

## Moving it to the right project

**Decision (2026-10):** leave it where it is for now. Everything works from `monedarapida`; it's only untidy in the console. If the project takes off, add a custom domain instead (see below), which makes the question moot.

What's possible, for when that happens:

- **The site itself can't move.** Firebase has no way to transfer a Hosting site between projects, and a deleted site name can never be reused. So deleting `themoviedbproject` to recreate it elsewhere would lose `themoviedbproject.web.app` for good. Don't.
- **Renaming projects is only cosmetic.** Display names can be changed in Project settings, but project IDs are permanent and nothing moves. MonedaRapida also holds other sites, so renaming it would just mislabel those.
- **A custom domain can move.** Buy a domain and add it to MovieDBProject (Hosting → Add custom domain, then set the DNS records it shows). Deploy there, then turn `themoviedbproject.web.app` into a redirect to the domain with a separate deploy to MonedaRapida. A custom domain can later be removed from one project and added to another; it's briefly down while the new HTTPS certificate is issued.

When deploying to MovieDBProject, update `.firebaserc`:

```json
{
  "projects": { "default": "moviedbproject-f4847" },
  "targets": {
    "moviedbproject-f4847": { "hosting": { "app": ["<site id>"] } }
  }
}
```
