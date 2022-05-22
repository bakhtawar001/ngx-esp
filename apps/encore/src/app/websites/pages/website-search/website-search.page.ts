import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-website-search',
  templateUrl: './website-search.page.html',
  styleUrls: ['./website-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteSearchPage {}

@NgModule({
  declarations: [WebsiteSearchPage],
  imports: [MatMenuModule, CosButtonModule],
  exports: [WebsiteSearchPage],
})
export class WebsiteSearchPageModule {}
