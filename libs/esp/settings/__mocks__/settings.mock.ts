import * as faker from 'faker/locale/en_US';
import { Setting } from '../src';

const mockSetting = (): Setting => {
  return {
    Id: faker.datatype.number(),
    Type: 'company_profile.name',
    Name: 'Asi Central',
    Description: faker.random.words(),
    Value: faker.random.words(),
    Default: faker.random.words(),
    Sequence: faker.datatype.number(),
  } as Setting;
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

export class SettingsMockDb {
  public static get Setting() {
    return mockSetting();
  }

  public static get Settings() {
    return generateRecords(mockSetting);
  }
}
