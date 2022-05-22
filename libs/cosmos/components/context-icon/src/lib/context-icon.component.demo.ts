import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-demo-component',
  styleUrls: ['demo.component.scss'],
  template: `<cos-context-icon [color]="color" [icon]="icon"
    ><div class="cos-demo-circle"></div
  ></cos-context-icon>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosContextIconDemoComponent {
  @Input() color!: string;
  @Input() icon!: string;
}
