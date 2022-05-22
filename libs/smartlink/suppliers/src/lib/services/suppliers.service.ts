import { Injectable } from '@angular/core';
import { RestClient } from '@smartlink/common/http';
import { Supplier } from '../models';
import { Ratings } from '../models/ratings';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService extends RestClient<Supplier> {
  override url = 'suppliers';

  getRatings(id: number, params?: { include_comments: boolean }) {
    return this.http.get<Ratings>(`${this.uri}/${id}/ratings`, { params });
  }
}
