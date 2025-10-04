import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSoonToExpireComponent } from './products-soon-to-expire.component';

describe('ProductsSoonToExpireComponent', () => {
  let component: ProductsSoonToExpireComponent;
  let fixture: ComponentFixture<ProductsSoonToExpireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsSoonToExpireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsSoonToExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
