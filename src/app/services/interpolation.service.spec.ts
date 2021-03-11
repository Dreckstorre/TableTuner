import { TestBed } from '@angular/core/testing';

import { InterpolationService } from './interpolation.service';

describe('InterpolationService', () => {
  let service: InterpolationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterpolationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
