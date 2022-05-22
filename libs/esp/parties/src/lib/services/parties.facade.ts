import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartiesService } from './parties.service';

export abstract class PartiesFacade {
  constructor(protected service: PartiesService<any>) {}

  validateDelete(id: number): Observable<boolean> {
    return this.service.validateDelete(id).pipe(
      map((res) => {
        return typeof res === 'object' ? res.IsDeletable : res;
      })
    );
  }

  delete(id: number) {
    return this.service.delete(id).pipe(map(() => true));
  }

  transferOwner(id: number | number[], ownerId: number) {
    return this.service.transferOwner(id, ownerId);
  }
}
