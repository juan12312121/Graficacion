import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartidosComponent } from './compartidos.component';

describe('CompartidosComponent', () => {
  let component: CompartidosComponent;
  let fixture: ComponentFixture<CompartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompartidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
