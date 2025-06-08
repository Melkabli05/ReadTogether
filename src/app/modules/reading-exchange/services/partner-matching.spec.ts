import { TestBed } from '@angular/core/testing';

import { PartnerMatching } from './partner-matching';

describe('PartnerMatching', () => {
  let service: PartnerMatching;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerMatching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
