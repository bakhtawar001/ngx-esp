# Visual Trackers

Visual Trackers are used to indicate the progress of an entity or form.

## How it works

Use trackers when user action will result in a progressed step forward in a flow of more than two unrelated steps.

- The current step is always highlighted
- Only the current step can display an error or alert that must be resolved before moving to the next step
- All steps after the current step are shown as incomplete (even if you are going back to a prior step)
- All steps before the current step are shown as completed

### When to use visual trackers

When there is a defined order of steps that will always move to the next or previous step

### When to not use visual trackers

- When there is a varied number of steps that is dependant on user action mid-flow. For example, proof approval is not a requirement on all orders, therefore it is not included in the visual tracker
- When steps can be done in any order or are not required. For example, invoices don't need to be generated for every order and payment can be collected at any time, for this reason, those items are not included in a visual tracker
- When something can exist in multiple steps at the same time

## Example usage

```html
<div class="cos-tooltip-demo-container">
  <cos-tracker [percent]="percent" [startsOnZero]="startOnZeroStep">
    <cos-tracker-step color="green"></cos-tracker-step>
    <cos-tracker-step color="green"></cos-tracker-step>
    <cos-tracker-step
      color="yellow"
      matTooltip="There is an alert here!"
      matTooltipPosition="below"
      matTooltipHideDelay="100"
      ><i class="fa fa-exclamation-triangle cos-text--white"></i
    ></cos-tracker-step>
    <cos-tracker-step></cos-tracker-step>
    <cos-tracker-step></cos-tracker-step>
  </cos-tracker>
</div>
```
