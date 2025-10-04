import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMovementCreateComponent } from './product-movement-create.component';

describe('ProductMovementCreateComponent', () => {
  let component: ProductMovementCreateComponent;
  let fixture: ComponentFixture<ProductMovementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMovementCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMovementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
