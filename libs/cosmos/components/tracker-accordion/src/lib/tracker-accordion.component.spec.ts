import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosTrackerAccordionComponent } from './tracker-accordion.component';

describe('CosTrackerAccordionComponent', () => {
  let component: CosTrackerAccordionComponent;
  let spectator: Spectator<CosTrackerAccordionComponent>;
  const createComponent = createComponentFactory({
    component: CosTrackerAccordionComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        accordionTitle: 'SampleTitle',
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expands when clicked and then collapse when clicked again', () => {
    const button: any = spectator.query('button');
    const headerEl = spectator.query('.cos-accordion');

    expect(component.expanded).toBeFalsy();

    expect(button).toHaveClass('cos-accordion-btn');

    spectator.click(button);
    spectator.detectChanges();
    expect(component.expanded).toBeTruthy();

    spectator.click(button);
    spectator.detectChanges();

    expect(component.expanded).toBeFalsy();
  });

  it('should show static title when the accordion is not expandable', () => {
    component.expandable = false;
    spectator.detectComponentChanges();

    expect(component.expandable).toBeFalsy();
    const title = spectator.query('.cos-accordion-static-title');
    expect(title).toBeTruthy();
    expect(title).toHaveText(component.accordionTitle);
  });
});
