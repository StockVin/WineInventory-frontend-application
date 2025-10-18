import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareguideDashboardComponent } from './careguide-dashboard.component';

describe('CareguideDashboardComponent', () => {
  let component: CareguideDashboardComponent;
  let fixture: ComponentFixture<CareguideDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareguideDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareguideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
