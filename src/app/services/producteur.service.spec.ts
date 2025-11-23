import { TestBed } from '@angular/core/testing';

import { ProducteurService } from './producteur.service';

describe('ProducteurService', () => {
  let service: ProducteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
