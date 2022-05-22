import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-company-artwork',
  templateUrl: './company-artwork.component.html',
  styleUrls: ['./company-artwork.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyArtworkComponent {}

@NgModule({
  declarations: [CompanyArtworkComponent],
  exports: [CompanyArtworkComponent],
})
export class CompanyArtworkComponentModule {}
