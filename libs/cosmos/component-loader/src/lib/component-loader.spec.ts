import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  NgModule,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ComponentLoader } from './component-loader';

describe('ComponentLoader', () => {
  @Component({
    selector: 'app-hello',
    template: '<div class="hello">Hello</div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class HelloComponent {}

  @NgModule({
    declarations: [HelloComponent],
  })
  class HelloModule {}

  @Component({
    selector: 'app-parent',
    template: '<ng-template #container></ng-template>',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class ParentComponent implements OnInit {
    @ViewChild('container', { read: ViewContainerRef, static: true })
    container!: ViewContainerRef;

    onReady = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });

    private resolve!: VoidFunction;

    constructor(private componentLoader: ComponentLoader) {}

    ngOnInit(): void {
      this.componentLoader
        .resolveComponentFactory(
          Promise.resolve().then(() => ({
            module: HelloModule,
            component: HelloComponent,
          }))
        )
        // eslint-disable-next-line rxjs-angular/prefer-takeuntil
        .subscribe((componentFactory) => {
          this.container.createComponent(componentFactory);
          this.resolve();
        });
    }
  }

  it('should return the component factory for a single component', async () => {
    // Arrange
    const componentLoader = TestBed.inject(ComponentLoader);

    // Act
    const componentFactoty = await firstValueFrom(
      componentLoader.resolveComponentFactory(
        Promise.resolve().then(() => ({
          module: HelloModule,
          component: HelloComponent,
        }))
      )
    );

    // Assert
    expect(componentFactoty).toBeInstanceOf(ComponentFactory);
    expect(componentFactoty.selector).toEqual('app-hello');
    expect(componentFactoty.componentType).toBe(HelloComponent);
  });

  it('should render the dynamic component', async () => {
    // Arrange
    TestBed.configureTestingModule({
      declarations: [ParentComponent],
    });

    const fixture = TestBed.createComponent(ParentComponent);
    fixture.detectChanges();

    // Act
    await fixture.componentInstance.onReady;

    // Assert
    expect(
      fixture.debugElement.nativeElement.querySelector('app-hello').innerHTML
    ).toEqual('<div class="hello">Hello</div>');
  });
});
