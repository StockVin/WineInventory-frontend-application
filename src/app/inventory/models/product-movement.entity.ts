import {v4 as uuid } from 'uuid';
import {DateTime} from '../../shared/model/date-time';

const Types: string[] = ["Purchase", "Donation", "Loss", "Internal-Consumption"]

/**
 * Represents a Product Movement in the system to sign-up the exit of a product from the inventory.
 */
export class ProductMovement {
  id: string;
  productId: string;
  movementType: string;
  productAmount: number;
  movementDate: DateTime;

  constructor(productMovement:{
    productId: string,
    movementType: string,
    productAmount: number,
    movementDate: DateTime
  }) {

    // Validation
    if (!(Types.includes(productMovement.movementType))) {
      throw new Error("Invalid Movement type.");
    }

    if (productMovement.productAmount <= 0) {
      throw new Error("Product amount must be more than 0.");
    }

    this.id = uuid();
    this.productId = productMovement.productId || '';
    this.movementType = productMovement.movementType || '';
    this.productAmount = productMovement.productAmount || 0;
    this.movementDate = productMovement.movementDate || null;
  }

  // IDEA: Can make an array of products like [{product, quantity}, {product, quantity}]
}
