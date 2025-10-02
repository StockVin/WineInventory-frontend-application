import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareguideCreateComponent } from './careguide-create.component';

describe('CareguideCreateComponent', () => {
  let component: CareguideCreateComponent;
  let fixture: ComponentFixture<CareguideCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareguideCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareguideCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
