import { TestBed } from '@angular/core/testing';

import { DiagramaService } from './diagrama.service';

describe('DiagramaService', () => {
  let service: DiagramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
