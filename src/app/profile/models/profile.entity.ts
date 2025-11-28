
export interface AccountStatus {
  planName: string;
  renewalDate: string;
  supportContact: string;
  statusLabel: string;
}

export interface Profile {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  username: string;
  avatarUrl?: string;
  accountStatus: AccountStatus;
  selectedPlanId: string;
  lastUpdated?: string;
}

export interface SubscriptionPlan {
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

export interface ProfileUpdateInput {
  fullName?: string;
  email?: string;
  username?: string;
  phone?: string;
  location?: string;
  role?: string;
  avatarUrl?: string;
  accountStatus?: Partial<AccountStatus>;
  selectedPlanId?: string;
  lastUpdated?: string;
}
