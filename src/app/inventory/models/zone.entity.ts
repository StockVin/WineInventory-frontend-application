import {v4 as uuid } from 'uuid';

/**
 * Represents a Zone in the system. A Zone is like an inventory that is assigned to different locations in the liquor store.
 */
export class Zone {
  zoneId: string;
  name: string;
  type: string;
  description: string;

  constructor(zone: {
    zoneId?: string,
    name?: string,
    description?: string
    type?: string,
  }) {
    this.zoneId = uuid() || '';
    this.name = zone.name || '';
    this.type = zone.type || '';
    this.description = zone.description || '';
  }
}
