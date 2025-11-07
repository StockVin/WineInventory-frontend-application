export class CareGuide {
  id: number;
  guideName: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;

  constructor(resource: { id?: number; name?: string; guideName?: string; type?: string; description?: string; imageUrl?: string }) {
    this.id = resource.id ?? 0;
    this.guideName = resource.guideName ?? resource.name ?? '';
    this.name = resource.name ?? this.guideName;
    this.type = resource.type ?? '';
    this.description = resource.description ?? '';
    this.imageUrl = resource.imageUrl ?? '';
  }
}