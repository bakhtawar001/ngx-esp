# Pagination

The pagination component is used to break up large sets of data across multiple pages.

---

## When to use

We paginate for long lists of items like in:

1. Search results
2. Supplier pages
3. Customers

We also paginate using the smaller treatment when we show page or product previews like:

1. When multiple products are shared within a modal
2. PDF previews

## Development

Example:

```html
<cos-pagination
  [length]="63606"
  [pageSize]="30"
  [maxPageNumbers]="12"
  [variant]="small"
></cos-pagination>
```

The "small" variant renders the "mobile layout" in all viewports.

The maxPageNumbers value is the highest number of page numbers the component will output without reverting to ellipses.

This number will not affect how many page numbers are output once the maximum is exceeded; in that case, the component uses the following logic:

1. Display two pages before and two pages after the current page.
2. If the current page is the first or last page, display three pages after (or before, respectively).

---

## How it works

#### Infinite Scroll

We use infinite scroll in user generated lists like:

1. Preferred suppliers
2. Products within collections and presentation
3. Customer view of the presentation
4. List of assets/projects/customers (modal and page)

#### Reasons to paginate

- Long list of items (like products, suppliers and customers)
- Limited space to display previews

#### Reasons to not paginate

- Areas where we have drag to reorder
- To avoid de-prioritizing products that are being sold to an end buyer
- Managing a list of user generated content

---

## Pages Shown

#### Desktop & Large area widths (Five columns or more)

- If the current page is 1, show the three pages after.
- Past 2, show the two pages before and the two pages after the current page.
- If the current page is last, show the three pages before.

#### Mobile & Small area widths (Four columns or less)

Display only the selected page of the total pages with the ability to only click next or previous

---

## Layout

- This component is centered on the page below the content it is used with.
