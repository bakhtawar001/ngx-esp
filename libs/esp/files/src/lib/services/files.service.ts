import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';

@Injectable({
  providedIn: 'root',
})
export class FilesService extends RestClient {
  override url = 'files';

  public uploadFile(file: File[], purpose: string) {
    // TODO: Multiple Files
    const uri = `${this.uri}/${purpose.toLowerCase()}`;

    const formData = new FormData();

    formData.append('file', file[0]);

    const httpOptions = {
      reportProgress: true,
      params: new HttpParams().append('fileType', file[0].type.split('/')[1]),
      headers: new HttpHeaders({
        'Angular-Skip-Assigning-Content-Type': 'true',
      }),
    };

    const uploadReq = new HttpRequest('POST', uri, formData, httpOptions);

    return this.http.request(uploadReq);
  }

  public deleteFile(mediaLinkId: string) {
    return this.http.delete(`${this.uri}/${mediaLinkId}`);
  }
}
