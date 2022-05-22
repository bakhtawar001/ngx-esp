import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

interface LoadScriptOptions {
  src: string;
  onLoad: VoidFunction;
}

export function loadScript(options: LoadScriptOptions): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = options.src;
  document.head.appendChild(script);
  fromEvent(script, 'load')
    .pipe(
      // Remove the event listener once the `load` event is triggered since zone.js additionaly stores callbacks on the `HTMLScriptElement` (inside the `__zone_symbol__loadfalse` property).
      take(1)
    )
    .subscribe(options.onLoad);
}
