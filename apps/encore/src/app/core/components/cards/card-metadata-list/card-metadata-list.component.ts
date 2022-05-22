import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'esp-card-metadata-list',
  template: `
    <ul
      class="metadata-list grid-cols-{{ cols }}-auto grid-gap-{{
        gap
      }} grid mb-0"
    >
      <ng-content select="li"></ng-content>
    </ul>
  `,
  styleUrls: ['./card-metadata-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMetadataListComponent {
  @Input() cols = 6;
  @Input() gap = 8;
}

@NgModule({
  declarations: [CardMetadataListComponent],
  imports: [CommonModule],
  exports: [CardMetadataListComponent],
})
export class CardMetadataListModule {}
