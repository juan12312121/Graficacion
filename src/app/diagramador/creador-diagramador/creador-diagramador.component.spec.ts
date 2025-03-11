import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadorDiagramadorComponent } from './creador-diagramador.component';

describe('CreadorDiagramadorComponent', () => {
  let component: CreadorDiagramadorComponent;
  let fixture: ComponentFixture<CreadorDiagramadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadorDiagramadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreadorDiagramadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
