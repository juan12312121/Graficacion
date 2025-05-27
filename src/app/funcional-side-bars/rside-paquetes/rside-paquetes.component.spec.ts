import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsidePaquetesComponent } from './rside-paquetes.component';

describe('RsidePaquetesComponent', () => {
  let component: RsidePaquetesComponent;
  let fixture: ComponentFixture<RsidePaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsidePaquetesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsidePaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
