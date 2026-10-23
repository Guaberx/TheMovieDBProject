import { environment } from '../../environments/environment';

export const tmdbImage = (path: string | null | undefined, size: string) =>
  `${environment.tmdb.imageBaseUrl}/${size}${path}`;

// Cards render 150-180px wide, so the browser picks 185px or 342px (high-DPI) images.
export const CARD_IMAGE_SIZES = '180px';
export const cardImageSrcset = (path: string | null | undefined) =>
  ['w185', 'w342', 'w500'].map((w) => `${tmdbImage(path, w)} ${w.slice(1)}w`).join(', ');
