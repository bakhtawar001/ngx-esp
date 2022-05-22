import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { Observable } from 'rxjs';
import {
  LinkRelationshipTypeView,
  NotificationTemplateType,
  TagType,
} from '../models';

export const enum LookupTypes {
  NotificationTemplate = 'notifications',
  TagTypes = 'tagtypes',
  LinkRelationships = 'linkrelationships',
}

@Injectable({
  providedIn: 'root',
})
export class LookupTypesApiService extends RestClient {
  override url = 'types';

  private getType<T>(type: LookupTypes, id?: number): Observable<T> {
    let uri = `${this.uri}/${type}`;
    if (id) uri += `/${id}`;
    return this.http.get<T>(uri);
  }

  getNotificationTemplateTypes() {
    return this.getType<NotificationTemplateType[]>(
      LookupTypes.NotificationTemplate
    );
  }

  getTagTypes() {
    return this.getType<TagType[]>(LookupTypes.TagTypes);
  }

  getLinkRelationships() {
    return this.getType<LinkRelationshipTypeView[]>(
      LookupTypes.LinkRelationships
    );
  }
}
