# Product Gallery

The Product Gallery contains a list of Small Product Cards

### When to use a product gallery

When a page has one or more groupings of related, suggested products to display, like on a product detail page, the homepage, or a collection or presentation not yet containing added products.

### When to not use a product gallery

When the subject of the page is a single list of related products, like search results, a supplier page containing products, a collection or a presentation already containing added products.

## Inputs:

- heading (string): The heading at the top of the container
- description (string):
- size (string): Whether this is the large or small variant of the component
- products: (array Products) The products to display
- viewMoreUrl: A URL
- galleryIconUrl:

Large:

```
    <cos-product-gallery
      [galleryIconUrl]="galleryIcon"
      [heading]="heading"
      [description]="description"
      [viewMoreUrl]="viewMoreUrl"
      [products]="products"
      [size]="size"
    ></cos-product-gallery>

```

Small:

```
    <cos-product-gallery
      [galleryIconUrl]="galleryIcon"
      [heading]="heading"
      [description]="description"
      [viewMoreUrl]="viewMoreUrl"
      [products]="products"
      [size]="size"
    ></cos-product-gallery>
```

## How it's used

The list of products contained within the gallery has two drivers and a "View More" link is provided to take users to the full list of products at its source.

The two drivers are:

1. Selected criteria available within the search results filters
2. A grouping of products from a single collection, presentation or order

Product Galleries contain the following content:

- Optional header icon or thumbnail
- Gallery title
- "View More"

### Visual Guidelines

- The Product Gallery component has a flexible width so that it can only display a single row of products that can fit within the horizontal space.
- Up to two Product Galleries can display next to each other, if an odd number of galleries need to display next to each other, stack them vertically and extend them to the full width available on the page.
