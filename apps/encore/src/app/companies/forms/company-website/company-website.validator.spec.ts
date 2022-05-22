import { CompanyWebsiteValidator } from './company-website.validator';

type ControlState = { pristine?: boolean; dirty?: boolean; invalid?: boolean };

const formFactory = (args: {
  Url?: ControlState;
  IsPrimary?: ControlState;
}) => {
  return {
    controls: {
      Url: {
        pristine: args?.Url?.pristine ?? false,
        dirty: args?.Url?.dirty ?? false,
        invalid: args?.Url?.invalid ?? false,
      },
      IsPrimary: {
        pristine: args?.IsPrimary?.pristine ?? false,
        dirty: args?.IsPrimary?.dirty ?? false,
        invalid: args?.IsPrimary?.invalid ?? false,
      },
    },
  };
};

describe('CompanyWebsiteValidator', () => {
  it('should be invalid when Url invalid', () => {
    const form = formFactory({
      Url: { invalid: true },
    });

    expect(CompanyWebsiteValidator(form as any)).toEqual({ invalid: true });
  });

  it('should be invalid when Url is dirty and invalid', () => {
    const form = formFactory({
      Url: { dirty: true, invalid: true },
    });

    expect(CompanyWebsiteValidator(form as any)).toEqual({ invalid: true });
  });

  it('should be invalid when IsPrimary is dirty, Url is invalid', () => {
    const form = formFactory({
      IsPrimary: { dirty: true },
      Url: { invalid: true },
    });

    expect(CompanyWebsiteValidator(form as any)).toEqual({ invalid: true });
  });

  it('should be valid when Url is valid', () => {
    const form = formFactory({
      Url: { invalid: false },
    });

    expect(CompanyWebsiteValidator(form as any)).toBe(null);
  });
});
