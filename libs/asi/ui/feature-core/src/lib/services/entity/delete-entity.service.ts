export abstract class DeleteEntity<T> {
  abstract delete(entity: T): void;
}
