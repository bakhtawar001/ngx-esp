import { addParameters } from '@storybook/angular';
import '!style-loader!css-loader!sass-loader!../_primitives/_documentation.scss';

import { setCompodocJson } from '@storybook/addon-docs/angular';

import compodocJson from 'dist/compodoc/cosmos-components/documentation.json';

setCompodocJson(compodocJson);

const customViewports = {
  bpSmall: {
    name: 'Small',
    styles: {
      width: '420px',
      height: '1024px',
    },
  },
  bpMedium: {
    name: 'Medium',
    styles: {
      width: '600px',
      height: '1024px',
    },
  },
  bpLarge: {
    name: 'Large',
    styles: {
      width: '1024px',
      height: '1024px',
    },
  },
  bpXLarge: {
    name: 'X Large',
    styles: {
      width: '1280px',
      height: '1024px',
    },
  },
  bpXXLarge: {
    name: 'XX Large',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
};

addParameters({
  viewport: {
    viewports: customViewports, // newViewports would be an ViewportMap. (see below for examples)
  },
  options: {
    storySort: {
      order: [
        'Documentation',
        ['Getting Started', 'File Structure', 'Accessibility'],
        'Primitives',
        'Attributes',
        'Buttons',
        'Charts',
        'Composites',
        'Controls & Inputs',
        'Layout Components',
        'Layout Examples',
        'Lists',
        'Media',
        'Navigation',
        'Objects',
        'Overlays',
      ],
    },
  },
});
