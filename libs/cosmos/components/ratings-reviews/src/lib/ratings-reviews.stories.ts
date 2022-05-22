import { CosRatingsReviewsComponent } from './ratings-reviews.component';
import data from './ratings-reviews.data.json';
import markdown from './ratings-reviews.md';
import { CosRatingsReviewsModule } from './ratings-reviews.module';

export default {
  title: 'Layout Examples/Ratings and Reviews',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    imports: [CosRatingsReviewsModule],
    declarations: [],
  },
  component: CosRatingsReviewsComponent,
  props: {
    headingText: 'Ratings and Reviews',
    overallHeadingText: 'Overall Rating',
    categoryLabels: {
      OverAll: 'Overall',
      Quality: 'Quality',
      Communication: 'Communication',
      Delivery: 'Delivery',
      ConflictResolution: 'Problem Resolution',
      Decoration: 'Imprinting',
    },
    reviewsHeadingText: 'Reviews',
    transactionsLabel: 'Transactions',
    overallSpecificationString:
      'Based on ${reportsLabel} reports and ${transactionsLabel} transactions',
    rateButtonLabel: 'Rate this supplier',
    viewMoreButtonLabel: 'View more reviews',
    reportsLabel: 'Reports',
    data: data,
  },
});
