import { RestClient } from '@esp/common/http';
import { LinkRelationship } from '@esp/models';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export abstract class PartiesService<T> extends RestClient<T> {
  links(id: number): Observable<LinkRelationship[]> {
    return this.http.get<LinkRelationship[]>(`${this.uri}/${id}/links`);
  }

  createLink(link: LinkRelationship, id: number): Observable<LinkRelationship> {
    return this.http.post<LinkRelationship>(`${this.uri}/${id}/links`, link);
  }

  patchLink(
    link: LinkRelationship,
    id: number,
    linkId: number
  ): Observable<LinkRelationship> {
    return this.http.put<LinkRelationship>(
      `${this.uri}/${id}/links/${linkId}`,
      link
    );
  }

  removeLink(id: number, linkId: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${id}/links/${linkId}`);
  }

  tasks(id: number) {
    return this.http.get(`${this.uri}/${id}/tasks`);
  }

  notes(id: number) {
    return this.http.get(`${this.uri}/${id}/notes`);
  }

  emails(id: number) {
    return this.http.get(`${this.uri}/${id}/emails`);
  }

  validateDelete(id: number): Observable<{ IsDeletable: boolean }> {
    return this.http
      .get<{ IsDeletable: boolean }>(`${this.uri}/${id}/validatedelete`)
      .pipe(
        map((resp) =>
          resp.hasOwnProperty('IsDeletable') ? resp : { IsDeletable: !!resp }
        )
      );
  }

  exists(name: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.uri}/exists/${encodeURIComponent(name)}`, {})
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(false);
        })
      );
  }

  transferOwner(id: number | number[], ownerId: number) {
    let ids;

    if (!Array.isArray(id)) {
      ids = [id];
    } else {
      ids = id;
    }

    return this.http.put(`${this.uri}/bulk/owner?args=${ownerId}`, ids);
  }
}
