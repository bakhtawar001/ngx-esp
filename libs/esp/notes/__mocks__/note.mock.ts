import { Note } from '@esp/models';
import * as faker from 'faker';

const mockNote = (): Partial<Note> => {
  const owner = {
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    id: faker.datatype.number(),
  };

  return {
    Id: faker.datatype.number(),
    Content: faker.datatype.string(),
    Type: faker.datatype.string(),
    UserName: owner.name,
    CreateDate: faker.date.past().toString(),
    CreatedBy: owner.name,
    UpdatedBy: owner.name,
    UpdateDate: faker.date.past().toString(),
    IsVisible: true,
    IsEditable: true,
    Links: [],
    OwnerId: owner.id,
    AccessLevel: 'Owner',
    Collaborators: [
      {
        Role: 'Owner',
        UserId: owner.id,
        Name: owner.name,
      },
    ],
  };
};

const generateRecords = (
  generator: any,
  size = faker.datatype.number({ min: 50, max: 200 })
) => {
  const res = [];

  for (let i = 0; i < size; i++) {
    res.push(generator());
  }

  return res;
};

export class NotesMockDB {
  public static get Notes(): Note[] {
    return generateRecords(mockNote, 1);
  }
}
