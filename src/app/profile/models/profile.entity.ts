export interface Profile {
  profileId: number;
  name: string;
  email: string;
  businessName: string;
  businessAddress: string;
  role: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}