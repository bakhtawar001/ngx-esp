import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';

const routes: Routes = [
  {
    path: 'articles/:id',
    loadChildren: () =>
      import('../components/article-page/article-page.module').then(
        m => m.ArticlePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
