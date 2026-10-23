import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TmdbApi } from './tmdb-api';

describe('TmdbApi', () => {
  let api: TmdbApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(TmdbApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('URL-encodes the search query', () => {
    api.searchMovies('fast & furious #9').subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/search/movie'));
    expect(req.request.params.get('query')).toBe('fast & furious #9');
    expect(req.request.urlWithParams).toContain('query=fast%20%26%20furious%20%239');
    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
  });

  it('reuses one request for the same data', () => {
    const results: unknown[] = [];
    api.movie(1).subscribe((m) => results.push(m));
    api.movie(1).subscribe((m) => results.push(m));
    http.expectOne((r) => r.url.endsWith('/movie/1')).flush({ id: 1 });
    api.movie(1).subscribe((m) => results.push(m));
    http.expectNone((r) => r.url.endsWith('/movie/1'));
    expect(results).toEqual([{ id: 1 }, { id: 1 }, { id: 1 }]);
  });

  it('goes back to the network after a failed request', () => {
    api.movie(2).subscribe({ error: () => {} });
    http
      .expectOne((r) => r.url.endsWith('/movie/2'))
      .flush(null, { status: 500, statusText: 'Error' });
    api.movie(2).subscribe();
    http.expectOne((r) => r.url.endsWith('/movie/2')).flush({ id: 2 });
  });
});
