import type { Entry } from 'contentful';

export interface ContentfulProductEntry {
  id: number;
  title: string;
  description: string;
}

export interface ContentfulTypeaheadEvent {
  article: {
    title: string;
    description: string;
    shortDescription: string;
    footer: string;
    products: ContentfulProductEntry[];
    sponsoredBy: {
      asiNumber: number;
      companyName: string;
    };
  };
  contentfulArticle: Entry<unknown>;
}
