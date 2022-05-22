import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { UniqueIdService } from '@cosmos/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product } from '@smartlink/models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipe } from '@smartlink/products';

@Component({
  selector: 'cos-product-media',
  templateUrl: 'product-media.component.html',
  providers: [UniqueIdService, ImageUrlPipe],
  styleUrls: ['product-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CosProductMediaComponent implements OnChanges, AfterViewInit {
  public _uniqueId = `${this._uniqueIdService.getUniqueIdForDom(
    'cos-product-media'
  )}`;
  _currentIndex = 0;

  _media: any[] = [];
  _product: any = null;
  _scrolling = false;
  thumbnailcontainer: HTMLElement | null = null;
  showVideo = false;
  showImage = true;

  files: File[] = [];

  @ViewChildren('thumbnailListItem') thumbnails!: QueryList<ElementRef>;

  @ViewChild('productMediaUpload') upload: ElementRef<HTMLLIElement> | null =
    null;

  @Output() imageUploadEvent = new EventEmitter<any>();
  @Output() mediaToggleEvent = new EventEmitter<any>();
  @Output() imageSelected = new EventEmitter<any>();

  @Input() editMode = false;

  @Input()
  set product(product: Product) {
    this._product = product;
  }

  get currentUrl() {
    return this._media ? this._media[this._currentIndex].Url : '';
  }

  get currentVideo() {
    return this._media ? this._media[this._currentIndex] : null;
  }

  get id() {
    return this._uniqueId;
  }

  focusThumbnail(id: number): void {
    const smallScreen = window.matchMedia('(max-width: 600px)');
    const el: HTMLElement | null = document.getElementById(
      `${this._uniqueId}-thumbnail-` + id
    );

    if (el && this.thumbnailcontainer && !smallScreen.matches) {
      setTimeout(
        () =>
          this.thumbnailcontainer!.scrollTo({
            top:
              el.offsetTop -
              this.thumbnailcontainer!.clientHeight / 2 +
              el.clientHeight / 2,
            behavior: 'smooth',
          }),
        0
      );
      el.focus();
    } else {
      setTimeout(
        () =>
          this.thumbnailcontainer!.scrollTo({
            left:
              el!.offsetLeft -
              this.thumbnailcontainer!.clientWidth / 2 +
              el!.clientWidth / 2,
            behavior: 'smooth',
          }),
        0
      );
      el!.focus();
    }
  }

  startScrolling(direction: string) {
    const smallScreen = window.matchMedia('(max-width: 600px)');
    const scroll = () => {
      if (direction === 'up') {
        this.thumbnailcontainer!.scrollTo({
          top: (this.thumbnailcontainer!.scrollTop -= 5),
          behavior: 'smooth',
        });
      } else {
        this.thumbnailcontainer!.scrollTo({
          top: (this.thumbnailcontainer!.scrollTop += 5),
          behavior: 'smooth',
        });
      }
    };
    const interval = setInterval(() => {
      if (this._scrolling) {
        scroll();
      } else {
        clearInterval(interval);
      }
    }, 10);
  }

  scrollTrack(direction: string, active: boolean) {
    this._scrolling = active;
    this.startScrolling(direction);
  }

  passClickToThumbnail(event: MouseEvent) {
    this.thumbnails.forEach((thumbnail: ElementRef) => {
      const element = thumbnail.nativeElement.getBoundingClientRect();
      if (this.existsAtCoordinates(element, event.pageX, event.pageY)) {
        thumbnail.nativeElement.click();
        return;
      }
    });

    const uploadElement = this.upload
      ? this.upload.nativeElement.getBoundingClientRect()
      : undefined;

    if (
      uploadElement &&
      this.existsAtCoordinates(uploadElement, event.pageX, event.pageY)
    ) {
      this.upload?.nativeElement.click();
      return;
    }
  }

  existsAtCoordinates(element: any, pageX: any, pageY: any) {
    const elementPos = {
      top:
        element.top +
        Math.max(
          document.scrollingElement!.scrollTop,
          document.documentElement.scrollTop
        ),
      left:
        element.left +
        Math.max(
          document.scrollingElement!.scrollLeft,
          document.documentElement.scrollLeft
        ),
    };
    const elementWidth = element.width;
    const elementHeight = element.height;

    return (
      pageY > elementPos.top &&
      pageY < elementPos.top + elementHeight &&
      pageX > elementPos.left &&
      pageX < elementPos.left + elementWidth
    );
  }

  setcurrentUrl(index: number) {
    this._currentIndex = index;
    this.focusThumbnail(index);
    this.imageSelected.next(index);
  }

  prevImage() {
    if (this._currentIndex > 0) {
      this._currentIndex--;
      this.focusThumbnail(this._currentIndex);
    }
  }

  nextImage() {
    if (this._currentIndex < this._media.length - 1) {
      this._currentIndex++;
      this.focusThumbnail(this._currentIndex);
    }
  }

  navigateThumbnails(event: KeyboardEvent) {
    if (event.keyCode === 40) {
      this.nextImage();
    } else if (event.keyCode === 38) {
      this.prevImage();
    } else {
      return;
    }
  }

  errorHandler(index: number) {
    this._media[index].error = true;
  }

  setItemVisibility(index: number) {
    this.mediaToggleEvent.emit(index);
  }

  ngAfterViewInit() {
    this.thumbnailcontainer = document.getElementById(
      `${this._uniqueId}-thumbnail-container`
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.product?.currentValue?.Media !==
      changes.product?.previousValue?.Media
    ) {
      this._media = [...this._product.Media];
    }
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.imageUploadEvent.emit(this.files);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  downloadImage(mediaItem: any) {
    const url = this.imageUrlPipe.transform(mediaItem.Url) + '&dl=true';
    const xhr = new XMLHttpRequest();
    const downloadName = this._product.Id;
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const el = document.createElement('a');
      el.href = imageUrl;
      el.download = downloadName;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    };
    xhr.send();
  }

  constructor(
    private _uniqueIdService: UniqueIdService,
    private imageUrlPipe: ImageUrlPipe
  ) {}
}
