export type ExportFormat = 'pptx' | 'pdf';

export class ExportRequest {
  CompanyId?: number;
  Format!: ExportFormat;
  Email?: string;
}
