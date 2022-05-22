import { StepInput } from '@cosmos/core';
import { ProductSearchResultItem } from '@smartlink/models';

export type PresentationSelectDialogData = StepInput<{
  subheader: string;
  checkedProducts: Map<number, ProductSearchResultItem> | null;
}>;
