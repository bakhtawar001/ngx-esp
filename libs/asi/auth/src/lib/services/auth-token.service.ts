import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthSession } from '../types';

const EXPIRATION_OFFSET_MS = 2 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private readonly session$ = new BehaviorSubject<AuthSession | null>(null);

  get isExpired() {
    const now = Date.now();
    const expirationDate = this.session$.value?.expires_at;

    return expirationDate != null
      ? now >= expirationDate - EXPIRATION_OFFSET_MS
      : true;
  }

  get refreshToken(): string {
    return this.session$.value?.refresh_token ?? '';
  }

  get token(): string {
    return this.session$.value?.access_token ?? '';
  }

  getToken() {
    return this.session$.pipe(map((session) => session?.access_token));
  }

  reset(session: AuthSession | null = null) {
    this.session$.next(session);
  }
}
