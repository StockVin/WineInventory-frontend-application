export class Warehouse {
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
  constructor(
    warehouseId: number,
    name: string,
    street: string,
    city: string,
    district: string,
    postalCode: string,
    country: string,
    maxTemperature: number,
    minTemperature: number,
    capacity: number,
    imageUrl: string,
    accountId: number = 0
  ) {
    this.warehouseId = warehouseId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.street = street;
    this.city = city;
    this.district = district;
    this.postalCode = postalCode;
    this.country = country;
    this.maxTemperature = maxTemperature;
    this.minTemperature = minTemperature;
    this.capacity = capacity;
    this.accountId = accountId;
  }

}
