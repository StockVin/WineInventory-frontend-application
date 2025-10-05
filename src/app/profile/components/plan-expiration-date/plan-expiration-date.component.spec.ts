import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExpirationDateComponent } from './plan-expiration-date.component';

describe('PlanExpirationDateComponent', () => {
  let component: PlanExpirationDateComponent;
  let fixture: ComponentFixture<PlanExpirationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanExpirationDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanExpirationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
