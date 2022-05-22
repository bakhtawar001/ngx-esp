import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UniqueIdService {
  constructor() {}

  /**
   * Generates a random id and prefixes it with a supplied string or with cos
   * Ex: cos-radio-k92zt9e1
   * @param prefix
   */
  getUniqueIdForDom(prefix: string = 'cos') {
    const uniqueId = `${prefix}-${uuid()}`;
    return uniqueId;
  }
}
