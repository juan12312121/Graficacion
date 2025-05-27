import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsideSecuenciaComponent } from './rside-secuencia.component';

describe('RsideSecuenciaComponent', () => {
  let component: RsideSecuenciaComponent;
  let fixture: ComponentFixture<RsideSecuenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsideSecuenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsideSecuenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
