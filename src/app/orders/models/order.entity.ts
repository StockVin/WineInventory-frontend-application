export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: MoneyAmount;
  lineTotal: MoneyAmount;
}

export interface DeliveryInformation {
  recipientName: string;
  contactPhone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  customerEmail: string;
  status: OrderStatus;
  orderedAt: string;
  deliveryDate: string;
  delivery: DeliveryInformation;
  notes?: string;
  items: OrderItem[];
  subtotalAmount: MoneyAmount;
  taxAmount: MoneyAmount;
  totalAmount: MoneyAmount;
}

export interface NewOrderItemInput {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface NewOrderInput {
  buyerId: number;
  customerEmail: string;
  currency: string;
  delivery: DeliveryInformation;
  deliveryDate: string;
  status: OrderStatus;
  taxAmount: number;
  notes?: string;
  items: NewOrderItemInput[];
}
