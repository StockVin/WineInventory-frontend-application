export interface Order {
  id: number;
  proveedor: string;
  estado: string;
  productos: { nombre: string, cantidad: number }[];
}
