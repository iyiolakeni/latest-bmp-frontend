import { TestBed } from '@angular/core/testing';

import { DeployedTableService } from './deployed-table.service';

describe('DeployedTableService', () => {
  let service: DeployedTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeployedTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
