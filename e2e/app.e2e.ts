import { Page, expect, test } from '@playwright/test';
import { mockTmdb } from './tmdb-mock';

const cards = (page: Page) => page.locator('app-poster-card');

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('home leads to the movie list, which pages with Load more', async ({ page }) => {
  await page.goto('/');
  // The whole welcome screen is one big link.
  await page.locator('a.startbtn').click();
  await expect(page).toHaveURL('/movies');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Popular movies');
  await expect(cards(page)).toHaveCount(20);

  await page.getByRole('button', { name: 'Load more' }).click();
  await expect(cards(page)).toHaveCount(40);
});

test('movie → actor → back', async ({ page }) => {
  await page.goto('/movies');
  await cards(page).first().getByRole('link').click();

  await expect(page).toHaveURL('/movies/1-movie-1');
  await expect(page).toHaveTitle('Movie 1 · MoviesApp');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Movie 1');
  await expect(page.getByText('2h 5m')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cast' })).toBeVisible();

  await page.getByRole('link', { name: /Actor 4000/ }).click();
  await expect(page).toHaveURL('/actors/4000-actor-4000');
  await expect(page.getByText('Born January 1, 1990 in Cali, Colombia')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Known for' })).toBeVisible();

  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Movie 1');
});

test('Back keeps the loaded pages and the scroll position', async ({ page }) => {
  await page.goto('/movies');
  await page.getByRole('button', { name: 'Load more' }).click();
  await page.getByRole('button', { name: 'Load more' }).click();
  await expect(cards(page)).toHaveCount(60);

  const card = cards(page).nth(45);
  await card.scrollIntoViewIfNeeded();
  const scrollY = await page.evaluate(() => window.scrollY);
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/\/movies\/46-/);

  await page.goBack();
  await expect(cards(page)).toHaveCount(60);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
});

test('search shows matching actors above the movies', async ({ page }) => {
  await page.goto('/movies');
  const search = page.getByRole('searchbox', { name: 'Search movies and actors' });
  // On phones the search box is inside the collapsed menu.
  if (!(await search.isVisible()))
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await search.fill('tom');
  await search.press('Enter');

  await expect(page).toHaveURL('/movies?q=tom');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Results for “tom”');
  await expect(page.getByRole('link', { name: 'tom person 3000' })).toBeVisible();
  await expect(page.getByRole('link', { name: /tom movie 500/ })).toBeVisible();

  await page.getByRole('link', { name: 'See all actors matching “tom”' }).click();
  await expect(page).toHaveURL('/actors?q=tom');
  await expect(cards(page)).toHaveCount(8);
});

test('genre filter', async ({ page }) => {
  await page.goto('/movies');
  await page.getByRole('link', { name: 'Action', exact: true }).click();
  await expect(page).toHaveURL('/movies?genre=28');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Popular action movies');
  await expect(cards(page).first()).toContainText('Action 1000');
});

test('trailer opens in a dialog and closes', async ({ page }) => {
  await page.goto('/movies/1');
  await page.getByRole('button', { name: /Watch trailer/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('iframe')).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/abc123/,
  );
  await page.getByRole('button', { name: 'Close trailer' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('unknown movie shows the 404 page', async ({ page }) => {
  await page.goto('/movies/404404');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page).toHaveTitle('Not found · MoviesApp');
});

// Regression checks for the layout bugs fixed earlier: every page shares one container, so the
// navbar brand, the first thing on the page and the footer start at the same x, at the same height.
for (const path of ['/movies', '/movies/1', '/actors/4000', '/about', '/contact']) {
  test(`${path} lines up with the navbar and footer`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main .container').first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    const box = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((e) => {
          const r = e.getBoundingClientRect();
          return { left: Math.round(r.left), top: Math.round(r.top + window.scrollY) };
        });
    const brand = await box('.navbar-brand');
    const first = await box('main .container > *');
    const footer = await box('.footer-inner > *');
    expect(first.left).toBe(brand.left);
    expect(footer.left).toBe(brand.left);
    expect(first.top).toBe(96);
    // No sideways scrolling.
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
  });
}

test('six-card rows fill the whole width', async ({ page }) => {
  await page.goto('/movies/1');
  for (const grid of await page.locator('.card-grid-six').all()) {
    const { gridRight, lastRight } = await grid.evaluate((g) => ({
      gridRight: Math.round(g.getBoundingClientRect().right),
      lastRight: Math.round(
        Math.max(...[...g.children].map((c) => c.getBoundingClientRect().right)),
      ),
    }));
    expect(lastRight).toBe(gridRight);
  }
});
