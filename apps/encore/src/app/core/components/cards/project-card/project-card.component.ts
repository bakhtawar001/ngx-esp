import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosContextIconModule } from '@cosmos/components/context-icon';
import { CosPillModule } from '@cosmos/components/pill';
import { CosTrackerModule } from '@cosmos/components/tracker';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'esp-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
  @Input() clientColor = '#0C68A2';

  detailShown = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.detailShown = result.matches;

        this.cd.markForCheck();
      });
  }

  toggleDetail() {
    this.detailShown = !this.detailShown;
    this.cd.markForCheck();
  }
}

@NgModule({
  declarations: [ProjectCardComponent],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CosPillModule,
    CosAvatarModule,
    CosTrackerModule,
    CosContextIconModule,
  ],
  exports: [ProjectCardComponent],
})
export class ProjectCardModule {}
