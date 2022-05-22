import { Environment } from './environment';

export interface Fixture<T = {}> {
  email: string;
  username: string;
  password: string;
  data: T;
}

export type Fixtures<T> = {
  [environment in Environment]: Fixture<T>;
};
