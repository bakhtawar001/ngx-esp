import { Observable } from 'rxjs';

export const raf$ = new Observable<void>((subscriber) => {
  const rafId = requestAnimationFrame(() => {
    subscriber.next();
    subscriber.complete();
  });
  return () => cancelAnimationFrame(rafId);
});
