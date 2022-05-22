# Product Media Component


## Media: Images

Images on Encore will be used to show products and product related features. The come in Large, Standard, and Small. Images also can appear on the pages as hero images.

### When to use this component

Use images when looking to display a product or product related features (colors, styles, variations). Also can be used to set the tone of the page in the form of an Hero Image.



## How it works

#### Size appropriately

To best display images of different sizes and types, appropriately size images for different displays and platforms. Resolution is the most important factor in how to best display images of different sizes and types, appropriately size images for different displays and platforms. Resolution is the most important factor in how quickly imagery will load. To preserve network bandwidth, keep resolution low where possible.



#### Alternative text

To ensure accessibility, imagery should include alternative text (or a caption) to be read by screen readers for users with visual impairments. Without alternative text, screen reader users just hear the word "image,” without any visual details.



#### Placement Imagery + Text

Elements like text or actions may be placed to the right of images.



#### Small

This view is used when there are lots of images to show and details of the imagery are less important. Usually associated with text on the right hand side. 



#### Standard

This the standard view on showing images. Is usually accompanied by text on the right hand side. 



#### Large

This view is used to show the largest image of a product on the product page. 



#### Hero Image

Hero images help draw attention, provide context about content, or reinforce a brand.



#### Image Carousel

On homepage an opportunity to display three different images to promote events/products/categories/ect. 


## Visual Details

### Sizes

There are 3 sizes of Product Views

| Attribute                           | Size            |
| ----------------------------------- | --------------- |
| Small                               | 40px by 40px    |
| Standard                            | 84px by 84px    |
| Large                               | 584px by 466px  |
| Large (mobile)                      | 343px by 240px  |
| Image Carousel/Hero Image (Desktop) | 1280px by 320px |
| Image Carousel/Hero Image (Mobile)  | 375px by 180px  |



### Layout

Large Product View is responsive as the page scales down. 

### States

States depend on the context of the images. For example an image could have a focus/hover state if it is used on the product page to indicate what image is shown.  



## Development
Inputs:

```
product: a product object
imageUploadEvent: output event that passes in the uploaded file
mediaToggleEvent: passes the media index of the image that needs to have the `Hidden` property toggled
editMode: enables or disables the ability to add/remove images
```

Usage:

```
<cos-product-media [product]="product" (imageUploadEvent)="mockUpload($event)" (mediaToggleEvent)="mockToggleEvent($event)" [editMode]="true"> </cos-product-media>

```

Data Example:

- Note that hidden is only required for editMode

```
   product = {
      Id: 552224978,
      Name: 'Price Buster Cap 5 Panel - Embroidered',
      ImageUrl: 'media/35117192',
      Media: [
        {
          Name: '',
          Url: 'media/35117184',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: '',
          Url: 'media/35117192',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Black',
          Url: 'media/35117183',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Navy Blue',
          Url: 'media/35117186',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Royal Blue',
          Url: 'media/35117196',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Athletic Gold',
          Url: 'media/35117189',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Gray',
          Url: 'media/35117190',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Green',
          Url: 'media/35117191',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Kelly Green',
          Url: 'media/35117193',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Khaki',
          Url: 'media/35117185',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Orange',
          Url: 'media/35117194',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Pink',
          Url: 'media/35117195',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'Red',
          Url: 'media/35117187',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Name: 'White',
          Url: 'media/35117188',
          Type: 'IMG',
          Hidden: false,
        },
        {
          Id: 31182756,
          Type: 'VD',
          Url: 'https://vimeo.com/122338885',
          Hidden: false,
        },
        {
          Id: 31182750,
          Type: 'VD',
          Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
          Hidden: false,
        },
      ]
    }
```