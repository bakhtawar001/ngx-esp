import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout';
import { HasRolePipeModule, IsOwnerPipeModule } from '@esp/auth';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DirectoryMenu, DIRECTORY_MENU } from '../../configs';

@UntilDestroy()
@Component({
  selector: 'esp-directory-search-page',
  templateUrl: './directory-search.page.html',
  styleUrls: ['./directory-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DIRECTORY_MENU, useValue: DirectoryMenu }],
})
export class DirectorySearchPage {
  constructor(
    @Inject(DIRECTORY_MENU) public readonly directoryMenu: NavigationItem[]
  ) {}
}

@NgModule({
  declarations: [DirectorySearchPage],
  imports: [
    CommonModule,
    RouterModule,
    CosVerticalMenuModule,
    HasRolePipeModule.withProvide(),
    IsOwnerPipeModule.withProvide(),
  ],
})
export class DirectorySearchPageModule {}
