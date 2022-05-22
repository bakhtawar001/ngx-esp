import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { SmartlinkProductsModule } from '@smartlink/products';

import { ArticleComponent } from './components/article/article.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { ContentfulCommonModule } from '@contentful/common';

@NgModule({
  imports: [
    CommonModule,
    SmartlinkProductsModule,
    NgSelectModule,
    FormsModule,
    ContentfulCommonModule,
  ],
  declarations: [ArticleComponent, TypeaheadComponent],
  providers: [],
  exports: [ArticleComponent, TypeaheadComponent],
})
export class SponsoredContentModule {}
