import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { OptInPreloadStrategy } from '@cosmos/router';

const ROUTER_OPTIONS: ExtraOptions = {
  preloadingStrategy: OptInPreloadStrategy,
};

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    loadChildren: async () =>
      (await import('./presentations/presentations.module'))
        .PresentationsModule,
    data: { preload: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, ROUTER_OPTIONS)],
})
export class AppRoutingModule {}
