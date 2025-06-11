import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidePropiedadesComponentesComponent } from './aside-propiedades-componentes.component';

describe('AsidePropiedadesComponentesComponent', () => {
  let component: AsidePropiedadesComponentesComponent;
  let fixture: ComponentFixture<AsidePropiedadesComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsidePropiedadesComponentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsidePropiedadesComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
