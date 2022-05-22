import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SponsoredContentModule } from '@contentful/sponsored-content';
import { ContentfulService } from '@contentful/common/services/contentful.service';
import { ArticleComponent } from '@contentful/sponsored-content/components/article/article.component';
import { TypeaheadComponent } from '@contentful/sponsored-content/components/typeahead/typeahead.component';

import { SmartlinkAuthInterceptor } from '@smartlink/auth';
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';

import { environment } from '../environments/environment';

@NgModule({
  imports: [HttpClientModule, BrowserModule, SponsoredContentModule],
  providers: [
    ContentfulService,
    {
      provide: SMARTLINK_SERVICE_CONFIG,
      useValue: { Url: environment.SMARTLINK_API },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SmartlinkAuthInterceptor,
      multi: true,
    },
  ],
})
export class AppModule implements DoBootstrap {
  constructor(injector: Injector) {
    const article = createCustomElement(ArticleComponent, { injector });

    customElements.define('sponsored-content', article);

    const typeahead = createCustomElement(TypeaheadComponent, { injector });

    customElements.define('sponsored-content-typeahead', typeahead);
  }

  ngDoBootstrap() {
    return;
  }
}
