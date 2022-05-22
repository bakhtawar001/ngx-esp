import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogService } from '@cosmos/core';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  const createService = createServiceFactory({
    service: ConfirmDialogService,
    imports: [MatDialogModule],
    mocks: [MatDialog],
  });

  const testSetup = () => {
    const spectator = createService();
    const dialog = spectator.inject(DialogService);

    return { dialog, service: spectator.service, spectator };
  };

  it('should create', () => {
    // Arrange
    const { service } = testSetup();

    // Assert
    expect(service).toBeTruthy();
  });

  it("should call dialog's open method with appropiate data, when dialog is closed", () => {
    // Arrange
    const { dialog, service } = testSetup();
    jest.spyOn(dialog, 'open');

    // Act
    service.confirmDiscardChanges();

    expect(dialog.open).toHaveBeenCalled();
  });
});
