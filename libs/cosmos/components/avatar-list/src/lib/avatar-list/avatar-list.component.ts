import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

export interface Avatar {
  icon?: string;
  displayText: string;
  imgUrl?: string;
  toolTipText?: string;
}

@Component({
  selector: 'cos-avatar-list',
  templateUrl: './avatar-list.component.html',
  styleUrls: ['./avatar-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CosAvatarListComponent implements OnChanges {
  @Input() avatars: Avatar[] = [];
  @Input() size: 'small' | 'default' = 'default';

  limit = 5;

  additionalCount = 0;
  additionalCountTooltip = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.avatars?.currentValue !== changes.avatars?.previousValue) {
      this.limit = changes.avatars.currentValue?.length > 5 ? 4 : 5;
      this.additionalCount = this.getAdditionalCount();
      this.additionalCountTooltip = this.getAdditionalCountTooltip();
    }
  }

  trackByFn(index: number, avatar: Avatar): string {
    return avatar.displayText;
  }

  private getAdditionalCount() {
    const remaining = this.avatars.length - this.limit;

    return Math.min(remaining, 99);
  }

  private getAdditionalCountTooltip(): string {
    return this.avatars
      .slice(this.limit, this.avatars.length)
      .map((avatar) => avatar.toolTipText)
      .join('\n');
  }

  imgError(event: ErrorEvent) {
    const target = <HTMLImageElement>event.target;
    target.style.display = 'none';
    target.onerror = null;
  }
}
