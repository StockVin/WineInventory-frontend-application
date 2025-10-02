import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import { CareGuide } from '../models/care-guide.entity';
import { environment } from '../../../environments/environment';

const careguidesResourceEndpointPath = environment.careguidesEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class CareGuideService  extends BaseService<CareGuide>{
  constructor() {
    super();
    this.resourceEndpoint = careguidesResourceEndpointPath;
  }
}