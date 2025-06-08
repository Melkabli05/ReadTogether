import { TestBed } from '@angular/core/testing';

import { RealTimeSync } from './real-time-sync';

describe('RealTimeSync', () => {
  let service: RealTimeSync;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealTimeSync);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
