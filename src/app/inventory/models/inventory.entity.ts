import {Zone} from './zone.entity';
import {Product} from './product.entity';
import {v4 as uuid} from 'uuid';
import {Money} from '../../shared/model/money';
import {DateTime} from '../../shared/model/date-time';
import {Currency} from '../../shared/model/currency';

/**
 * Represents the actual state of alert of the Inventory.
 */
export type AlertLevels = "CRITICAL" | "RISKY" | "NORMAL";

const penCurrencyCode = "PEN" as const;
const penCurrency = new Currency(penCurrencyCode);

/**
 * Represents an Inventory in the system.
 */
export class Inventory {
  id: string;
  zone: Zone;
  totalQuantity: number;
  alertLevel: AlertLevels;
  products: Array<Product>;
  profileId: string;

  /**
   * Creates a new Inventory instance.
   * @param inventory {Inventory} - The Object that contains the data to create the Inventory instance.
   */
  constructor(inventory: {
    zone: Zone;
    totalQuantity: number;
    products: Array<Product>;
    profileId: string;
  }) {

    // Validation
    if (!inventory.profileId || inventory.profileId.trim() === "") {
      throw new Error("Provider ID cannot be empty");
    }

    if (!(inventory.totalQuantity) && inventory.totalQuantity < 0) {
      throw new Error('Inventory cannot have a negative quantity of products.');
    }

    this.id = uuid();
    this.zone = inventory.zone;
    this.totalQuantity = inventory.totalQuantity;
    this.alertLevel = "NORMAL";
    this.products = inventory.products || [];
    this.profileId = inventory.profileId;
  }

  public addProduct(
    name: string,
    unitPriceAmount: number,
    content: number,
    expirationDate: DateTime,
    productType: string,
    currentStock: number,
    minimumStock: number,
    providerId: string): void {

    const unitPrice = new Money(unitPriceAmount, penCurrency);
    const product: Product = new Product({name, unitPrice, content, expirationDate, productType, currentStock, minimumStock, providerId});
    this.products.push(product);
    this.totalQuantity++;
  }

  public updateProduct(productId: string, name: string, unitPriceAmount: number, content: number): void {
    if (productId) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == productId) {
          this.products[i].updateInfo(name, new Money(unitPriceAmount, penCurrency), content);
        } else {
          throw new Error("Product not found.");
        }
      }
    } else {
      throw new Error("ProductId cannot be empty.");
    }
  }

  //
  public deleteProduct(productId: string): void {
    if (productId) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == productId) {
          this.products.splice(i, 1);
          this.totalQuantity--;
        } else {
          throw new Error("Product not found.");
        }
      }
    } else {
      throw new Error("ProductId cannot be empty.");
    }
  }

  public updateTotalStock(amount: number): void {
    if (amount && !(amount === 0)) {
      this.totalQuantity += amount;
    } else {
      throw new Error("Enter an amount that is not null.")
    }
  }

  public setAlertLevel(level: AlertLevels): void {
    this.alertLevel = level;
  }

  public getAlertLevel(): string {
    return this.alertLevel;
  }

  public getStock(): number {
    return this.products.length;
  }

  //TO-DO: Complete get methods.
}
