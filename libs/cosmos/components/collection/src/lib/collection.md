# Collections Card

Collections cards hold information on products and collaborators associated with a collection.

---

## Component

Regular:

```html
<cos-collection>
  [title]="title" [subtitle]="subtitle" [images]="images"
  [collaborators]="collaborators" [handleClick]="clickAction()"
</cos-collection>
```

Small

```html
<cos-collection>
  [title]="title" [subtitle]="subtitle" [images]="images" [size]="small"
</cos-collection>
```

## Data example

```js
    title: 'Favorite Office Products',
    subtitle: 'Last updated 2 days ago by Lisa',

    images = [
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
        { url: 'media/33807255', alt: '' },
    ];

    collaborators = [
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
        { url: 'https://via.placeholder.com/64', alt: '' },
    ];
```

## How it works

There are two views of a presentation card, Primary and Small.

### Primary / Standard

Primary collection cards include the collowing elements:

- Icon
- Collection Name
- Time last updated and by who
- 8 small image squares (7 images plus XX number if more than 8)
- Collaborators

### Small

Small collection cards include the collowing elements:

- Icon
- Collection Name
- Time last updated and by who

#### Header Icons

Icons used in header are being pulled from https://ngx-emoji-mart.netlify.app/.
If user doesn’t select an icon, a default will be applied.

---

### States

Hover state is an applied drop show of G25-Moth. ( 0 px, 1 px, 10px, 0px)

Focus state is 2px #0f8bff

---
