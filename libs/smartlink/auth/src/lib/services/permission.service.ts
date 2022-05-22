/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@angular/core';
import { BrowserStorageService } from '@cosmos/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  //--------------------------------------------------------------------------------------------------------
  //@Private Variables
  //----------------------------------------------------------------------------------------------------------
  private readonly consentStorageKey = 'HasConsent';
  private readonly resetStorageKey = 'ResetRequired';

  /**
   * Constructor
   *
   * @param {BrowserStorageService} browserStorage
   */
  constructor(private browserStorage: BrowserStorageService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get hasConsent(): boolean {
    return this.browserStorage.get(this.consentStorageKey) === 'true';
  }

  get resetPassword(): boolean {
    return this.browserStorage.get(this.resetStorageKey) === 'true';
  }

  set hasConsent(value: boolean) {
    this.browserStorage.set(this.consentStorageKey, value.toString());
  }

  set resetPassword(value: boolean) {
    this.browserStorage.set(this.resetStorageKey, value.toString());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  setPermissions(needConsent: boolean, requiredPasswordReset: boolean) {
    this.hasConsent = !needConsent;
    this.resetPassword = requiredPasswordReset;
  }
  clearPermissions(): void {
    this.browserStorage.remove(this.consentStorageKey);
    this.browserStorage.remove(this.resetStorageKey);
  }

  resetPermissions(): void {
    this.hasConsent = true;
    this.resetPassword = false;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
}
