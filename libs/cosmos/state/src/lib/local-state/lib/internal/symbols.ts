import { Connection, StateMetaData } from '../extensibility/connector';

export const CONNECT_TO_STATE = Symbol('_ConnectToState');

export type OpenConnectionFn<T> = (
  initialiser: (metadata: StateMetaData<T>) => Connection
) => void;
