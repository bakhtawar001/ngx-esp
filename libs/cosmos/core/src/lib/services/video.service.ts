import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type VideoType = 'youtube' | 'vimeo' | 'facebook';

export interface VideoObject {
  type: VideoType;
  playlist: boolean;
  url: string;
  id: string;
  thumbnail: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly noId = '0';

  constructor(private http: HttpClient) {}

  getVideoObj(url: string, type?: VideoType): VideoObject | null {
    // url = 'https://vimeo.com/307102520/54f92844e9';
    // url = 'https://vimeo.com/280433194/6117c185a7';
    // url = 'https://player.vimeo.com/video/311759248';
    const _type = type || this.getVideoType(url);

    if (_type === 'youtube') {
      return this.getYoutubeVideoObj(url);
    } else if (_type === 'vimeo') {
      return this.getVimeoVideoObj(url);
    } else if (_type === 'facebook') {
      return this.getFacebookVideoObj(url);
    }

    return null;
  }

  getVideoType(url: string) {
    if (
      url.indexOf('youtube') > -1 ||
      url.indexOf('ytimg') > -1 ||
      url.indexOf('youtu.be') > -1
    ) {
      return 'youtube';
    } else if (url.indexOf('vimeo') > -1) {
      return 'vimeo';
    } else if (url.indexOf('facebook') > -1) {
      return 'facebook';
    }

    return null;
  }

  getVimeoVideoObj(url: string): VideoObject {
    const ret: VideoObject = {
      type: 'vimeo',
      playlist: false,
      url,
      id: '',
      thumbnail: '',
    };

    const regExp =
      /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
    const match = regExp.exec(url);

    ret.id = (match && match.length && match[5]) || this.noId;

    this.getVimeoThumbnail(ret.id).subscribe({
      next: (result: any) => {
        ret.thumbnail =
          result.thumbnail_url || 'https://i.vimeocdn.com/video/0_640.png';
      },
      error: () => (ret.thumbnail = 'https://i.vimeocdn.com/video/0_640.png'),
    });

    return ret;
  }

  getVimeoThumbnail(id: VideoObject['id']) {
    return this.http.get(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/video/${id}`
    );
  }

  getYoutubeVideoObj(url: string): VideoObject {
    const ret: VideoObject = {
      type: 'youtube',
      playlist: false,
      url: url,
      id: '',
      thumbnail: '',
      imageUrl: '',
    };

    const _url = url
      .replace(/(>|<)/gi, '')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    let match = null;

    if (_url[2] !== undefined) {
      match = _url[2].split(/[^0-9a-z_\-]/i);
      ret.id = (match && match.length && match[0]) || this.noId;
    } else {
      ret.id = url;
    }

    if (
      typeof ret.id === 'string' &&
      ret.id.length &&
      ret.id[0].indexOf('list') > 0
    ) {
      ret.playlist = true;
      match = /[&|\?]list=([a-zA-Z0-9_-]+)/gi.exec(_url as unknown as string);
      ret.id = (match && match.length && match[1]) || this.noId;
    }

    ret.thumbnail = this.getYoutubeThumbnail(ret.id);
    ret.imageUrl = this.getYoutubeThumbnail(ret.id, 'lg');

    return ret;
  }

  getYoutubeThumbnail(id: VideoObject['id'], size = '') {
    const imageResolution = size === 'lg' ? 'hqdefault.jpg' : 'mqdefault.jpg';
    return 'https://img.youtube.com/vi/' + id + '/' + imageResolution;
  }

  getVideoThumbnail(url: string) {
    const videoObj = this.getVideoObj(url);

    if (videoObj !== null) {
      if (videoObj.type === 'youtube') {
        return this.getYoutubeThumbnail(videoObj.id);
      } else if (videoObj.type === 'vimeo') {
        return this.getVimeoThumbnail(videoObj.id);
      }
    }

    return null;
  }

  getFacebookVideoObj(url: string): VideoObject {
    return {
      type: 'facebook',
      playlist: false,
      url: url,
      id: '',
      thumbnail: '',
    };
  }
}
