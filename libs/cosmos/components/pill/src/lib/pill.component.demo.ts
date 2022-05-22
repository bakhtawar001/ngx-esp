import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-button-component',
  template: `
    <ng-container [ngSwitch]="pillType">
      <a *ngSwitchDefault href="#" cosPill
        >{{ innerText }}
        <i *ngIf="_icon.length > 1" class="fa" [ngClass]="_icon"></i
      ></a>
      <span *ngSwitchCase="'label'" cosPillLabel>{{ innerText }} </span>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosPillDemoComponent {
  private _icon: string;
  @Input() innerText: string;
  @Input() pillType: string;
  @Input()
  set icon(value: string) {
    if (!value) {
      this._icon = '';
    }
    this._icon = `fa-${value}`;
  }
  get icon() {
    return this._icon;
  }
}
