# Customer Dropdown Component

Renders a mat-select in desktop and a native select in mobile (<600px).

## Example

```
    <cos-customer-dropdown
      dropdownLabel="Customer"
      newCustomerButtonLabel="Create new customer"
      [selectedCustomerId]="3"
      [customers]="[
        {
            Id: 1,
            Name: 'Bloom Co-Locations',
            ImageSrc: 'https://placebear.com/g/28/28'
        },
        {
            Id: 2,
            Name: 'Dentitect',
            ImageSrc: 'http://placekitten.com/28/28'
        },
        {
            Id: 3,
            Name: 'Elastic, LLC',
            ImageSrc: 'http://placekitten.com/28/28'
        }
      ]"
    </cos-customer-dropdown>
```
