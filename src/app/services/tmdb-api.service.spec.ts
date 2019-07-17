import { TestBed } from '@angular/core/testing';

import { TMDBApiService } from './tmdb-api.service';

describe('TMDBApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TMDBApiService = TestBed.get(TMDBApiService);
    expect(service).toBeTruthy();
  });
});
