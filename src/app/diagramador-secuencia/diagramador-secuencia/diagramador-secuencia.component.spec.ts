import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramadorSecuenciaComponent } from './diagramador-secuencia.component';

describe('DiagramadorSecuenciaComponent', () => {
  let component: DiagramadorSecuenciaComponent;
  let fixture: ComponentFixture<DiagramadorSecuenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramadorSecuenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramadorSecuenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
