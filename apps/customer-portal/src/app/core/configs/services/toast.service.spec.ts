import { MatSnackBar } from '@angular/material/snack-bar';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { ToastComponent, ToastConfig, ToastService } from './toast.service';

describe('ToastService', () => {
  let spectator: SpectatorService<ToastService>;
  let service: ToastService;
  let snackBar: SpyObject<MatSnackBar>;

  const createService = createServiceFactory({
    service: ToastService,
    declarations: [MockComponent(ToastComponent)],
    mocks: [MatSnackBar],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  beforeEach(() => (snackBar = spectator.inject(MatSnackBar)));

  it('shows toast', () => {
    service.showToast('test', 'test');

    expect(snackBar.openFromComponent).toHaveBeenCalled();
  });

  it('passes data to snackbar', () => {
    const body = 'test';
    const title = 'test';
    const type = 'test';
    const config: ToastConfig = {
      duration: 0,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };

    service.showToast(body, title, type, config);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(ToastComponent, {
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
    const type = 'test';
    const config: ToastConfig = {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    };

    service.showToast(body, title, type);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(ToastComponent, {
      data: {
        body,
        title,
        type,
      },
      ...config,
    });
  });

  describe('helper methods', () => {
    let showToastSpy;
    const title = 'test',
      body = 'test';

    beforeEach(() => {
      showToastSpy = jest.spyOn(service, 'showToast');
    });

    it('shows success', () => {
      service.success(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        title,
        body,
        'confirm',
        undefined
      );
    });

    it('shows error', () => {
      service.error(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(
        title,
        body,
        'error',
        undefined
      );
    });

    it('shows info', () => {
      service.info(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(title, body, 'info', undefined);
    });

    it('shows warning', () => {
      service.warning(title, body);

      expect(showToastSpy).toHaveBeenCalledWith(title, body, 'warn', undefined);
    });
  });
});
