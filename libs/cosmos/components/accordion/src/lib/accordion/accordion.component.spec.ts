import { ENTER, TAB } from '@angular/cdk/keycodes';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosAccordionComponent } from './accordion.component';

describe('CosAccordionComponent', () => {
  let component: CosAccordionComponent;
  let spectator: Spectator<CosAccordionComponent>;

  const expandedClass = 'cos-accordion--expanded';

  const createComponent = createComponentFactory({
    component: CosAccordionComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        accordionTitle: 'This is the title of the component',
        expanded: false,
        disabled: false,
        hideToggle: false,
      },
    });
    component = spectator.component;
  });

  it('should display the accordion title correctly', () => {
    // Arrange & act & assert
    const title = 'This is the title of the component';
    const accordionTitle = spectator.query(
      '.cos-accordion-header > .cos-accordion-header--label'
    );
    expect(accordionTitle).toHaveText(title);
  });

  it('should not expand the accordion by default', () => {
    // Arrange & act & assert
    const accordionBtn = spectator.query('.cos-accordion-header')!;
    expect(accordionBtn.getAttribute('aria-expanded')).toEqual('false');
  });

  it('should not disable the accordion by default', () => {
    // Arrange & act & assert
    const accordionBtn = spectator.query('.cos-accordion-header')!;
    expect(accordionBtn.getAttribute('disabled')).toEqual('false');
  });

  it('expands when clicked and then collapse when clicked again', () => {
    // Arrange & act & assert
    const compiled = spectator.debugElement.nativeElement;
    const button: HTMLElement = spectator.query('.cos-accordion-header');
    expect(compiled).not.toHaveClass(expandedClass);

    spectator.click(button);
    spectator.detectChanges();
    expect(compiled).toHaveClass(expandedClass);

    spectator.click(button);
    spectator.detectChanges();
    expect(compiled).not.toHaveClass(expandedClass);
  });

  it('should expand the accordion when the space or enter key is dispatched on the header', () => {
    // Arrange & act & assert
    const appRef = TestBed.inject(ApplicationRef);
    const spy = jest.spyOn(appRef, 'tick');
    const compiled = spectator.debugElement.nativeElement;
    const button: HTMLElement = spectator.query('.cos-accordion-header');

    // The `spectator.dispatchKeyboardEvent` calls `detectChanges()` internally.
    button.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: TAB,
      })
    );

    expect(spy).not.toHaveBeenCalled();
    expect(compiled).not.toHaveClass(expandedClass);

    spectator.dispatchKeyboardEvent(button, 'keydown', ENTER);

    expect(spy).toHaveBeenCalled();
    expect(compiled).toHaveClass(expandedClass);
  });
});
