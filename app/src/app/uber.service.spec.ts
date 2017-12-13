import { TestBed, inject } from '@angular/core/testing';

import { UberService } from './uber.service';

describe('UberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UberService]
    });
  });

  it('should be created', inject([UberService], (service: UberService) => {
    expect(service).toBeTruthy();
  }));
});
