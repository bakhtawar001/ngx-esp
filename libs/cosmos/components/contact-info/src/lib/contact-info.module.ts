import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  WebsiteUrlPipeModule,
  UrlToDomainNamePipeModule,
  UrlToSocialIconPipeModule,
} from '@cosmos/core';

import { CosContactInfoComponent } from './contact-info.component';

@NgModule({
  imports: [
    CommonModule,
    WebsiteUrlPipeModule,
    UrlToDomainNamePipeModule,
    UrlToSocialIconPipeModule,
  ],
  declarations: [CosContactInfoComponent],
  exports: [CosContactInfoComponent],
})
export class CosContactInfoModule {}
