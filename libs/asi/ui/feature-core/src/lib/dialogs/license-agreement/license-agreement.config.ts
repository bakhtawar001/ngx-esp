import { createDialogDef } from '@cosmos/core';
import {
  LicenseAgreementDialogData,
  LicenseAgreementDialogResult,
} from './models';

export const licenseAgreementDialogDef = createDialogDef<
  LicenseAgreementDialogData,
  LicenseAgreementDialogResult
>({
  load: async () =>
    (await import('./license-agreement.dialog')).AsiLicenseAgreementDialog,
  defaultConfig: {
    minWidth: '684px',
    width: '684px',
  },
});
