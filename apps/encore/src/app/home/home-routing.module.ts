import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage, HomePageModule } from './pages/home/home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      analytics: {
        page: 'Home',
      },
      meta: { title: `Home` },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HomePageModule],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
