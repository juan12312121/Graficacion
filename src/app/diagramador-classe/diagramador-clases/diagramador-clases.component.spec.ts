import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramadorClasesComponent } from './diagramador-clases.component';

describe('DiagramadorClasesComponent', () => {
  let component: DiagramadorClasesComponent;
  let fixture: ComponentFixture<DiagramadorClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramadorClasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramadorClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
