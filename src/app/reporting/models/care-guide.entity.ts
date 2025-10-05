export class CareGuide {
    name: string;
    type: string;
    description: string;
    imageUrl: string;
  
    constructor(products:{name?: string, type?: string, description?: string, imageUrl?: string}) {
      this.name = products.name || '';
      this.type = products.type || '';
      this.description = products.description || '';
      this.imageUrl = products.imageUrl || '';
    }
}