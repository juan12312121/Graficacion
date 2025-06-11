import { TestBed } from '@angular/core/testing';

import { DiagramadorApiService } from './diagramador-api.service';

describe('DiagramadorApiService', () => {
  let service: DiagramadorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramadorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
