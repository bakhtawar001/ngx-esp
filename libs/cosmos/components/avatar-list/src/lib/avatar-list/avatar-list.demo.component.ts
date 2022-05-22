import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'cos-avatar-list-demo-component',
  template: `<cos-avatar-list [avatars]="_avatars"></cos-avatar-list> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAvatarListDemoComponent implements OnChanges {
  @Input() avatars;
  @Input() rulesDisplay;

  _avatars = [];

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.avatars?.currentValue !== changes.avatars?.previousValue ||
      changes.rulesDisplay?.currentValue !== changes.rulesDisplay?.previousValue
    ) {
      if (changes.rulesDisplay.currentValue === 'fiveOnly') {
        this._avatars = this.avatars.slice(0, 5);
      } else {
        this._avatars = this.avatars;
      }
    }
  }
}
