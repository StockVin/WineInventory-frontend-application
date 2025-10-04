import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {AuthenticationService} from '../../../authentication/services/user.service';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent {
  isExpanded = false;
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  constructor( private authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  onLogout() {
    this.authenticationService.signOut();
  }

}