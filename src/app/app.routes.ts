import { Routes } from '@angular/router';



const PageNotFoundComponent = () => import('./shared/presentation/view/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)


const baseTitle = 'WineInventory';

export const routes: Routes = [
  { path: '**', loadComponent: PageNotFoundComponent, data: { title: `${baseTitle} | Page Not Found` } }
];
