
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { finalize, filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanBenefitsComponent } from '../../components/plan-benefits/plan-benefits.component';
import { PlanDetailsComponent } from '../../components/plan-details/plan-details.component';
import { ProfileEditComponent, ProfileFormValue } from '../../components/profile-edit/profile-edit.component';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { AccountStatus, Profile, ProfileUpdateInput, SubscriptionPlan } from '../../models/profile.entity';
import { UserService } from '../../../authentication/services/user.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SideNavbarComponent } from "../../../shared/presentation/components/side-navbar/side-navbar.component";
import { LanguageSwitcher } from "../../../shared/presentation/components/language-switcher/language-switcher.component";
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    PlanDetailsComponent,
    SideNavbarComponent,
    LanguageSwitcher,
    TranslateModule
  ]
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly profile = signal<Profile | null>(null);
  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly premiumBenefits = signal<string[]>([]);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly updateError = signal<string | null>(null);
  readonly isSettingsView = signal(false);
  readonly isProfileView = computed(() => !this.isSettingsView() && !this.isAccountView() && !this.isBenefitView());
  readonly isAccountView = computed(() => this.currentRoute().includes('/profile/account'));
  readonly isBenefitView = computed(() => this.currentRoute().includes('/profile/benefit'));

  private currentRoute = signal('');

  readonly overviewAvatarError = signal(false);

  readonly accountStatus = computed<AccountStatus | null>(() => this.profile()?.accountStatus ?? null);
  readonly selectedPlanId = computed<string | null>(() => this.profile()?.selectedPlanId ?? null);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userData: UserProfile = {
    id: 0,
    username: '',
    email: '',
    role: ''
  };

  constructor() {
    this.profile.set(null);
    this.plans.set([]);
    this.premiumBenefits.set([]);

    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed())
      .subscribe(profile => {
        if (profile) {
          this.profile.set(profile);
          this.overviewAvatarError.set(false);
          console.log('Perfil actualizado desde servicio:', profile);
        }
      });

    this.profileService
      .getPlans()
      .pipe(takeUntilDestroyed())
      .subscribe(plans => {
        this.plans.set(plans);
        console.log('Planes actualizados desde servicio:', plans);
      });

    this.profileService
      .getPremiumBenefits()
      .pipe(takeUntilDestroyed())
      .subscribe(benefits => this.premiumBenefits.set(benefits));

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => this.evaluateView(event.urlAfterRedirects));

    this.evaluateView(this.router.url);
  }

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    console.log('Usuario actual encontrado:', currentUser);

    const userProfile = this.userService.getCurrentUserProfile();
    if (userProfile) {
      this.profile.set(userProfile);
      console.log('Perfil inicial establecido desde servicio de usuario:', userProfile);
    } else {
      console.error('No se pudo obtener el perfil del usuario desde el servicio');
    }

    const currentPlans = this.plans();
    console.log('Planes actuales en el componente:', currentPlans);
    console.log('Número de planes actuales:', currentPlans.length);

    this.fetchInitialData();
  }

  fetchInitialData(): void {
    this.isLoading.set(true);

    this.profileService
      .refreshAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          console.log('Datos iniciales cargados exitosamente:', data);
          console.log('Planes después de refreshAll:', this.plans());
          console.log('Número de planes:', this.plans().length);
          this.plans.set([...this.plans()]);
        },
        error: (error) => {
          console.error('Error cargando datos iniciales:', error);
        }
      });
  }

  handleProfileSave(formValue: ProfileFormValue): void {
    this.updateError.set(null);
    this.isSaving.set(true);

    this.profileService
      .updateProfile({
        ...formValue,
        lastUpdated: new Date().toISOString()
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => this.goToProfile(),
        error: () =>
          this.updateError.set('We could not save your changes at this time. Please try again later.')
      });
  }

  handleCancelEdit(): void {
    this.updateError.set(null);
    this.goToProfile();
  }

  handlePlanSelected(planId: string): void {
    console.log('Plan seleccionado:', planId, 'Plan actual:', this.selectedPlanId());

    if (this.selectedPlanId() === planId) {
      console.log('El plan seleccionado es el mismo que el actual, ignorando');
      return;
    }

    const payload = this.buildPlanUpdatePayload(planId);
    if (!payload) {
      console.error('No se pudo construir el payload para actualizar el plan');
      return;
    }

    console.log('Payload construido:', payload);

    this.updateError.set(null);
    this.isSaving.set(true);

    this.profileService
      .updateProfile(payload)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (updatedProfile) => {
          console.log('Perfil actualizado exitosamente:', updatedProfile);

          const normalizedProfile: Profile = {
            id: this.profile()?.id || '',
            fullName: updatedProfile.fullName || this.profile()?.fullName || '',
            email: updatedProfile.email || this.profile()?.email || '',
            username: updatedProfile.username || this.profile()?.username || '',
            phone: updatedProfile.phone || this.profile()?.phone || '',
            location: updatedProfile.location || this.profile()?.location || '',
            role: this.profile()?.role || '',
            avatarUrl: updatedProfile.avatarUrl || this.profile()?.avatarUrl,
            accountStatus: updatedProfile.accountStatus || this.profile()?.accountStatus || {
              planName: 'Free',
              renewalDate: new Date().toISOString(),
              supportContact: 'soporte@wineinventory.com',
              statusLabel: 'Activo'
            },
            selectedPlanId: planId,
            lastUpdated: new Date().toISOString()
          };

          this.profile.set(normalizedProfile);
          console.log('Estado del perfil actualizado:', normalizedProfile);
        },
        error: (error) => {
          console.error('Error actualizando plan:', error);
          this.updateError.set('We could not update your selected plan at this time. Please try again later.');
        }
      });
  }

  private buildPlanUpdatePayload(planId: string): ProfileUpdateInput | null {
    const currentProfile = this.profile();
    if (!currentProfile) {
      console.error('No hay perfil actual para construir el payload');
      return null;
    }

    console.log('Construyendo payload para plan:', planId, 'con perfil actual:', currentProfile);

    const payload: ProfileUpdateInput = {
      fullName: currentProfile.fullName,
      email: currentProfile.email,
      username: currentProfile.username,
      phone: currentProfile.phone,
      location: currentProfile.location,
      role: currentProfile.role,
      avatarUrl: currentProfile.avatarUrl,
      selectedPlanId: planId,
      lastUpdated: new Date().toISOString()
    };

    const nextStatus = this.profileService.buildAccountStatusForPlan(planId);
    if (nextStatus) {
      payload.accountStatus = nextStatus;
      console.log('Estado de cuenta calculado:', nextStatus);
    }

    console.log('Payload final construido:', payload);
    return payload;
  }

  private evaluateView(url: string): void {
    this.currentRoute.set(url);
    this.isSettingsView.set(url.includes('/profile/settings'));
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToAccount(): void {
    this.router.navigate(['/profile/account']);
  }

  goToBenefits(): void {
    this.router.navigate(['/profile/benefit']);
  }

  goToSettings(): void {
    this.router.navigate(['/profile/edit'], {
      state: { profile: this.profile() }
    });
  }

  computeInitials(fullName: string): string {
    if (!fullName) {
      return 'US';
    }

    const initials = fullName
      .split(' ')
      .filter(part => part.trim().length > 0)
      .slice(0, 2)
      .map(part => part.trim().charAt(0).toUpperCase())
      .join('');

    return initials || fullName.charAt(0).toUpperCase();
  }

  handleOverviewAvatarError(): void {
    this.overviewAvatarError.set(true);
  }
}

