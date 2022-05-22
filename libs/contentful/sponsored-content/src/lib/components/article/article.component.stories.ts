import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SmartlinkAuthInterceptor } from '@smartlink/auth';
import { object, select, text } from '@storybook/addon-knobs';
import { SponsoredContentModule } from '../../sponsored-content.module';
import { ArticleComponent } from './article.component';

export default {
  title: 'ArticleComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [SponsoredContentModule, HttpClientModule],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: SmartlinkAuthInterceptor,
        multi: true,
      },
    ],
  },
  component: ArticleComponent,
  props: {
    articleId: text('articleId', '2XRut264yVKnRbHV3h0mxA'),
    asiAuthHeader: text('asiAuthHeader', 'Bearer '),
    layout: select('layout', { preview: 'preview', full: 'full' }, 'full'),
    readMoreText: text('readMoreText', 'Read full article'),
    saveButtonText: text('saveButtonText', 'Save'),
    orderButtonText: text('orderButtonText', 'Order'),
    smartlinkUrl: text('smartlinkUrl', 'https://api.uat-asicentral.com/v1'),
    contentfulConfig: object('contentfulConfig', {
      space: 'b0i267aobexu',
      accessToken: '8cYBuA-MLtP1WiGtp6qGBXAZ1cNY9df-IZciGhB7PPg',
      environment: 'master',
    }),
  },
});

export const preview = () => ({
  moduleMetadata: {
    imports: [SponsoredContentModule, HttpClientModule],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: SmartlinkAuthInterceptor,
        multi: true,
      },
    ],
  },
  component: ArticleComponent,
  props: {
    articleId: text('articleId', '2XRut264yVKnRbHV3h0mxA'),
    asiAuthHeader: text('asiAuthHeader', 'Bearer '),
    layout: select('layout', { preview: 'preview', full: 'full' }, 'preview'),
    readMoreText: text('readMoreText', 'Read full article'),
    saveButtonText: text('saveButtonText', 'Save'),
    orderButtonText: text('orderButtonText', 'Order'),
    smartlinkUrl: text('smartlinkUrl', 'https://api.uat-asicentral.com/v1'),
    contentfulConfig: object('contentfulConfig', {
      space: 'b0i267aobexu',
      accessToken: '8cYBuA-MLtP1WiGtp6qGBXAZ1cNY9df-IZciGhB7PPg',
      environment: 'master',
    }),
  },
});
