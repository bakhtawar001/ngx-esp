import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import markdown from './input-row.md';
import { CosInputRowModule } from './input-row.module';

@Component({
  selector: 'cos-input-row-example-component',
  template: `
    <cos-input-row
      *ngFor="let price of prices; index as i"
      [id]="price.Id"
      [allowDisable]="true"
      [allowRemove]="i === 1"
      [disabled]="disabled"
      (toggleDisabled)="toggleDisabled($event)"
      (remove)="remove($event)"
    >
      <cos-form-field>
        <cos-label [ngClass]="{ 'cos-accessibly-hidden': i > 0 }"
          >Quantity</cos-label
        >
        <input
          cos-input
          [(ngModel)]="price.Quantity"
          [disabled]="price.Disabled"
          type="number"
          id="Quantity"
          name="Quantity"
        />
      </cos-form-field>
      <cos-form-field>
        <cos-label [ngClass]="{ 'cos-accessibly-hidden': i > 0 }"
          >Cost</cos-label
        >
        <input
          cos-input
          [(ngModel)]="price.Cost"
          [disabled]="price.Disabled"
          id="Cost"
          name="Cost"
        />
      </cos-form-field>
      <cos-form-field>
        <cos-label [ngClass]="{ 'cos-accessibly-hidden': i > 0 }"
          >Profit Margin</cos-label
        >
        <input
          cos-input
          [(ngModel)]="price.ProfitMargin"
          [disabled]="price.Disabled"
          id="ProfitMargin"
          name="ProfitMargin"
        />
      </cos-form-field>
      <cos-form-field>
        <cos-label [ngClass]="{ 'cos-accessibly-hidden': i > 0 }"
          >Original Price</cos-label
        >
        <input
          cos-input
          [(ngModel)]="price.OriginalPrice"
          [disabled]="price.Disabled"
          readonly
          id="OriginalPrice"
          name="OriginalPrice"
        />
      </cos-form-field>
      <cos-form-field>
        <cos-label [ngClass]="{ 'cos-accessibly-hidden': i > 0 }"
          >Customer Price</cos-label
        >
        <input
          cos-input
          [(ngModel)]="price.Price"
          [disabled]="price.Disabled"
          id="Price"
          name="Price"
        />
      </cos-form-field>
    </cos-input-row>
    <p>{{ _message }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosInputRowExampleComponent {
  private _message: string;
  @Input() disabled = false;

  prices = [
    {
      Id: 1,
      Quantity: 200,
      Price: '$106.00',
      Cost: '$63.60',
      ProfitMargin: '40%',
      OriginalPrice: '$50.00',
      Disabled: false,
    },
    {
      Id: 2,
      Quantity: 400,
      Price: '$206.00',
      Cost: '$83.60',
      ProfitMargin: '40%',
      OriginalPrice: '$100.00',
      Disabled: false,
    },
  ];

  toggleDisabled($event) {
    this.prices.find((x) => x.Id === $event.id).Disabled = $event.disabled;
  }

  remove($event) {
    this._message = 'Removed row with ID ' + $event.id;
  }
}

export default {
  title: 'Layout Examples/Input Row',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosInputRowExampleComponent],
    imports: [CosInputRowModule, CosFormFieldModule, CosInputModule],
  },
  component: CosInputRowExampleComponent,
});
