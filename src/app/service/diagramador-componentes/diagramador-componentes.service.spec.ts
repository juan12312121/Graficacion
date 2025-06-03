import { TestBed } from '@angular/core/testing';

import { DiagramadorComponentesService } from './diagramador-componentes.service';

describe('DiagramadorComponentesService', () => {
  let service: DiagramadorComponentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramadorComponentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
