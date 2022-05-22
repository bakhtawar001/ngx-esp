import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-avatar-demo-component',
  template: `
    <cos-avatar [size]="size">
      <ng-container *ngIf="mode === 'text'">{{ text }}</ng-container>
      <img
        *ngIf="mode === 'image'"
        [attr.src]="imageUrl"
        alt="User profile for Bill Murray"
      />
    </cos-avatar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAvatarDemoComponent {
  @Input() mode: 'image' | 'text' = 'text';

  @Input() imageUrl: string;
  @Input() size: string;
  @Input() text: string;
}
