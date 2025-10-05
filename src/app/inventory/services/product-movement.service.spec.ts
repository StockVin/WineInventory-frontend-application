import { TestBed } from '@angular/core/testing';

import { ProductMovementService } from './product-movement.service';

describe('ProductMovementService', () => {
  let service: ProductMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
