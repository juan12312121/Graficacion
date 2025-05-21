import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsideClasesComponent } from './rside-clases.component';

describe('RsideClasesComponent', () => {
  let component: RsideClasesComponent;
  let fixture: ComponentFixture<RsideClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsideClasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsideClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
