import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosCardModule } from '@cosmos/components/card';
import { UntilDestroy } from '@ngneat/until-destroy';

@Directive({
  selector: '[asiUiDetailsCardAvatar]',
})
export class AsiUiDetailsCardAvatar {}

@Directive({
  selector: '[asiUiDetailsCardText]',
})
export class AsiUiDetailsCardText {}

@UntilDestroy()
@Component({
  selector: 'asi-details-card',
  templateUrl: 'details-card.component.html',
  styleUrls: ['details-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AsiUiDetailsCardComponent {
  @Input() firstLineDetails = '';
  @Input() secondLineDetails = '';
  @Input() subtitleFirstLine = '';
  @Input() subtitleSecondLine = '';
  @Input() title = '';
  @Input() topBorderColor = '#6A7281';

  @Input() showFirstLineTooltip = true;
  @Input() showSecondLineTooltip = true;
  @Input() showSubtitleTooltip = false;
  @Input() showTitleTooltip = false;

  @Output() cardClick = new EventEmitter<void>();

  clickCallback(): void {
    this.cardClick.emit();
  }
}

@NgModule({
  declarations: [
    AsiUiDetailsCardComponent,
    AsiUiDetailsCardAvatar,
    AsiUiDetailsCardText,
  ],
  exports: [
    AsiUiDetailsCardComponent,
    AsiUiDetailsCardAvatar,
    AsiUiDetailsCardText,
  ],
  imports: [CommonModule, MatTooltipModule, CosCardModule, CosAvatarModule],
})
export class AsiUiDetailsCardComponentModule {}
