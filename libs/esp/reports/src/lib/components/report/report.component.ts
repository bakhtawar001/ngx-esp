import {
  Component,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';

import { Embed, IEmbedConfiguration } from 'powerbi-client';
import { PowerBIService } from '../../services/powerbi.service';

@Component({
  selector: 'esp-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnChanges, OnDestroy {
  // Private
  private component: Embed | null = null;

  @Input()
  public config!: IEmbedConfiguration;
  @Output() embedded = new EventEmitter<Embed>();

  @ViewChild('powerbiWrapper', { static: true })
  powerbiWrapper!: ElementRef;

  /**
   * Constructor
   *
   */
  constructor(protected powerBIService: PowerBIService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {
    const { config } = changes;

    if (config.previousValue === config.currentValue) {
      return;
    }

    if (this.isValid()) {
      this.reset(this.powerbiWrapper.nativeElement);
      this.embed(this.powerbiWrapper.nativeElement, config.currentValue);
    } else if (this.component) {
      this.reset(this.powerbiWrapper.nativeElement);
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.component) {
      this.reset(this.powerbiWrapper.nativeElement);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  public isValid(): boolean {
    return !!this.config?.embedUrl && !!this.config?.accessToken;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Given an HTMLElement, construct an embed configuration based on attributes and pass to service.
   * @param element - native element where the embedding needs to be done
   * @param config - configuration to be embedded
   */
  private embed(element: HTMLElement, config: IEmbedConfiguration) {
    this.component = this.powerBIService.embed(element, config);

    this.embedded.emit(this.component);
  }

  /**
   * Reset the component that has been removed from DOM.
   * @param element - native element where the embedded was made
   */
  private reset(element: HTMLElement) {
    this.powerBIService.reset(element);

    this.component = null;
  }
}
