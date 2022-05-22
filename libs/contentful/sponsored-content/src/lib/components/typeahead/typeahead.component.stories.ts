import { HttpClientModule } from '@angular/common/http';
import { boolean, number, object, text } from '@storybook/addon-knobs';
import { SponsoredContentModule } from '../../sponsored-content.module';
import { TypeaheadComponent } from './typeahead.component';

export default {
  title: 'TypeaheadComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [SponsoredContentModule, HttpClientModule],
  },
  component: TypeaheadComponent,
  props: {
    debounce: number('debounce', 300),
    isDisabled: boolean('isDisabled', false),
    loadingText: text('loadingText', 'Loading'),
    notFoundText: text('notFoundText', 'No results'),
    numberOfResults: number('numberOfResults', 5),
    placeholder: text('placeholder', 'Select an article'),
    value: text('value', ''),
    sponsoredByAsiNumber: number('sponsoredByAsiNumber', undefined),
    contentType: text('contentType', 'sponsoredContent'),
    sponsoredById: text('sponsoredById', 'sponsor'),
    sponsoredByIdQueryPath: text(
      'sponsoredByIdQueryPath',
      'fields.sponsoredBy.sys.contentType.sys.id'
    ),
    asiNumberQueryPath: text(
      'asiNumberQueryPath',
      'fields.sponsoredBy.fields.asiNumber'
    ),
    contentfulConfig: object('contentfulConfig', {
      type: 'sponsoredContent',
      space: 'b0i267aobexu',
      accessToken: '8cYBuA-MLtP1WiGtp6qGBXAZ1cNY9df-IZciGhB7PPg',
      environment: 'master',
    }),
  },
});

export const preSelectedValue = () => ({
  moduleMetadata: {
    imports: [SponsoredContentModule, HttpClientModule],
  },
  component: TypeaheadComponent,
  props: {
    debounce: number('debounce', 300),
    isDisabled: boolean('isDisabled', false),
    loadingText: text('loadingText', 'Loading'),
    notFoundText: text('notFoundText', 'No results'),
    numberOfResults: number('numberOfResults', 5),
    placeholder: text('placeholder', 'Select an article'),
    value: text('value', '2XRut264yVKnRbHV3h0mxA'),
    sponsoredByAsiNumber: number('sponsoredByAsiNumber', undefined),
    contentType: text('contentType', 'sponsoredContent'),
    sponsoredById: text('sponsoredById', 'sponsor'),
    sponsoredByIdQueryPath: text(
      'sponsoredByIdQueryPath',
      'fields.sponsoredBy.sys.contentType.sys.id'
    ),
    asiNumberQueryPath: text(
      'asiNumberQueryPath',
      'fields.sponsoredBy.fields.asiNumber'
    ),
    contentfulConfig: object('contentfulConfig', {
      space: 'b0i267aobexu',
      accessToken: '8cYBuA-MLtP1WiGtp6qGBXAZ1cNY9df-IZciGhB7PPg',
      environment: 'master',
    }),
  },
});
