import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import {
  CosActionBarComponent,
  CosActionBarControlsComponent,
} from './action-bar.component';
import { CosActionBarModule } from './action-bar.module';

describe(CosActionBarComponent.name, () => {
  let component: CosActionBarComponent;
  let spectator: Spectator<CosActionBarComponent>;

  const createComponent = createComponentFactory({
    component: CosActionBarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.query('.cos-action-bar-container')).toBeTruthy();
  });
});

describe(CosActionBarControlsComponent.name, () => {
  @Component({
    template: `
      <cos-action-bar>
        <cos-action-bar-controls></cos-action-bar-controls>
      </cos-action-bar>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {}

  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [CosActionBarModule],
  });

  it('should render the desktop view', () => {
    // Arrange
    const spectator = createComponent({
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe() {
              return of({ matches: true });
            },
          },
        },
      ],
    });

    // Act
    spectator.detectChanges();

    // Assert
    expect(spectator.query('cos-action-bar-controls')).toHaveClass(
      'cos-action-bar-controls'
    );
    expect(spectator.query('.cos-action-bar-menu-container')).toBeNull();
  });

  it('should render the mobile view', () => {
    // Arrange
    const spectator = createComponent({
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe() {
              return of({ matches: false });
            },
          },
        },
      ],
    });

    // Act
    spectator.detectChanges();

    // Assert
    expect(spectator.query('.cos-action-bar-menu-container')).toExist();
  });

  it('should toggle the menu when the button is clicked', () => {
    // cos-action-bar-menu
    // Arrange
    const spectator = createComponent({
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe() {
              return of({ matches: false });
            },
          },
        },
      ],
    });

    // Act
    spectator.detectChanges();

    // Assert
    expect(spectator.query('.cos-action-bar-menu')).toBeNull();
    spectator.click('.cos-action-bar-menu-button');
    expect(spectator.query('.cos-action-bar-menu')).toExist();
  });
});
