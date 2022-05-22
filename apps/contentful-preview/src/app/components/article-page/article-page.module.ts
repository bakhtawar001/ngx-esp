import { NgModule } from '@angular/core';
import { ArticlePageComponent } from './article-page.component';
import { RouterModule } from '@angular/router';
import { SponsoredContentModule } from '@contentful/sponsored-content';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SponsoredContentModule,
    RouterModule.forChild([{ path: '', component: ArticlePageComponent }]),
  ],
  declarations: [ArticlePageComponent],
})
export class ArticlePageModule {}
