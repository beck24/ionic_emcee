import { TestBed } from '@angular/core/testing';

import { DeviceConnectionService } from './device-connection.service';

describe('DeviceConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceConnectionService = TestBed.get(DeviceConnectionService);
    expect(service).toBeTruthy();
  });
});
