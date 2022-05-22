import { Injectable } from '@angular/core';

import {
  Embed,
  factories,
  IEmbedConfiguration,
  service as pbi,
} from 'powerbi-client';

export function pbiServiceFactory() {
  return new PowerBIService(
    new pbi.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    )
  );
}

@Injectable({
  providedIn: 'root',
  useFactory: pbiServiceFactory,
})
export class PowerBIService {
  constructor(protected readonly _service: pbi.Service) {}

  /**
   * Creates new report
   * @param HTMLElement Parent HTML element
   * @param IEmbedConfiguration Embed configuration
   * @returns Embed Embedded object
   */
  createReport(element: HTMLElement, config: IEmbedConfiguration): Embed {
    return this._service.createReport(element, config);
  }

  /**
   * Given a configuration based on an HTML element,
   * if the component has already been created and attached to the element, reuses the component instance and existing iframe,
   * otherwise creates a new component instance.
   *
   * @param HTMLElement Parent HTML element
   * @param IEmbedConfiguration Embed configuration
   * @returns Embed Embedded object
   */
  embed(element: HTMLElement, config: IEmbedConfiguration): Embed {
    return this._service.embed(element, config);
  }

  /**
   * Given an HTML element that has a component embedded within it,
   * removes the component from the list of embedded components,
   * removes the association between the element and the component, and removes the iframe.
   *
   * @param HTMLElement Parent HTML element
   * @returns void
   */
  reset(element: HTMLElement): void {
    this._service.reset(element);
  }
}
