export abstract class CreateEntity<T> {
  abstract create(entity: T): void;
}
