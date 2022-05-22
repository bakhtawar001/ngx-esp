import { ToastConfig, ToastData } from '../services';

const ACTION_SCOPE = '[Toast]';

export namespace ToastActions {
  export class Show {
    static readonly type = `${ACTION_SCOPE} Show toast`;

    constructor(public payload: ToastData, public config?: ToastConfig) {}
  }
}
