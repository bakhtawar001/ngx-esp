# Input Row

Container to output form fields in a horizontal row with optional hide and remove buttons.

Mobile version will not fit into a mobile viewport. Use a horizontal scrolling container.

```
<cos-input-row
    [id]="number"
    [allowDisable]="true"
    [allowRemove]="true"
    [disabled]="true"
    (toggleDisabled)="method($event)"
    (remove)="method($event)"
>
    Children should form-field components
</cos-input-row>
```
