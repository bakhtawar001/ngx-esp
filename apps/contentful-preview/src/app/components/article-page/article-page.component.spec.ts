import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SponsoredContentModule } from '@contentful/sponsored-content';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ArticlePageComponent } from './article-page.component';

// Note: This test is skipped because the component select esp-product-card is missing from the ArticlePageComponent
describe.skip('ArticlePageComponent', () => {
  let spectator: Spectator<ArticlePageComponent>;
  let component: ArticlePageComponent;
  const createComponent = createComponentFactory({
    component: ArticlePageComponent,
    imports: [
      NgxsModule.forRoot(),
      HttpClientTestingModule,
      SponsoredContentModule,
      RouterModule.forRoot([]),
    ],
    declarations: [ArticlePageComponent],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({});
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
