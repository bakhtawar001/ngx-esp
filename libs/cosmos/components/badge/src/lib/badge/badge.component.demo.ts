import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-badge-component',
  template: ` <div cosBadge>{{ innerText }}</div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosBadgeDemoComponent {
  @Input() innerText;
}
