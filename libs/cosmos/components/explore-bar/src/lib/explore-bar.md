## Sub Nav

Some views will require more extensive navigation than what the global navigation bar is intended to deal with. Using a sub navigation in those contexts can help users:

- Easily understand where they are in a complex navigation structure
- Quickly navigate to deeper pages without relying on a complex menu system

---

## When to use this

This sub nav appears on the homepage to display different categories for exploration.

---

## How it works

### Selected Nav Items

The sub navigation component is usually paired with the global nav component. Combined they give users a clear sense of place and visual hierarchy.

---

## Visual Details

### Style

| Attribute        | Value      |
| ---------------- | ---------- |
| Background color | G00-White  |
| Text color       | G53- Shark |
| Border radius    | None       |

### Sizing

| Attribute | Value        |
| --------- | ------------ |
| Height    | 50px (fixed) |
| Width     | 100% of view |

### Typography

- Nav items use Work Sans Medium 12 in color G53- Shark.

- Selected State uses Work Sans Medium 12 in color BL57- Azure.

### Spacing

- Inline spacing between nav items is Inline 60px.

## Development

This component uses the following properties of NavigationItem;
type, title, url

```html
<cos-explore-bar
    ariaLabel: string,
    navItems: array<object>
>
</cos-explore-bar>
```
