import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrustHtmlPipeModule } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { AuthFacade } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  LicenseAgreement,
  LoginService,
  PermissionService,
} from '@smartlink/auth';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LicenseAgreementFormModel {
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  signature: string;
}

@UntilDestroy()
@Component({
  selector: 'esp-license-agreement',
  templateUrl: './license-agreement.page.html',
  styleUrls: ['./license-agreement.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseAgreementPage extends FormGroupComponent<LicenseAgreementFormModel> {
  licenseAgreement$: Observable<LicenseAgreement> = this.getLicenseAgreement();

  constructor(
    private _authFacade: AuthFacade,
    protected loginService: LoginService,
    private _router: Router,
    private permissionService: PermissionService
  ) {
    super();
  }

  get email() {
    return this._authFacade.user.Email;
  }
  get firstName() {
    return this._authFacade.user.GivenName;
  }
  get lastName() {
    return this._authFacade.user.FamilyName;
  }

  saveConsent(): void {
    if (this.form.invalid) return;

    this.loginService
      .saveLicenseAgreement(this.form.controls?.signature?.value)
      .pipe(
        tap(() => {
          if (this.permissionService.resetPassword) {
            this._router.navigate(['/auth/resetpassword']);
          } else {
            this.permissionService.resetPermissions();
            this._router.navigate(['/home']);
          }
        }),
        catchError(() => {
          return EMPTY;
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  cancelConsent(): void {
    this._authFacade.logout();
  }

  protected override createForm() {
    return this._fb.group<LicenseAgreementFormModel>({
      termsAccepted: [false, [Validators.requiredTrue]],
      privacyPolicyAccepted: [false, [Validators.requiredTrue]],
      signature: ['', [Validators.required]],
    });
  }

  private getLicenseAgreement(): Observable<LicenseAgreement> {
    return this.loginService.getLicenseAgreement().pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }

  print(): void {
    window.print();
  }
}

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: LicenseAgreementPage }]),
    CosFormFieldModule,
    CosCheckboxModule,
    CosButtonModule,
    CosInputModule,
    CommonModule,
    ReactiveFormsModule,
    TrustHtmlPipeModule,
  ],
  declarations: [LicenseAgreementPage],
})
export class LicenseAgreementPageModule {}
