import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  year = new Date().getFullYear();
}

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
})
export class FooterComponentModule {}
