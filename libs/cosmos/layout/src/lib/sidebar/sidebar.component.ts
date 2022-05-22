import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, defer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { SidebarService } from './sidebar.service';

const flexLayout$ = defer(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: 'flex-layout' */
      '@cosmos/flex-layout'
    )
).pipe(shareReplay({ bufferSize: 1, refCount: true }));

@UntilDestroy()
@Component({
  selector: 'cos-sidebar',
  template: '<ng-content></ng-content>',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy, OnChanges {
  // Private
  private defaultFoldedState: boolean | undefined = undefined;

  @Input()
  name!: string;

  @Input()
  position: 'left' | 'right' = 'left';

  @HostBinding('class.open')
  opened = false;

  @Input()
  lockedOpen!: string;

  @HostBinding('class.locked-open')
  isLockedOpen: boolean = false;

  @Input()
  foldedWidth = 64;

  @Input()
  foldedAutoTriggerOnHover = true;

  @HostBinding('class.unfolded')
  unfolded: boolean = false;

  @Input()
  invisibleOverlay = false;

  @Output()
  foldedChanged = new EventEmitter<boolean>();

  @Output()
  openedChanged = new EventEmitter<boolean>();

  // Private
  private _folded = false;
  private _wasActive: boolean = false;
  private _wasFolded: boolean = false;
  private _backdrop: HTMLElement | null = null;
  private _player: AnimationPlayer | null = null;

  private activeMediaQuery = '';
  private onMediaChange = new BehaviorSubject<string>('');

  @HostBinding('class.animations-enabled')
  _animationsEnabled = false;

  constructor(
    private _injector: Injector,
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _sidebarService: SidebarService,
    private _renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  @Input()
  set folded(value: boolean) {
    if (this.defaultFoldedState === undefined) {
      return;
    }

    // Set the folded
    this._folded = value;

    // Return if the sidebar is closed
    if (!this.opened) {
      return;
    }

    // Programmatically add/remove padding to the element
    // that comes after or before based on the position
    let sibling, styleRule;

    const styleValue = this.foldedWidth + 'px';

    // Get the sibling and set the style rule
    if (this.position === 'left') {
      sibling = this._elementRef.nativeElement.nextElementSibling;
      styleRule = 'padding-left';
    } else {
      sibling = this._elementRef.nativeElement.previousElementSibling;
      styleRule = 'padding-right';
    }

    // If there is no sibling, return...
    if (!sibling) {
      return;
    }

    // If folded...
    if (value) {
      // Fold the sidebar
      this.fold();

      // Set the folded width
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'width',
        styleValue
      );
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'min-width',
        styleValue
      );
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'max-width',
        styleValue
      );

      // Set the style and class
      this._renderer.setStyle(sibling, styleRule, styleValue);
      this._renderer.addClass(this._elementRef.nativeElement, 'folded');
    } else {
      // If unfolded...
      // Unfold the sidebar
      this.unfold();

      // Remove the folded width
      this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
      this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
      this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

      // Remove the style and class
      this._renderer.removeStyle(sibling, styleRule);
      this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
    }

    // Update store
    this._sidebarService.setFolded(this.name, value);

    // Emit the 'foldedChanged' event
    this.foldedChanged.emit(this.folded);
  }

  get folded(): boolean {
    return this._folded;
  }

  ngOnInit(): void {
    // Register the sidebar
    this._sidebarService.register(this.name, this);

    // Setup visibility
    this._setupVisibility();

    // Setup position
    this._setupPosition();

    // Setup lockedOpen
    this._setupLockedOpen();

    // Setup folded
    this._setupFolded();
  }

  ngOnDestroy(): void {
    // If the sidebar is folded, unfold it to revert modifications
    if (this.folded) {
      this.unfold();
    }

    // Unregister the sidebar
    this._sidebarService.unregister(this.name);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { folded } = changes;

    if (folded?.firstChange) {
      const persistedFoldedState = this._sidebarService.getFolded(this.name);

      this.defaultFoldedState = folded.currentValue ?? this._folded;
      this._folded = persistedFoldedState ?? this.defaultFoldedState;
    }
  }

  private _setupVisibility(): void {
    // Remove the existing box-shadow
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'box-shadow',
      'none'
    );

    // Make the sidebar invisible
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'visibility',
      'hidden'
    );
  }

  /**
   * Setup the sidebar position
   */
  private _setupPosition(): void {
    // Add the correct class name to the sidebar
    // element depending on the position attribute
    if (this.position === 'right') {
      this._renderer.addClass(
        this._elementRef.nativeElement,
        'right-positioned'
      );
    } else {
      this._renderer.addClass(
        this._elementRef.nativeElement,
        'left-positioned'
      );
    }
  }

  /**
   * Setup the lockedOpen handler
   */
  private _setupLockedOpen(): void {
    // Return if the lockedOpen wasn't set
    if (!this.lockedOpen) {
      return;
    }

    // Set the wasActive for the first time
    this._wasActive = false;

    // Set the wasFolded
    this._wasFolded = this.folded;

    // Show the sidebar
    this._showSidebar();

    flexLayout$
      .pipe(untilDestroyed(this))
      .subscribe(this._setupMediaChangeListener);
  }

  /**
   * Setup the initial folded status
   */
  private _setupFolded(): void {
    // Return, if sidebar is not folded/opened
    if (!this.folded || !this.opened) {
      return;
    }

    // Programmatically add/remove padding to the element
    // that comes after or before based on the position
    let sibling, styleRule;

    const styleValue = this.foldedWidth + 'px';

    // Get the sibling and set the style rule
    if (this.position === 'left') {
      sibling = this._elementRef.nativeElement.nextElementSibling;
      styleRule = 'padding-left';
    } else {
      sibling = this._elementRef.nativeElement.previousElementSibling;
      styleRule = 'padding-right';
    }

    // If there is no sibling, return...
    if (!sibling) {
      return;
    }

    // Fold the sidebar
    this.fold();

    // Set the folded width
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'width',
      styleValue
    );
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'min-width',
      styleValue
    );
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'max-width',
      styleValue
    );

    // Set the style and class
    this._renderer.setStyle(sibling, styleRule, styleValue);
    this._renderer.addClass(this._elementRef.nativeElement, 'folded');
  }

  /**
   * Show the backdrop
   */
  private _showBackdrop(): void {
    // Create the backdrop element
    this._backdrop = this._renderer.createElement('div');

    if (!this._backdrop) {
      return;
    }

    // Add a class to the backdrop element
    this._backdrop.classList.add('sidebar-overlay');

    // Add a class depending on the invisibleOverlay option
    if (this.invisibleOverlay) {
      this._backdrop.classList.add('sidebar-overlay-invisible');
    }

    // Append the backdrop to the parent of the sidebar
    this._renderer.appendChild(
      this._elementRef.nativeElement.parentElement,
      this._backdrop
    );

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms ease', style({ opacity: 1 }))])
      .create(this._backdrop);

    // Play the animation
    this._player.play();

    // Add an event listener to the overlay
    this._backdrop.addEventListener('click', () => {
      this.close();
    });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Hide the backdrop
   */
  private _hideBackdrop(): void {
    if (!this._backdrop) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms ease', style({ opacity: 0 }))])
      .create(this._backdrop);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the backdrop still exists...
      if (this._backdrop) {
        // Remove the backdrop
        const parentNode = this._backdrop.parentNode;
        parentNode && parentNode.removeChild(this._backdrop);
        this._backdrop = null;
      }
    });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Change some properties of the sidebar
   * and make it visible
   */
  private _showSidebar(): void {
    // Remove the box-shadow style
    this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

    // Make the sidebar invisible
    this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  private _setupMediaChangeListener = ({
    MediaObserver,
  }: typeof import('@cosmos/flex-layout')): void => {
    const mediaObserver = this._injector.get(MediaObserver);

    mediaObserver
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe((change) => {
        if (this.activeMediaQuery !== change.mqAlias) {
          this.activeMediaQuery = change.mqAlias;
          this.onMediaChange.next(change.mqAlias);
        }
      });

    this.onMediaChange.pipe(untilDestroyed(this)).subscribe(() => {
      // Get the active status
      const isActive = mediaObserver.isActive(this.lockedOpen);

      // If the both status are the same, don't act
      if (this._wasActive === isActive) {
        return;
      }

      // Activate the lockedOpen
      if (isActive) {
        // Set the lockedOpen status
        this.isLockedOpen = true;

        // Show the sidebar
        this._showSidebar();

        // Force the the opened status to true
        this.opened = true;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // If the sidebar was folded, forcefully fold it again
        if (this._wasFolded) {
          // Enable the animations
          this._enableAnimations();

          // Fold
          this.folded = true;

          // Mark for check
          this._changeDetectorRef.markForCheck();
        }

        // Hide the backdrop if any exists
        this._hideBackdrop();
      } else {
        // De-Activate the lockedOpen
        // Set the lockedOpen status
        this.isLockedOpen = false;

        // Unfold the sidebar in case if it was folded
        this.unfold();

        // Force the the opened status to close
        this.opened = false;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // Hide the sidebar
        this._hideSidebar();
      }

      // Store the new active status
      this._wasActive = isActive;
    });
  };

  /**
   * Change some properties of the sidebar
   * and make it invisible
   */
  private _hideSidebar(delay = true): void {
    const delayAmount = delay ? 300 : 0;

    // Add a delay so close animation can play
    setTimeout(() => {
      // Remove the box-shadow
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'box-shadow',
        'none'
      );

      // Make the sidebar invisible
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'visibility',
        'hidden'
      );
    }, delayAmount);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Enable the animations
   */
  private _enableAnimations(): void {
    // Return if animations already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open the sidebar
   */
  open(): void {
    if (this.opened || this.isLockedOpen) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Show the sidebar
    this._showSidebar();

    // Show the backdrop
    this._showBackdrop();

    // Set the opened status
    this.opened = true;

    // Emit the 'openedChanged' event
    this.openedChanged.emit(this.opened);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the sidebar
   */
  close(): void {
    if (!this.opened || this.isLockedOpen) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Hide the backdrop
    this._hideBackdrop();

    // Set the opened status
    this.opened = false;

    // Emit the 'openedChanged' event
    this.openedChanged.emit(this.opened);

    // Hide the sidebar
    this._hideSidebar();

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle open/close the sidebar
   */
  toggleOpen(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Mouseenter
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    // Only work if the auto trigger is enabled
    if (!this.foldedAutoTriggerOnHover) {
      return;
    }
    this._document.body.classList.add('sidebar-hover');
    this.unfoldTemporarily();
  }

  /**
   * Mouseleave
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Only work if the auto trigger is enabled
    if (!this.foldedAutoTriggerOnHover) {
      return;
    }
    this._document.body.classList.remove('sidebar-hover');
    this.foldTemporarily();
  }

  /**
   * Fold the sidebar permanently
   */
  fold(): void {
    // Only work if the sidebar is not folded
    if (this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Fold
    this.folded = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Unfold the sidebar permanently
   */
  unfold(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Unfold
    this.folded = false;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle the sidebar fold/unfold permanently
   */
  toggleFold(): void {
    if (this.folded) {
      this.unfold();
    } else {
      this.fold();
    }
  }

  /**
   * Fold the temporarily unfolded sidebar back
   */
  foldTemporarily(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Fold the sidebar back
    this.unfolded = false;

    // Set the folded width
    const styleValue = this.foldedWidth + 'px';

    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'width',
      styleValue
    );
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'min-width',
      styleValue
    );
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'max-width',
      styleValue
    );

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Unfold the sidebar temporarily
   */
  unfoldTemporarily(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Unfold the sidebar temporarily
    this.unfolded = true;

    // Remove the folded width
    this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
    this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
    this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
