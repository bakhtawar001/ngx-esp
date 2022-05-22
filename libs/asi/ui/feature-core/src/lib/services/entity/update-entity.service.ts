export abstract class UpdateEntityService<T> {
  abstract update(entity: T): void;
}
