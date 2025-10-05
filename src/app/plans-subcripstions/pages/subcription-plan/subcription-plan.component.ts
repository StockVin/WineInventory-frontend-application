import { Component } from '@angular/core';
import {ToolBarComponent} from '../../../public/services/components/tool-bar/tool-bar.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-plan',
  imports: [
    ToolBarComponent,
    TranslatePipe
  ],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.css',

})
export class SubcriptionPlanComponent {

}