import { TestBed } from '@angular/core/testing';

import { ReadingTool } from './reading-tool';

describe('ReadingTool', () => {
  let service: ReadingTool;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingTool);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
