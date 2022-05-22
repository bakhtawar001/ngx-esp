import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line
import { environment } from 'apps/contentful-preview/src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  id: string;
  smartlinkUrl: string;
  error: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.smartlinkUrl = environment.SMARTLINK_API;
  }

  errorHandler($event): void {
    this.error = $event;
  }
}
