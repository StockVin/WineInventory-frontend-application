import { Routes } from '@angular/router';


const SignInComponent = () => import('./authentication/pages/sign-in/sign-in.component').then(m => m.SignInComponent);
const SignUpComponent = () => import('./authentication/pages/sign-up/sign-up.component').then(m => m.SignUpComponent);
const PageNotFoundComponent = () => import('./shared/presentation/view/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)


const baseTitle = 'WineInventory';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadComponent: SignInComponent, data: { title: `${baseTitle} | Sign In` } },
  { path: 'sign-up', loadComponent: SignUpComponent, data: { title: `${baseTitle} | Sign Up` } },
  { path: '**', loadComponent: PageNotFoundComponent, data: { title: `${baseTitle} | Page Not Found` } }
];
