import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { explorePageResolver } from './explore-page-resolver';

describe('explorePageResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => explorePageResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
