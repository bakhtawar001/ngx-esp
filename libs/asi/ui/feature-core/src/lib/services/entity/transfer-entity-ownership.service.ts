export abstract class TransferEntityOwnership<T> {
  abstract transferOwnership(entity: T): void;
}
