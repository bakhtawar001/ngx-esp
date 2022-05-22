import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { CosButtonModule } from './button.module';
import { CosAnchorComponent, CosButtonComponent } from './button.component';

describe('CosButtonComponent', () => {
  let spectator: SpectatorHost<CosButtonComponent>;
  let component: CosButtonComponent;
  const createHost = createHostFactory({
    component: CosButtonComponent,
    imports: [CosButtonModule],
  });

  describe('with plain text', () => {
    beforeEach(() => {
      spectator = createHost(`
      <button cos-button
      [size]="size"
      [color]="color"
      [disabled]="disabled"
    >
      {{ text }}
    </button>`);
      component = spectator.component;
    });

    it('should default button to cos-button', () => {
      const button = spectator.queryHost('button')!;

      expect(button).toExist();
      expect(button.classList.contains('cos-button')).toBeTruthy();
      expect(button.classList.contains('cos-button--lg')).toBeFalsy();
      expect(button.classList.contains('cos-button--sm')).toBeFalsy();
      expect(button.classList.contains('disabled')).toBeFalsy();
    });

    it('should add sm class', () => {
      component.size = 'sm';
      spectator.detectComponentChanges();
      const button = spectator.queryHost('button')!;
      expect(button.classList.contains('cos-button--sm')).toBeTruthy();
    });

    it('should add lg class', () => {
      component.size = 'lg';
      spectator.detectComponentChanges();
      const button = spectator.queryHost('button')!;
      expect(button.classList.contains('cos-button--lg')).toBeTruthy();
    });

    it('should add warn color class', () => {
      component.color = 'warn';
      spectator.detectComponentChanges();
      const button = spectator.queryHost('button')!;
      expect(button.classList.contains('cos-warn')).toBeTruthy();
    });

    it('should add disabled class', () => {
      spectator.component.disabled = true;
      spectator.detectChanges();
      const button = spectator.queryHost('button')!;

      expect(button.classList.contains('cos-button-disabled')).toBeTruthy();
    });
  });

  it('should add icon class', () => {
    const spectator = createHost(`
     <button cos-icon-button [color]="color" [disabled]="disabled">
      {{ text }}
     </button>
    `);
    const button = spectator.queryHost('button')!;
    expect(button.classList.contains('cos-icon-button')).toBeTruthy();
  });
});

describe('CosAnchorComponent', () => {
  let spectator: SpectatorHost<CosAnchorComponent>;

  const createHost = createHostFactory({
    component: CosAnchorComponent,
    imports: [CosButtonModule],
  });

  beforeEach(() => {
    spectator = createHost(`
    <a cos-button [size]="size" [color]="color" [disabled]="disabled">
       {{ text }}
    </a>
    `);
  });

  it('Should halt events when disabled', () => {
    // Arrange
    spectator.component.disabled = true;
    spectator.detectComponentChanges();
    const event = new MouseEvent('click');
    event.preventDefault = jest.fn();
    event.stopImmediatePropagation = jest.fn();
    // Act
    spectator.debugElement.nativeElement.dispatchEvent(event);
    // Assert
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('Should allow events when enabled', () => {
    // Arrange
    const event = new MouseEvent('click');
    event.preventDefault = jest.fn();
    event.stopImmediatePropagation = jest.fn();
    // Act
    spectator.debugElement.nativeElement.dispatchEvent(event);
    // Assert
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });

  // `@UntilDestroy()` previously had issues with extendable components, let's just ensure that the listener is removed w/o issues.
  it('should remove the event listener when the component gets destroyed', () => {
    // Arrange
    const spy = jest.spyOn(
      spectator.debugElement.nativeElement,
      'removeEventListener'
    );
    // Act
    spectator.fixture.destroy();
    // Assert
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function), undefined);
  });
});
