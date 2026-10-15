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
  - Caches JS/CSS for a year. Their filenames change on every build, so that's safe. `index.html` is never cached, so new deploys show up right away.

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

Hosting site names are unique across all of Firebase, so `themoviedbproject` can only exist in one project at a time. Choose one of these options:

1. **Keep the name and move it.** Delete the `themoviedbproject` site from MonedaRapida, then create it again in MovieDBProject with `firebase hosting:sites:create themoviedbproject --project moviedbproject-f4847`. Check Firebase's current docs before deleting: a deleted site name might not be reusable right away, and the URL is down between the two steps.
2. **Use MovieDBProject's own site.** Deploy to `moviedbproject-f4847.web.app` (or a custom domain added to that project). Then point the old site at it with a redirect in a separate deploy to MonedaRapida.

Either way, update `.firebaserc` afterwards:

```json
{
  "projects": { "default": "moviedbproject-f4847" },
  "targets": {
    "moviedbproject-f4847": { "hosting": { "app": ["<site id>"] } }
  }
}
```
