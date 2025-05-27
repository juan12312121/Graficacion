import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleDClaseComponent } from './example-d-clase.component';

describe('ExampleDClaseComponent', () => {
  let component: ExampleDClaseComponent;
  let fixture: ComponentFixture<ExampleDClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDClaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleDClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
