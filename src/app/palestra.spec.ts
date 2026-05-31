import { TestBed } from '@angular/core/testing';

import { Palestra } from './palestra';

describe('Palestra', () => {
  let service: Palestra;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Palestra);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
