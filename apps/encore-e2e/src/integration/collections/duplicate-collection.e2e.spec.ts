import { Collection } from '@esp/collections';
import { standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { createCollection, duplicate, removeCollection } from './utils';

const fixture = collectionDetail(Cypress.env('environment'));

let collection: Collection;

standardSetup(fixture);

describe('Duplicate Collection scenarios.', () => {
  after('Remove collection', () => removeCollection(collection));

  it('EN 217 : User should be able to copy a collection with maximum characters in Name and description field.', () => {
    createCollection(
      generateCollection({
        Name: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvw',
        Description:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ  ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      }),
      false
    )
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        duplicate(collection).then((resp) => {
          expect(collection.Name).to.be.equal(resp.Name);
          expect(collection.Description).to.be.equal(resp.Description);
        });
      });
  });
});
