import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {Zone} from '../model/zone.entity';
import {environment} from '../../../environments/environment';

const zoneResourceEndpointPath = environment.zonesEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class ZoneService extends BaseService<Zone>{

  constructor() {
    super();
    this.resourceEndpoint = zoneResourceEndpointPath;
  }
}
