import { ClipboardItem } from '../models';

export class SetItems {
  static type = '[Clipboard] SetItems';
  constructor(public items: ClipboardItem[]) {}
}

export class AddItem {
  static type = '[Clipboard] AddItem';
  constructor(public item: ClipboardItem) {}
}

export class DeleteItem {
  static type = '[Clipboard] DeleteItem';
  constructor(public id: number) {}
}

export class DeleteItems {
  static type = '[Clipboard] DeleteItems';
  constructor(public ids: number[]) {}
}
