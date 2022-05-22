export function asNumber(numberOrString: string | number) {
  const num = parseFloat(<any>numberOrString);
  return Number.isNaN(num) ? 0 : num;
}

export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];
