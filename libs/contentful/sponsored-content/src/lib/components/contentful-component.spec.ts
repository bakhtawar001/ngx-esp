import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ContentfulComponent } from './contentful-component';

@Component({
  selector: 'sponsored-content-cci',
  template: '',
})
class ContentfulComponentImplementationComponent extends ContentfulComponent {
  constructor(rootContentfulService: RootContentfulService) {
    super(rootContentfulService);
  }

  callSetConfig() {
    this.setConfig();
  }

  getContentful() {
    return this.contentful;
  }
}

const contentfulConfig = {
  accessToken: 'test',
  space: 'test',
  environment: 'test',
  host: 'test',
};

describe('ContentfulComponent', () => {
  let service;
  let component: ContentfulComponentImplementationComponent;
  let spectator: Spectator<ContentfulComponentImplementationComponent>;
  const createComponent = createComponentFactory({
    component: ContentfulComponentImplementationComponent,
    imports: [HttpClientTestingModule],
    providers: [RootContentfulService],
  });

  beforeEach(() => {
    spectator = createComponent();
    service = spectator.inject(RootContentfulService);
    component = spectator.component;
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('calls setConfig if there are changes to contentfulConfig', () => {
      const spy = jest.spyOn(<any>component, 'setConfig');

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnChanges({
        contentfulConfig: {
          currentValue: 'test',
          previousValue: '',
          isFirstChange: null,
          firstChange: null,
        },
      });

      expect(spy).toHaveBeenCalled();
    });

    it('doesnt call setConfig on irrelevent changes', () => {
      const spy = jest.spyOn(<any>component, 'setConfig');

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnChanges({
        test: {
          currentValue: 1,
          previousValue: null,
          isFirstChange: null,
          firstChange: null,
        },
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('setConfig', () => {
    it('checks for existing client & contentfulConfig object', () => {
      const spy = jest.spyOn(<any>component.getContentful(), 'setConfig');

      component.contentfulConfig = contentfulConfig;

      component.callSetConfig();

      expect(spy).toHaveBeenCalledWith(
        contentfulConfig.space,
        contentfulConfig.accessToken,
        contentfulConfig.environment,
        contentfulConfig.host
      );
    });

    it('parses JSON string', () => {
      const spy = jest.spyOn(component.getContentful(), 'setConfig');

      component.contentfulConfig = JSON.stringify(contentfulConfig);

      component.callSetConfig();

      expect(spy).toHaveBeenCalledWith(
        contentfulConfig.space,
        contentfulConfig.accessToken,
        contentfulConfig.environment,
        contentfulConfig.host
      );
    });

    it('catches error', (done) => {
      const error = 'error';

      jest
        .spyOn(component.getContentful(), 'setConfig')
        .mockImplementation(() => {
          throw error;
        });

      component.contentfulConfig = contentfulConfig;

      component.error.subscribe((e) => {
        expect(e).toBeTruthy();

        done();
      });

      component.callSetConfig();
    });
  });

  describe('errorHandler', () => {});
});
