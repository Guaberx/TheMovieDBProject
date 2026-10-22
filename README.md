# MoviesApp

Browse popular movies and actors from [The Movie Database (TMDB)](https://www.themoviedb.org/), search for movies, and open detail pages with cast, filmography and similar titles.

Built with Angular 22 (standalone components, signals, `rxResource`) and Bootstrap 5.

## Requirements

Node.js `^22.22.3`, `^24.15.0` or `>=26`.

## Getting started

```bash
npm install
npm start          # dev server at http://localhost:4200
npm run build      # production build in dist/movies-app
npm test           # unit tests (Vitest)
```

## Routes

| URL                                       | Page                 |
| ----------------------------------------- | -------------------- |
| `/`                                       | Welcome              |
| `/movies`                                 | Popular movies       |
| `/movies?q=batman`                        | Movie search results |
| `/movies/429617-spider-man-far-from-home` | Movie details        |
| `/actors`                                 | Popular actors       |
| `/actors/1136406-tom-holland`             | Actor details        |
| `/about`, `/contact`                      | Static pages         |

Detail URLs use an `id-slug` segment. Only the numeric id is used for lookups; a missing or outdated slug is replaced with the canonical one.

## Deployment

Hosted on Firebase at https://themoviedbproject.web.app. See [DEPLOYMENT.md](DEPLOYMENT.md) for how to deploy, and for a note on why the site sits in the wrong Firebase project.

## Configuration

The TMDB API key lives in `src/environments/environment.ts`. TMDB keys are free and intended for client-side use, so it is committed on purpose.
