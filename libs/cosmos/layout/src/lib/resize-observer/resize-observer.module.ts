import { NgModule } from '@angular/core';
import { ResizeObserverDirective } from './resize-observer.directive';
import { ResizeObserverService } from './resize-observer.service';

@NgModule({
  declarations: [ResizeObserverDirective],
  exports: [ResizeObserverDirective],
  providers: [ResizeObserverService],
})
export class ResizeObserverModule {}
