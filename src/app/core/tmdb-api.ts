import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MovieCredits,
  MovieDetails,
  MovieSummary,
  Paged,
  PersonDetails,
  PersonMovieCredits,
  PersonSummary,
} from './tmdb.models';

const { baseUrl, apiKey, language } = environment.tmdb;

@Injectable({ providedIn: 'root' })
export class TmdbApi {
  private readonly http = inject(HttpClient);

  // Movies
  popularMovies(): Observable<Paged<MovieSummary>> {
    return this.get('movie/popular');
  }

  searchMovies(query: string): Observable<Paged<MovieSummary>> {
    return this.get('search/movie', { query, include_adult: false });
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

  // People
  popularPeople(): Observable<Paged<PersonSummary>> {
    return this.get('person/popular');
  }

  person(id: number): Observable<PersonDetails> {
    return this.get(`person/${id}`);
  }

  personMovieCredits(id: number): Observable<PersonMovieCredits> {
    return this.get(`person/${id}/movie_credits`);
  }

  // HttpParams takes care of URL-encoding every value.
  private get<T>(path: string, params: Record<string, string | number | boolean> = {}) {
    return this.http.get<T>(`${baseUrl}/${path}`, {
      params: new HttpParams({ fromObject: { api_key: apiKey, language, ...params } }),
    });
  }
}
