import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramadorComponentesComponent } from './diagramador-componentes.component';

describe('DiagramadorComponentesComponent', () => {
  let component: DiagramadorComponentesComponent;
  let fixture: ComponentFixture<DiagramadorComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramadorComponentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramadorComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
