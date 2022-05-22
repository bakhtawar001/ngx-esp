import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface Star {
  Fill: number;
  Index: number;
}

export type RatingSizes = 'sm' | 'lg' | null;

@Component({
  selector: 'cos-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.style]': 'ratingAsStyle',
    // '[attr.style--rating]': 'calculatedRating', // ViewEngine Bug?
  },
})
export class CosRatingComponent {
  @Input() rating?: number;
  @Input() totalCount?: number;
  @Input() size!: RatingSizes;

  public get ratingAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--rating: ${this.calculatedRating}`
    );
  }

  constructor(private sanitizer: DomSanitizer) {}

  get calculatedRating(): number {
    return this.rating! / 2;
  }

  get ratingDisplay(): string {
    return `${this.calculatedRating} out of 5 stars`;
  }
}
