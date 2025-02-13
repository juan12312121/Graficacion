import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCrearDiagramaComponent } from './btn-crear-diagrama.component';

describe('BtnCrearDiagramaComponent', () => {
  let component: BtnCrearDiagramaComponent;
  let fixture: ComponentFixture<BtnCrearDiagramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnCrearDiagramaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnCrearDiagramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
