import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgModule,
  NgZone,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosEmojiMenuModule } from '@cosmos/components/emoji-menu';
import { CosInputModule } from '@cosmos/components/input';
import { CosToastService } from '@cosmos/components/notification';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  take,
} from 'rxjs/operators';
import { CollectionsDialogService } from '../../services';
import { CollectionsMenuLocalState } from './collections-menu.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-collections-menu',
  templateUrl: './collections-menu.component.html',
  styleUrls: ['./collections-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollectionsMenuLocalState],
})
export class CollectionsMenuComponent {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  @ViewChild('createNewCollectionButton', { static: false, read: ElementRef })
  createNewCollectionButton?: ElementRef<HTMLButtonElement>;

  constructor(
    public readonly state: CollectionsMenuLocalState,
    private readonly _ngZone: NgZone,
    private _collectionsDialogService: CollectionsDialogService,
    private _router: Router,
    private _toastService: CosToastService
  ) {
    state.connect(this);

    this.state.form.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((criteria) => this.state.search(criteria));
  }

  ngOnInit(): void {
    this.menu._animationDone
      .pipe(
        filter((event) => event.toState === 'enter'),
        // Wait until the content is rendered lazily, it takes a bit before the items are inside the DOM.
        switchMap(() => this._ngZone.onStable.pipe(take(1))),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.createNewCollectionButton?.nativeElement.focus();
      });
  }

  clearSearch(): void {
    this.state.form.controls.term.setValue('');
  }

  createCollection() {
    const onError = () => {
      this._toastService.error(
        'Collection not created.',
        'Collection was unable to be created.'
      );
    };

    this._collectionsDialogService
      .openCreateDialog(null, true)
      .pipe(untilDestroyed(this))
      .subscribe((collection) => {
        if (collection) {
          this._router
            .navigate(['/collections', collection.Id])
            .then(() =>
              this._toastService.success(
                'Success: Collection created!',
                `Your collection ${collection.Name} has been created.`
              )
            );
        } else {
          onError();
        }
      }, onError);
  }

  public trackByFn(index: number) {
    return index;
  }

  get backToNavigationName() {
    const pathName = window.location.pathname.toLocaleLowerCase();
    switch (pathName) {
      case '/collections':
        return { navigationName: 'Back to Collections' };
      case '/products':
        return { navigationName: 'Back to Search Results' };
      default:
        return { navigationName: 'Back' };
    }
  }
}

@NgModule({
  declarations: [CollectionsMenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule,

    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,

    CosButtonModule,
    CosEmojiMenuModule,
    CosInputModule,
  ],
})
export class CollectionsMenuComponentModule {}
