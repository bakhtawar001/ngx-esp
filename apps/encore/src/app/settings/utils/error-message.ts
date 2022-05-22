export function errorMessageDisplay(
  e: { error: string | { Error: { Message: string } } },
  msgs: { error?: string; alreadyExists?: string },
  type?: string
) {
  const str =
    typeof e.error === 'string'
      ? e.error
      : e.error?.Error?.Message || `There was an error changing your ${type}.`;

  if (str.includes('already exists')) {
    return (
      msgs.alreadyExists || `${type} already exists. Choose another ${type}.`
    );
  }

  return str;
}
