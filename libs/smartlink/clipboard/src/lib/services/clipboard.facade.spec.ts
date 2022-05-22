import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ClipboardItem } from '../models';
import {
  AddItem,
  ClipboardState,
  DeleteItem,
  DeleteItems,
  SetItems,
} from '../store';
import { ClipboardFacade } from './clipboard.facade';
import { ClipboardService } from './clipboard.service';

let dispatchSpy;
let service;
let clipboard;
let store;
const mockItem = {
  Id: 1,
  Name: '',
  Description: '',
  ImageUrl: '',
  Product: null,
};
let spectator: SpectatorService<ClipboardFacade>;

describe('ClipboardFacade', () => {
  const createService = createServiceFactory({
    service: ClipboardFacade,
    imports: [HttpClientTestingModule, NgxsModule.forRoot([ClipboardState])],
    providers: [mockProvider(ClipboardService)],
  });

  beforeEach(() => {
    spectator = createService();

    store = spectator.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    clipboard = spectator.service;
    service = spectator.inject(ClipboardService);
  });

  it('works', () => {
    expect(clipboard).toBeTruthy();
  });

  describe('getItemById', () => {
    it('selects from store and calls getItem with no res', (done) => {
      const value = 1;
      const getItemSpy = jest
        .spyOn(clipboard, 'getItem')
        .mockReturnValue(of(mockItem));

      clipboard.getItemById(value).subscribe((res) => {
        expect(getItemSpy).toHaveBeenCalledWith(value);
        expect(res).toEqual(mockItem);
        done();
      });
    });

    it('selects from store and returns observable of res', (done) => {
      const value = 1;
      const resultSpy = jest.fn().mockReturnValue(mockItem);
      const selectSpy = jest
        .spyOn(store, 'select')
        .mockReturnValue(of(resultSpy));

      clipboard.getItemById(value).subscribe((res) => {
        expect(resultSpy).toHaveBeenCalledWith(value);
        expect(selectSpy).toHaveBeenCalledWith(ClipboardState.getItemById);
        expect(res).toEqual(mockItem);
        done();
      });
    });
  });

  describe('all', () => {
    it('calls service.all and dispatches SetItems', () => {
      const value: ClipboardItem[] = [mockItem];
      const allSpy = jest.spyOn(service, 'all').mockReturnValue(of(value));

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      clipboard.all().subscribe(() => {});

      expect(allSpy).toHaveBeenCalled();

      expect(dispatchSpy).toHaveBeenCalledWith(new SetItems(value));
    });
  });

  describe('addItem', () => {
    it('calls service.create and dispatches AddItem', () => {
      const value: ClipboardItem = mockItem;
      const addSpy = jest.spyOn(service, 'create').mockReturnValue(of(value));

      const params = { Product: { Id: 1 }, ImageUrl: 'test' };

      clipboard.addItem(params);

      expect(addSpy).toHaveBeenCalledWith(params);

      expect(dispatchSpy).toHaveBeenCalledWith(new AddItem(value));
    });
  });

  describe('deleteList', () => {
    it('calls deleteList and dispatches DeleteItems', () => {
      const value = [1, 2, 3];
      const deleteSpy = jest
        .spyOn(service, 'deleteList')
        .mockReturnValue(of(null));

      clipboard.deleteList(value);

      expect(deleteSpy).toHaveBeenCalledWith(value);
      expect(dispatchSpy).toHaveBeenCalledWith(new DeleteItems(value));
    });
  });

  describe('delete', () => {
    it('calls service.delete and dispatches DeleteItem', () => {
      const value = 1;
      const deleteSpy = jest.spyOn(service, 'delete').mockReturnValue(of(null));

      clipboard.delete(value);

      expect(deleteSpy).toHaveBeenCalledWith(value);
      expect(dispatchSpy).toHaveBeenCalledWith(new DeleteItem(value));
    });
  });

  describe('getItem', () => {
    it('calls service.get, dispatches AddItem, and merges getITemById', (done) => {
      const value = 1;
      const getSpy = jest.spyOn(service, 'get').mockReturnValue(of(mockItem));
      const getItemByIdSpy = jest
        .spyOn(clipboard, 'getItemById')
        .mockReturnValue(of(mockItem));

      clipboard.getItem(value).subscribe((res) => {
        expect(getSpy).toHaveBeenCalledWith(value);
        expect(dispatchSpy).toHaveBeenCalledWith(new AddItem(mockItem));
        expect(getItemByIdSpy).toHaveBeenCalledWith(value);

        expect(res).toEqual(mockItem);
        done();
      });
    });
  });
});
