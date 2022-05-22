/**
 * This function merges a list of items and a map of replacement items.
 * It returns the updated list of items or **if no items were updated, it
 * returns null** to signify the fact that there were no updates.
 * The null response can be used to determine if the original container object
 * can be returned or if a new container object should be created for the updated list.
 * By default it is assumed that the id of the object is in the "Id" property, but
 * this can be changed by supplying the idProp parameter.
 * @param items The original list of items
 * @param replacementMap The map of updated items using the id of the item as the key
 * @param idProp The property of the object that is used to look
 *   for an updated item in the map (default: "Id")
 * @returns The updated list of items, or null if no items in the list were updated
 * @example
 * ```typescript
 * const updatedItems = order && getUpdatedList(order.LineItems, lineItemsUpdating);
 * const result = updatedItems ? { ...order, LineItems: updatedItems } : order;
 * ```
 */
export function getUpdatedList<T extends { Id: string | number }>(
  items: T[],
  replacementMap: Record<T['Id'], T>
): T[] | null;
export function getUpdatedList<
  T extends Record<TIdProp, string | number>,
  TIdProp extends keyof T
>(
  items: T[],
  replacementMap: Record<T[TIdProp], T>,
  idProp: TIdProp
): T[] | null;
export function getUpdatedList<
  T extends Record<TIdProp, string | number>,
  TIdProp extends keyof T
>(
  items: T[],
  replacementMap: Record<T[TIdProp], T>,
  idProp: TIdProp = 'Id' as TIdProp
): T[] | null {
  let hasUpdatedItem = false;
  const updatedItems =
    replacementMap &&
    items &&
    items.map((item) => {
      const idValue = item[idProp];
      const updatedItem: T = replacementMap[idValue];
      hasUpdatedItem = hasUpdatedItem || Boolean(updatedItem);
      return updatedItem || item;
    });
  return hasUpdatedItem ? updatedItems : null;
}
