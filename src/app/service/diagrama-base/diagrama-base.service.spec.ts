import { TestBed } from '@angular/core/testing';

import { DiagramaBaseService } from './diagrama-base.service';

describe('DiagramaBaseService', () => {
  let service: DiagramaBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramaBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
