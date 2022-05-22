import { RouterTestingModule } from '@angular/router/testing';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { OrderQuoteSummaryComponentModule } from '../order-quote-summary';
import { OrderDetailSidebarComponent } from './order-detail-sidebar.component';

describe('OrderDetailSidebarComponent', () => {
  const createComponent = createComponentFactory({
    component: OrderDetailSidebarComponent,
    imports: [
      RouterTestingModule,
      CosVerticalMenuModule,
      OrderQuoteSummaryComponentModule,
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    const element = spectator.element;

    return { component, element, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display Quote Status as Quoting', () => {
    // Arrange
    const { element, spectator } = testSetup();

    // Act
    spectator.setInput('order', OrdersMockDb.quoteDomainModel);
    spectator.detectChanges();
    const status = element.querySelector('.order-detail-info__status');

    // Assert
    expect(status).toHaveText('Quoting');
  });

  it('should display Order Status as Ordering', () => {
    // Arrange
    const { element, spectator } = testSetup();

    // Act
    spectator.setInput('order', OrdersMockDb.orderDomainModel);
    spectator.detectChanges();
    const status = element.querySelector('.order-detail-info__status');

    // Assert
    expect(status).toHaveText('Ordering');
  });
});
