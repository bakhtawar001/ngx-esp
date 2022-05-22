import { Type } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NavigationItem } from '@cosmos/layout';

export class MenuItem extends NavigationItem {
  menu?: MatMenu;
  component?: Type<any>;
}
