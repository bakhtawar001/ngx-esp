import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-attribute-tag',
  template: `
    <ul class="cos-inline-list">
      <li>
        <p cosAttributeTag [size]="size">
          <i class="fa fa-{{ iconTag1 }}"></i> {{ innerTextTag1 }}
        </p>
      </li>
      <li>
        <p cosAttributeTag [size]="size">
          <i class="fa fa-{{ iconTag2 }}"></i> {{ innerTextTag2 }}
        </p>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAttributeTagDemoComponent {
  @Input() size: string;

  @Input() iconTag1: string;
  @Input() innerTextTag1: string;

  @Input() iconTag2: string;
  @Input() innerTextTag2: string;
}
