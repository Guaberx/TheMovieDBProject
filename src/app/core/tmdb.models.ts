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
}

export interface MovieDetails extends MovieSummary {
  overview: string;
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
}

export interface MovieCredits {
  cast: PersonSummary[];
}

export interface PersonMovieCredits {
  cast: MovieSummary[];
}
