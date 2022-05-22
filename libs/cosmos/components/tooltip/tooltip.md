# Tooltips

Tooltips display informative text when users hover over, focus on, or tap an element.

### Use Tooltips to communicate

- Helper text
- Text to describe an icon-only action or indicator, like on some vertical trackers

### Do not use Tooltips to communicate

Complex information that requires multiple lines of text, pills or tags in multiple styles, in these instances display the information directly on the page

```html
<button
  cos-stroked-button
  matTooltip="Info about the action"
  [matTooltipPosition]="'above'"
  matTooltipHideDelay="100"
  aria-label="Button that displays a tooltip that hides when scrolled out of the container"
>
  Action
</button>
```

## How it works

When activated, tooltips display a text label identifying an element, such as a description of its function.
