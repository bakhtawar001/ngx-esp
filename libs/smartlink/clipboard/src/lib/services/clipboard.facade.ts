import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClipboardService } from './clipboard.service';
import {
  AddItem,
  SetItems,
  DeleteItems,
  DeleteItem,
  ClipboardState,
} from '../store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClipboardItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ClipboardFacade {
  items$ = this.store.select(ClipboardState.items);

  constructor(
    private store: Store,
    private clipboardService: ClipboardService
  ) {}

  getItemById(id: number) {
    return this.store.select(ClipboardState.getItemById).pipe(
      map(res => res(id)),
      mergeMap(res => {
        if (res) {
          return of(res);
        } else {
          return this.getItem(id);
        }
      })
    );
  }

  all() {
    this.clipboardService.all().subscribe(res => {
      this.store.dispatch(new SetItems(res));
    });

    return this.items$;
  }

  addItem(item: ClipboardItem) {
    this.clipboardService.create(item).subscribe(res => {
      this.store.dispatch(new AddItem(res));
    });

    return this.items$;
  }

  deleteList(ids: number[]) {
    this.clipboardService.deleteList(ids).subscribe(res => {
      this.store.dispatch(new DeleteItems(ids));
    });

    return this.items$;
  }

  delete(id: number) {
    this.clipboardService.delete(id).subscribe(res => {
      this.store.dispatch(new DeleteItem(id));
    });

    return this.items$;
  }

  getItem(id: number) {
    return this.clipboardService.get(id).pipe(
      tap(res => {
        this.store.dispatch(new AddItem(res));
      }),
      mergeMap(() => this.getItemById(id))
    );
  }
}
