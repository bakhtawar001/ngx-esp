import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  WebsiteTemplatePage,
  WebsiteTemplatePageModule,
} from './website-template.page';

describe('WebsiteTemplatePage', () => {
  let spectator: Spectator<WebsiteTemplatePage>;
  let component: WebsiteTemplatePage;

  const createComponent = createComponentFactory({
    component: WebsiteTemplatePage,
    imports: [
      WebsiteTemplatePageModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
