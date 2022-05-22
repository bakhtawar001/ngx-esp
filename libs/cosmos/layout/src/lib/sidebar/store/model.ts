import { Dictionary } from '@cosmos/core';

export type SidebarStateModel = Dictionary<SidebarStateModelItem>;

interface SidebarStateModelItem {
  folded: boolean;
}
