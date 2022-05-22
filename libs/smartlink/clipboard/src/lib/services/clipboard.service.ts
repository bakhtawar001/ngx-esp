import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestClient } from '@smartlink/common/http';
import { Observable } from 'rxjs';
import { ClipboardItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService extends RestClient<ClipboardItem> {
  override url = 'clipboard';

  // @ts-ignore
  create(model: ClipboardItem): Observable<ClipboardItem> {
    const form = new FormData();

    form.append('product_id', model.Product.Id.toString());
    form.append('image_url', model.ImageUrl);

    return this.http.post<ClipboardItem>(`${this.uri}`, form);
  }

  // create(product_id: number, image_url?: string) {
  //   const form = new FormData();

  //   form.append('product_id', product_id.toString());
  //   form.append('image_url', image_url);

  //   return this.http
  //     .post<ClipboardItem>(this.uri, form);
  // }

  deleteList(ids: number[]) {
    const params = new HttpParams().append('ids', ids.join(','));

    return this.http.delete(`${this.uri}`, { params });
  }
}
