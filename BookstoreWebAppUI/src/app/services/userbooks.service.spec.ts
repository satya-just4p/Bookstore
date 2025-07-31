import { TestBed } from '@angular/core/testing';

import { UserbooksService } from './userbooks.service';

describe('UserbooksService', () => {
  let service: UserbooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserbooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
