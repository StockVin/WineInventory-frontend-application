import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Report } from '../models/report.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<Report> {
  protected override resourceEndpoint = environment.reportingEndpointPath;
}