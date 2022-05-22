import { FileType } from './file-type';

export class File {
  Id!: number;
  DownloadFileName!: string;
  DownloadFileUrl!: string;
  FileType!: FileType;
  FileUrl!: string;
  IsVisible!: boolean;
  MediaId!: number;
  OnDiskFileName!: string;
  OriginalFileName!: string;
}
