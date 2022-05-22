export interface MediaLink {
  Id?: number;
  MediaId: number;
  FileType?: string;
  FileUrl?: string;
  OriginalFileName?: string;
  OnDiskFileName?: string;
  DownloadFileName?: string;
  DownloadFileUrl?: string;
  IsVisible?: boolean;
  // Extension: string; // AngularJS viewmodel prop
}
