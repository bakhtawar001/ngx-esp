import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { arg } from '@cosmos/storybook';
import { CosCardComponent } from './card.component';
import markdown from './card.md';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from './card.module';

const heading = `This is a card`;
const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
const sidebarContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
const footerContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export default {
  title: 'Layout Components/Card',
  component: CosCardComponent,
  parameters: {
    notes: markdown,
  },
  args: {
    heading,
    content,
  },
  argTypes: {
    heading: arg('Heading'),
    content: arg('Content'),
    borderColor: arg('Border Color', 'color'),
    sidebarContent: arg('Sidebar Content'),
    footerContent: arg('Footer Content'),
  },
};

@Component({
  selector: 'cos-card-demo-component',
  template: `
    <cos-card [borderColor]="borderColor">
      <h1>{{ heading }}</h1>
      <p>{{ content }}</p>

      <div cos-card-sidebar *ngIf="sidebarContent">
        <p>{{ sidebarContent }}</p>
      </div>

      <div cos-card-footer *ngIf="footerContent">
        <p>{{ footerContent }}</p>
      </div>
    </cos-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCardDemoComponent {
  @Input() heading: string;
  @Input() content: string;

  @Input() sidebarContent: string;
  @Input() footerContent: string;

  @Input() borderColor: string;
}

@Component({
  selector: 'cos-card-demo-component',
  template: `
    <cos-card>
      <cos-card-menu>
        <ul class="cos-list-no-style px-16 my-0">
          <li class="mb-8">
            <a class="cos-text--black" href="#"
              ><i class="fa fa-pen"></i> Edit</a
            >
          </li>
          <li>
            <a class="cos-text--red" href="#">
              <i class="fa fa-trash"></i> Delete</a
            >
          </li>
        </ul>
      </cos-card-menu>
      <h1>{{ heading }}</h1>
      <p>{{ content }}</p>
    </cos-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCardWithControlsDemoComponent {
  @Input() heading: string;
  @Input() content: string;
}

@Component({
  selector: 'cos-card-demo-component',
  template: `
    <cos-card [inlineControls]="inlineControls">
      <cos-card-controls>
        <button cos-flat-button color="primary">test</button>
      </cos-card-controls>
      <cos-card-menu>
        <ul class="cos-list-no-style px-16 my-0">
          <li class="mb-8">
            <a class="cos-text--black" href="#"
              ><i class="fa fa-pen"></i> Edit</a
            >
          </li>
          <li>
            <a class="cos-text--red" href="#">
              <i class="fa fa-trash"></i> Delete</a
            >
          </li>
        </ul>
      </cos-card-menu>
      <h1>{{ heading }}</h1>
      <p>{{ content }}</p>
    </cos-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCardWithCustomControlsDemoComponent {
  @Input() heading: string;
  @Input() content: string;

  @Input() inlineControls: boolean;
}

@Component({
  selector: 'cos-card-notice-component',
  styleUrls: ['./card-with-notice.scss'],
  template: `
    <cos-card
      ngClass="cos-card--notice"
      [style.border]="'1px solid' + borderColor"
    >
      <h1>{{ heading }}</h1>
      <p>{{ content }}</p>
      <div [style.background]="borderColor" class="cos-card-notice-container">
        Proof Approved
      </div>
    </cos-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCardWithNoticeDemoComponent {
  @Input() heading: string;
  @Input() content: string;

  @Input() borderColor: string;
}

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosCardDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule],
  },
  component: CosCardDemoComponent,
  props,
});

export const cardWithSidebar = (props) => ({
  moduleMetadata: {
    declarations: [CosCardDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule],
  },
  component: CosCardDemoComponent,
  props,
});

cardWithSidebar.args = {
  sidebarContent,
};

export const cardWithFooter = (props) => ({
  moduleMetadata: {
    declarations: [CosCardDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule],
  },
  component: CosCardDemoComponent,
  props,
});

cardWithFooter.args = {
  footerContent,
};

export const cardWithControls = (props) => ({
  moduleMetadata: {
    declarations: [CosCardWithControlsDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule, CosButtonModule],
  },
  component: CosCardWithControlsDemoComponent,
  props,
});

export const cardWithCustomControls = (props) => ({
  moduleMetadata: {
    declarations: [CosCardWithCustomControlsDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule, CosButtonModule],
  },
  component: CosCardWithCustomControlsDemoComponent,
  props,
});

export const cardWithNotice = (props) => ({
  moduleMetadata: {
    declarations: [CosCardWithNoticeDemoComponent],
    imports: [BrowserAnimationsModule, CosCardModule, CosButtonModule],
  },
  component: CosCardWithNoticeDemoComponent,
  props,
});

cardWithNotice.args = {
  borderColor: '#0071db',
};
