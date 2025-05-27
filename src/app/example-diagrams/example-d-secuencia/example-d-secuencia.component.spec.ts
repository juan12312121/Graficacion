import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleDSecuenciaComponent } from './example-d-secuencia.component';

describe('ExampleDSecuenciaComponent', () => {
  let component: ExampleDSecuenciaComponent;
  let fixture: ComponentFixture<ExampleDSecuenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDSecuenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleDSecuenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
