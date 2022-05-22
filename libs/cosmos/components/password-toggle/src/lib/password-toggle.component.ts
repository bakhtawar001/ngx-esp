import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'cos-password-toggle',
  templateUrl: './password-toggle.component.html',
  styleUrls: ['./password-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosPasswordToggleComponent {
  @Input() isVisible = false;

  get type() {
    return this.isVisible ? 'text' : 'password';
  }
}

@NgModule({
  declarations: [CosPasswordToggleComponent],
  exports: [CosPasswordToggleComponent],
  imports: [CommonModule, CosButtonModule],
})
export class CosPasswordToggleComponentModule {}
