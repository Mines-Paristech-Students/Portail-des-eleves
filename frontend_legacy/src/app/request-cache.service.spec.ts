import { TestBed, inject } from '@angular/core/testing';

import { RequestCacheService } from './request-cache.service';

describe('RequestCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestCacheService]
    });
  });

  it('should be created', inject([RequestCacheService], (service: RequestCacheService) => {
    expect(service).toBeTruthy();
  }));
});
