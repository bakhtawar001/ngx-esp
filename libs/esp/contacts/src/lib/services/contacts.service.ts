import { Injectable } from '@angular/core';
import { Contact } from '@esp/models';
import { PartiesService } from '@esp/parties';

@Injectable({
  providedIn: 'root',
})
export class ContactsService extends PartiesService<Contact> {
  override url = 'contacts';

  setStatus(id: number, active: boolean) {
    return this.http.put(`${this.uri}/bulk/status`, [id], {
      params: { args: active.toString() },
    });
  }
}
