import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { ContentfulService } from '@contentful/common/services/contentful.service';
import {
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  Component,
} from '@angular/core';
import type { CreateClientParams } from 'contentful';

@Component({
  template: '',
  selector: 'sponsored-content-contentful-component',
})
export abstract class ContentfulComponent implements OnInit, OnChanges {
  @Input() contentfulConfig: string | CreateClientParams;
  @Output() error: EventEmitter<any> = new EventEmitter();

  protected contentful: ContentfulService;
  protected _contentfulConfig: CreateClientParams;
  protected angularJsBindingRegex = new RegExp(/^{{.*}}$/);

  constructor(protected contentfulFactory: RootContentfulService) {
    this.contentful = contentfulFactory.getClient();
  }

  ngOnInit() {
    this.setConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contentfulConfig && changes.contentfulConfig.currentValue) {
      this.setConfig();
    }
  }

  protected setConfig() {
    try {
      if (!!(!this.contentful.hasClient && this.contentfulConfig)) {
        if (
          typeof this.contentfulConfig === 'string' &&
          this.angularJsBindingRegex.test(this.contentfulConfig)
        ) {
          return;
        } else if (typeof this.contentfulConfig === 'string') {
          this._contentfulConfig = JSON.parse(this.contentfulConfig);
        } else {
          this._contentfulConfig = <CreateClientParams>this.contentfulConfig;
        }

        const { space, accessToken, environment, host } =
          this._contentfulConfig;

        this.contentful.setConfig(space, accessToken, environment, host);
      }
    } catch (e) {
      this.errorHandler(e);
    }
  }

  protected errorHandler(e) {
    console.log('errorhandler', e);
    this.error.next(e);
  }
}
