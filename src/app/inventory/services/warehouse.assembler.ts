import {WarehouseResource} from './warehouse.response';
import {Warehouse} from '../model/warehouse.entity';

export class WarehouseAssembler {
  static toEntityFromResource(resource: WarehouseResource): Warehouse {
    return new Warehouse(
      resource.warehouseId,
      resource.name,
      resource.street,
      resource.city,
      resource.district,
      resource.postalCode,
      resource.country,
      resource.maxTemperature,
      resource.minTemperature,
      resource.capacity,
      resource.imageUrl,
      resource.accountId
    );
  }

  static toEntitiesFromResources(resources: WarehouseResource[]): Warehouse[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
