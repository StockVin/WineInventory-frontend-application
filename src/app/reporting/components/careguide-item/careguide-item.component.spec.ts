import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareguideItemComponent } from './careguide-item.component';

describe('CareguideItemComponent', () => {
  let component: CareguideItemComponent;
  let fixture: ComponentFixture<CareguideItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareguideItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareguideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
