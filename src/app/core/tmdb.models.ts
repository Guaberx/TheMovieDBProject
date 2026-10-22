export interface Paged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  vote_average: number;
  /** "YYYY-MM-DD", or "" when TMDB doesn't know it yet. */
  release_date?: string;
  popularity?: number;
}

export interface MovieDetails extends MovieSummary {
  overview: string;
  tagline: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  spoken_languages: { english_name: string; name: string }[];
}

export interface PersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface PersonDetails extends PersonSummary {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
}

export interface MovieCredits {
  cast: (PersonSummary & { character?: string })[];
}

export interface PersonMovieCredits {
  cast: MovieSummary[];
}

export interface Video {
  key: string;
  name: string;
  /** "YouTube", "Vimeo", ... */
  site: string;
  /** "Trailer", "Teaser", "Clip", ... */
  type: string;
  official: boolean;
}
