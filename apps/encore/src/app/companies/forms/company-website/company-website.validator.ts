import { FormGroup } from '@cosmos/forms';
import { Website } from '@esp/models';

export function CompanyWebsiteValidator(group: FormGroup<Website>) {
  const urlControl = group.controls.Url;
  const primaryControl = group.controls.IsPrimary;

  if ((urlControl.dirty && urlControl.invalid) || urlControl.invalid) {
    return { invalid: true };
  }

  if (primaryControl.dirty && urlControl.invalid) {
    return { invalid: true };
  }

  return null;
}
