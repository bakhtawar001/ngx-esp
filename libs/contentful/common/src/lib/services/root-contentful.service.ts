import { Injectable } from '@angular/core';
import { ContentfulService } from './contentful.service';

@Injectable({
  providedIn: 'root',
})
export class RootContentfulService {
  private config: {
    space: string;
    accessToken: string;
    contentType?: string;
    environment: string;
    host?: string;
  };

  setGlobalConfig(config) {
    this.config = config;
  }

  getClient(): ContentfulService {
    if (this.config) {
      const contentful = new ContentfulService();

      contentful.setConfig(
        this.config.space,
        this.config.accessToken,
        this.config.environment,
        this.config.host
      );

      return contentful;
    }

    return new ContentfulService();
  }
}
