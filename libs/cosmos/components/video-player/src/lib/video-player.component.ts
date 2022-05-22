import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { VideoObject, VideoService } from '@cosmos/core';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    Vimeo: any;
    YT: any;
    FB: any;
    fbAsyncInit: any;
  }
}

@Component({
  selector: 'cos-video-player',
  templateUrl: 'video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-video-player',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosVideoPlayerComponent implements OnChanges {
  noVideo = false;
  videoError = false;
  settings = {
    autoPlay: 0,
  };

  @Input() video: {
    Id: number;
    Url: string;
    Type: string;
    IsPrimary: boolean;
  } | null = null;

  playerApis = {
    youtube: {
      url: 'https://www.youtube.com/iframe_api',
      loaded: false,
    },
    vimeo: {
      url: 'https://player.vimeo.com/api/player.js',
      loaded: false,
    },
    facebook: {
      url: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.5',
      loaded: false,
    },
  };

  loadPlayer() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const classRef = this;
    if (!this.video || !this.video.Url) {
      this.noVideo = true;
      return;
    }

    const Url = (this.video && this.video.Url) || null;

    if (Url === null) {
      return;
    }

    const videoObj = this._videoService.getVideoObj(Url);

    if (videoObj?.id === '0') {
      this.videoError = true;
      return;
    }

    if (videoObj?.type === 'youtube') {
      this.loadYoutubeVideo(videoObj);
    } else if (videoObj?.type === 'vimeo') {
      this.loadVimeoVideo(Url);
    } else if (videoObj?.type === 'facebook') {
      if (!window.fbAsyncInit) {
        window.fbAsyncInit = function () {
          window.FB.init({
            autoLogAppEvents: true,
            xfbml: false,
            version: 'v10.0',
          });
          classRef.loadFacebookVideo();
        };
      } else {
        this.loadFacebookVideo();
      }
    } else {
      this.videoError = true;
    }

    if (videoObj?.type && !this.apiLoaded(this.playerApis[videoObj.type].url)) {
      this.loadApiSrc(this.playerApis[videoObj.type].url);
    }
  }

  loadYoutubeVideo(videoObj: VideoObject) {
    const load = () => {
      const params = {
        playerVars: {
          autoplay: this.settings.autoPlay ? 1 : 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          listType: '',
          list: null as string | null,
        },
        videoId: null as string | null,
      };

      if (videoObj.playlist) {
        params.playerVars.listType = 'playlist';
        params.playerVars.list = videoObj.id;
      } else {
        params.videoId = videoObj.id;
      }

      const player = new window.YT.Player(this.element.nativeElement, params);
    };

    if (
      !this.playerApis.youtube.loaded &&
      !(<any>window.YT && window.YT.loaded)
    ) {
      window.onYouTubeIframeAPIReady = () => {
        this.playerApis.youtube.loaded = true;
        load();
      };
    } else {
      this.playerApis.youtube.loaded = true;
      load();
    }
  }

  loadVimeoVideo(videoUrl: string) {
    const load = () => {
      const options = {
        url: videoUrl,
        byline: false,
        title: false,
        autoplay: this.settings.autoPlay ? 1 : 0,
      };

      const player = new window.Vimeo.Player(
        this.element.nativeElement,
        options
      );
    };

    if (!this.playerApis.vimeo.loaded) {
      let vTimer = setInterval(() => {
        if (window.Vimeo) {
          //this.playerApis.vimeo.loaded = true;
          clearInterval(vTimer);
          load();
        }
      }, 100);
    } else {
      load();
    }
  }

  loadFacebookVideo() {
    if (this.video === null) {
      return;
    }

    const fbVideoDivEl = document.createElement('div');
    fbVideoDivEl.setAttribute('class', 'fb-video');
    fbVideoDivEl.setAttribute('data-href', this.video.Url);
    fbVideoDivEl.setAttribute('data-allowfullscreen', 'true');
    fbVideoDivEl.setAttribute('data-show-text', 'false');

    this.renderer.appendChild(this.element.nativeElement, fbVideoDivEl);
    window.FB.XFBML.parse(this.element.nativeElement);
  }

  loadApiSrc(src: string) {
    const firstScriptTag = document.getElementsByTagName('script')[0];
    const tag = document.createElement('script');
    tag.src = src;

    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
  }

  apiLoaded(src: string) {
    const scripts = document.getElementsByTagName('script');

    for (let i = scripts.length; i--; ) {
      if (scripts[i].src === src) return true;
    }

    return false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.video && changes.video.currentValue) {
      this.loadPlayer();
    }
  }

  constructor(
    private _videoService: VideoService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}
}
