import { TestBed } from '@angular/core/testing';

import { MaintenanceRequestService } from './maintenance-request.service';

describe('MaintenanceRequestService', () => {
  let service: MaintenanceRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
