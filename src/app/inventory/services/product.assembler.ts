import { ProductResource } from './product.response';
import { Product } from '../model/product.entity';

export class ProductAssembler {
  static toEntityFromResource(resource: ProductResource): Product {
    return new Product(
      resource.id,
      resource.name,
      resource.liquorType,
      resource.brandName,
      resource.unitPriceAmount,
      resource.minimumStock,
      resource.imageUrl
    );
  }

  static toEntitiesFromResources(resources: ProductResource[]): Product[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
