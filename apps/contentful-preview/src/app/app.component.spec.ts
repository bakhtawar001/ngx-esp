import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app;
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterModule.forRoot([])],
    declarations: [AppComponent],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({});
    app = spectator.component;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
