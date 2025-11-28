export interface Plan {
  planId: string;
  paypalPlanId: string | null;
  paypalSubscriptionId: string | null;
  planType: string;
  description: string;
  paymentFrequency: string;
  price: number;
  currency: string;
  maxProducts: number;
}