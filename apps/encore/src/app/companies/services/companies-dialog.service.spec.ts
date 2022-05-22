import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogService } from '@cosmos/core';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CompaniesDialogService } from './companies-dialog.service';

describe('CompaniesDialogService', () => {
  let spectator: SpectatorService<CompaniesDialogService>;

  const createService = createServiceFactory({
    service: CompaniesDialogService,
    imports: [MatDialogModule],
    mocks: [MatDialog],
    providers: [DialogService],
  });

  const testSetup = () => {
    const spectator = createService();
    return { spectator, service: spectator.service };
  };

  it('should create', () => {
    //Arrange
    const { spectator, service } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('create company', () => {
    //Arrange
    const { spectator, service } = testSetup();
    const dialogService = spectator.inject(DialogService);
    const spy = jest.spyOn(dialogService, 'open');
    const data = {
      companyId: 123,
      type: 'Customer',
    };

    //Act
    service.createCompany(data);

    //Assert
    expect(spy).toHaveBeenCalled();
  });
});
