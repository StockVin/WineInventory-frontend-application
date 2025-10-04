export class Product {
  id: number;
  name: string;
  liquorType: string;
  brandName: string;
  unitPriceAmount: number;
  minimumStock: number;
  imageUrl: string;

  constructor(
    id: number,
    name: string,
    liquorType: string,
    brandName: string,
    unitPriceAmount: number,
    minimumStock: number,
    imageUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.liquorType = liquorType;
    this.brandName = brandName;
    this.unitPriceAmount = unitPriceAmount;
    this.minimumStock = minimumStock;
    this.imageUrl = imageUrl;
  }
}
