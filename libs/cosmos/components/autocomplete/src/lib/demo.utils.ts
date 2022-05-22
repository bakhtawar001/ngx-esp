export const filter = (raw, normalizedProp, searchTerm) =>
  Object.values(raw).join().toLowerCase().includes(searchTerm);
