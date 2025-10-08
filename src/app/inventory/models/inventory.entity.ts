export type LiquorType = 'Vino' | 'Destilado' | 'Cerveza' | 'Licores' | 'Licor Anisado';

export interface InventoryItemProps {
    id: string;
    name: string;
    type: LiquorType;
    price: number;
    expirationDate?: Date; 
    currentStock: number;
    minStockLevel: number;
    location: string;
    imageUrl: string;
}

export class InventoryItem {
    private props: InventoryItemProps;

    constructor(props: InventoryItemProps) {
        this.props = { 
            ...props, 
            location: props.location || 'Almacén general', 
            imageUrl: props.imageUrl || ''
        };
    }
    
    get toPrimitives(): InventoryItemProps {
        return { 
            ...this.props, 
            expirationDate: this.props.expirationDate?.toISOString().split('T')[0] as any 
        };
    }
}