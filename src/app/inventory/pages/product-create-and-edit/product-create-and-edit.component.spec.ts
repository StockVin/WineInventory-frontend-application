import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateAndEditComponent } from './product-create-and-edit.component';

describe('ProductCreateAndEditComponent', () => {
  let component: ProductCreateAndEditComponent;
  let fixture: ComponentFixture<ProductCreateAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreateAndEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreateAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
