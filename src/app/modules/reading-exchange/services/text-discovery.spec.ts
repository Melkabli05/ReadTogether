import { TestBed } from '@angular/core/testing';

import { TextDiscovery } from './text-discovery';

describe('TextDiscovery', () => {
  let service: TextDiscovery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextDiscovery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
