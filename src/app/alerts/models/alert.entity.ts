export interface AlertEntity {
      id: string;
  title: string;
  message: string;
  severity: 'WARNING' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'PRODUCTLOWSTOCK' | 'EXPIRATION_WARNING';
  productId: string;
  warehouseId: string;
  state: string;
}
