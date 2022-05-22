# Featured Media

Featured media contains information about video, image or text based content.

```html
<cos-featured-video
  [video]="{
        Id: number,
        Url: string
      }"
  heading="String"
  description="String"
>
</cos-featured-video>
```

Will output an event `videoPlayRequested(video: object)`

## How it works

Featured media components contain the following content:

- Thumbnail
- Media title
- Media description
- Optional link to full content

Featured media and most frequently display in a list as part of the Features component.

### Examples

- Catalogs
- Videos
