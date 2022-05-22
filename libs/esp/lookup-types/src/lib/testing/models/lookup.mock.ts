import { Lookup } from '../../models';

let sequence = 0;
export function createLookup(options: Partial<Lookup> = {}) {
  sequence++;
  const sampleLookup: Lookup = {
    Code: 'Code ' + sequence,
    Description: 'Lookup ' + sequence,
    Name: 'Lookup' + sequence,
    Sequence: sequence,
  };
  return { ...sampleLookup, ...options };
}
