import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareguideListComponent } from './careguide-list.component';

describe('CareguideListComponent', () => {
  let component: CareguideListComponent;
  let fixture: ComponentFixture<CareguideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareguideListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareguideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
