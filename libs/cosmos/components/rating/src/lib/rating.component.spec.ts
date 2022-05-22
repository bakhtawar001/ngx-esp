import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosRatingComponent } from './rating.component';
import { CosRatingModule } from './rating.module';

describe('CosRatingComponent', () => {
  let component: CosRatingComponent;
  let spectator: Spectator<CosRatingComponent>;
  const createComponent = createComponentFactory({
    component: CosRatingComponent,
    imports: [CosRatingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total rating correctly and set all values', () => {
    component.rating = 5;
    component.totalCount = 22;

    spectator.detectComponentChanges();

    expect(component.calculatedRating).toEqual(component.rating / 2);
    expect(component.ratingDisplay).toEqual('2.5 out of 5 stars');
  });

  it('should show rating stars when provided', () => {
    component.rating = 5;
    component.totalCount = 10;

    spectator.detectComponentChanges();

    const el = spectator.query('.cos-rating-stars');

    expect(el).toExist();
  });

  it('should show review count when provided', () => {
    component.rating = 5;
    component.totalCount = 10;

    spectator.detectComponentChanges();

    const el = spectator.query('.cos-rating-review-count');

    expect(el).toExist();
    expect(el).toHaveText(`(${component.totalCount})`);
  });

  it('should hide review count when provided', () => {
    component.rating = 5;
    component.totalCount = undefined;

    spectator.detectComponentChanges();

    const el = spectator.query('.cos-rating-review-count');

    expect(el).not.toExist();
  });

  it('should show not rated when no ratings are provided', () => {
    component.rating = undefined;
    component.totalCount = 0;

    spectator.detectComponentChanges();

    const el = spectator.query('.cos-rating-no-rating');

    expect(el).toExist();
  });
});
