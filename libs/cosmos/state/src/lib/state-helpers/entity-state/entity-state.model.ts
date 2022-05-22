export interface EntityStateModel<T = any> {
  items: Record<number, T>;
  itemIds: number[];
  currentId?: number | null;
}
