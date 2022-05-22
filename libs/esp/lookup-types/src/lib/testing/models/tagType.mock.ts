import { TagType } from '../../models';

let sequence = 0;
export function createTagType(options: Partial<TagType> = {}) {
  sequence++;
  const sampleTagType: TagType = {
    Code: 'Code ' + sequence,
    Description: 'Tag Type ' + sequence,
    IsEditable: true,
    Name: 'Tag' + sequence,
    Sequence: sequence,
  };
  return { ...sampleTagType, ...options };
}
