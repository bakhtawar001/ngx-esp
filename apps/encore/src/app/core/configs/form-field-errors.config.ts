import { ErrorsMap } from '@cosmos/components/form-field';

export const formFieldErrorsConfig: ErrorsMap = {
  email: 'Please provide a valid email address.',
  max: ({ max, actualValue, label }) =>
    label
      ? `Your ${label} must be less than ${max}.`
      : `You must enter less than ${max}.`,
  maxlength: ({ requiredLength, actualLength, label }) =>
    label
      ? `Your ${label} can be no longer than ${requiredLength} characters.`
      : `You must enter at least ${requiredLength} characters.`,
  minlength: ({ requiredLength, actualLength, label }) =>
    label
      ? `Your ${label} must be at least ${requiredLength} characters.`
      : `You must enter less than ${requiredLength} characters.`,
  min: ({ min, actualValue, label }) =>
    label
      ? `Your ${label} must be at least ${min}.`
      : `You must enter at least ${min}.`,
  required: 'You must enter a value.', // 'This field is required.',
  serverError: (error) => error,
};
