# Presentation Card

Presentation cards hold project information and products contained within the associated presentation.

```html
<cos-presentation-card
  [title]="title"
  [subtitle]="subtitle"
  [createdDate]="createdDate"
  [lastUpdatedDate]="lastUpdatedDate"
  [lastUsedDate]="lastUsedDate"
  [imgUrl]="imgUrl"
  [imgAlt]="imgAlt"
  [whiteBg]="whiteBg"
  [size]="size"
>
</cos-presentation-card>
```

## How it works

There are two views of a presentation card, Primary and Small.

### Primary / Standard

Primary presentation cards contain the following elements:

- Colored stripe
- Customer Icon
- Project/Presentation Name
- Customer Name
- 8 small image squares (7 images plus XX number if more than 8)
- Meta Data
  - Created Date
  - Time last updated and by who

### Small

Small presentation cards contain the following elements:

- Colored stripe
- Customer Icon
- Project/Presentation Name
- Customer Name
- Created Date
- Time last updated and by who

#### Colored Stripe and Icons

The colored strip and icons used in header are being pulled from the customer configuration in the directory.
If those items are not configured, a default will be applied.

---

### States

Hover state is an applied drop show of G25-Moth. ( 0 px, 1 px, 10px, 0px)

Focus state is 2px #0f8bff

---
