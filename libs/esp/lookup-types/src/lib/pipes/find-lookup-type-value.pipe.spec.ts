import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { FindLookupTypeValuePipe } from './find-lookup-type-value.pipe';

const MockLookup = [{ Code: 'US', Name: 'United States' }];

describe('FindLookupTypePipe', () => {
  let spectator: SpectatorPipe<FindLookupTypeValuePipe>;
  const createPipe = createPipeFactory(FindLookupTypeValuePipe);

  it('find and display default country name from country code', () => {
    spectator = createPipe(`{{'US' | findLookupTypeValue: 'Countries' }}`, {
      providers: [
        mockProvider(Store, {
          selectSnapshot: (type) => MockLookup,
        }),
      ],
    });
    expect(spectator.element.textContent).toMatch('United States');
  });

  it('find and display country name from country code', () => {
    spectator = createPipe(
      `{{'US' | findLookupTypeValue: 'Countries':'Code':'Name' }}`,
      {
        providers: [
          mockProvider(Store, {
            selectSnapshot: (type) => MockLookup,
          }),
        ],
      }
    );
    expect(spectator.element.textContent).toMatch('United States');
  });

  it('find and display country code from country name', () => {
    spectator = createPipe(
      `{{'United States' | findLookupTypeValue: 'Countries':'Name':'Code' }}`,
      {
        providers: [
          mockProvider(Store, {
            selectSnapshot: (type) => MockLookup,
          }),
        ],
      }
    );
    expect(spectator.element.textContent).toMatch('US');
  });

  it('find and display value because it was not found in lookups', () => {
    spectator = createPipe(`{{'Value' | findLookupTypeValue: 'Countries' }}`, {
      providers: [
        mockProvider(Store, {
          selectSnapshot: (type) => MockLookup,
        }),
      ],
    });
    expect(spectator.element.textContent).toMatch('Value');
  });
});
