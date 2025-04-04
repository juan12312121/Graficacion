import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidedComponent } from './asided.component';

describe('AsidedComponent', () => {
  let component: AsidedComponent;
  let fixture: ComponentFixture<AsidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsidedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
