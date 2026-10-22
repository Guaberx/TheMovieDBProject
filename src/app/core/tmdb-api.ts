import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MovieCredits,
  MovieDetails,
  MovieSummary,
  Paged,
  PersonDetails,
  PersonMovieCredits,
  PersonSummary,
  Video,
} from './tmdb.models';

const { baseUrl, apiKey, language } = environment.tmdb;

/** How long a response is reused before it's fetched again. */
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 100;

// Page 1 is requested without the param, so it shares its cache entry with older callers.
const pageParam = (page: number): Record<string, number> => (page > 1 ? { page } : {});

@Injectable({ providedIn: 'root' })
export class TmdbApi {
  private readonly http = inject(HttpClient);
  // Responses are shared and cached by URL, so a hover prefetch, the page that needs the same
  // data and a later Back navigation all reuse one request.
  private readonly cache = new Map<string, { response: Observable<unknown>; time: number }>();

  // Movies
  popularMovies(page = 1): Observable<Paged<MovieSummary>> {
    return this.get('movie/popular', pageParam(page));
  }

  searchMovies(query: string, page = 1): Observable<Paged<MovieSummary>> {
    return this.get('search/movie', { query, include_adult: false, ...pageParam(page) });
  }

  movie(id: number): Observable<MovieDetails> {
    return this.get(`movie/${id}`);
  }

  movieCredits(id: number): Observable<MovieCredits> {
    return this.get(`movie/${id}/credits`);
  }

  similarMovies(id: number): Observable<Paged<MovieSummary>> {
    return this.get(`movie/${id}/similar`);
  }

  movieVideos(id: number): Observable<{ results: Video[] }> {
    return this.get(`movie/${id}/videos`);
  }

  // People
  popularPeople(page = 1): Observable<Paged<PersonSummary>> {
    return this.get('person/popular', pageParam(page));
  }

  person(id: number): Observable<PersonDetails> {
    return this.get(`person/${id}`);
  }

  personMovieCredits(id: number): Observable<PersonMovieCredits> {
    return this.get(`person/${id}/movie_credits`);
  }

  // HttpParams takes care of URL-encoding every value.
  private get<T>(path: string, params: Record<string, string | number | boolean> = {}) {
    const url = `${baseUrl}/${path}`;
    const httpParams = new HttpParams({ fromObject: { api_key: apiKey, language, ...params } });
    const key = `${url}?${httpParams}`;

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return cached.response as Observable<T>;
    }

    const response = this.http.get<T>(url, { params: httpParams }).pipe(shareReplay(1));
    // Failed requests aren't cached, so a retry goes back to the network.
    response.subscribe({ error: () => this.cache.delete(key) });
    this.cache.delete(key);
    this.cache.set(key, { response, time: Date.now() });
    if (this.cache.size > CACHE_MAX_ENTRIES) {
      // Maps keep insertion order, so the first key is the oldest.
      this.cache.delete(this.cache.keys().next().value!);
    }
    return response;
  }
}
