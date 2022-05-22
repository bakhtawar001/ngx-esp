import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  CosRadioButtonComponent,
  CosRadioGroupDirective
} from './radio.component';
import { CosRadioModule } from './radio.module';

/* eslint-disable */
// eslint-disable-next-line @angular-eslint/use-component-selector
@Component({
  template: `
    <div
      cosRadioGroup
      [disabled]="isGroupDisabled"
      [labelPosition]="labelPos"
      [required]="isGroupRequired"
      [value]="groupValue"
      name="test-name"
    >
      <cos-radio-button value="fire"> Charmander </cos-radio-button>
      <cos-radio-button value="water"> Squirtle </cos-radio-button>
      <cos-radio-button value="leaf"> Bulbasaur </cos-radio-button>
    </div>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class RadiosInsideRadioGroup {
  labelPos?: 'before' | 'after';
  isFirstDisabled = false;
  isGroupDisabled = false;
  isGroupRequired = false;
  groupValue: string | null = null;
}

describe('CosRadio', () => {
  describe('inside of a group', () => {
    let spectator: Spectator<RadiosInsideRadioGroup>;
    let groupDebugElement: DebugElement;
    let radioDebugElements: DebugElement[];
    let radioNativeElements: HTMLElement[];
    let radioLabelElements: HTMLLabelElement[];
    let radioInputElements: HTMLInputElement[];
    let groupInstance: CosRadioGroupDirective;
    let radioInstances: CosRadioButtonComponent[];
    let component: RadiosInsideRadioGroup;

    const createComponent = createComponentFactory({
      component: RadiosInsideRadioGroup,
      imports: [CosRadioModule, FormsModule],
      declarations: [RadiosInsideRadioGroup],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      groupDebugElement = spectator.debugElement.query(
        By.directive(CosRadioGroupDirective)
      )!;
      groupInstance = groupDebugElement.injector.get<CosRadioGroupDirective>(
        CosRadioGroupDirective
      );
      radioDebugElements = spectator.debugElement.queryAll(
        By.directive(CosRadioButtonComponent)
      );
      radioNativeElements = radioDebugElements.map(
        (debugEl) => debugEl.nativeElement
      );
      radioInstances = radioDebugElements.map(
        (debugEl) => debugEl.componentInstance
      );
      radioLabelElements = radioDebugElements.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (debugEl) => debugEl.query(By.css('label'))!.nativeElement
      );
      radioInputElements = radioDebugElements.map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (debugEl) => debugEl.query(By.css('input'))!.nativeElement
      );
    });

    it('should set individual radio names based on the group name', () => {
      expect(groupInstance.name).toBeTruthy();
      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }
    });

    it('should coerce the disabled binding on the radio group', () => {
      (groupInstance as any).disabled = '';
      spectator.detectChanges();

      radioLabelElements[0].click();
      spectator.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
      expect(groupInstance.disabled).toBe(true);
    });

    it('should disable click interaction when the group is disabled', () => {
      component.isGroupDisabled = true;
      spectator.detectComponentChanges();

      radioLabelElements[0].click();
      spectator.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
    });

    it('should update the group and radios when one of the radios is clicked', () => {
      expect(groupInstance.value).toBeFalsy();

      radioLabelElements[0].click();
      spectator.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBe(true);
      expect(radioInstances[1].checked).toBe(false);

      radioLabelElements[1].click();
      spectator.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(groupInstance.selected).toBe(radioInstances[1]);
      expect(radioInstances[0].checked).toBe(false);
      expect(radioInstances[1].checked).toBe(true);
    });

    it('should check a radio upon interaction with the underlying native radio button', () => {
      radioInputElements[0].click();
      spectator.detectChanges();

      expect(radioInstances[0].checked).toBe(true);
      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
    });
  });
});
