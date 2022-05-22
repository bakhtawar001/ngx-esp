import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReactiveComponent } from '@cosmos/common';
import { CosmosConfigService } from '@cosmos/core';
import { NavigationItem, NavigationService } from '@cosmos/layout';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavbarModalComponent } from './navbar-modal.component';

@Component({
  selector: 'esp-navbar',
  templateUrl: './navbar.component.html',
  // styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent
  extends ReactiveComponent
  implements AfterViewInit
{
  private dialogRef: MatDialogRef<NavbarModalComponent>;

  @ViewChild('navbar')
  private navbarElementRef: ElementRef;

  showMore$ = new BehaviorSubject<boolean>(false);

  appbarSettings = {
    height: 0,
    buttonHeight: 0,
    footerHeight: 0,
  };
  applications: NavigationItem[] = [];

  @Input()
  public navigationKey = 'main';

  constructor(
    private _configService: CosmosConfigService,
    private _navigationService: NavigationService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngAfterViewInit() {
    const toolbarWrapper = this.navbarElementRef.nativeElement;
    const items = toolbarWrapper?.querySelectorAll(
      '.navbar-menu__items .nav-item a'
    );
    const footer = toolbarWrapper?.querySelector('.navbar-menu__footer');

    this.appbarSettings = {
      height: toolbarWrapper?.scrollHeight ?? 0,
      footerHeight: footer?.offsetHeight,
      buttonHeight: items[0]?.offsetHeight,
    };

    this.applications = this.mapApplications();
  }

  mapApplications() {
    const items = this._navigationService.getNavigation(this.navigationKey);

    return items.map(
      (item): NavigationItem => ({
        ...item,
        type: 'item',
      })
    );
  }

  measureAppbar(entry) {
    const cr = entry.contentRect;

    let visibleAppCount = this.applications.length;

    if (this.appbarSettings.height > cr.height) {
      visibleAppCount = Math.floor(
        (cr.height -
          this.appbarSettings.footerHeight -
          this.appbarSettings.buttonHeight || 1) /
          this.appbarSettings.buttonHeight
      );
    }

    const showMore = visibleAppCount < this.applications.length;

    this.showMore$.next(showMore);

    if (this.dialogRef && !showMore) {
      this.dialogRef.close();
    }

    for (let i = 0; i < this.applications.length; i++) {
      const hidden = i >= visibleAppCount;

      if (this.applications[i].hidden !== hidden) {
        this._navigationService.updateNavigationItem(
          this.applications[i].id,
          { hidden } as NavigationItem,
          this.navigationKey
        );
      }
    }
  }

  showAppDialog(): void {
    if (this.dialogRef?.getState() === 0) {
      return;
    }

    const dialogConfig = <MatDialogConfig>{
      width: '340px',
      height: '400px',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      disableClose: false,
      panelClass: 'application-list',
      position: {
        top: '64px',
        left: '68px',
      },
    };

    this.dialogRef = this.dialog.open(NavbarModalComponent, dialogConfig);
  }

  protected override setState() {
    this.state = this.connect({
      applications: this._navigationService.currentNavigation$.pipe(
        map((navigation) => {
          return navigation.map((item) => ({
            ...item,
            type: 'item',
          }));
        })
      ),
      config: this._configService.config$,
    });
  }
}
