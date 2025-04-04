import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramadorPaquetesComponent } from './diagramador-paquetes.component';

describe('DiagramadorPaquetesComponent', () => {
  let component: DiagramadorPaquetesComponent;
  let fixture: ComponentFixture<DiagramadorPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramadorPaquetesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramadorPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
