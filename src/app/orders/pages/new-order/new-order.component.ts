import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersService } from '../../services/orders.service';
import { DeliveryInformation, NewOrderInput, OrderStatus } from '../../models/order.entity';
import { SideNavbarComponent } from "../../../shared/presentation/components/side-navbar/side-navbar.component";
import { LanguageSwitcher } from "../../../shared/presentation/components/language-switcher/language-switcher.component";

interface OrderFormItemValue {
  productId: number | null;
  productName: string | null;
  unitPrice: number | null;
  quantity: number | null;
}

interface OrderFormValue {
  buyerId: number | null;
  customerEmail: string | null;
  notes: string | null;
  status: OrderStatus | null;
  currency: string | null;
  deliveryDate: string | null;
  delivery: DeliveryInformation | null;
  items: OrderFormItemValue[] | null;
}

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CurrencyPipe, SideNavbarComponent, LanguageSwitcher, TranslateModule],

  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  readonly statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    processing: 'En preparación',
    completed: 'Completado',
    cancelled: 'Cancelado'
  };

  readonly statusOptions: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];

  readonly orderForm: FormGroup = this.fb.group(
    {
      buyerId: [this.getDefaultBuyerId(), [Validators.required, Validators.min(1)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      currency: ['USD', Validators.required],
      notes: [''],
      status: ['pending', Validators.required],
      deliveryDate: [this.toDateTimeLocalInput(this.addDays(new Date(), 4)), Validators.required],
      delivery: this.fb.group({
        recipientName: ['', Validators.required],
        contactPhone: ['', Validators.required],
        addressLine: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      items: this.fb.array([])
    }
  );

  readonly orderPreview$ = this.orderForm.valueChanges.pipe(
    startWith(this.orderForm.value),
    map(value => this.buildPreview(value as OrderFormValue))
  );

  ngOnInit(): void {
    this.addItem();
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null, [Validators.required, Validators.min(1)]],
        productName: ['', Validators.required],
        unitPrice: [0, [Validators.required, Validators.min(0.01)]],
        quantity: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formValue = this.orderForm.value as OrderFormValue;
    const rawItems = (formValue.items ?? []) as OrderFormItemValue[];
    const items = rawItems.map(item => ({
      productId: Number(item?.productId ?? 0),
      productName: String(item?.productName ?? ''),
      quantity: Number(item?.quantity ?? 1),
      unitPrice: Number(item?.unitPrice ?? 0)
    }));

    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = Math.round(subtotal * 0.19 * 100) / 100;

    const payload: NewOrderInput = {
      buyerId: Number(formValue.buyerId ?? 0),
      customerEmail: formValue.customerEmail!,
      currency: formValue.currency!,
      delivery: {
        recipientName: formValue.delivery?.recipientName ?? '',
        contactPhone: formValue.delivery?.contactPhone ?? '',
        addressLine: formValue.delivery?.addressLine ?? '',
        city: formValue.delivery?.city ?? '',
        state: formValue.delivery?.state ?? '',
        postalCode: formValue.delivery?.postalCode ?? '',
        country: formValue.delivery?.country ?? ''
      },
      deliveryDate: this.toIsoString(formValue.deliveryDate!),
      status: formValue.status!,
      taxAmount,
      notes: formValue.notes ?? undefined,
      items
    };

    this.ordersService.createOrder(payload).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: error => console.error('No se pudo crear la orden.', error)
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  private buildPreview(formValue: OrderFormValue) {
    const rawItems = (formValue.items ?? []) as OrderFormItemValue[];
    const items = rawItems.map(item => {
      const quantity = Number(item?.quantity ?? 0);
      const unitPrice = Number(item?.unitPrice ?? 0);
      return {
        name: item?.productName ?? 'Sin nombre',
        quantity,
        unitPrice,
        total: quantity * unitPrice
      };
    });

    const subtotal = items.reduce((acc: number, item) => acc + item.total, 0);
    const tax = Math.round(subtotal * 0.19 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return {
      items,
      subtotal,
      tax,
      total
    };
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private toDateTimeLocalInput(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private toIsoString(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('La fecha proporcionada no es válida.');
    }
    return date.toISOString();
  }

  private getDefaultBuyerId(): number {
    const raw = localStorage.getItem('accountId');
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }
}
