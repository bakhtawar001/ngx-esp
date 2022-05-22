import { LookupTypesStateModel } from '../../states';

export function createLookupTypesStateModel(
  data: Partial<LookupTypesStateModel> = {}
): LookupTypesStateModel {
  return { ...data } as LookupTypesStateModel;
}
