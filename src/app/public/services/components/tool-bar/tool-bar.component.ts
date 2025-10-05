import {Component, Input} from '@angular/core';
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {MatToolbar} from "@angular/material/toolbar";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-tool-bar',
  imports: [
    LanguageSwitcherComponent,
    MatToolbar,
    TranslatePipe
  ],
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {
  @Input() titleKey: string = '';
}