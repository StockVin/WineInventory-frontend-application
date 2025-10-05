import { Routes } from '@angular/router';

const SignInComponent = () =>
  import('./authentication/pages/sign-in/sign-in.component').then(m => m.SignInComponent);
const SignUpComponent = () =>
  import('./authentication/pages/sign-up/sign-up.component').then(m => m.SignUpComponent);
const DashboardComponent = () =>
  import('./shared/presentation/view/dashboard/dashboard.component').then(m => m.DashboardComponent);
const PageNotFoundComponent = () =>
  import('./shared/presentation/view/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ProfileComponent = () =>
  import('./profile/pages/profile/profile.component').then(m => m.ProfileComponent);
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
const AlertsComponent = () => import('./alerts/pages/alerts/alerts.component').then(m => m.AlertsComponent);
const baseTitle = 'WineInventory';

export const routes: Routes = [
  // Home -> Sign In
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },

  { path: 'sign-in', loadComponent: SignInComponent, data: { title: `${baseTitle} | Sign In` } },
  { path: 'sign-up', loadComponent: SignUpComponent, data: { title: `${baseTitle} | Sign Up` } },
  // Redirecciones fuera de dashboard hacia rutas canónicas dentro de dashboard
  { path: 'profile', redirectTo: 'dashboard/profile', pathMatch: 'full' },
  { path: 'profile/settings', redirectTo: 'dashboard/profile/settings', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: DashboardComponent,
    children: [
      // Por defecto dentro de dashboard: ve al resumen de perfil
      { path: '', redirectTo: 'profile', pathMatch: 'full' },

      // Rutas reales
      { path: 'profile', loadComponent: ProfileComponent, data: { title: `${baseTitle} | Profile` } },
      { path: 'profile/settings', loadComponent: ProfileComponent, data: { title: `${baseTitle} | Profile Settings` } },

      // Alias /dashboard/settings -> /dashboard/profile/settings
      { path: 'settings', redirectTo: 'profile/settings', pathMatch: 'full' },

      // Cualquier otra subruta dentro de dashboard -> perfil
      { path: '**', redirectTo: 'profile' }
    ]
  },
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
  { path: 'alerts', children:[
    { path:'',loadComponent: AlertsComponent,}
  ], data: { title: `${baseTitle} | Alerts` } },
  { path: '**', loadComponent: PageNotFoundComponent, data: { title: `${baseTitle} | Page Not Found` } }
];
