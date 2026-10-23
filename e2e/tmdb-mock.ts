import { Page } from '@playwright/test';

// A tiny fake TMDB: predictable lists, movies and people, so the tests can count cards and
// follow links without the network. Ids tell the lists apart (popular 1+, genre 1000+, ...).

const PAGE_SIZE = 20;
const PAGES = 5;
// 1x1 grey PNG for every image.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

const movie = (id: number, title = `Movie ${id}`) => ({
  id,
  title,
  original_title: title,
  poster_path: `/poster-${id}.jpg`,
  backdrop_path: `/backdrop-${id}.jpg`,
  vote_average: 7.5,
  release_date: '2020-05-01',
  popularity: 10_000 - id,
});

const person = (id: number, name = `Actor ${id}`) => ({
  id,
  name,
  profile_path: `/profile-${id}.jpg`,
});

const range = (from: number, count: number) => Array.from({ length: count }, (_, i) => from + i);

const paged = <T>(page: number, firstId: number, make: (id: number) => T, pages = PAGES) => ({
  page,
  results: range(firstId + (page - 1) * PAGE_SIZE, PAGE_SIZE).map(make),
  total_pages: pages,
  total_results: pages * PAGE_SIZE,
});

function respond(url: URL): { status: number; body: unknown } {
  const path = url.pathname.replace(/^\/3\//, '');
  const page = Number(url.searchParams.get('page') ?? 1);
  const query = url.searchParams.get('query') ?? '';
  const ok = (body: unknown) => ({ status: 200, body });
  let m: RegExpMatchArray | null;

  if (path === 'movie/popular') return ok(paged(page, 1, (id) => movie(id)));
  if (path === 'discover/movie') return ok(paged(page, 1000, (id) => movie(id, `Action ${id}`)));
  if (path === 'search/movie')
    return ok(paged(page, 500, (id) => movie(id, `${query} movie ${id}`), 1));
  if (path === 'genre/movie/list')
    return ok({
      genres: [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
      ],
    });
  if (path === 'person/popular') return ok(paged(page, 2000, (id) => person(id)));
  if (path === 'search/person')
    return ok({
      page: 1,
      results: range(3000, 8).map((id) => person(id, `${query} person ${id}`)),
      total_pages: 1,
      total_results: 8,
    });

  if ((m = path.match(/^movie\/(\d+)$/))) {
    const id = Number(m[1]);
    if (id === 404404) return { status: 404, body: { status_code: 34 } };
    return ok({
      ...movie(id),
      overview: `Overview of movie ${id}.`,
      tagline: 'A tagline.',
      runtime: 125,
      genres: [{ id: 28, name: 'Action' }],
      spoken_languages: [{ english_name: 'English', name: 'English' }],
    });
  }
  if ((m = path.match(/^movie\/(\d+)\/credits$/)))
    return ok({ cast: range(4000, 8).map((id) => ({ ...person(id), character: `Role ${id}` })) });
  if ((m = path.match(/^movie\/(\d+)\/similar$/))) return ok(paged(1, 6000, (id) => movie(id), 1));
  if ((m = path.match(/^movie\/(\d+)\/videos$/)))
    return ok({
      results: [
        { key: 'abc123', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true },
      ],
    });

  if ((m = path.match(/^person\/(\d+)$/))) {
    const id = Number(m[1]);
    return ok({
      ...person(id),
      biography: `Biography of actor ${id}.`,
      birthday: '1990-01-01',
      deathday: null,
      place_of_birth: 'Cali, Colombia',
    });
  }
  if ((m = path.match(/^person\/(\d+)\/movie_credits$/)))
    return ok({ cast: range(7000, 8).map((id) => movie(id)) });

  return { status: 404, body: { status_code: 34 } };
}

/** Routes TMDB API and image requests to the fake data. Call before the first page.goto(). */
export async function mockTmdb(page: Page) {
  await page.route('https://api.themoviedb.org/3/**', (route) => {
    const { status, body } = respond(new URL(route.request().url()));
    return route.fulfill({ status, json: body, headers: { 'access-control-allow-origin': '*' } });
  });
  await page.route('https://image.tmdb.org/**', (route) =>
    route.fulfill({ body: PIXEL, contentType: 'image/png' }),
  );
  // Keep the trailer test offline too.
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ body: '<title>Trailer</title>', contentType: 'text/html' }),
  );
}
