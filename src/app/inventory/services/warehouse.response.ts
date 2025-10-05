export interface WarehouseResource {
  warehouseId: number;
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  maxTemperature: number;
  minTemperature: number;
  capacity: number;
  imageUrl: string;
  accountId: number;
}
