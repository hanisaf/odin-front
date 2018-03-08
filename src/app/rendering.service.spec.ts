import { TestBed, inject } from '@angular/core/testing';

import { RenderingService } from './rendering.service';

describe('RenderingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderingService]
    });
  });

  it('should be created', inject([RenderingService], (service: RenderingService) => {
    expect(service).toBeTruthy();
  }));
});
