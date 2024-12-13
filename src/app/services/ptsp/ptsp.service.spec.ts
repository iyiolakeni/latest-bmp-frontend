import { TestBed } from '@angular/core/testing';

import { PtspService } from './ptsp.service';

describe('PtspService', () => {
  let service: PtspService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtspService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
