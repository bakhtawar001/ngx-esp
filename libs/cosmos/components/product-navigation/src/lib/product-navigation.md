# Product Navigation

The Product Navigation is used to paginate between multiple pages of products.

```html
<cos-product-navigation
  [products]="products"
  [backUrl]="backUrl"
></cos-product-navigation>
```

Data Example:

```js
backUrl = '#';

products = [
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    title: 'Adult Softspun Semi-Fitted Tee',
    url: '#',
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
];
```

## How it's used

The product navigation will display a preview of all of the product that are included in the pagination.

Each product in the navigation has the following content

- Thumbnail image
- Product name
- Price per smallest units

### Visual Guidelines

- The Product Navigation contains as many products that are available for viewing. If there are more products than can be displayed all within the current browser width, then bleed off the edge of the view so that a user can scroll them left and right.
- The product navigation is always displayed as a sticky footer. If other sticky elements exist display them above or beneath the product navigation depending on page level hierarchy. For example, the mobile navigation is displayed beneath the product navigation becuase of it's higher level of hierarchy.
