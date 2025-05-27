import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleDPaquetesComponent } from './example-d-paquetes.component';

describe('ExampleDPaquetesComponent', () => {
  let component: ExampleDPaquetesComponent;
  let fixture: ComponentFixture<ExampleDPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDPaquetesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleDPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
