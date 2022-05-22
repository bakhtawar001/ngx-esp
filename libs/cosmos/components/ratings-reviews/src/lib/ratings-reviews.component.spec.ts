import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { CosRatingsReviewsComponent } from './ratings-reviews.component';
import { CosRatingsReviewsModule } from './ratings-reviews.module';
import { FeatureFlagsService } from '@cosmos/feature-flags';

describe('CosRatingsReviewsComponent', () => {
  const data = {
    OverAll: {
      Rating: 9,
      Companies: 27,
      Transactions: 80,
    },
    Quality: {
      Rating: 9,
      Companies: 21,
      Transactions: 66,
    },
    Communication: {
      Rating: 9,
      Companies: 20,
      Transactions: 52,
    },
    Delivery: {
      Rating: 9,
      Companies: 20,
      Transactions: 64,
    },
    ConflictResolution: {
      Rating: 7,
      Companies: 7,
      Transactions: 15,
    },
    Decoration: {
      Rating: 10,
      Companies: 14,
      Transactions: 38,
    },
    Comments: [
      {
        Id: 118883,
        Comment:
          'Terrible Customer Service. Refused to send invoice and no one in company can tell me what we were charged for. Avoid at all costs.',
        Distributor: {
          Id: 127134,
          Name: 'Artistic Imprints Inc',
          AsiNumber: '125346',
        },
        CreateDate: '2020-01-15T12:48:00.000',
      },
    ],
  };

  let component: CosRatingsReviewsComponent;
  let spectator: Spectator<CosRatingsReviewsComponent>;

  const createComponent = createComponentFactory({
    component: CosRatingsReviewsComponent,
    imports: [CosRatingsReviewsModule],
    providers: [mockProvider(FeatureFlagsService, { isEnabled: () => true })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { data, overallSpecificationString: 'Test' },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the 5 point rating based on the 10 point rating', () => {
    expect(component.getStarRating(10)).toEqual('5.0');
  });

  it('should check for overal rating value', () => {
    component.data.OverAll = {
      Rating: 10,
      Companies: 73,
      Transactions: 139,
    };
    spectator.detectComponentChanges();
    const overAllRatingElement = spectator.query('.overall-rating-value');
    expect(overAllRatingElement.textContent.trim()).toEqual('5.0');
  });

  it('should show heading text', () => {
    component.headingText = 'Heading Text Test';
    spectator.detectComponentChanges();
    const ratingReviewElement = spectator.query('.cos-ratings-review-heading');
    expect(ratingReviewElement.textContent).toEqual(component.headingText);
  });

  it('Ratings section should be displayed when reviews section is empty', () => {
    component._reviews = [];
    spectator.detectComponentChanges();
    expect(spectator.queryAll('.cos-comment').length).toBe(0);
    expect(spectator.query('.cos-rating-category-section')).toBeTruthy();
  });

  it('Reviews section should be displayed when ratings section is empty', () => {
    component.data = {
      Comments: [
        {
          Id: 118883,
          Comment:
            'Terrible Customer Service. Refused to send invoice and no one in company can tell me what we were charged for. Avoid at all costs.',
          Distributor: {
            Id: 127134,
            Name: 'Artistic Imprints Inc',
            AsiNumber: '125346',
          },
          CreateDate: '2020-01-15T12:48:00.000',
        },
      ],
    };
    spectator.detectComponentChanges();
    expect(spectator.queryAll('.cos-comment').length).toBe(1);
    expect(spectator.query('.cos-rating-category-section')).toBeFalsy();
  });

  describe('Footer', () => {
    it('should not show view more button', () => {
      component.data.Comments = [];
      spectator.detectComponentChanges();
      const supplierFunctions = spectator.query(
        '.cos-reviews-footer > cos-button'
      );
      expect(supplierFunctions).toBeFalsy();
    });
  });

  it('should render overaall rating component', () => {
    component.data.OverAll = {
      Rating: 10,
      Companies: 73,
      Transactions: 139,
    };
    spectator.detectComponentChanges();
    const overallRating = spectator.query('.cos-rating-overall');
    expect(overallRating).toBeTruthy();
    expect(overallRating.getAttribute('ng-reflect-rating')).toBeDefined();
    expect(overallRating.getAttribute('ng-reflect-rating')).toEqual('10');
  });

  it('should render correct other rating component length', () => {
    const otherRatings = spectator.queryAll('.cos-rating-category-section');
    expect(otherRatings.length).toEqual(5);
  });

  it('should render correct other rating component category name', () => {
    component.categoryLabels = {
      OverAll: 'Overall',
      Quality: 'Quality',
      Communication: 'Communication',
      Delivery: 'Delivery',
      ConflictResolution: 'Problem Resolution',
      Decoration: 'Imprinting',
    };
    spectator.detectComponentChanges();
    const otherRatingsCategories = spectator.queryAll(
      '.cos-rating-category-label'
    );
    expect(otherRatingsCategories[0].innerHTML).toContain('Quality');
    expect(otherRatingsCategories[1].innerHTML).toContain('Communication');
    expect(otherRatingsCategories[2].innerHTML).toContain('Delivery');
    expect(otherRatingsCategories[3].innerHTML).toContain('Problem Resolution');
    expect(otherRatingsCategories[4].innerHTML).toContain('Imprinting');
  });

  it('should render correct other rating comapnies count and reports label', () => {
    component.data = data;
    component.reportsLabel = 'Report Label Test Value';
    spectator.detectComponentChanges();
    const otherRatingsCategories = spectator.queryAll('.cos-companies');
    expect(otherRatingsCategories[0].innerHTML).toContain(
      `21 ${component.reportsLabel}`
    );
    expect(otherRatingsCategories[1].innerHTML).toContain(
      `20 ${component.reportsLabel}`
    );
    expect(otherRatingsCategories[2].innerHTML).toContain(
      `20 ${component.reportsLabel}`
    );
    expect(otherRatingsCategories[3].innerHTML).toContain(
      `7 ${component.reportsLabel}`
    );
    expect(otherRatingsCategories[4].innerHTML).toContain(
      `14 ${component.reportsLabel}`
    );
  });

  it('should render correct other rating transactions count and transactions label', () => {
    component.data = data;
    component.transactionsLabel = 'Report Transactional Label Test Value';
    spectator.detectComponentChanges();
    const otherRatingsCategories = spectator.queryAll('.cos-transactions');
    expect(otherRatingsCategories[0].innerHTML).toContain(
      `66 ${component.transactionsLabel}`
    );
    expect(otherRatingsCategories[1].innerHTML).toContain(
      `52 ${component.transactionsLabel}`
    );
    expect(otherRatingsCategories[2].innerHTML).toContain(
      `64 ${component.transactionsLabel}`
    );
    expect(otherRatingsCategories[3].innerHTML).toContain(
      `15 ${component.transactionsLabel}`
    );
    expect(otherRatingsCategories[4].innerHTML).toContain(
      `38 ${component.transactionsLabel}`
    );
  });

  it('should render cos rating for other categories', () => {
    const otherRatingsCategories = spectator.queryAll(
      '.cos-categorical-rating > cos-rating'
    );
    expect(otherRatingsCategories.length).toEqual(5);
  });

  describe('header', () => {
    it('should show overall heading text', () => {
      component.overallHeadingText = 'Overall Heading Text Test';
      spectator.detectComponentChanges();
      const ratingReviewElement = spectator.query(
        '.cos-overall-rating > .cos-ratings-reviews-card-heading'
      );
      expect(ratingReviewElement.textContent).toEqual(
        component.overallHeadingText
      );
    });

    it('should display No ratings for review', () => {
      component.overallHeadingText = 'No Ratings for this supplier yet';
      spectator.detectComponentChanges();
      const ratingReviewElement = spectator.query(
        '.cos-overall-rating > .cos-ratings-reviews-card-heading'
      );
      expect(ratingReviewElement.textContent).toEqual(
        component.overallHeadingText
      );
    });

    it('verify the rate button label', () => {
      component.rateButtonLabel = 'Button label';
      spectator.detectComponentChanges();
      const rateButtonLabel = spectator.query('.cos-flat-button');
      expect(rateButtonLabel?.textContent.trim()).toEqual(
        component.rateButtonLabel
      );
    });

    it('should display rate this supplier as button label', () => {
      component.rateButtonLabel = 'Rate this supplier';
      spectator.detectComponentChanges();
      const rateButtonLabel = spectator.query('.cos-flat-button');
      expect(rateButtonLabel?.textContent.trim()).toEqual(
        component.rateButtonLabel
      );
    });

    it('verify reviews header', () => {
      component.reviewsHeadingText = 'Reviews';
      spectator.detectComponentChanges();
      const rateButtonLabel = spectator.query('.cos-reviews-header > h3');
      expect(rateButtonLabel.textContent.trim()).toEqual(
        component.reviewsHeadingText
      );
    });

    it('should show reviews heading card text', () => {
      component.reviewsHeadingText = 'Review Heading Text Test';
      spectator.detectComponentChanges();
      const ratingReviewElement = spectator.query(
        '.cos-reviews-header > .cos-ratings-reviews-card-heading'
      );
      expect(ratingReviewElement.textContent).toEqual(
        component.reviewsHeadingText
      );
    });
  });

  describe('Button Label', () => {
    it('verify View more button label', () => {
      component.viewMoreButtonLabel = 'View More';
      component.data.Comments = [
        {
          Id: 118883,
          Comment:
            'Terrible Customer Service. Refused to send invoice and no one in company can tell me what we were charged for. Avoid at all costs.',
          Distributor: {
            Id: 127134,
            Name: 'Artistic Imprints Inc',
            AsiNumber: '125346',
          },
          CreateDate: '2020-01-15T12:48:00.000',
        },
      ];
      spectator.detectComponentChanges();
      const viewMoreButtonLabel = spectator.query('.cos-button');
      expect(viewMoreButtonLabel.textContent.trim()).toEqual(
        component.viewMoreButtonLabel
      );
    });
  });

  describe('review details', () => {
    it('Should view reviews content', () => {
      component._reviews = component.data.Comments;
      component.getTimeElapsed = (date) => {
        return '8 months ago test';
      };
      spectator.detectComponentChanges();
      const reviewContent = spectator.queryAll(
        '.cos-review > .cos-rating-content'
      );
      expect(reviewContent[0].innerHTML).toContain('8 months ago test');
    });

    it('Should view reviews comment', () => {
      component._reviews = component.data.Comments;
      component.getTimeElapsed = (date) => {
        return '8 months ago test';
      };
      spectator.detectComponentChanges();
      const reviewContent = spectator.queryAll('.cos-review > .cos-comment');
      expect(reviewContent[0].innerHTML).toContain(
        component.data.Comments[0].Comment
      );
    });
  });

  describe('Distributor details', () => {
    it('Should view reviews Distributor name', () => {
      component._reviews = component.data.Comments;
      component.getTimeElapsed = (date) => {
        return '8 months ago test';
      };
      spectator.detectComponentChanges();
      const reviewContent = spectator.queryAll('.cos-review .cos-name');
      expect(reviewContent[0].innerHTML).toContain(
        component.data.Comments[0].Distributor.Name
      );
    });

    it('Should view reviews Distributor ASI Number', () => {
      component._reviews = component.data.Comments;
      component.getTimeElapsed = (date) => {
        return '8 months ago test';
      };
      spectator.detectComponentChanges();
      const reviewContent = spectator.queryAll('.cos-review .cos-asi-number');
      expect(reviewContent[0].innerHTML).toContain(
        component.data.Comments[0].Distributor.AsiNumber
      );
    });
  });
});
