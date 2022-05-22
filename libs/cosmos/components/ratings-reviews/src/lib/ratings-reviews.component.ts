import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'cos-ratings-reviews',
  templateUrl: 'ratings-reviews.component.html',
  styleUrls: ['ratings-reviews.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-ratings-reviews',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosRatingsReviewsComponent implements OnInit {
  @Input()
  headingText!: string;

  @Input()
  overallHeadingText!: string;

  @Input()
  reviewsHeadingText!: string;

  @Input()
  categoryLabels!: Record<string, any>;

  @Input()
  transactionsLabel!: string;

  @Input()
  overallSpecificationString!: string;

  @Input()
  rateButtonLabel!: string;

  @Input()
  viewMoreButtonLabel!: string;

  @Input()
  reportsLabel!: string;

  @Input()
  data: any;

  _reviews: any[] = [];

  get overallRating() {
    return this.data['OverAll'];
  }

  get ratingCategories(): any {
    const cats = Object.entries(this.data).filter(
      // eslint-disable-next-line no-prototype-builtins
      (x: any) => x[0] !== 'OverAll' && x[1]?.hasOwnProperty('Rating')
    );
    return cats;
  }

  get reviews() {
    return this._reviews;
  }

  ngOnInit() {
    // Not sorting on the front end because the data is coming in already sorted desc.
    this._reviews = this.data?.Comments?.slice(0, 3);
  }

  getStarRating(value: number) {
    const rating = (value / 2).toFixed(1);
    return rating;
  }

  getVerboseTotalCount(node: string) {
    let countStr = this.overallSpecificationString.replace(
      '${reportsLabel}',
      this.data['OverAll']?.Companies
    );
    countStr = countStr.replace(
      '${transactionsLabel}',
      this.data['OverAll']?.Transactions
    );
    return countStr;
  }

  getCategoryLabel(category: any) {
    return this.categoryLabels?.[category];
  }

  getTimeElapsed(date: any) {
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  toggleRatings() {
    this._reviews = this.data?.Comments;
  }
}
