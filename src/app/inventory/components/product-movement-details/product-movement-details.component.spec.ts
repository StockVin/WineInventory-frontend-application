import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMovementDetailsComponent } from './product-movement-details.component';

describe('ProductMovementDetailsComponent', () => {
  let component: ProductMovementDetailsComponent;
  let fixture: ComponentFixture<ProductMovementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMovementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMovementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
