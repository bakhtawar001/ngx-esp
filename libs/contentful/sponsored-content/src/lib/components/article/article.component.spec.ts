import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { SmartlinkProductsModule } from '@smartlink/products';

import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let spectator: Spectator<ArticleComponent>;
  const createComponent = createComponentFactory({
    component: ArticleComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      SmartlinkProductsModule,
    ],
    providers: [RootContentfulService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {});

  describe('ngOnChanges', () => {});

  describe('setConfig', () => {});

  describe('parseSanitizeDocument', () => {});

  describe('getArticle', () => {});
});
