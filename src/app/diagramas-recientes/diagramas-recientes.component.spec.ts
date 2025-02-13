import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramasRecientesComponent } from './diagramas-recientes.component';

describe('DiagramasRecientesComponent', () => {
  let component: DiagramasRecientesComponent;
  let fixture: ComponentFixture<DiagramasRecientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramasRecientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramasRecientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
