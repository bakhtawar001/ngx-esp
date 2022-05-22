import { IUser } from '@cosmos/common';
import { EspUserProfile } from './user-profile';

export class User implements EspUserProfile, IUser {
  Id: number;
  Name: string;
  GivenName: string;
  FamilyName: string;
  CompanyName: string;
  AsiNumber: string;
  GravatarHash: string;
  Permissions: string[];
  CompanyId?: number;
  IsAdmin: boolean;
  IsCorporate?: boolean;
  IsDistributor?: boolean;
  IsInternal?: boolean;
  IsSupplier?: boolean;
  UserName: string;
  ContactId: number;
  LoginEmail?: string;
  Email: string;
  TenantCode: string;
  TenantId: number;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get displayName(): string {
    return this.Name;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  hasPermission(permission: string, namespace = 'Permission') {
    return (
      this.Permissions?.length &&
      this.Permissions.includes(`${namespace}:${permission}`)
    );
  }

  hasCapability = (role: string) => this.hasPermission(role, 'Capability');
  hasRole = (role: string) => this.hasPermission(role, 'Role');
}
