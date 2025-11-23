import { TestBed } from '@angular/core/testing';

import { CodelistService } from './codelist.service';

describe('CodelistService', () => {
  let service: CodelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
