import { Component } from '@angular/core';
import { createComponentFactory } from '@ngneat/spectator/jest';

import { ClickOutsideModule } from './click-outside.directive';

describe('[clickOutside]', () => {
  @Component({
    template: `
      <div class="a" (clickOutside)="clickOutside()">
        <div class="c"></div>
      </div>

      <div class="b"></div>
    `,
  })
  class TestComponent {
    eventHasBeenEmitted = false;

    clickOutside(): void {
      this.eventHasBeenEmitted = true;
    }
  }

  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [ClickOutsideModule],
    declarations: [TestComponent],
  });

  it('should not emit the event if the element has been clicked inside', () => {
    // Arrange
    const spectator = createComponent();
    // Act
    spectator.click(spectator.query('.a')!);
    spectator.click(spectator.query('.c')!);
    // Assert
    expect(spectator.component.eventHasBeenEmitted).toEqual(false);
  });

  it('should emit the event if some element has been clicked outside of the host', () => {
    // Arrange
    const spectator = createComponent();
    // Act
    spectator.click(spectator.query('.b')!);
    // Assert
    expect(spectator.component.eventHasBeenEmitted).toEqual(true);
  });
});
