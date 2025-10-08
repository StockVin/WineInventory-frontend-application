import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionPlanComponent } from './subcription-plan.component';

describe('SubscriptionPlanComponent', () => {
  let component: SubcriptionPlanComponent;
  let fixture: ComponentFixture<SubcriptionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcriptionPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});