## Global Nav Bar

- Allows users to navigate to the main sections of the Encore app.
- Global search allows users to search across their entire database of products, suppliers, and decorators.
- Allow for quick links to Collections, Orders, Notifications, Accounts.

---

## When to use this

This should appear on the top of every page.

---

### Example:

```html
<cos-global-header
  ariaLabel="Main"
  bottomSheetLogoSrc="https://placekitten.com/100/25"
  [clientSafeMode]="true"
  [navItemsDesktop]="array of navItems"
  [navItemsMobile]="array of navItems"
>
  <a class="header-style-18" href="#">Encore Logo</a>
  <cos-global-search
    inputLabel="Search for"
    categoryLabel="Search in"
    buttonLabel="Search"
    [categories]="[{value: 'products', text: 'Products'}, {value: 'suppliers', text: 'Suppliers'}]"
  ></cos-global-search>
</cos-global-header>
```

## How it works

### Selected Nav Items

When a user clicks on nav item, the item will changed to it's selected state and the page content will adjust accordingly.

### Search

Global search allows users to search across their entire database of products, suppliers, and decorators. After the user types 1 character the typeahead box appears.

![](/Users/samantha.salvisburg/Desktop/Screen Shot 2020-05-14 at 1.10.08 PM.png)

---

## Visual Details

### Style

Selected and hovered nav items get these visual attributes:

| Attribute        | Value     |
| ---------------- | --------- |
| Background color | #265f8b   |
| Text color       | G00-White |
| Border radius    | None      |

### Sizing

| Attribute | Value        |
| --------- | ------------ |
| Height    | 70px (fixed) |
| Width     | 100% of view |

### Typography

- Nav items use Work Sans Medium 12 in color G-00White

### Spacing

- Inline spacing between nav items is Inline 20

---

## Layout

The layout of the global navigation bar can be broken into Three parts, the left (hamburger menu & encore logo), middle (search area), and right (quick links). As the view resizes in width, the right side moves into the hamburger menu, and the search moves below the Encore logo.
