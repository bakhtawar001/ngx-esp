export interface ResetPassword {
  newPassword: string; // These is an optional parameter for only new user reset password change.
  templateCode: string;
  applicationName?: string;
  oldPassword?: string;
}

export interface ResetKeys {
  primaryEmail: string;
  applicationName: string;
  templateCode: string;
  resetPasswordUrlTemplate?: string;
}

export interface AnonymousResetPassword extends ResetKeys {
  resetKey: string;
  password: string;
  customerSupportPhoneNumber?: string;
}
