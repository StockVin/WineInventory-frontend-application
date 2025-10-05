import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCreateAndEditComponent } from './warehouse-create-and-edit.component';

describe('WarehouseCreateAndEditComponent', () => {
  let component: WarehouseCreateAndEditComponent;
  let fixture: ComponentFixture<WarehouseCreateAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseCreateAndEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseCreateAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
