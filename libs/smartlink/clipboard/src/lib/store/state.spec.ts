import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { ClipboardStateModel } from './model';
import { ClipboardState } from './state';

describe('ClipboardState', () => {
  let store;
  let state: ClipboardStateModel;
  let spectator: SpectatorService<ClipboardState>;
  const createService = createServiceFactory({
    service: ClipboardState,
    imports: [NgxsModule.forRoot([ClipboardState])],
    providers: [ClipboardState],
  });

  beforeEach(() => {
    spectator = createService();

    store = spectator.inject(Store);

    state = {
      items: [
        {
          Id: 1,
          Name: 'test',
          Description: 'test',
          ImageUrl: 'test',
          Product: null,
        },
      ],
    };

    store.reset({ clipboard: state });
  });

  describe('ClipboardStateModel', () => {
    describe('Selectors', () => {
      describe('items', () => {
        it('returns state.items', () => {
          const res = ClipboardState.items(state);

          expect(res).toEqual(state.items);
        });
      });

      describe('getItemById', () => {
        it('returns fn(id) => item', () => {
          const res = ClipboardState.getItemById(state)(1);

          expect(res).toEqual(state.items[0]);
        });
      });
    });
  });
});
