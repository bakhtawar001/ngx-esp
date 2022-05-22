import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FilterPipeModule, ReactiveComponent } from '@cosmos/common';
import { NavigationModule, NavigationService } from '@cosmos/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'esp-navbar-modal',
  templateUrl: './navbar-modal.component.html',
  styleUrls: ['./navbar-modal.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarModalComponent extends ReactiveComponent {
  showSearch = true;
  searchTerm = '';

  constructor(private _navigationService: NavigationService) {
    super();
  }

  protected override setState() {
    this.state = this.connect({
      applications: this._navigationService.currentNavigation$.pipe(
        map((navigation) => {
          return navigation
            .filter((i) => i.hidden)
            .map((i) => ({ ...i, hidden: false }));
        })
      ),
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NavigationModule,
    FilterPipeModule,
    MatInputModule,
    MatIconModule,
  ],
  declarations: [NavbarModalComponent],
  exports: [NavbarModalComponent],
})
export class NavbarModalModule {}
