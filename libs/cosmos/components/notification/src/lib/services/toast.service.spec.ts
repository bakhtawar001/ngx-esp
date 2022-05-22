import { HotToastService } from '@ngneat/hot-toast';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ToastConfig, HotToastComponent } from './lazy-hot-toast';
import { CosToastService, LazyHotToastLoader } from './toast.service';

describe('ToastService', () => {
  let service: CosToastService, hotToastMock: HotToastService;
  let spectator: SpectatorService<CosToastService>;

  const createService = createServiceFactory({
    service: CosToastService,
    imports: [NgxsModule.forRoot()],
    entryComponents: [],
    declarations: [MockComponent(HotToastComponent)],
    providers: [
      CosToastService,
      mockProvider(HotToastService),
      mockProvider(LazyHotToastLoader, {
        getLazyHotToast: () =>
          of({
            HotToastService,
            HotToastComponent,
          }),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(CosToastService);
    hotToastMock = spectator.inject(HotToastService);
  });

  it('shows toast', () => {
    service.showToast({ title: 'test', body: 'test', type: 'info' });

    expect(hotToastMock.show).toHaveBeenCalled();
  });

  it('passes data to toast', () => {
    const body = 'test';
    const title = 'test';
    const type = 'info';
    const config: ToastConfig = {
      duration: 0,
      position: 'bottom-right',
      dismissible: false,
      autoClose: true,
      className: 'cos-toast',
    };

    service.showToast({ body, title, type }, config);
    expect(hotToastMock.show).toHaveBeenCalledWith(HotToastComponent, {
      data: {
        body,
        title,
        type,
      },
      ...config,
    });
  });

  it('passes defaults', () => {
    const body = 'test';
    const title = 'test';
    const type = 'info';
    const config: ToastConfig = {
      duration: 3000,
      position: 'bottom-right',
      dismissible: false,
      autoClose: true,
      className: 'cos-toast',
    };

    service.showToast({ body, title, type });
    expect(hotToastMock.show).toHaveBeenCalledWith(HotToastComponent, {
      data: {
        body,
        title,
        type,
      },
      ...config,
    });
  });

  describe('helper methods', () => {
    let showToastSpy: jest.SpyInstance;
    const title = 'test',
      body = 'test';

    beforeEach(() => {
      showToastSpy = jest.spyOn(service, 'showToast');
    });

    it('shows success', () => {
      service.success(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        {
          title,
          body,
          type: 'confirm',
        },
        undefined
      );
    });

    it('shows error', () => {
      service.error(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        {
          title,
          body,
          type: 'error',
        },
        undefined
      );
    });

    it('shows info', () => {
      service.info(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        { title, body, type: 'info' },
        undefined
      );
    });

    it('shows warning', () => {
      service.warning(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        { title, body, type: 'warn' },
        undefined
      );
    });
  });
});
