import { PresentationStatus } from '@esp/models';

// Temporary config. Will be removed when we have working presentation phases
export const toggleOptions = [
  { name: 'PreShare', value: PresentationStatus.PreShare, disabled: false },
  { name: 'PostShare', value: PresentationStatus.PostShare, disabled: false },
  {
    name: 'Quote Requested',
    value: PresentationStatus.QuoteRequested,
    disabled: false,
  },
  {
    name: 'Quote Created',
    value: PresentationStatus.QuoteCreated,
    disabled: false,
  },
];
