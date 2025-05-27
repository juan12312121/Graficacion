import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleDComponentesComponent } from './example-d-componentes.component';

describe('ExampleDComponentesComponent', () => {
  let component: ExampleDComponentesComponent;
  let fixture: ComponentFixture<ExampleDComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDComponentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleDComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
