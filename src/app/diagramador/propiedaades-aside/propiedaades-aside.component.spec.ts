import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedaadesAsideComponent } from './propiedaades-aside.component';

describe('PropiedaadesAsideComponent', () => {
  let component: PropiedaadesAsideComponent;
  let fixture: ComponentFixture<PropiedaadesAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedaadesAsideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropiedaadesAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
