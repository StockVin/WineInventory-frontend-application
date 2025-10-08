import { Routes } from '@angular/router';

const ProfileComponent = () =>import('./profile/pages/profile/profile.component').then(m => m.ProfileComponent);
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
const ProfileEditComponent = () => import('./profile/components/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent);
const InventoryComponent = () => import('./inventory/pages/inventory/inventory.component').then(m => m.InventoryComponent);
const AuthGuard = () => import('./authentication/services/auth.guard').then(m => m.AuthGuard);

const baseTitle = 'WineInventory';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadComponent: SignInComponent, data: { title: `${baseTitle} | Sign In` } },
  { path: 'sign-up', loadComponent: SignUpComponent, data: { title: `${baseTitle} | Sign Up` } },
  { path: 'dashboard', loadComponent: DashboardComponent, canActivate: [AuthGuard], children: [{ path: '', redirectTo: 'home', pathMatch: 'full' },] },
  { path: 'reports', canActivate: [AuthGuard], children: [
    { path: '', loadComponent: ReportsComponent },
    { path: 'report-create', loadComponent: ReportCreateComponent },
    { path: 'careguides', loadComponent: CareGuidesComponent },
    { path: 'careguides/create', loadComponent: CareGuidesCreateComponent },
  ], data: { title: `${baseTitle} | Reports` } },
  { path: 'orders', canActivate: [AuthGuard], children: [
    { path: '', loadComponent: OrdersComponent },
    { path: 'new', loadComponent: NewOrderComponent },
    { path: ':id/details', loadComponent: OrderDetailComponent }
  ], data: { title: `${baseTitle} | Orders` } },
  { path: 'alerts', canActivate: [AuthGuard], children: [
    { path: '', loadComponent: AlertsComponent }
  ], data: { title: `${baseTitle} | Alerts` } },
  { path: 'profile', canActivate: [AuthGuard], children: [
    { path: '', loadComponent: ProfileComponent, data: { title: `${baseTitle} | Profile` } },
    { path: 'edit', loadComponent: ProfileEditComponent, data: { title: `${baseTitle} | Profile Edit` } },
    { path: 'account', loadComponent: ProfileComponent, data: { title: `${baseTitle} | Profile Account` } },
    { path: 'benefits', loadComponent: ProfileComponent, data: { title: `${baseTitle} | Profile Benefits` } },
  ], data: { title: `${baseTitle} | Profile` } },
  { path: 'inventory', canActivate: [AuthGuard], children: [
    { path: '', loadComponent: InventoryComponent, data: { title: `${baseTitle} | Inventory` } },
    { path: 'create', loadComponent: InventoryComponent, data: { title: `${baseTitle} | Inventory Create` } },
    { path: ':id/details', loadComponent: InventoryComponent, data: { title: `${baseTitle} | Inventory Details` } },
  ], data: { title: `${baseTitle} | Inventory` } },
  { path: '**', loadComponent: PageNotFoundComponent, data: { title: `${baseTitle} | Page Not Found` } }
];
