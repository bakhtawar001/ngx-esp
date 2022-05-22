import { By } from '@angular/platform-browser';
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import { CosInputDirective } from './input.directive';
import { CosInputModule } from './input.module';

describe('CosInputDirective', () => {
  let spectator: SpectatorDirective<CosInputDirective>;

  const createDirective = createDirectiveFactory({
    directive: CosInputDirective,
    imports: [CosInputModule],
  });

  beforeEach(() => (spectator = createDirective('<input cos-input />')));

  it('should add classes', () => {
    const input = spectator.debugElement.query(By.css('input'));

    expect(input.nativeElement.classList.contains('cos-input')).toBeTruthy();
  });
});
