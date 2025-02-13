import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDiagramasComponent } from './mis-diagramas.component';

describe('MisDiagramasComponent', () => {
  let component: MisDiagramasComponent;
  let fixture: ComponentFixture<MisDiagramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDiagramasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisDiagramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
