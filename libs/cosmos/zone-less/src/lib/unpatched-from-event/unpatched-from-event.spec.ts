/// <reference types="zone.js" />

import { TestBed } from '@angular/core/testing';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { unpatchedFromEvent } from './unpatched-from-event';

describe('unpatchedFromEvent', () => {
  @UntilDestroy()
  @Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
  class UnpatchedComponent implements OnInit {
    listenerHasBeenCalledWithinTheAngularZone!: boolean;

    ngOnInit(): void {
      unpatchedFromEvent(document, 'click')
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.listenerHasBeenCalledWithinTheAngularZone =
            NgZone.isInAngularZone();
        });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnpatchedComponent],
    });
  });

  it('should retrieve the native DOM API and add event listener', () => {
    const addEventListenerSpy = jest.spyOn(
      document,
      Zone.__symbol__('addEventListener') as 'addEventListener'
    );

    const removeEventListenerSpy = jest.spyOn(
      document,
      Zone.__symbol__('removeEventListener') as 'removeEventListener'
    );

    const fixture = TestBed.createComponent(UnpatchedComponent);
    fixture.detectChanges();

    document.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      })
    );

    fixture.destroy();

    try {
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(
        fixture.componentInstance.listenerHasBeenCalledWithinTheAngularZone
      ).toEqual(false);
    } finally {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    }
  });
});
