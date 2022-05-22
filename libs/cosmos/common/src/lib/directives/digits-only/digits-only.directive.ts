import { Directive, HostListener, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[cosDigitsOnly]',
})
export class DigitsOnlyDirective {
  @Input() allowDecimals = false;
  @Input() decimalSeparator = '.';

  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  @HostListener('keydown.silent', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;
    if (
      this.navigationKeys.indexOf(key) > -1 ||
      (key === 'a' && ctrlKey === true) ||
      (key === 'c' && ctrlKey === true) ||
      (key === 'v' && ctrlKey === true) ||
      (key === 'x' && ctrlKey === true) ||
      (key === 'a' && metaKey === true) ||
      (key === 'c' && metaKey === true) ||
      (key === 'v' && metaKey === true) ||
      (key === 'x' && metaKey === true) ||
      (key === this.decimalSeparator && this.allowDecimals)
    ) {
      return;
    }

    if (key === ' ' || isNaN(Number(key))) {
      event.preventDefault();
    }
  }

  @HostListener('beforeinput.silent', ['$event'])
  onBeforeInput(event: InputEvent) {
    if (isNaN(Number(event.data))) {
      if (event.data === this.decimalSeparator && this.allowDecimals) {
        return; // go on
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    event.preventDefault();

    const regex = this.allowDecimals ? /[^0-9\.]+/g : /\D/g;
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(regex, ''); // get a digit-only string

    document.execCommand('insertText', false, pastedInput);
  }
}

@NgModule({
  declarations: [DigitsOnlyDirective],
  exports: [DigitsOnlyDirective],
})
export class DigitsOnlyDirectiveModule {}
