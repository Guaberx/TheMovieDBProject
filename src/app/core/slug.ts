/** Turns "Spider-Man: Far From Home" into "spider-man-far-from-home". */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Builds the "id-slug" route segment, e.g. "429617-spider-man-far-from-home". */
export function idSlug(id: number, name: string): string {
  const slug = slugify(name);
  return slug ? `${id}-${slug}` : `${id}`;
}

/** Reads the id back out of an "id-slug" segment. The slug part is ignored. */
export function parseIdSlug(segment: string | undefined): number | undefined {
  const match = /^(\d+)(?:-|$)/.exec(segment ?? '');
  return match ? Number(match[1]) : undefined;
}

export const movieLink = (m: { id: number; title: string }) => ['/movies', idSlug(m.id, m.title)];
export const actorLink = (p: { id: number; name: string }) => ['/actors', idSlug(p.id, p.name)];
