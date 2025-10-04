import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMovementLogComponent } from './product-movement-log.component';

describe('ProductMovementLogComponent', () => {
  let component: ProductMovementLogComponent;
  let fixture: ComponentFixture<ProductMovementLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMovementLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMovementLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
