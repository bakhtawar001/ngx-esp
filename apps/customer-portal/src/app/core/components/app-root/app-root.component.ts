import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosmosLayoutModule } from '@cosmos/layout';
import { EncoreLayoutModule } from '@esp/layouts/encore-layout';

@Component({
  selector: 'esp-app-root',
  templateUrl: './app-root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRootComponent {}

@NgModule({
  declarations: [AppRootComponent],
  imports: [CosmosLayoutModule, EncoreLayoutModule],
  exports: [AppRootComponent],
})
export class AppRootComponentModule {}
