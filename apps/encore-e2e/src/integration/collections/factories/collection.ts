import { Collection } from '@esp/collections';

export const generateCollection = (data?: Partial<Collection>): Collection => ({
  Emoji: ':package:',
  Name: 'collectionName',
  Description: 'collectionName description',
  Status: 'Active',
  Products: [],
  Collaborators: [],
  IsEditable: true,
  IsVisible: true,
  ...data,
});
