import { LinkRelationshipTypeView } from '../../models';

let linkRelationshipTypeId = 0;
export function createLinkRelationshipType(
  options: Partial<LinkRelationshipTypeView> = {}
) {
  linkRelationshipTypeId++;
  const sampleLinkRelationshipType: LinkRelationshipTypeView = {
    Id: linkRelationshipTypeId,
    Code: 'Code ' + linkRelationshipTypeId,
    Name: 'Name' + linkRelationshipTypeId,
    Reverse: 'Reverse' + linkRelationshipTypeId,
    Forward: 'Forward' + linkRelationshipTypeId,
    ForwardTitle: 'ForwardTitle' + linkRelationshipTypeId,
    ReverseTitle: 'ReverseTitle' + linkRelationshipTypeId,
    IsEditable: true,
    ForCompany: true,
    ForPerson: true,
  };
  return { ...sampleLinkRelationshipType, ...options };
}
