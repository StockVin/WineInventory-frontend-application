import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

  unavailableRoute: string = '';

  constructor(private router: Router) {
    this.unavailableRoute = this.router.url;
  }

  goToLogin() {
    this.router.navigate(['/sign-in']);
  }
}
