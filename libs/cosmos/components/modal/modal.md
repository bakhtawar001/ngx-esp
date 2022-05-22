# Modals

Modals allow users to view information, complete tasks, and more without having to leave the context of their current page. A modal is presented in the middle of the screen, over the current user context.

### Choosing between a Modal and Context Menu

Use a **Modal** when...

- you need the largest amount of space to display information
- covering the current screen doesn't negatively impact the experience of using the modal
- you want to block the view from the user to draw their attention exclusively to the modal content

Use a **Context Menu** when...

- you are presenting a small amount of information
- you are presenting actions that only require a click to apply. For example, adding filters to a table or selecting a network.

---

## Modal Development

Styled version of the Angular Material Dialog component. Full documentation available at https://material.angular.io/components/dialog/overview

A change to the title is necessary to consistently implement the close "x" button. This markup should be used as a template for new modals.

```html
<header>
  <div>
    <button class="cos-modal-close" mat-dialog-close cdkFocusInitial>
      <i class="fas fa-times"></i>
      <span class="cos-accessibly-hidden">Close</span>
    </button>
  </div>
  <h2 mat-dialog-title>TITLE</h2>
</header>
<mat-dialog-content> MAIN CONTENT </mat-dialog-content>
<mat-dialog-actions align="end"> OPTIONAL ACTIONS </mat-dialog-actions>
```

---

## How it works

The modal can be broken down into three parts:

| Part   | About                                      | Optional |
| ------ | ------------------------------------------ | -------- |
| Header | Reserved for the title and supporting copy | No       |
| Body   | Reserved for the modal content             | No       |
| Footer | Reserved for actions required by the modal | Yes      |

### Interaction

The modal can be triggered by a button or link. When presented there is an overlay presented behind the modal to provide additional separation and focus for the user.

#### Accessibility

- The close button "x" is focused by default.

#### Dismissing the modal

- If there are no action buttons in the footer, the modal can be dismissed by clicking anywhere outside of the modal
- If there are action buttons, the modal can only be dismissed by explicitly clicking the "Cancel" or "X" buttons.

---

## Visual Details

### Overlay

The overlay behind the modal is black at 60% opacity.

### Sizing

- Min-width of 800px
- Min-height of 650px
- Max-width of 90%
- Max-height of 90%

### Spacing

- Inset 16

---

## Layout

- This component is centered vertically and horizontally in the view.
