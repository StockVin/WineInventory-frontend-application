import { Routes } from '@angular/router';

const SignInComponent = () => import('./authentication/pages/sign-in/sign-in.component').then(m => m.SignInComponent);
const SignUpComponent = () => import('./authentication/pages/sign-up/sign-up.component').then(m => m.SignUpComponent);
const DashboardComponent = () => import('./shared/presentation/view/dashboard/dashboard.component').then(m => m.DashboardComponent);
const OrdersComponent = () => import('./orders/pages/orders/orders.component').then(m => m.OrdersComponent);
const PageNotFoundComponent = () => import('./shared/presentation/view/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const NewOrderComponent = () => import('./orders/pages/new-order/new-order.component').then(m => m.NewOrderComponent);
const OrderDetailComponent = () => import('./orders/pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent);
const ReportsComponent = () => import('./reporting/pages/report-dashboard/report-dashboard.component').then(m => m.ReportDashboardComponent);
const ReportCreateComponent = () => import('./reporting/pages/report-create/report-create.component').then(m => m.ReportCreateComponent);
const CareGuidesComponent = () => import('./reporting/pages/careguide-dashboard/careguide-dashboard.component').then(m => m.CareguideDashboardComponent);
const CareGuidesCreateComponent = () => import('./reporting/pages/careguide-create/careguide-create.component').then(m => m.CareguideCreateComponent);
const baseTitle = 'WineInventory';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadComponent: SignInComponent, data: { title: `${baseTitle} | Sign In` } },
  { path: 'sign-up', loadComponent: SignUpComponent, data: { title: `${baseTitle} | Sign Up` } },
  { path: 'dashboard',loadComponent: DashboardComponent,children: [{ path: '', redirectTo: 'home', pathMatch: 'full' },]},
  { path: 'reports', children: [
    { path: '', loadComponent: ReportsComponent },
    { path: 'report-create', loadComponent: ReportCreateComponent },
    { path: 'careguides', loadComponent: CareGuidesComponent },
    { path: 'careguides/create', loadComponent: CareGuidesCreateComponent },
  ], data: { title: `${baseTitle} | Reports` } },
  { path: 'orders', children:[
    { path:'',loadComponent: OrdersComponent,},
    { path:'new',loadComponent: NewOrderComponent,},
    { path:':id/details',loadComponent: OrderDetailComponent,}
  ], data: { title: `${baseTitle} | Orders` } },
  { path: '**', loadComponent: PageNotFoundComponent, data: { title: `${baseTitle} | Page Not Found` } }
];
