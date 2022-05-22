import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestOptions } from '@cosmos/common/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, delay, mergeMap, tap } from 'rxjs/operators';
import { ExportRequest, Report } from '../models';

import { ReportsService } from './reports.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ReportsFacade {
  downloadQueue$ = new Subject<{ ReportId: string; ExportId: string }>();
  exportQueue$ = new Subject<{ ReportId: string; ExportId: string }>();
  reports$ = new BehaviorSubject<Report[]>(null!);

  processing: Record<string, boolean> = {};

  constructor(private _reportsService: ReportsService) {
    this.exportQueue$
      .pipe(
        delay(2000),
        mergeMap((data) =>
          this._reportsService.exportStatus(data.ReportId, data.ExportId).pipe(
            tap((res) => {
              if (res['status'] === 'Running')
                return this.exportQueue$.next(data);

              if (res['status'] === 'Succeeded')
                return this.downloadQueue$.next(data);
            }),
            catchError(() => of(null))
          )
        ),
        untilDestroyed(this)
      )
      .subscribe();

    this.downloadQueue$
      .pipe(
        tap((data) => delete this.processing[data.ReportId]),
        mergeMap((data) =>
          this._reportsService
            .exportDownload(data.ReportId, data.ExportId)
            .pipe(tap((response) => this.downloadFile(response)))
        ),
        catchError(() => of(null)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  getReports(companyId?: number) {
    const params: Record<string, string> = {};

    if (companyId) {
      params['companyId'] = companyId.toString();
    }

    return this._reportsService
      .all({ params })
      .pipe(tap((res) => this.reports$.next(res)));
  }

  getReport(reportId: string, options?: HttpRequestOptions) {
    return this._reportsService.get(reportId, options);
  }

  saveReport(reportId: string, request: ExportRequest) {
    this.processing[reportId] = true;

    return this._reportsService
      .export(reportId, request)
      .pipe(
        tap((res) =>
          this.exportQueue$.next({ ReportId: reportId, ExportId: res.id })
        )
      );
  }

  private getFileName(response: HttpResponse<Blob>) {
    let filename: string;

    try {
      const contentDisposition: string | null = response.headers.get(
        'content-disposition'
      );
      const r = /(?:filename=")(.+)(?:")/;
      filename = r.exec(contentDisposition!)![1];
    } catch (e) {
      filename = 'report.pdf';
    }

    return filename;
  }

  downloadFile(response: HttpResponse<Blob>) {
    const filename = this.getFileName(response);

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
      new Blob([response.body!], { type: 'blob' })
    );
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.parentNode!.removeChild(downloadLink);
  }
}
